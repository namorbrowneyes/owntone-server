# OwnTone Server — Roman's Fork

## Mission
Improve OwnTone's web UI responsiveness and reliability for multi-room AirPlay streaming. The upstream UI is sluggish — song changes don't reflect in the web GUI, page reloads lose playback state entirely (can't see or stop what's playing), and the overall feel is far from modern music players like Navidrome. The backend (C server) handles AirPlay multi-room sync well and should be preserved; the frontend needs a major overhaul.

## Deployment Context
This fork runs on a dedicated Alpine Linux VM (spotify-sync) as a Docker container. It is the central hub for multi-room Spotify playback via AirPlay.

### Infrastructure
- **VM**: Alpine Linux, 2GB RAM, 2 vCPU, 8GB disk at `D:\VMs\spotify-sync\spotify-sync.vmx`
- **OwnTone version**: 29.0, runs inside Docker container `owntone`
- **Web UI access**: `https://play.gensky.xyz` (Cloudflare tunnel → localhost:3689)
- **WebSocket port**: 3688 (same host)
- **VM network**:
  - eth0: 192.168.247.51 (VMnet1 host-only, SSH)
  - eth1: 192.168.153.130 (NAT, internet for Spotify/librespot)
  - eth2: 172.16.0.80 (Bridged Eero, AirPlay mDNS + web UI)
- **SSH**: `ssh spotify-sync` → root@192.168.247.51

### Audio Outputs (AirPlay)
- **Sonos Beam** — AirPlay 1, primary speaker (living room)
- **LG C5 OLED77** — AirPlay 2, TV
- **Roman's PC** — AirPlay 1 via custom Node.js RAOP receiver at 172.16.0.71:5000
- All three play simultaneously via OwnTone's multi-room AirPlay sync

### Spotify Integration
- Spotify Premium via librespot (embedded in OwnTone)
- Spotify Connect device name: "OwnTone on spotify-sync"
- Spotify bitrate: 320kbps (bitrate = 3)
- **CRITICAL**: Container restarts trigger a full Spotify library scan (~12 min, 725 playlists, 83K songs). During scan, ALL queue operations return 500 errors. Avoid unnecessary restarts.

## Problems to Solve

