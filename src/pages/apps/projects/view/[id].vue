<script setup>
import ProjectInterestSites from '@/views/apps/projects/view/ProjectInterestSites.vue';
import ProjectReferenceSites from '@/views/apps/projects/view/ProjectReferenceSites.vue';

const currentTab = ref('tab-1')
const route = useRoute('apps-projects-view-id')
const { data: projectData } = await useApi(`api/project/${ route.params.id }`)
const status = ref()
const {
  data: usersData
} = await useApi(createUrl('api/users', {
  query: {
    status: true,
    role: 'BRIGADIER',
  }
}))
const project = computed(() => projectData.value)

if (project.value) {
  status.value = project.value.activated ? 'Activo' : 'Desactivo'
}
const objReferenceSite = JSON.parse(project.value.reference_sites_data)
const existsSiteReference = ref(objReferenceSite.hasOwnProperty('answers'))

const editProjecy = async project => {
  await $api(`api/project/${project._id}`, {
    method: 'PATCH',
    body: {
      'activated': !project.activated
    },
  })
}
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <div class="d-flex gap-2 align-center mb-2 flex-wrap">
          <h5 class="text-h5">
            {{ project.name }}
          </h5>
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
      </div>
      <div>
        <div class="d-flex justify-space-between align-center">
          <VSwitch
            v-model="status"
            :label="status.toString()"
            true-value="Activo"
            false-value="Desactivo"
            @click="editProjecy(project)"
          />
          <VBtn
            variant="tonal"
            color="secondary"
            class="ml-5"
            :to="{name: 'apps-projects-list'}"
          >
            Regresar
          </VBtn>
        </div>
      </div>
    </div>
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
</template>
