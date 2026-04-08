import { defineStore } from 'pinia'
import library from '@/api/library'
import player from '@/api/player'
import { useQueueStore } from '@/stores/queue'

const STORAGE_KEY = 'owntone_player'

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
    return null
  } catch {
    return null
  }
}

const saveToStorage = (state) => {
  try {
    const persistable = { ...state }
    delete persistable.lyricsContent
    delete persistable.showLyrics
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
  } catch {
    // Storage full or unavailable
  }
}

const defaults = {
  consume: false,
  item_id: 0,
  item_length_ms: 0,
  item_progress_ms: 0,
  lyricsContent: '',
  repeat: 'off',
  showLyrics: false,
  shuffle: false,
  state: 'stop',
  volume: 0
}

export const usePlayerStore = defineStore('PlayerStore', {
  actions: {
    async initialise() {
      const serverState = await player.state()
      this.$patch(serverState)
      saveToStorage(this.$state)
      this.loadLyrics()
    },
    async loadLyrics() {
      const trackId = useQueueStore().current.track_id
      if (trackId) {
        const data = await library.track(trackId)
        this.lyricsContent = data.lyrics || ''
      }
    }
  },
  getters: {
    isMuted: (state) => state.volume === 0,
    isPlaying: (state) => state.state === 'play',
    isRepeatAll: (state) => state.repeat === 'all',
    isRepeatOff: (state) => state.repeat === 'off',
    isRepeatSingle: (state) => state.repeat === 'single',
    isStopped: (state) => state.state === 'stop'
  },
  state: () => ({ ...defaults, ...loadFromStorage() })
})
