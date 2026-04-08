import { defineStore } from 'pinia'
import outputs from '@/api/outputs'

const STORAGE_KEY = 'owntone_outputs'

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

export const useOutputsStore = defineStore('OutputsStore', {
  actions: {
    async initialise() {
      const serverState = await outputs.state()
      this.$patch(serverState)
      saveToStorage(this.$state)
    }
  },
  state: () => {
    const saved = loadFromStorage()
    return { outputs: (saved && saved.outputs) || [] }
  }
})
