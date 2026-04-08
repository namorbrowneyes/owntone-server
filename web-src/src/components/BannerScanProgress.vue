<template>
  <div v-if="libraryStore.updating" class="scan-banner">
    <div class="scan-content">
      <mdicon class="icon is-spinning" name="loading" size="18" />
      <span class="scan-text">
        {{ $t('dialog.update.progress') }}
        — {{ libraryStore.songs.toLocaleString() }} songs scanned
      </span>
    </div>
  </div>
</template>

<script>
import { useLibraryStore } from '@/stores/library'

export default {
  name: 'BannerScanProgress',
  setup() {
    return { libraryStore: useLibraryStore() }
  },
  data() {
    return { pollInterval: null }
  },
  watch: {
    'libraryStore.updating'(updating) {
      if (updating) {
        this.startPolling()
      } else {
        this.stopPolling()
      }
    }
  },
  mounted() {
    if (this.libraryStore.updating) {
      this.startPolling()
    }
  },
  beforeUnmount() {
    this.stopPolling()
  },
  methods: {
    startPolling() {
      this.stopPolling()
      this.pollInterval = setInterval(() => {
        this.libraryStore.initialise()
      }, 3000)
    },
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
        this.pollInterval = null
      }
    }
  }
}
</script>

<style scoped>
.scan-banner {
  position: fixed;
  top: var(--bulma-navbar-height);
  left: 0;
  right: 0;
  z-index: 30;
  background: hsl(40, 90%, 18%);
  border-bottom: 1px solid hsl(40, 80%, 30%);
  padding: 0.5rem 1rem;
}

.scan-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: hsl(40, 90%, 80%);
  font-size: 0.85rem;
  font-weight: 500;
}

.is-spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
