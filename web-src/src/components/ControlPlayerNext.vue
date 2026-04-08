<template>
  <button :disabled="disabled" @click="next">
    <mdicon
      class="icon"
      name="skip-forward"
      :title="$t('player.button.skip-forward')"
    />
  </button>
</template>

<script>
import { usePlayerStore } from '@/stores/player'
import { useQueueStore } from '@/stores/queue'

export default {
  name: 'ControlPlayerNext',
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
    next() {
      this.playerStore.skipNext()
    }
  }
}
</script>
