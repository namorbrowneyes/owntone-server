<template>
  <recycle-scroller
    v-if="itemList.length > 0"
    v-slot="{ item }"
    class="scroller"
    :buffer="500"
    :item-size="48"
    :items="itemList"
    key-field="itemId"
  >
    <list-item
      :is-item="item.isItem"
      :index="item.index"
      :lines="[item.item.name]"
      @open="open(item.item)"
      @open-details="openDetails(item.item)"
    />
  </recycle-scroller>
  <modal-dialog-artist
    :item="selectedItem"
    :show="showDetailsModal"
    @close="showDetailsModal = false"
  />
</template>

<script>
import ListItem from '@/components/ListItem.vue'
import ModalDialogArtist from '@/components/ModalDialogArtist.vue'
import { RecycleScroller } from 'vue-virtual-scroller'

export default {
  name: 'ListArtists',
  components: { ListItem, ModalDialogArtist, RecycleScroller },
  props: {
    items: { required: true, type: Object },
    load: { default: null, type: Function }
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
    open(item) {
      this.$router.push({
        name: `${item.media_kind}-artist`,
        params: { id: item.id }
      })
    },
    openDetails(item) {
      this.selectedItem = item
      this.showDetailsModal = true
    }
  }
}
</script>

<style scoped>
.scroller {
  height: calc(100vh - 7rem);
}
</style>
