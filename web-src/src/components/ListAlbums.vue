<template>
  <recycle-scroller
    v-if="itemList.length > 0"
    v-slot="{ item }"
    class="scroller"
    :buffer="500"
    :item-size="64"
    :items="itemList"
    key-field="itemId"
  >
    <list-item
      :is-item="item.isItem"
      :image="image(item)"
      :index="item.index"
      :lines="[
        item.item.name,
        item.item.artist,
        $formatters.toDate(item.item.date_released)
      ]"
      @open="open(item.item)"
      @open-details="openDetails(item.item)"
    />
  </recycle-scroller>
  <modal-dialog-album
    :item="selectedItem"
    :media-kind="mediaKind"
    :show="showDetailsModal"
    @close="showDetailsModal = false"
    @play-count-changed="playCountChanged"
    @podcast-deleted="podcastDeleted"
  />
</template>

<script>
import ListItem from '@/components/ListItem.vue'
import ModalDialogAlbum from '@/components/ModalDialogAlbum.vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'ListAlbums',
  components: { ListItem, ModalDialogAlbum, RecycleScroller },
  props: {
    items: { required: true, type: Object },
    load: { default: null, type: Function },
    mediaKind: { default: '', type: String }
  },
  emits: ['play-count-changed', 'podcast-deleted'],
  setup() {
    return { settingsStore: useSettingsStore() }
  },
  data() {
    return { selectedItem: {}, showDetailsModal: false }
  },
  computed: {
    itemList() {
      if (!this.items) {
        return []
      }
      return [...this.items]
    }
  },
  methods: {
    image(item) {
      if (this.settingsStore.showCoverArtworkInAlbumLists) {
        return { caption: item.item.name, url: item.item.artwork_url }
      }
      return null
    },
    open(item) {
      const mediaKind = this.mediaKind || item.media_kind
      if (mediaKind === 'podcast') {
        this.$router.push({ name: 'podcast', params: { id: item.id } })
      } else {
        this.$router.push({
          name: `${mediaKind}-album`,
          params: { id: item.id }
        })
      }
    },
    openDetails(item) {
      this.selectedItem = item
      this.showDetailsModal = true
    },
    playCountChanged() {
      this.$emit('play-count-changed')
    },
    podcastDeleted() {
      this.$emit('podcast-deleted')
    }
  }
}
</script>

<style scoped>
.scroller {
  height: calc(100vh - 7rem);
}
</style>
