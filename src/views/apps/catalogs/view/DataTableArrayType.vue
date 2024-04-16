<script setup>
import { useApi } from '@/composables/useApi';
import { computed } from 'vue';

const props = defineProps({
  catalogId: {
    type: String,
    required: true,
  }
})
const catalogId = ref(structuredClone(toRaw(props.catalogId)))
const {
  data: catalogData,
  execute: fetchValues,
} = await useApi(createUrl(`api/catalog/${ catalogId.value }`))
const values = computed(() => catalogData.value.values)

const resultValues = computed(() => values.value.map(value => ({ value })))
const totalValues = computed(() => resultValues.length)
const itemsPerPage = ref(10)
const page = ref(1)
const isValueInfoEditDialogVisible = ref(false)
const isNewValue = ref()
const valueDetail = ref()

const headers = [
  {
    title: 'Valor',
    key: 'value',
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
  },
]
const deleteValues = async (value) => {
  const index = catalogData.value.values.indexOf(value)
  if (index > -1)
    catalogData.value.values.splice(index, 1)
  
  await $api(`api/catalog/${catalogData.value._id}`, {
    method: 'PATCH',
    body: {
      'values': catalogData.value.values
    },
  })

  fetchValues()
}
const showValueEditor = async (value, isNew) => {
  valueDetail.value = !isNew ? value : {key: '', value: ''}
  isNewValue.value = isNew
  isValueInfoEditDialogVisible.value = true
}
const editValue = async valueData => {
  catalogData.value.values.push(valueData.value)
  
  await $api(`api/catalog/${catalogData.value._id}`, {
    method: 'PATCH',
    body: {
      'values': catalogData.value.values
    },
  })
  
  fetchValues()
}
</script>
<template>
  <div>
    <VCardText class="d-flex flex-wrap gap-4">
    <div class="me-3 d-flex gap-3">
      <AppSelect
        :model-value="itemsPerPage"
        :items="[
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: -1, title: 'Todos' },
        ]"
        style="inline-size: 6.25rem;"
        @update:model-value="itemsPerPage = parseInt($event, 10)"
      />
    </div>
    <VSpacer />

    <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
      <VBtn
        variant="tonal"
        color="secondary"
        class="ml-5"
        :to="{name: 'apps-catalogs-list'}"
      >
        Regresar
      </VBtn>
      <VBtn
        prepend-icon="tabler-plus"
        @click="showValueEditor(item, true)"
      >
        Agregar valor
      </VBtn>
    </div>
    </VCardText>
    <VDivider />
    <VDataTable
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="resultValues"
      :items-length="totalValues"
      item-value="name"
      class="text-no-wrap"
    >
      <template #item.values="{ item }">
        <div class="text-body-1">
          {{ item.value }}
        </div>
      </template>
      <template #item.actions="{ item }">
        <IconBtn @click="deleteValues(item.value)">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>
      <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalValues"
          />
        </template>
    </VDataTable>
    <div class="mb-5"></div>
  </div>
  <AddNewCatalogArrayValueDialog
    v-model:isDialogVisible="isValueInfoEditDialogVisible"
    v-model:isNewValue="isNewValue"
    v-model:valueDetail="valueDetail"
    @value-data="editValue"
  />
</template>
