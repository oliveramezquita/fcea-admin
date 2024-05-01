<script setup>
import ProjectInterestSites from '@/views/apps/projects/view/ProjectInterestSites.vue';
import ProjectReferenceSites from '@/views/apps/projects/view/ProjectReferenceSites.vue';
import TemporadaLluvias from '@images/illustrations/temporada-lluvias.jpg';
definePage({
  meta: {
    action: 'manage',
    subject: 'admin',
  },
})
const userData = useCookie('userData')
const isSuperAdminRule = ref(userData.value.role === 'SUPER_ADMIN' ? true : false)
const currentTab = ref('tab-1')
const route = useRoute('apps-projects-view-id')
const { data: projectData } = await useApi(`api/project/${ route.params.id }`)
const status = ref()
const {
  data: usersData
} = await useApi(createUrl('api/users', {
  query: {
    status: true,
  }
}))
const project = computed(() => projectData.value)

if (project.value) {
  status.value = project.value.activated ? 'Activo' : 'Desactivo'
}
const objReferenceSite = JSON.parse(project.value.reference_sites_data)
const existsSiteReference = ref(objReferenceSite.hasOwnProperty('answers'))
const adminUsers = ref(usersData.value.data.filter(user => user.role === 'ADMIN' && user.activated))
const admins = ref()
const isEditing = ref(false)

admins.value = project.value?.admin_users

const editProject = async project => {
  await $api(`api/project/${project._id}`, {
    method: 'PATCH',
    body: {
      'activated': !project.activated
    },
  })
}
const editAdminUsers = async project => {
  await $api(`api/project/${project._id}`, {
    method: 'PATCH',
    body: {
      'admin_users': admins.value
    },
  })
  isEditing.value = true
}
const geoJsonFile = ref()
const loading = ref(false)
const isAlertVisible = ref(false)
const alertType = ref('error') 
const alertMessage = ref()
const uploadGeoJson = async project => {
  if (!geoJsonFile.value[0]) {
    isGeoJsonFileDeleteDialogVisible.value = true
  } else {
    loading.value = true
    let formData = new FormData()
    formData.append('geojson_file', geoJsonFile.value[0])
    await $api(`api/project/${project._id}`, {
      method: 'PATCH',
      body: formData,
      onResponse() {
        loading.value = false
      },
      onResponseError({ response }) {
        loading.value = false
        alertMessage.value = `Ocurrió un error al momento de subi el archivo: ${response?._data?.message}`
        isAlertVisible.value = true
        fetchGeoJsonFile()
      }
    })
  }
}

const isGeoJsonFileDeleteDialogVisible = ref(false)
const deleteGeoJsonFile = async project => {
  await $api(`api/project/${project._id}`, {
    method: 'PATCH',
    body: {
      'geojson_file': null
    },
  })
}
const cancelDeleteGeoJsonFile = async () => {
  fetchGeoJsonFile()
}

const geoJsonFileURL = ref(project.value?.geojson_file)
const fetchGeoJsonFile = async () => {
  $api(geoJsonFileURL.value, {
    method: 'GET',
    onResponse({ response }) {
      const filename = geoJsonFileURL.value.replace(/^.*[\\/]/, '')
      geoJsonFile.value = [new File([response._data], filename, {type: "text/json;charset=utf-8"})]
    }
  })
}
if (geoJsonFileURL.value) {
  fetchGeoJsonFile()
}
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VImg
        :src="TemporadaLluvias"
        min-height="125"
        max-height="250"
        cover
      />

      <VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-6">
        <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
          <div class="d-flex gap-2 align-center mb-2 flex-wrap">
            <h4 class="text-h4">
              {{ project.name }}
            </h4>
            <div class="d-flex gap-x-2">
              <VChip
                variant="tonal"
                color="info"
                label
                size="small"
              >
                {{ project.season }}
              </VChip>
            </div>
          </div>

          <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-5">
            <div class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-6">
              <div class="w-50">
                <AppAutocomplete
                  v-model="admins"
                  multiple
                  chips
                  :closable-chips="isSuperAdminRule"
                  :items="adminUsers"
                  item-title="full_name"
                  item-value="_id"
                  placeholder="Selecciona un administrador"
                  label="Administrador(es)"
                  :readonly="!isSuperAdminRule"
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
                  <template #append v-if="isSuperAdminRule">
                    <VSlideXReverseTransition mode="out-in">
                      <VIcon
                        :key="`icon-${isEditing}`"
                        :color="isEditing ? 'success' : 'info'"
                        :icon="isEditing ? 'tabler-checks' : 'tabler-device-floppy'"
                        :size="22"
                        @click="editAdminUsers(project)"
                      />
                    </VSlideXReverseTransition>
                  </template>
                </AppAutocomplete>
                <VFileInput
                  accept="application/json"
                  v-model="geoJsonFile"
                  :loading="loading"
                  color="primary"
                  label="Polígeno GeoJSON"
                  variant="outlined"
                  class="mt-5"
                  @update:model-value="uploadGeoJson(project)"
                />
                <VAlert
                  v-model="isAlertVisible"
                  closable
                  close-label="Close Alert"
                  class="mt-5"
                  :type="alertType"
                  variant="tonal">
                  {{ alertMessage }}
                </VAlert>
              </div>
            </div>

            <div class="d-flex justify-space-between align-center">
              <VSwitch
                v-model="status"
                :label="status.toString()"
                true-value="Activo"
                false-value="Desactivo"
                @click="editProject(project)"
                v-if="isSuperAdminRule"
              />
              <VBtn
                variant="tonal"
                color="info"
                class="ml-5"
                :to="{name: 'apps-projects-list'}"
              >
                Regresar
              </VBtn>
            </div>
          </div>
        </div>
      </VCardText>
    </VCard>
    <VCard>
      <VTabs
        v-model="currentTab"
        grow
        stacked
        class="mt-3"
      >
        <VTab>
          <VIcon
            icon="tabler-map-2"
            class="mb-2"
          />
          <span>Sitio de referencia</span>
        </VTab>

        <VTab>
          <VIcon
            icon="tabler-map-check"
            class="mb-2"
          />
          <span>Sitios de interés</span>
        </VTab>
      </VTabs>

      <VCardText>
        <VWindow v-model="currentTab">
          <VWindowItem>
            <ProjectReferenceSites :project-data="project" :users-data="usersData.data" />
          </VWindowItem>
          <VWindowItem>
            <ProjectInterestSites v-if="existsSiteReference" :project-data="project" :users-data="usersData.data" />
            <template v-if="!existsSiteReference">
              <VAlert
                prominent
                type="info"
                variant="tonal"
                color="secondary"
              >
                <template #text>
                  Para asignar sitios de interés es necesario dar de alta el sitio de referencia
                </template>
              </VAlert>
            </template>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </div>
  <DeleteGeoJsonFileDialog
    v-model:isDialogVisible="isGeoJsonFileDeleteDialogVisible"
    v-model:projectData="project"
    @delete-geo-json-file="deleteGeoJsonFile"
    @cancel-delete-file="cancelDeleteGeoJsonFile"
  />
</template>
