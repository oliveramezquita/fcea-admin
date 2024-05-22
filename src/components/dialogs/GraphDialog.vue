<script setup>
import ComparativeGraph from '@/views/charts/ComparativeGraph.vue';
import HistoricalGraph from '@/views/charts/HistoricalGraph.vue';

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  graphItem: {
    type: Object,
    required: true,
  },
  sites: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits([
  'update:isDialogVisible',
  'update:graphItem',
  'update:sites',
])
const graphItem = ref(structuredClone(toRaw(props.graphItem)))
const sites = ref(structuredClone(toRaw(props.sites)))
const historicalGraphData = ref({series: [], labels: [], title: ''})
const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}
const currentTab = ref('tab-1')
const comparativeGraphData = ref(sites.value && graphItem.value ? graphData(sites.value, graphItem.value) : null)
watch(props, () => {
  graphItem.value = structuredClone(toRaw(props.graphItem))
  sites.value = structuredClone(toRaw(props.sites))
  comparativeGraphData.value = sites.value && graphItem.value ? graphData(sites.value, graphItem.value) : null
})
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
              :title="graphItem.title"
              :series="comparativeGraphData.series"
              :categories="comparativeGraphData.categories"
              :colors="comparativeGraphData.colors"
             />
          </VWindowItem>
          <VWindowItem class="mt-5">
            <HistoricalGraph
            :series="historicalGraphData.series"
            :labels="historicalGraphData.labels"
            :title="graphItem.title" />
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
