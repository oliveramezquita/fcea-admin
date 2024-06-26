<script setup>
import { useApi } from '@/composables/useApi';
import AddNewBasinDrawer from '@/views/apps/basins/list/AddNewBasinDrawer.vue';

const {
  data: basinsData,
  execute: fetchBasins,
} = await useApi(createUrl('api/basins'))
const basins = computed(() => basinsData.value)
const headers = [
  {
    title: 'Nombre',
    key: 'name',
  },
  {
    title: 'Archivo GeoJSON',
    key: 'geojson_file',
  },
  {
    title: 'Instituciones',
    key: 'institutions',
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
  },
]
const isAddNewBasinDrawerVisible = ref(false)
const createBasin = async basin => {
  await $api('api/basins', {
    method: 'POST',
    body: basin,
  })
  fetchBasins()
}
const institutionsParse = institutions => {
  const nameOfInstitutionsList = institutions.map(i => i.name)
  const nameOfInstitutions = nameOfInstitutionsList.toString()
  if (nameOfInstitutions !== '')
    return nameOfInstitutions.length > 35 ? `${nameOfInstitutions?.substring(0,35)}...` : nameOfInstitutions
}
const selectedBasin = ref()
const isBasinDeleteDialogVisible = ref(false)
const showDeleteBasinConfirmation = async basin => {
  selectedBasin.value = basin
  isBasinDeleteDialogVisible.value = true
}
const deleteBasin = async basinId => {
  await $api(`api/basin/${ basinId }`, { method: 'DELETE' })
  fetchBasins()
}
</script>
<template>
  <div>
    <VRow>
      <VCol
        cols="12"
      >
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              <h5 class="text-h5">
                Cuencas
              </h5>
            </template>
            <template #append>
              <div class="text-base font-weight-medium text-primary cursor-pointer">
                <VBtn
                  prepend-icon="tabler-plus"
                  @click="isAddNewBasinDrawerVisible = true"
                >
                  Agregar cuenca
                </VBtn>
              </div>
            </template>
          </VCardItem>
          <VDivider />
          <VDataTable
            :headers="headers"
            :items="basins"
            :items-per-page="5"
          >
            <template #item.name="{ item }">
              <div class="d-flex align-center">
                <div class="d-flex flex-column ms-3">
                  <RouterLink
                    :to="{ name: 'apps-basins-view-id', params: { id: item._id } }"
                    class="font-weight-medium text-link"
                  >
                    {{ item.name }}
                  </RouterLink>
                </div>
              </div>
            </template>

            <template #item.geojson_file="{ item }">
              <VChip
                class="font-weight-medium"
                size="small"
                v-if="item.geojson_file"
              >
                <a :href="item.geojson_file" target="_blank">{{ item.geojson_file.split('/').pop() }}</a>
              </VChip>
            </template>

            <template #item.institutions="{ item }">
              <span>{{ institutionsParse(item.institutions) }}</span>
            </template>

            <template #item.actions="{ item }">
              <VBtn 
                color="secondary"
                variant="plain"
                :to="{ name: 'apps-basins-view-id', params: { id: item._id } }"
              >
                <VIcon
                  start
                  icon="tabler-pencil"
                />Editar
              </VBtn>
              <VBtn
                color="secondary"
                variant="plain"
                @click="showDeleteBasinConfirmation(item)"
              >
                <VIcon 
                  start
                  icon="tabler-trash" />Eliminar
              </VBtn>
            </template>

            <template #bottom />
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <AddNewBasinDrawer
    v-model:isDrawerOpen="isAddNewBasinDrawerVisible"
    @create-basin="createBasin"
  />
  <DeleteBasinDialog
    v-model:isDialogVisible="isBasinDeleteDialogVisible"
    v-model:basin="selectedBasin"
    @delete-basin="deleteBasin"
  />
</template>
