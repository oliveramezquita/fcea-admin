<script setup>
import { useApi } from '@/composables/useApi';
import AddNewProjectDrawer from '@/views/apps/projects/list/AddNewProjectDrawer.vue';
import temporadaLluvias from '@images/illustrations/temporada-lluvias.jpg';
import temporadaSecas from '@images/illustrations/temporada-secas.jpg';
import { computed } from 'vue';

const {
  data: projectsData,
  execute: fetchProjects,
} = await useApi(createUrl('api/projects'))
const projects = computed(() => projectsData.value)

const refineProjects = projects => {
  projects.forEach((project, index) => {
    add(projects[index], 'isHover', false)
    add(projects[index], 'color', project.activated ? 'success' : 'secondary')
    
    const interestSites = project.interest_sites_data ? JSON.parse(project.interest_sites_data) : []
  
    add(projects[index], 'info', [
      {
        avatarColor: 'primary',
        avatarIcon: 'tabler-map-check',
        title: 'Sitios de interés',
        count: interestSites.answers ? interestSites.answers.length : 0,
      },
      {
        avatarColor: 'warning',
        avatarIcon: 'tabler-users-group',
        title: 'Brigadistas',
        count: getNumOfUsers(projects[index])
      },
    ])
  })
  return projects
}

let add = (obj, k, v) => Object.assign(obj, obj[k] 
  ? { [k]: [].concat(obj[k], v) } 
  : { [k]: v })

const getSiteName = referenceSites => {
  const objReferenceSite = JSON.parse(referenceSites)
  return objReferenceSite.answers ? objReferenceSite.answers[0].nombre_sitio : 'PENDIENTE'
}

const isAddNewProjectDrawerVisible = ref(false)
const addNewProject = async projectData => {
  await $api('api/projects', {
    method: 'POST',
    body: projectData,
  })

  // refetch User
  fetchProjects()
}

const getNumOfUsers = project => {
  const objReferenceSite = JSON.parse(project.reference_sites_data)
  const rfs = objReferenceSite.users ? objReferenceSite.users : []
  const objInterestSite = JSON.parse(project.interest_sites_data)
  const its = objInterestSite.users ? objInterestSite.users : []
  const numOfUsers = [...rfs, ...its]
  let unique = [...new Set(numOfUsers)];
  return unique.length
}

</script>

<template>
  <VRow>
    <template
      v-for="project in refineProjects(projects)"
      :key="project._id"
    >
      <VCol
        lg="4"
        sm="6"
        cols="12"
      >
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="project.isHover ? `border-block-end-color: rgb(var(--v-theme-${project.color}))` : `border-block-end-color: rgba(var(--v-theme-${project.color}),0.38)`"
          @mouseenter="project.isHover = true"
          @mouseleave="project.isHover = false"
          :to="{ name: 'apps-projects-view-id', params: { id: project._id } }"
        >
          <VImg :src="temporadaLluvias" v-if="project.season === 'Lluvias' " />
          <VImg :src="temporadaSecas" v-if="project.season === 'Secas' " />
          <VCardItem>
            <VCardTitle>{{ project.name }}</VCardTitle>
            <VCardSubtitle>SRF: {{ getSiteName(project.reference_sites_data) }}</VCardSubtitle>
          </VCardItem>
          <VCardText>
            <VList class="card-list">
              <VListItem
                v-for="(info, i) in project.info"
                :key="i"
              >
                <template #prepend>
                  <VAvatar
                    :color="info.avatarColor"
                    variant="tonal"
                    size="34"
                    rounded
                    class="me-1"
                  >
                    <VIcon
                      :icon="info.avatarIcon"
                      size="22"
                    />
                  </VAvatar>
                </template>

                <VListItemTitle class="font-weight-medium me-4">
                  {{ info.title }}
                </VListItemTitle>

                <template #append>
                  <div class="d-flex gap-x-4">
                    <div class="text-body-1">
                      {{ info.count }}
                    </div>
                  </div>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </template>
      <VCol
        lg="4"
        sm="6"
        cols="12"
      >
        <VCard
          class="logistics-card-statistics cursor-pointer"
          style="border-block-end-color: rgba(var(--v-theme-info), 0.38);"
          @click="isAddNewProjectDrawerVisible = true"
        >
          <VCardText class="text-center">
            <div class="mt-5">
              <VBtn
                icon="tabler-category-plus"
                size="42"
                color="info"
                variant="tonal"
              />
            </div>
            <span class="v-card-title text-secondary mt-2 mb-3">Nuevo Projecto</span>
          </VCardText>
        </VCard>
      </VCol>
  </VRow>
  <AddNewProjectDrawer
    v-model:isDrawerOpen="isAddNewProjectDrawerVisible"
    @project-data="addNewProject"
  />
</template>

<style lang="scss" scoped>
@use "@core/scss/base/mixins" as mixins;

.logistics-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;

    @include mixins.elevation(8);

    transition: all 0.1s ease-out;
  }
}

.skin--bordered {
  .logistics-card-statistics {
    border-block-end-width: 2px;

    &:hover {
      border-block-end-width: 3px;
      margin-block-end: -2px;
      transition: all 0.1s ease-out;
    }
  }
}

.card-list {
  --v-card-list-gap: 24px;
}
</style>
