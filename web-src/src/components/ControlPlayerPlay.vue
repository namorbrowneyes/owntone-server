<template>
  <button :disabled="disabled" @click="toggle">
    <mdicon class="icon" :name="icon" :title="$t(`player.button.${icon}`)" />
  </button>
</template>

<script>
import { usePlayerStore } from '@/stores/player'
import { useQueueStore } from '@/stores/queue'

export default {
  name: 'ControlPlayerPlay',
  setup() {
    return {
      playerStore: usePlayerStore(),
      queueStore: useQueueStore()
    }
  },
  computed: {
    disabled() {
      return this.queueStore.isEmpty
    },
    icon() {
      if (!this.playerStore.isPlaying) {
        return 'play'
      } else if (this.queueStore.isPauseAllowed) {
        return 'pause'
      }
      return 'stop'
    }
  },
  methods: {
    toggle() {
      if (
        this.playerStore.isPlaying &&
        !this.queueStore.isPauseAllowed
      ) {
        this.playerStore.stopPlayback()
      } else {
        this.playerStore.playPause()
      }
    }
  }
}
</script>
