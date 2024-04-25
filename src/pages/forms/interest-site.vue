<script setup>
import SiteInterestInfo from '@/views/forms/SiteInterestInfo.vue';
definePage({
  meta: {
    action: 'read',
    subject: ['admin', 'brigadier'],
  },
})
const {
  data: projectsData
} = await useApi(createUrl('api/projects'))
const projects = computed(() => projectsData.value)
const userData = useCookie('userData')
const emptyProjects = ref(true)

const checkInterestSite = project => {
  const insterestSite = JSON.parse(project.interest_sites_data)
  if (userData.value.role === 'SUPER_ADMIN') {
    emptyProjects.value = projects.value.length ? false : true
    return true
  }
  if (userData.value.role === 'ADMIN') {
    emptyProjects.value = !project.admin_users.includes(userData.value._id)
    return project.admin_users.includes(userData.value._id)
  }
  if (insterestSite.users) {
    emptyProjects.value = !insterestSite.users.includes(userData.value._id)
    return insterestSite.users.includes(userData.value._id)
  }
  return false
}
// projects.value.forEach(project => {
//   emptyProjects.value = !checkInterestSite(project)
// });
</script>
<template>
  <template v-for="project in projects" :key="project._id">
    <SiteInterestInfo
      :project-data="project"
      :user-data="userData" 
      v-if="checkInterestSite(project)" />
  </template>
  <VCard title="Sin cuenca o sitio de interés no asignado" v-if="emptyProjects">
    <VCardText>
      No cuentas con alguna cuenca asignada o activa, para más información envíanos un correo a: <a href="mailto:info@fcea.org.mx" target="_blank">info@fcea.org.mx</a> o mediante el enlace: <a href="https://fcea.org.mx/contact/" target="_blank">fcea.org.mx/contact/</a>.
    </VCardText>
  </VCard>
</template>
