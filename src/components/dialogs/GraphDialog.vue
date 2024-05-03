<script setup>
import ApexChartHorizontalBar from '@/views/charts/apex-chart/ApexChartHorizontalBar.vue';
import ApexChartNewTechnologiesData from '@/views/charts/apex-chart/ApexChartNewTechnologiesData.vue';

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
})
const emit = defineEmits([
  'update:isDialogVisible',
])

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
      <VCardItem>
        <VCardTitle class="text-center">{{ props.title }}</VCardTitle>
      </VCardItem>
      <VCardText>
        <VWindow v-model="currentTab">
          <VWindowItem>
            <ApexChartHorizontalBar />
          </VWindowItem>
          <VWindowItem>
            <ApexChartNewTechnologiesData />
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
