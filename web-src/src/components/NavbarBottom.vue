<template>
  <nav class="navbar is-fixed-bottom" :class="{ 'is-bottom': !isPlayerPage }">
    <div
      v-if="playerStore.isPlaying && progressPercent > 0"
      class="progress-bar"
      :style="{ width: progressPercent + '%' }"
    />
    <div class="navbar-brand is-flex-grow-1">
      <control-link class="navbar-item" :to="{ name: 'queue' }">
        <mdicon class="icon" name="playlist-play" />
      </control-link>
      <template v-if="isPlayerPage">
        <control-player-previous class="navbar-item ml-auto" />
        <control-player-back class="navbar-item" :offset="10000" />
        <control-player-play class="navbar-item" />
        <control-player-forward class="navbar-item" :offset="30000" />
        <control-player-next class="navbar-item mr-auto" />
      </template>
      <template v-else>
        <control-link
          :to="{ name: 'player' }"
          exact
          class="navbar-item is-justify-content-flex-start is-expanded is-clipped is-size-7"
        >
          <img
            v-if="queueStore.current.artwork_url"
            class="track-artwork"
            :src="queueStore.current.artwork_url"
          />
          <div class="is-text-clipped">
            <strong v-text="queueStore.current.title" />
            <br />
            <span v-text="metadata" />
          </div>
        </control-link>
        <control-player-play class="navbar-item" />
      </template>
      <a class="navbar-item" @click="uiStore.togglePlayerMenu">
        <mdicon
          class="icon"
          :name="uiStore.showPlayerMenu ? 'chevron-down' : 'chevron-up'"
        />
      </a>
      <div
        class="dropdown is-up is-right"
        :class="{ 'is-active': uiStore.showPlayerMenu }"
      >
        <div class="dropdown-menu is-mobile">
          <div class="dropdown-content">
            <div class="dropdown-item pt-0">
              <control-main-volume />
              <control-output-volume
                v-for="output in outputsStore.outputs"
                :key="output.id"
                :output="output"
              />
              <control-stream-volume />
            </div>
            <hr class="dropdown-divider" />
            <div class="dropdown-item is-flex is-justify-content-center">
              <div class="buttons has-addons">
                <control-player-repeat class="button" />
                <control-player-shuffle class="button" />
                <control-player-consume class="button" />
                <control-player-lyrics class="button" />
              </div>
            </div>
            <hr class="dropdown-divider" />
            <div class="dropdown-item is-flex is-justify-content-center">
              <button
                class="button is-danger is-small"
                :disabled="playerStore.isStopped"
                @click="stopAll"
              >
                <mdicon class="icon" name="stop" size="18" />
                <span>{{ $t('player.button.stop') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import ControlLink from '@/components/ControlLink.vue'
import ControlMainVolume from '@/components/ControlMainVolume.vue'
import ControlOutputVolume from '@/components/ControlOutputVolume.vue'
import ControlPlayerBack from '@/components/ControlPlayerBack.vue'
import ControlPlayerConsume from '@/components/ControlPlayerConsume.vue'
import ControlPlayerForward from '@/components/ControlPlayerForward.vue'
import ControlPlayerLyrics from '@/components/ControlPlayerLyrics.vue'
import ControlPlayerNext from '@/components/ControlPlayerNext.vue'
import ControlPlayerPlay from '@/components/ControlPlayerPlay.vue'
import ControlPlayerPrevious from '@/components/ControlPlayerPrevious.vue'
import ControlPlayerRepeat from '@/components/ControlPlayerRepeat.vue'
import ControlPlayerShuffle from '@/components/ControlPlayerShuffle.vue'
import ControlStreamVolume from '@/components/ControlStreamVolume.vue'
import { useOutputsStore } from '@/stores/outputs'
import { usePlayerStore } from '@/stores/player'
import { useQueueStore } from '@/stores/queue'
import { useUIStore } from '@/stores/ui'

export default {
  name: 'NavbarBottom',
  components: {
    ControlLink,
    ControlMainVolume,
    ControlOutputVolume,
    ControlPlayerBack,
    ControlPlayerConsume,
    ControlPlayerForward,
    ControlPlayerLyrics,
    ControlPlayerNext,
    ControlPlayerPlay,
    ControlPlayerPrevious,
    ControlPlayerRepeat,
    ControlPlayerShuffle,
    ControlStreamVolume
  },
  setup() {
    return {
      outputsStore: useOutputsStore(),
      playerStore: usePlayerStore(),
      queueStore: useQueueStore(),
      uiStore: useUIStore()
    }
  },
  computed: {
    isPlayerPage() {
      return this.$route.name === 'player'
    },
    metadata() {
      const { current } = this.queueStore
      return [current.artist, current.album].filter(Boolean).join(' - ')
    },
    progressPercent() {
      if (this.playerStore.item_length_ms > 0) {
        return (
          (this.playerStore.item_progress_ms / this.playerStore.item_length_ms) *
          100
        )
      }
      return 0
    }
  },
  methods: {
    stopAll() {
      this.playerStore.stopPlayback()
    }
  }
}
</script>

<style scoped>
.is-text-clipped {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background-color: hsl(204, 86%, 53%);
  transition: width 1s linear;
  z-index: 1;
}

.track-artwork {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 0.5rem;
  flex-shrink: 0;
}
</style>
