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
  if (userData.value.role === 'SUPER_ADMIN')
    return true
  if (userData.value.role === 'ADMIN')
    return project.admin_users.includes(userData.value._id)
  if (insterestSite.users) 
    return insterestSite.users.includes(userData.value._id)
  return false
}
projects.value.forEach(project => {
  emptyProjects.value = !checkInterestSite(project)
});
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
      No cuentas con alguna cuenca activa asignada o algún sitio de interés asignado, para más información envíanos un correo a: <a href="mailto:karla.rivera@fcea.org.mx" target="_blank">karla.rivera@fcea.org.mx</a> o comunícate al teléfono: <a href="https://wa.me/525548104412" target="_blank">55 4810 4412</a>.
    </VCardText>
  </VCard>
</template>
