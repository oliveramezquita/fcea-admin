<script setup>
import ProjectData from '@/views/apps/projects/view/ProjectData.vue';
import ProjectInterestSites from '@/views/apps/projects/view/ProjectInterestSites.vue';
import ProjectReferenceSites from '@/views/apps/projects/view/ProjectReferenceSites.vue';
import { watch } from 'vue';
definePage({
  meta: {
    action: 'manage',
    subject: 'admin',
  },
})
const router = useRouter()
const userData = useCookie('userData')
const isSuperAdminRule = ref(userData.value.role === 'SUPER_ADMIN' ? true : false)
const currentTab = ref('tab-1')
const route = useRoute('apps-projects-view-id')
const { data: projectData } = await useApi(`api/project/${ route.params.id }`)
const { data: basinsData } = await useApi(createUrl('api/basins'))
const status = ref()
const season = ref(projectData.value.season)
const month = ref(projectData.value.month)
const year = ref(projectData.value.year)
const itemsPerPage = ref(10000)
const page = ref(1)
const {
  data: usersData
} = await useApi(createUrl('api/users', {
  query: {
    status: true,
    itemsPerPage,
    page
  }
}))
const project = computed(() => projectData.value)
if (project.value) {
  status.value = project.value.activated ? 'Activo' : 'Desactivo'
}
const objReferenceSite = JSON.parse(project.value.reference_sites_data)
const existsSiteReference = ref(objReferenceSite.hasOwnProperty('answers'))
const adminUsers = ref(usersData.value.data.filter(user => user.role === 'ADMIN' && user.activated))
const editProject = async project => {
  await $api(`api/project/${project._id}`, {
    method: 'PATCH',
    body: {
      'activated': !project.activated
    },
  })
}
const updateProjectData = projectUpdated => {
  season.value = projectUpdated.season
  month.value = projectUpdated.month
  year.value = projectUpdated.year
}
const isProjectDeleteDialogVisible = ref(false)
const deleteProject = async projectId => {
  await $api(`api/project/${ projectId }`, { method: 'DELETE' })
  await router.push('/apps/projects/list')
}
watch([season, month, year])
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VImg :src="setBackgroundSeason(project.season, 'large')" width="100%" />

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
                {{ season }}
              </VChip>
            </div>
          </div>

          <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-5">
            <div class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-6">
              <div class="text-h5 pt-1" v-if="year && month">
                {{ `${month} ${year}` }}
              </div>
              <VSwitch
                v-model="status"
                :label="status.toString()"
                true-value="Activo"
                false-value="Desactivo"
                @click="editProject(project)"
                v-if="isSuperAdminRule"
              />
            </div>

            <div class="d-flex justify-space-between align-center">
              <VBtn
                variant="tonal"
                color="error"
                class="ml-5"
                @click="isProjectDeleteDialogVisible = true"
                v-if="isSuperAdminRule"
              >
                Eliminar
              </VBtn>
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
            icon="tabler-list-letters"
            class="mb-2"
          />
          <span>Datos de la cuenca</span>
        </VTab>
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
        <VWindow v-model="currentTab" class="disable-tab-transition">
          <VWindowItem>
            <ProjectData
            :project-data="project"
            :users-data="adminUsers"
            :basins-data="basinsData"
            :is-super-admin-rule="isSuperAdminRule"
            @updateProjectData="updateProjectData" />
          </VWindowItem>
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
  <DeleteProjectDialog
    v-model:isDialogVisible="isProjectDeleteDialogVisible"
    v-model:project="project"
    @delete-project="deleteProject"
  />
</template>
