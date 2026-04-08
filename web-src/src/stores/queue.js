import { defineStore } from 'pinia'
import queue from '@/api/queue'
import { useConfigurationStore } from '@/stores/configuration'
import { usePlayerStore } from '@/stores/player'

const STORAGE_KEY = 'owntone_queue'

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable
  }
}

const defaults = { count: 0, items: [], version: 0 }

export const useQueueStore = defineStore('QueueStore', {
  actions: {
    async initialise() {
      const serverState = await queue.state()
      this.$patch(serverState)
      saveToStorage(this.$state)
    }
  },
  getters: {
    current(state) {
      const playerStore = usePlayerStore()
      return state.items.find((item) => item.id === playerStore.item_id) ?? {}
    },
    isEmpty(state) {
      return state.count === 0
    },
    isPauseAllowed(state) {
      return state.current && state.current.data_kind !== 'pipe'
    },
    isSavingAllowed() {
      const configuration = useConfigurationStore()
      return (
        configuration.allow_modifying_stored_playlists &&
        configuration.default_playlist_directory
      )
    }
  },
  state: () => ({ ...defaults, ...loadFromStorage() })
})
