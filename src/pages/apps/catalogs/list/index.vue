<script setup>
import { useApi } from '@/composables/useApi';
import AddNewCatalogDrawer from '@/views/apps/catalogs/list/AddNewCatalogDrawer.vue';
import { computed } from 'vue';

const {
  data: catalogsData,
  execute: fetchCatalogs,
} = await useApi(createUrl('api/catalog'))
const catalogs = computed(() => catalogsData.value)
const headers = [
  {
    title: 'Nombre',
    key: 'name',
  },
  {
    title: 'Tipo',
    key: 'type',
  },
  {
    title: 'Valores',
    key: 'values',
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false,
  },
]
const isAddNewCatalogDrawerVisible = ref(false)
const isCatalogDeleteDialogVisible = ref(false)
const catalogDetail = ref()

const addNewCatalog = async catalog => {
  await $api('api/catalog', {
    method: 'POST',
    body: catalog,
  })

  // refetch User
  fetchCatalogs()
}
const getNumOfValues = (catalog) => {
  if (catalog.type == 'object') 
    return catalog.values ? Object.keys(catalog.values).length : 'Sin valores'
  if (catalog.type == 'array')
    return catalog.values ? catalog.values.length : 'Sin valores'
}
const showDeleteCatalogConfirmation = async catalog => {
  catalogDetail.value = catalog
  isCatalogDeleteDialogVisible.value = true
}

const deleteCatalog = async id => {
  await $api(`api/catalog/${ id }`, { method: 'DELETE' })

  // refetch User
  fetchCatalogs()
}
</script>
<template>
  <div>
    <VRow>
      <VCol
        cols="12"
      >
        <!-- 👉 Order Details -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              <h5 class="text-h5">
                Catálogos
              </h5>
            </template>
            <template #append>
              <div class="text-base font-weight-medium text-primary cursor-pointer">
                <VBtn
                  prepend-icon="tabler-plus"
                  @click="isAddNewCatalogDrawerVisible = true"
                >
                  Agregar catálogo
                </VBtn>
              </div>
            </template>
          </VCardItem>

          <VDivider />
          <VDataTable
            :headers="headers"
            :items="catalogs"
            item-value="name"
            class="text-no-wrap"
          >
            <template #item.name="{ item }">
              <div class="d-flex gap-x-3 align-center">
                <div class="d-flex flex-column align-start">
                  <h6 class="text-h6">
                    <RouterLink
                      :to="{ name: 'apps-catalogs-view-id', params: { id: item._id } }"
                      class="font-weight-medium text-link"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </h6>
                </div>
              </div>
            </template>
            <template #item.type="{ item }">
              <div class="text-body-1">
                {{ item.type == 'object' ? 'Objeto' : 'Arreglo' }}
              </div>
            </template>
            <template #item.values="{ item }">
              <div class="text-body-1 text-capitalize">
                {{ getNumOfValues(item) }}
              </div>
            </template>
            <!-- Actions -->
            <template #item.actions="{ item }">
              <VBtn 
                color="secondary"
                variant="plain"
                :to="{ name: 'apps-catalogs-view-id', params: { id: item._id } }"
              >
                <VIcon
                  start
                  icon="tabler-pencil"
                />Editar
              </VBtn>
              <VBtn
                color="secondary"
                variant="plain"
                @click="showDeleteCatalogConfirmation(item)"
              >
                <VIcon 
                  start
                  icon="tabler-trash" />Eliminar
              </VBtn>
            </template>

            <template #bottom />
          </VDataTable>
          <div class="mb-5"></div>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <AddNewCatalogDrawer
    v-model:isDrawerOpen="isAddNewCatalogDrawerVisible"
    @catalog-data="addNewCatalog"
  />
  <DeleteCatalogDialog
    v-model:isDialogVisible="isCatalogDeleteDialogVisible"
    v-model:catalogDetail="catalogDetail"
    @catalog-data="deleteCatalog"
  />
</template>
