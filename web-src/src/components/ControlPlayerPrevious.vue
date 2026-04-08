<template>
  <button :disabled="disabled" @click="previous">
    <mdicon
      class="icon"
      name="skip-backward"
      :title="$t('player.button.skip-backward')"
    />
  </button>
</template>

<script>
import { usePlayerStore } from '@/stores/player'
import { useQueueStore } from '@/stores/queue'

export default {
  name: 'ControlPlayerPrevious',
  setup() {
    return {
      playerStore: usePlayerStore(),
      queueStore: useQueueStore()
    }
  },
  computed: {
    disabled() {
      return this.queueStore.isEmpty
    }
  },
  methods: {
    previous() {
      this.playerStore.skipPrevious()
    }
  }
}
</script>
