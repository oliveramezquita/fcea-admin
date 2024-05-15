<script setup>
import { useApi } from '@/composables/useApi';
import AddNewInstitutionDrawer from '@/views/apps/basins/view/AddNewInstitutionDrawer.vue';

const route = useRoute('apps-basins-view-id')
const { 
  data: basinData,
  execute: fetchBasin
} = await useApi(createUrl(`api/basin/${ route.params.id }`))
const basin = computed(() => basinData.value)
const name = ref(basin.value.name)
const institution = ref()
const refForm = ref()
const geoJsonFile = ref()
const geoJsonFileURL = ref(basin.value?.geojson_file)
const isAddNewInstitutionDrawerVisible = ref(false)
const typeForm = ref()
const addOrEditInstitution = async data => {
  await $api(`api/basin/${basin.value._id}`, {
    method: 'PATCH',
    body: data.formData,
  })
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
const deleteInstitution = async institutionName => {
  const formData = new FormData()
  formData.set('name', institutionName)
  formData.set('delete', true)
  await $api(`api/basin/${basin.value._id}`, {
    method: 'PATCH',
    body: formData,
  })
  fetchBasin()
}
const isAlertVisible = ref(false)
const alertType = ref() 
const alertMessage = ref() 
const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      const formData = new FormData()
      formData.set('name', name.value)
      if (geoJsonFile.value?.length > 0)
        formData.set('geojson_file', geoJsonFile.value[0])
      $api(`api/basin/${basin.value._id}`, {
        method: 'PUT',
        body: formData,
        onResponse({ response }) {
          if (response.ok) {
            alertType.value = "success"
            alertMessage.value = "Los datos de la cuenca han sido actualizados exitosamente"
          } else {
            alertType.value = response.status === 404 ? "warning" : "error"
            alertMessage.value = `Ocurrió un error al momento de actualizar los datos: ${response?._data?.message}`
          }
          isAlertVisible.value = true
        }
      })
      nextTick(() => {
        refForm.value?.resetValidation()
      })
    }
  })
}
onMounted(() => {
  if (basin.value.geojson_file) {
    $api(geoJsonFileURL.value, {
      method: 'GET',
      onResponse({ response }) {
        const filename = geoJsonFileURL.value.replace(/^.*[\\/]/, '')
        geoJsonFile.value = [new File([response._data], filename, {type: "text/json;charset=utf-8"})]
      }
    })
  }
})
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
        @submit.prevent="onSubmit"
      >
        <VRow>
          <VCol cols="12" md="6">
            <AppTextField
              v-model="name"
              :rules="[requiredValidator]"
              label="Nombre"
              placeholder="Nombre de la cuenca"
              prepend-icon="tabler-map-plus"
            />
          </VCol>
          <VCol cols="12" md="6" class="mt-md-6">
            <VFileInput
              accept="application/json"
              v-model="geoJsonFile"
              label="Polígeno GeoJSON"
              variant="outlined"
            />
          </VCol>
          <VCol cols="12" v-if="!isAlertVisible">
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
          <VCol cols="12">
            <VAlert
              v-model="isAlertVisible"
              closable
              close-label="Close Alert"
              class="mt-5"
              :type="alertType"
              variant="tonal">
              {{ alertMessage }}
            </VAlert>
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
              <VAvatar size="48" :variant="!institution.logo ? 'tonal' : undefined">
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
              <VBtn
                size="small"
                color="secondary"
                variant="outlined"
                @click="deleteInstitution(institution.name)">
                Eliminar
              </VBtn>
            </template>
          </VListItem>
          <VDivider v-if="index !== basin.institutions.length - 1" class="mt-2 mb-2" />
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
