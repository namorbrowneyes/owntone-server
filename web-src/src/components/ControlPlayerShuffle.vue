<template>
  <button :class="{ 'is-dark': playerStore.shuffle }" @click="toggle">
    <mdicon
      class="icon"
      :name="icon"
      :size="16"
      :title="$t(`player.button.${icon}`)"
    />
  </button>
</template>

<script>
import { usePlayerStore } from '@/stores/player'

export default {
  name: 'ControlPlayerShuffle',
  setup() {
    return { playerStore: usePlayerStore() }
  },
  computed: {
    icon() {
      if (this.playerStore.shuffle) {
        return 'shuffle'
      }
      return 'shuffle-disabled'
    }
  },
  methods: {
    toggle() {
      this.playerStore.toggleShuffle()
    }
  }
}
</script>
