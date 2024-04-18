<script setup>
import SiteInterestInfo from '@/views/forms/SiteInterestInfo.vue';
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
</script>
<template>
  <template v-for="project in projects" :key="project._id">
    <SiteInterestInfo
      :project-data="project"
      :user-data="userData" 
      v-if="checkInterestSite(project)" />
  </template>
</template>
