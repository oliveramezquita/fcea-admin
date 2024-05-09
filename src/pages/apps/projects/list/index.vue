<script setup>
import { useApi } from '@/composables/useApi';
import AddNewProjectDrawer from '@/views/apps/projects/list/AddNewProjectDrawer.vue';
import { computed } from 'vue';
definePage({
  meta: {
    action: 'manage',
    subject: 'admin',
  },
})
const userData = useCookie('userData')
const isSuperAdminRule = ref(userData.value.role === 'SUPER_ADMIN' ? true : false)
const {
  data: projectsData,
  execute: fetchProjects,
} = await useApi(createUrl('api/projects'))
const projects = computed(() => projectsData.value)
const hasAssignedProjects = ref(false)
const emptyProjects = ref(true)
const refineProjects = projects => {
  projects.forEach((project, index) => {
    add(projects[index], 'isHover', false)
    add(projects[index], 'color', project.activated ? 'success' : 'secondary')
    
    const interestSites = project.interest_sites_data ? JSON.parse(project.interest_sites_data) : []
    if ((project.admin_users && project.admin_users.includes(userData.value._id)) || userData.value.role === 'SUPER_ADMIN') {
      hasAssignedProjects.value = true
      emptyProjects.value = false
    }
    
    add(projects[index], 'info', [
      {
        avatarIcon: 'tabler-map-2',
        title: 'Sitio de referencia',
        count: -1,
      },
      {
        avatarIcon: 'tabler-map-check',
        title: 'Sitios de interés',
        count: interestSites.answers ? interestSites.answers.length : 0,
      },
      {
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
        v-if="hasAssignedProjects"
      >
        <VCard
          class="logistics-card-statistics cursor-pointer"
          :style="project.isHover ? `border-block-end-color: rgb(var(--v-theme-${project.color}))` : `border-block-end-color: rgba(var(--v-theme-${project.color}),0.38)`"
          @mouseenter="project.isHover = true"
          @mouseleave="project.isHover = false"
          :to="{ name: 'apps-projects-view-id', params: { id: project._id } }"
        >
          <VImg :src="setBackgroundSeason(project.season)" />
          <VCardItem>
            <VCardTitle>
              <div class="d-flex gap-2 align-center mb-2 flex-wrap">
                <h5 class="text-h5">{{ project.name }}</h5>
                <div class="d-flex gap-x-2">
                  <VChip
                    variant="tonal"
                    :color="project.season === 'Lluvias' ? 'info' : 'warning'"
                    label
                    size="small"
                  >
                    {{ project.season }}
                  </VChip>
                  <VChip
                    variant="tonal"
                    :color="project.activated ? 'success' : 'secondary'"
                    label
                    size="small"
                  >
                    {{ project.activated ? 'Activo' : 'Desactivo' }}
                  </VChip>
                </div>
              </div>
            </VCardTitle>
            <VCardSubtitle>{{ project.year && project.month ? `${project.month} ${project.year}` : '' }}</VCardSubtitle>
          </VCardItem>
          <VCardText>
            <VList class="card-list">
              <VListItem
                v-for="(info, i) in project.info"
                :key="i"
              >
                <template #prepend>
                  <VAvatar
                    
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
                      {{ info.count >= 0 ? info.count : getSiteName(project.reference_sites_data)}}
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
      v-if="isSuperAdminRule"
    >
      <VCard
        class="logistics-card-statistics cursor-pointer"
        style="border-block-end-color: rgba(var(--v-theme-info), 0.38);"
        @click="isAddNewProjectDrawerVisible = true"
      >
        <VCardText class="text-center">
          <div class="mt-5">
            <VBtn
              icon="tabler-map-plus"
              size="42"
              color="info"
              variant="tonal"
            />
          </div>
          <span class="v-card-title text-secondary mt-2 mb-3">Nueva Cuenca</span>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <template v-if="emptyProjects && !isSuperAdminRule">
    <VCard title="Sin cuenca asignada" class="mt-5">
      <VCardText>
        No cuentas con alguna cuenca asignada o activa, para más información envíanos un correo a: <a href="mailto:karla.rivera@fcea.org.mx" target="_blank">karla.rivera@fcea.org.mx</a> o comunícate al teléfono: <a href="https://wa.me/525548104412" target="_blank">55 4810 4412</a>.
      </VCardText>
    </VCard>
  </template>
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
