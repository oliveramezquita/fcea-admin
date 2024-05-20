<script setup>
import ComparativeGraph from '@/views/charts/ComparativeGraph.vue';
import HistoricalGraph from '@/views/charts/HistoricalGraph.vue';

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  sites: {
    type: Array,
    required: true,
  }
})
const emit = defineEmits([
  'update:isDialogVisible',
  'udpate:sites',
])
const sites = ref(structuredClone(toRaw(props.sites)))
watch(props, () => {
  sites.value = structuredClone(toRaw(props.sites))
})
const graphData = ref(cgvOverallQuality(sites.value))

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}

const currentTab = ref('tab-1')
const tabItemText = 'Biscuit cheesecake gingerbread oat cake tiramisu. Marzipan tiramisu jelly-o muffin biscuit jelly cake pie. Chocolate cookie candy croissant brownie cupcake powder cheesecake. Biscuit sesame snaps biscuit topping tiramisu croissant.'
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    @update:model-value="dialogVisibleUpdate"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <VCard class="graph-dialog">
      <VTabs
        v-model="currentTab"
        grow
        stacked
        class="mt-3"
      >
        <VTab>
          <VIcon
            icon="tabler-chart-bar"
            class="mb-2"
          />
          <span>Datos Comparativos</span>
        </VTab>

        <VTab>
          <VIcon
            icon="tabler-history"
            class="mb-2"
          />
          <span>Datos Históricos</span>
        </VTab>

      </VTabs>
      <VCardText>
        <VWindow v-model="currentTab" class="disable-tab-transition">
          <VWindowItem class="mt-5">
            <ComparativeGraph
              :title="graphData.title"
              :series="graphData.series"
              :categories="graphData.categories"
              :colors="graphData.colors"
             />
          </VWindowItem>
          <VWindowItem class="mt-5">
            <HistoricalGraph />
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.graph-dialog {
  .v-card-text {
    padding-block-start: 0 !important;
    padding-inline: 0 !important;
  }

  .v-window {
    padding-inline: 24px !important;
  }
}
</style>
