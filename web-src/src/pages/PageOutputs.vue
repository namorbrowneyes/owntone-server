<template>
  <content-with-heading>
    <template #heading>
      <pane-title :content="heading" />
    </template>
    <template #actions>
      <button
        class="button is-danger is-small"
        :disabled="playerStore.isStopped"
        @click="playerStore.stopPlayback()"
      >
        <mdicon class="icon" name="stop" size="16" />
        <span v-text="$t('player.button.stop')" />
      </button>
    </template>
    <template #content>
      <div class="output-grid">
        <div
          v-for="output in outputsStore.outputs"
          :key="output.id"
          class="output-card"
          :class="{ 'is-active': output.selected }"
        >
          <div class="output-header">
            <div class="output-icon">
              <mdicon :name="outputIcon(output)" size="22" />
            </div>
            <div class="output-info">
              <div class="output-name" v-text="output.name" />
              <div class="output-type" v-text="output.type" />
            </div>
            <button
              class="output-toggle"
              :class="{ 'is-on': output.selected }"
              @click="toggleOutput(output)"
            >
              <mdicon
                :name="output.selected ? 'power' : 'power-off'"
                size="18"
              />
            </button>
          </div>
          <div v-if="output.selected" class="output-volume">
            <mdicon name="volume-low" size="16" class="output-vol-icon" />
            <input
              type="range"
              class="output-slider"
              min="0"
              max="100"
              :value="output.volume"
              @input="setVolume(output, $event)"
            />
            <span class="output-vol-value" v-text="output.volume" />
          </div>
        </div>
      </div>
    </template>
  </content-with-heading>
</template>

<script>
import ContentWithHeading from '@/templates/ContentWithHeading.vue'
import PaneTitle from '@/components/PaneTitle.vue'
import outputs from '@/api/outputs'
import player from '@/api/player'
import { useOutputsStore } from '@/stores/outputs'
import { usePlayerStore } from '@/stores/player'

export default {
  name: 'PageOutputs',
  components: { ContentWithHeading, PaneTitle },
  setup() {
    return {
      outputsStore: useOutputsStore(),
      playerStore: usePlayerStore()
    }
  },
  computed: {
    heading() {
      return {
        title: this.$t('page.outputs.title')
      }
    }
  },
  methods: {
    outputIcon(output) {
      if (output.type.startsWith('AirPlay')) {
        return 'cast-variant'
      } else if (output.type === 'Chromecast') {
        return 'cast'
      } else if (output.type === 'fifo') {
        return 'pipe'
      }
      return 'speaker'
    },
    setVolume(output, event) {
      player.setVolume(event.target.valueAsNumber, output.id)
    },
    toggleOutput(output) {
      outputs.toggle(output.id)
    }
  }
}
</script>

<style scoped>
.output-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.output-card {
  background: var(--owntone-bg-tertiary, #1c2128);
  border: 1px solid var(--owntone-border, #30363d);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  transition: all 0.2s ease;
}

.output-card.is-active {
  border-color: var(--owntone-accent, #58a6ff);
  background: rgba(88, 166, 255, 0.05);
}

.output-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.output-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--owntone-border, #30363d);
  color: var(--owntone-text-muted, #8b949e);
}

.is-active .output-icon {
  background: var(--owntone-accent, #58a6ff);
  color: var(--owntone-bg, #0d1117);
}

.output-info {
  flex: 1;
  min-width: 0;
}

.output-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--owntone-text, #e6edf3);
}

.output-type {
  font-size: 0.75rem;
  color: var(--owntone-text-muted, #8b949e);
}

.output-toggle {
  background: none;
  border: 1px solid var(--owntone-border, #30363d);
  border-radius: 8px;
  padding: 0.4rem;
  cursor: pointer;
  color: var(--owntone-text-muted, #8b949e);
  transition: all 0.15s ease;
}

.output-toggle.is-on {
  color: var(--owntone-success, #3fb950);
  border-color: var(--owntone-success, #3fb950);
}

.output-toggle:hover {
  background: var(--owntone-bg-secondary, #161b22);
}

.output-volume {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--owntone-border, #30363d);
}

.output-vol-icon {
  color: var(--owntone-text-muted, #8b949e);
  flex-shrink: 0;
}

.output-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--owntone-border, #30363d);
  border-radius: 2px;
  outline: none;
}

.output-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--owntone-accent, #58a6ff);
  cursor: pointer;
}

.output-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--owntone-accent, #58a6ff);
  border: none;
  cursor: pointer;
}

.output-vol-value {
  font-size: 0.75rem;
  color: var(--owntone-text-muted, #8b949e);
  min-width: 24px;
  text-align: right;
}
</style>