### P1: Song changes don't reflect in the web UI
- Change song via Spotify Connect or queue → web UI still shows old song
- Root cause: WebSocket event delivery is delayed/unreliable. The frontend debounces at 50ms but the real issue is libwebsockets not flushing events immediately (upstream PR #1243 addresses this)
- The player store only updates when a WebSocket `player` event arrives — if that event is late or lost, the UI is stale

### P2: Page reload loses all playback state
- Reload play.gensky.xyz → can't see what's currently playing, can't control playback
- No localStorage persistence of player state
- On mount, the app connects WebSocket and waits for events — but doesn't proactively fetch `/api/player` and `/api/queue` to hydrate state immediately
- **This is a safety issue for multi-room**: if you can't see or stop playback from the UI, you have to physically go to each speaker/TV to turn volume down

### P3: General UI sluggishness
- Navigation feels heavy compared to Navidrome
- Large list rendering is not virtualized (Spotify library has 83K songs)
- No optimistic UI updates — every action waits for server round-trip before reflecting in UI
- Bulma CSS framework adds weight without much payoff

## Goals

### Responsiveness
- **Instant state hydration on load**: Fetch `/api/player`, `/api/queue`, `/api/outputs` on mount — don't wait for WebSocket
- **Optimistic UI updates**: When user hits play/pause/skip, update UI immediately, then confirm with server response
- **Reliable WebSocket**: Reconnect on disconnect, re-subscribe, and re-fetch full state on reconnect
- **Virtual scrolling**: For library views with 80K+ tracks — only render what's visible

### Navidrome-Inspired UX
- Clean, minimal, dark-mode-first design
- Always-visible player bar at bottom with: album art, song title, artist, progress bar, play/pause/skip, volume, output selector
- The player bar should NEVER lose state — it persists across navigation and page reloads
- Snappy navigation with client-side routing and minimal loading states
- Queue management that feels instant (drag to reorder, swipe to remove)

### Multi-Room Control (Critical)
- **Output management panel**: See all AirPlay outputs, their enabled/disabled state, and individual volumes
- **One-tap stop all**: Emergency button to stop playback on all outputs simultaneously
- **Per-output volume**: Slider for each output, clearly labeled
- **Output status indicators**: Show which outputs are actively receiving audio vs. just enabled

### Reliability
- **State persistence**: Save player state (current track, position, volume, active outputs) to localStorage
- **Graceful degradation**: If WebSocket disconnects, fall back to polling `/api/player` every 2 seconds
- **Connection status indicator**: Show when WebSocket is connected/disconnected/reconnecting
- **Error recovery**: If an API call fails, show a non-blocking toast notification — don't break the whole UI

## Technical Approach

### Frontend Stack
The existing frontend is Vue 3 + Vite + Pinia + Bulma. Options:
1. **Refactor in place** — Fix the Vue 3 frontend's state management, add localStorage persistence, improve WebSocket handling, swap Bulma for Tailwind. Least risk, fastest path.
2. **Rebuild with modern stack** — New frontend in the same `web-src/` directory using React/Next.js or Svelte with Tailwind. More work but cleaner result.

Recommendation: Start with option 1 (refactor). The Vue 3 + Pinia stack is fine — the problems are in implementation, not framework choice.

### Backend Changes
- Apply the fix from upstream PR #1243 (immediate WebSocket event delivery)
- Consider reducing the debounce interval in the frontend from 50ms to 0ms (or removing it)
- No other backend changes needed initially — the C server and AirPlay sync work well

### Key Files
- **Frontend entry**: `web-src/src/main.js`
- **App shell + WebSocket**: `web-src/src/App.vue`
- **Player store**: `web-src/src/stores/player.js` — needs state persistence + eager fetch
- **Queue store**: `web-src/src/stores/queue.js`
- **Outputs store**: `web-src/src/stores/outputs.js`
- **API layer**: `web-src/src/api/` — add optimistic update wrappers
- **Components**: `web-src/src/components/` — 60+ components, focus on player controls + output selectors
- **Pages**: `web-src/src/pages/` — 20+ pages, focus on PagePlayer, PageQueue, PageOutputs
- **Styles**: `web-src/src/styles.scss` — candidate for Tailwind migration
- **WebSocket config**: Port 3688, protocol `notify`, subscribe with `{"notify": ["player", "queue", "outputs", ...]}`
- **Backend WebSocket**: `src/websocket.c` — where PR #1243 changes go

### OwnTone JSON API Reference
Base URL: `http://localhost:3689`

**Player:**
- `GET /api/player` — current state (playing/paused/stopped, current track, position, volume, shuffle, repeat)
- `PUT /api/player/play`, `/pause`, `/stop`, `/toggle`, `/next`, `/previous`
- `PUT /api/player/seek?position_ms=<ms>`
- `PUT /api/player/volume?volume=<0-100>`
- `PUT /api/player/shuffle?state=<true|false>`
- `PUT /api/player/repeat?state=<off|all|one>`

**Queue:**
- `GET /api/queue` — list queue items
- `POST /api/queue/items/add?expression=<query>&playback=<start|next|last>&clear=<bool>`
- `PUT /api/queue/items/<id>` — move item
- `DELETE /api/queue/items/<id>` — remove item
- `PUT /api/queue/clear` — clear queue

**Outputs:**
- `GET /api/outputs` — list all audio outputs (AirPlay devices)
- `PUT /api/outputs/<id>` — enable/disable output, set volume
- Each output has: id, name, type, selected (enabled), volume, has_password, needs_auth_key

**Library:**
- `GET /api/library` — library stats
- `GET /api/library/artists`, `/albums`, `/tracks`, `/genres`
- `GET /api/library/playlists`
- `GET /api/search?query=<q>&type=<tracks|artists|albums>&limit=<n>`

**Spotify:**
- `GET /api/spotify` — Spotify connection status (has_credentials, is_active, etc.)
- `GET /api/spotify-login` — trigger Spotify auth flow

**WebSocket:**
- Connect to `ws://localhost:3688/`
- Send: `{"notify": ["player", "queue", "outputs", "library", "spotify", "options", "volume", "update", "database", "pairing"]}`
- Server pushes event type strings when state changes

Full API docs: https://owntone.github.io/owntone-server/json-api/

## Implementation Priority

### Phase 1: Fix Critical State Issues
1. On app mount, immediately fetch `/api/player`, `/api/queue`, `/api/outputs` (don't wait for WebSocket)
2. Persist player state to localStorage — restore on reload as optimistic state until fresh data arrives
3. Add WebSocket reconnect logic with exponential backoff
4. On WebSocket reconnect, re-fetch all state
5. Add "Stop All" button that calls `PUT /api/player/stop`

### Phase 2: Optimistic UI + Responsiveness
1. Wrap player control API calls with optimistic state updates
2. Add virtual scrolling to library/queue views (use vue-virtual-scroller or similar)
3. Reduce/remove WebSocket event debouncing
4. Add loading skeletons instead of spinners

### Phase 3: UI/UX Overhaul
1. Dark mode redesign (Navidrome-inspired, clean/minimal)
2. Persistent bottom player bar with full controls
3. Output management panel with per-device volume sliders
4. Connection status indicator (WebSocket health)
5. Toast notifications for errors instead of blocking modals
6. Consider Tailwind CSS migration from Bulma

### Phase 4: Backend WebSocket Fix
1. Port changes from upstream PR #1243 to improve WebSocket event delivery
2. Test with multi-room playback to confirm events arrive immediately

## What NOT to Change
- The C backend's AirPlay sync logic — it works
- librespot / Spotify Connect integration — it works
- The JSON API contract — other clients may depend on it
- OwnTone config file format (`/etc/owntone/owntone.conf`)
- Docker container setup and OpenRC init system
- The Cloudflare tunnel routing

## Testing
- Test with Spotify Connect: play → pause → skip → verify UI updates within 200ms
- Test page reload during playback: verify player bar shows current song immediately
- Test output toggling: enable/disable AirPlay outputs from the UI
- Test "Stop All" with all 3 outputs active
- Test with 83K song library: verify smooth scrolling, no OOM
- Test WebSocket disconnect: kill connection, verify reconnect + state recovery
