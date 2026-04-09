import { defineStore } from 'pinia'

const POLL_INTERVAL = 3000
const LYRICS_API = 'http://localhost:3001/api/now-playing'

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
    trackTitle: item.name || '',
    trackUri: item.uri || ''
  }
}

export const useSpotifyPlayerStore = defineStore('SpotifyPlayerStore', {
  actions: {
    startPolling() {
      if (this.pollId) {
        return
      }
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
    async poll() {
      try {
        const response = await fetch(LYRICS_API)
        if (!response.ok) {
          this.isActive = false
          return
        }
        const data = await response.json()
        if (!data.is_playing) {
          this.isActive = false
          return
        }
        this.$patch(parseTrackData(data))
      } catch {
        // Lyrics server unreachable, will retry
      }
    }
  },
  state: () => ({
    deviceName: '',
    isActive: false,
    pollId: null,
    repeatState: 'off',
    shuffleState: false,
    trackAlbum: '',
    trackArtist: '',
    trackArtwork: '',
    trackDurationMs: 0,
    trackProgressMs: 0,
    trackTitle: '',
    trackUri: ''
  })
})
