<script setup>
import SiteReferenceInfo from '@/views/forms/SiteReferenceInfo.vue';
definePage({
  meta: {
    action: 'read',
    subject: 'brigadier',
  },
})
const {
  data: projectsData
} = await useApi(createUrl('api/projects'))
const projects = computed(() => projectsData.value)
const userData = useCookie('userData')
const emptyProjects = ref(true)

const checkReferenceSite = project => {
  const referenceSite = JSON.parse(project.reference_sites_data)
  if (userData.value.role === 'SUPER_ADMIN')
    return true
  if (userData.value.role === 'ADMIN')
    return project.admin_users.includes(userData.value._id) 
  if (referenceSite.users) 
    return referenceSite.users.includes(userData.value._id)
  return false
}
projects.value.forEach(project => {
  emptyProjects.value = !checkReferenceSite(project)
});
</script>
<template>
  <template v-for="project in projects" :key="project._id">
    <SiteReferenceInfo
      :project-data="project"
      :user-data="userData"
      v-if="checkReferenceSite(project)" />
  </template>
  <VCard title="Sin cuenca asignada" v-if="emptyProjects">
    <VCardText>
      No cuentas con alguna cuenca asignada o activa, para más información envíanos un correo a: <a href="mailto:karla.rivera@fcea.org.mx" target="_blank">karla.rivera@fcea.org.mx</a> o comunícate al teléfono: <a href="https://wa.me/525548104412" target="_blank">55 4810 4412</a>.
    </VCardText>
  </VCard>
</template>   
