<script setup>
import { toRaw } from 'vue';
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
  selectedMonitoringPeriod: {
    type: String,
    required: true,
  },
  selectedSeason: {
    type: String,
    required: true,
  },
  projectList: {
    type: Array,
    required: true,
  },
  monitoringPeriodList: {
    type: Array,
    required: true,
  },
  seasonsList: {
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
})
const selectedProject = ref(structuredClone(toRaw(props.selectedProject)))
const selectedMonitoringPeriod = ref(structuredClone(toRaw(props.selectedMonitoringPeriod)))
const selectedSeason = ref(structuredClone(toRaw(props.selectedSeason)))
const projectList = ref(structuredClone(toRaw(props.projectList)))
const monitoringPeriodList = ref(structuredClone(toRaw(props.monitoringPeriodList)))
const seasonsList = ref(structuredClone(toRaw(props.seasonsList)))
const statesList = ref(structuredClone(toRaw(props.statesList)))
const institutionsList = ref(structuredClone(toRaw(props.institutionsList)))

const emit = defineEmits([
  'update:isDrawerOpen',
  'updateMap'
])
const isFormValid = ref(false)
const refForm = ref()
const selectedState = ref()
const selectedInstitution = ref()
const dateRange = ref()

watch(props, () => {
  selectedProject.value = structuredClone(toRaw(props.selectedProject))
  selectedMonitoringPeriod.value = structuredClone(toRaw(props.selectedMonitoringPeriod))
  selectedSeason.value = structuredClone(toRaw(props.selectedSeason))
})

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('updateMap', {
        project: selectedProject.value,
        monitoringPeriod: selectedMonitoringPeriod.value,
        season: selectedSeason.value,
        state: selectedState.value,
        institution: selectedInstitution.value,
        dates: dateRange.value,
      })
      emit('update:isDrawerOpen', false)
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const updateProjects = async () => {
  nextTick(() => {
    selectedState.value = null
    selectedInstitution.value = null
    dateRange.value = null
  })
  $api(`api/site-filters?project=${selectedProject.value}`, {
    method: 'GET',
    onResponse({ response }) {
      if (response.ok) {
        const data = response._data
        selectedMonitoringPeriod.value = data.default_project.monitoring_period
        selectedSeason.value = data.default_project.season
        monitoringPeriodList.value = data.monitoring_periods
        seasonsList.value = data.seasons
        statesList.value = data.states
        institutionsList.value = data.institution
      }
    }
  })
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
                  placeholder="Selecciona una cuenca"
                  :items="projectList"
                  @update:model-value="updateProjects"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedMonitoringPeriod"
                  placeholder="Selecciona un período de monitoreo"
                  :items="monitoringPeriodList"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedSeason"
                  placeholder="Selecciona una temporada"
                  :items="seasonsList"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedState"
                  placeholder="Selecciona un estado"
                  :items="statesList"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="selectedInstitution"
                  placeholder="Selecciona una institución"
                  :items="institutionsList"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
              <VCol cols="12">
              <AppDateTimePicker
                v-model="dateRange"
                placeholder="Selecciona una fecha de monitoreo"
                :config="{ mode: 'range' }"
                clearable
                clear-icon="tabler-x"
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
