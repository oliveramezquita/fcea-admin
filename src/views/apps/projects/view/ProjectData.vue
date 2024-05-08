<script setup>
const props = defineProps({
  projectData: {
    type: Object,
    required: true,
  },
  usersData: {
    type: Array,
    required: true,
  },
  geoJsonFile: {
    type: Array,
    required: false,
  },
  isSuperAdminRule: {
    type: Boolean,
    required: true,
  },
  updateProjectData: {
    type: Object,
    required: true,
  }
})

const emit = defineEmits([
  'update:projectData',
  'update:usersData',
  'update:geoJsonFile',
  'update:isSuperAdminRule',
  'updateProjectData'
])

const project = ref(structuredClone(toRaw(props.projectData)))
project.value.geojson_file = structuredClone(toRaw(props.geoJsonFile))
const isFormValid = ref(false)
const refForm = ref()
const yearList = ref(generateArrayOfYears())
const monthList = ref(['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'])


const isAlertVisible = ref(false)
const alertType = ref() 
const alertMessage = ref() 
const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      const formData = new FormData()
      formData.set('season', project.value.season)
      formData.set('admin_users', project.value.admin_users)
      formData.set('year', project.value.year)
      formData.set('month', project.value.month)
      if (project.value.geojson_file?.length > 0)
        formData.set('geojson_file', project.value.geojson_file[0])
      
      $api(`api/project/${project.value._id}`, {
        method: 'PATCH',
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
        },
      })
      emit('updateProjectData', project.value)
      nextTick(() => {
        refForm.value?.resetValidation()
      })
    }
  })
}

watch(props, () => {
  project.value = structuredClone(toRaw(props.projectData))
  project.value.geojson_file = structuredClone(toRaw(props.geoJsonFile))
})
</script>

<template>
  <VForm
    ref="refForm"
    v-model="isFormValid"
    @submit.prevent="onSubmit"
  >
    <VRow>
      <!-- 👉 Season -->
      <VCol cols="12" md="6">
        <AppSelect
          v-model="project.season"
          label="Temporada"
          placeholder="Selecciona una temporada"
          :rules="[requiredValidator]"
          :items="['Secas', 'Lluvias']"
          prepend-icon="tabler-cloud-pin"
        />
      </VCol>
      <VCol cols="12" md="6">
        <AppAutocomplete
          v-model="project.admin_users"
          multiple
          chips
          :closable-chips="props.isSuperAdminRule"
          :items="props.usersData"
          item-title="full_name"
          item-value="_id"
          placeholder="Selecciona un administrador"
          label="Administrador(es)"
          :readonly="!props.isSuperAdminRule"
          prepend-icon="tabler-user-cog"
        >
          <template #chip="{ props, item }">
            <VChip
              v-bind="props"
              :text="item.raw.full_name"
            />
          </template>

          <template #item="{ props, item }">
            <VListItem
              v-bind="props"
              :title="item?.raw?.full_name"
              :subtitle="item?.raw?.institution"
            />
          </template>
        </AppAutocomplete>
      </VCol>
      <!-- 👉 Year -->
      <VCol cols="12" md="6">
        <AppSelect
          v-model="project.year"
          label="Año"
          placeholder="Selecciona un año"
          :rules="[requiredValidator]"
          :items="yearList"
          prepend-icon="tabler-calendar"
        />
      </VCol>
        <!-- 👉 Month -->
      <VCol cols="12" md="6">
        <AppSelect
          v-model="project.month"
          label="Mes"
          placeholder="Selecciona un mes"
          :rules="[requiredValidator]"
          :items="monthList"
          prepend-icon="tabler-calendar-month"
        />
      </VCol>
      <VCol cols="12" md="6" class="mt-3">
        <VFileInput
          accept="application/json"
          v-model="project.geojson_file"
          color="primary"
          label="Polígeno GeoJSON"
          variant="outlined"
        />
      </VCol>
      <!-- 👉 Submit and Cancel -->
      <VCol cols="12" v-if="!isAlertVisible">
        <VBtn
          type="submit"
          class="me-3"
        >
          Agregar
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
</template>
