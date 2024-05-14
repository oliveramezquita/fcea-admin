<script setup>
import { useApi } from '@/composables/useApi';
import AddNewInstitutionDrawer from '@/views/apps/basins/view/AddNewInstitutionDrawer.vue';

const route = useRoute('apps-basins-view-id')
const { 
  data: basinData,
  execute: fetchBasin
} = await useApi(createUrl(`api/basin/${ route.params.id }`))
const basin = computed(() => basinData.value)
const institution = ref()
const isFormValid = ref(false)
const refForm = ref()
const geoJsonFile = ref()
const isAddNewInstitutionDrawerVisible = ref(false)
const typeForm = ref()
const addOrEditInstitution = async data => {
  if (data.type === 'new') {
    await $api(`api/basin/${basin.value._id}`, {
      method: 'PATCH',
      body: data.formData,
    })
  }
  fetchBasin()
}
const addNewInstitution = () => {
  institution.value = {name: '', logo: null}
  typeForm.value = 'new'
  isAddNewInstitutionDrawerVisible.value = true
}
const editInstitution = i => {
  institution.value = i
  typeForm.value = 'edit'
  isAddNewInstitutionDrawerVisible.value = true
}
const onSubmit = () => {

}
</script>
<template>
  <VCard>
    <VCardItem>
      <template #title>
        <h4 class="text-h4 mb-3">
          Cuenca
        </h4>
      </template>
      <VForm
        ref="refForm"
        v-model="isFormValid"
        @submit.prevent="onSubmit"
      >
        <VRow>
          <VCol cols="12" md="6">
            <AppTextField
              v-model="basin.name"
              :rules="[requiredValidator]"
              label="Nombre"
              placeholder="Nombre de la cuenca"
              prepend-icon="tabler-map-plus"
            />
          </VCol>
          <VCol cols="12" md="6">
            <VFileInput
              accept="application/json"
              v-model="geoJsonFile"
              label="Polígeno GeoJSON"
              variant="outlined"
            />
          </VCol>
          <VCol cols="12">
            <VBtn
              type="submit"
              class="me-3"
            >
              Actualizar
            </VBtn>
            <VBtn
              type="reset"
              variant="tonal"
              color="secondary"
              :to="{name: 'apps-basins-list'}"
            >
              Regresar
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardItem>
    <VDivider />
    <VCardItem>
      <template #title>
        <h4 class="text-h4 mb-3">
          Instituciones
        </h4>
      </template>
      <template #append>
        <div class="text-base font-weight-medium text-primary cursor-pointer">
          <VBtn
            prepend-icon="tabler-plus"
            @click="addNewInstitution"
            variant="tonal"
          >
            Agregar Institución
          </VBtn>
        </div>
      </template>
    </VCardItem>
    <VCardText v-if="basin.institutions.length > 0">
      <VList
        lines="two"
        border
      >
        <template
          v-for="(institution, index) of basin.institutions"
          :key="institution.name"
        >
          <VListItem>
            <template #prepend>
              <VAvatar size="48" :variant="!institution.logo ? 'tonal' : undefined" class="mt-2">
                <VImg
                  v-if="institution.logo"
                  :src="institution.logo"
                  />
                  <span v-else>{{ avatarText(institution.name) }}</span>
              </VAvatar>
            </template>
            <VListItemTitle>
              {{ institution.name }}
            </VListItemTitle>

            <template #append>
              <VBtn
                size="small" 
                color="primary" 
                variant="outlined" 
                class="mr-2"
                @click="editInstitution(institution)">
                Editar
              </VBtn>
              <VBtn size="small" color="secondary" variant="outlined">
                Eliminar
              </VBtn>
            </template>
          </VListItem>
          <VDivider v-if="index !== basin.institutions.length - 1" />
        </template>
      </VList>
    </VCardText>
  </VCard>
  <AddNewInstitutionDrawer
    v-model:isDrawerOpen="isAddNewInstitutionDrawerVisible" 
    v-model:institutionData="institution"
    v-model:typeForm="typeForm"
    @add-or-edit-institution="addOrEditInstitution"
  />
</template>
