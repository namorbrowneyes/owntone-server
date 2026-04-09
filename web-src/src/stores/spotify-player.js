import api from '@/api'
import { defineStore } from 'pinia'

const POLL_INTERVAL = 3000
const SPOTIFY_API = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOKEN_REFRESH_BUFFER = 30000

const getArtistNames = (item) =>
  (item?.artists || []).map((a) => a.name).join(', ')

const parseTrackData = (data) => {
  const item = data.item || {}
  const album = item.album || {}
  const images = album.images || []
  return {
    deviceName: (data.device || {}).name || '',
    isActive: data.is_playing || false,
    repeatState: data.repeat_state || 'off',
    shuffleState: data.shuffle_state || false,
    trackAlbum: album.name || '',
    trackArtist: getArtistNames(item),
    trackArtwork: images.length > 0 && images[0].url || '',
    trackDurationMs: item.duration_ms || 0,
    trackProgressMs: data.progress_ms || 0,
    trackTitle: item.name || ''
  }
}

export const useSpotifyPlayerStore = defineStore('SpotifyPlayerStore', {
  actions: {
    startPolling() {
      if (this.pollId) {
        return
      }
      this.fetchToken()
      this.pollId = setInterval(() => {
        this.poll()
      }, POLL_INTERVAL)
      this.poll()
    },
    stopPolling() {
      if (this.pollId) {
        clearInterval(this.pollId)
        this.pollId = null
      }
    },
    async fetchToken() {
      try {
        const data = await api.get('./api/spotify')
        if (data.webapi_token_valid && data.webapi_token) {
          this.token = data.webapi_token
          this.tokenExpiresAt = Date.now() + (data.webapi_token_expires_in * 1000)
        }
      } catch {
        // Token fetch failed
      }
    },
    async ensureToken() {
      if (!this.token || Date.now() > this.tokenExpiresAt - TOKEN_REFRESH_BUFFER) {
        await this.fetchToken()
      }
      return Boolean(this.token)
    },
    async poll() {
      if (!await this.ensureToken()) {
        return
      }
      try {
        const response = await fetch(SPOTIFY_API, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.handleResponse(response)
      } catch {
        // Network error, will retry
      }
    },
    async handleResponse(response) {
      if (response.status === 204 || response.status === 202) {
        this.isActive = false
        return
      }
      if (response.status === 401 || response.status === 403) {
        await this.fetchToken()
        return
      }
      if (response.ok) {
        const data = await response.json()
        this.$patch(parseTrackData(data))
      }
    }
  },
  state: () => ({
    deviceName: '',
    isActive: false,
    pollId: null,
    repeatState: 'off',
    shuffleState: false,
    token: '',
    tokenExpiresAt: 0,
    trackAlbum: '',
    trackArtist: '',
    trackArtwork: '',
    trackDurationMs: 0,
    trackProgressMs: 0,
    trackTitle: ''
  })
})
