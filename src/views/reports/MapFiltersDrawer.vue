<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  selectedProject: {
    type: String,
    required: true,
  },
  projectList: {
    type: Array,
    required: true,
  },
  statesList: {
    type: Array,
    required: true,
  },
  institutionsList: {
    type: Array,
    required: true,
  },
  sitesList: {
    type: Array,
    required: true,
  },
})
const selectedProject = ref(structuredClone(toRaw(props.selectedProject)))
const statesList = ref(structuredClone(toRaw(props.projectList)))
const institutionsList = ref(structuredClone(toRaw(props.institutionsList)))
const sitesList = ref(structuredClone(toRaw(props.sitesList)))

const emit = defineEmits([
  'update:isDrawerOpen',
  'updateMap'
])
const isFormValid = ref(false)
const refForm = ref()
const selectedState = ref()
const selectedInstitution = ref()
const selectedSites = ref()
const dateRange = ref()
const selectedParameter = ref()

watch(props, () => {
  selectedProject.value = structuredClone(toRaw(props.selectedProject))
  statesList.value = structuredClone(toRaw(props.statesList))
  institutionsList.value = structuredClone(toRaw(props.institutionsList))
  sitesList.value = structuredClone(toRaw(props.sitesList))
})

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('updateMap', {
        project: selectedProject.value,
        state: selectedState.value,
        institution: selectedInstitution.value,
        site: selectedSites.value,
        dates: dateRange.value,
      })
      emit('update:isDrawerOpen', false)
      // nextTick(() => {
      //   refForm.value?.reset()
      //   refForm.value?.resetValidation()
      // })
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const updateProjects = async project => {
  nextTick(() => {
    selectedState.value = null
    selectedInstitution.value = null
    selectedSites.value = null

  })
  if (project) {
    $api(`api/site-filters?project=${project}`, {
          method: 'GET',
          onResponse({ response }) {
            if (response.ok) {
              const data = response._data
              statesList.value = data.states
              institutionsList.value = data.institution
              sitesList.value = data.sites
            }
          }
    })
  }
}

</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Filtros"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedProject"
                  placeholder="Seleccionar cuenca"
                  :items="projectList"
                  @update:model-value="updateProjects"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedState"
                  placeholder="Seleccionar estado"
                  :items="statesList"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedInstitution"
                  placeholder="Seleccionar institución"
                  :items="institutionsList"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedSites"
                  placeholder="Seleccionar sitio"
                  :items="sitesList"
                />
              </VCol>
              <VCol cols="12">
              <AppDateTimePicker
                v-model="dateRange"
                placeholder="Selecciona una fecha"
                :config="{ mode: 'range' }"
              />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedParameter"
                  placeholder="Seleccionar parámetro"
                  :items="[]"
                />
              </VCol>
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Filtrar
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancelar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
