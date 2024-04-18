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
</script>
<template>
  <template v-for="project in projects" :key="project._id">
    <SiteReferenceInfo
      :project-data="project"
      :user-data="userData"
      v-if="checkReferenceSite(project)" />
  </template>
</template>   
