<template>
  <nav class="player-bar">
    <!-- Progress bar -->
    <div
      class="player-progress"
      @click="seekFromProgress"
    >
      <div
        class="player-progress-fill"
        :style="{ width: progressPercent + '%' }"
      />
    </div>
    <!-- Main layout: 3 columns -->
    <div class="player-content">
      <!-- LEFT: Track info -->
      <div class="player-left">
        <control-link :to="{ name: 'player' }" class="player-track-link">
          <img
            v-if="queueStore.current.artwork_url"
            class="player-artwork"
            :src="queueStore.current.artwork_url"
          />
          <div v-else class="player-artwork-placeholder">
            <mdicon name="music" size="20" />
          </div>
          <div class="player-track-info">
            <div class="player-track-title" v-text="queueStore.current.title || $t('page.player.title')" />
            <div class="player-track-meta" v-text="metadata" />
          </div>
        </control-link>
      </div>
      <!-- CENTER: Playback controls -->
      <div class="player-center">
        <control-player-shuffle class="player-btn player-btn-small" />
        <control-player-previous class="player-btn" />
        <control-player-play class="player-btn player-btn-play" />
        <control-player-next class="player-btn" />
        <control-player-repeat class="player-btn player-btn-small" />
      </div>
      <!-- RIGHT: Volume + extras -->
      <div class="player-right">
        <button class="player-btn player-btn-small" @click="toggleMute">
          <mdicon :name="volumeIcon" size="18" />
        </button>
        <input
          class="player-volume"
          type="range"
          min="0"
          max="100"
          :value="playerStore.volume"
          @input="setVolume($event.target.valueAsNumber)"
        />
        <control-link :to="{ name: 'queue' }" class="player-btn player-btn-small">
          <mdicon name="playlist-play" size="18" />
        </control-link>
        <button class="player-btn player-btn-small" @click="uiStore.togglePlayerMenu">
          <mdicon name="cast-variant" size="18" />
        </button>
      </div>
    </div>
    <!-- Outputs dropdown (kept from original) -->
    <div
      class="dropdown is-up is-right player-dropdown"
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
  </nav>
  <div
    v-show="uiStore.showPlayerMenu"
    class="player-overlay"
    @click="uiStore.hideMenus"
  />
</template>

<script>
import ControlLink from '@/components/ControlLink.vue'
import ControlMainVolume from '@/components/ControlMainVolume.vue'
import ControlOutputVolume from '@/components/ControlOutputVolume.vue'
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
  data() {
    return { savedVolume: 50 }
  },
  computed: {
    metadata() {
      const { current } = this.queueStore
      return [current.artist, current.album].filter(Boolean).join(' \u2014 ')
    },
    progressPercent() {
      if (this.playerStore.item_length_ms > 0) {
        return (
          (this.playerStore.item_progress_ms / this.playerStore.item_length_ms) *
          100
        )
      }
      return 0
    },
    volumeIcon() {
      if (this.playerStore.volume === 0) {
        return 'volume-off'
      } else if (this.playerStore.volume < 50) {
        return 'volume-medium'
      }
      return 'volume-high'
    }
  },
  methods: {
    seekFromProgress(event) {
      if (this.playerStore.item_length_ms > 0) {
        const rect = event.currentTarget.getBoundingClientRect()
        const percent = (event.clientX - rect.left) / rect.width
        const positionMs = Math.floor(percent * this.playerStore.item_length_ms)
        this.playerStore.item_progress_ms = positionMs
        import('@/api/player').then((mod) => {
          mod.default.seekToPosition(positionMs)
        })
      }
    },
    setVolume(volume) {
      this.playerStore.changeVolume(volume)
    },
    stopAll() {
      this.playerStore.stopPlayback()
    },
    toggleMute() {
      if (this.playerStore.volume > 0) {
        this.savedVolume = this.playerStore.volume
        this.playerStore.changeVolume(0)
      } else {
        this.playerStore.changeVolume(this.savedVolume || 50)
      }
    }
  }
}
</script>

<style lang="scss" src="./NavbarBottom.scss" />
