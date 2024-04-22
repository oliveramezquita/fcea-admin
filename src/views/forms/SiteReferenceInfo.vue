<script setup>
import { urlFormParse } from '@/utils/urlFormParse';
import DialogFormsApp from '@/views/forms/dialog/DialogFormsApp.vue';
import academyCourseIllustration1 from '@images/pages/academy-course-illustration1.png';
const props = defineProps({
  projectData: {
    type: Object,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
})
const projectData = ref(structuredClone(toRaw(props.projectData)))
const userData = ref(structuredClone(toRaw(props.userData)))
const referenceSiteData = JSON.parse(projectData.value.reference_sites_data)
const {url, params} = urlFormParse(referenceSiteData.url_form)
const projectName = encodeURIComponent(projectData.value.name)
const email = encodeURIComponent(userData.value.email)
const urlFormsApp = ref(`${url}#${params[0]}=${email}&${params[2]}=${projectName}`)
const formAvailable = ref(false)

if (!referenceSiteData.hasOwnProperty('answers') && referenceSiteData.hasOwnProperty('url_form') && projectData.value.activated) {
  formAvailable.value = true
}
</script>
<template>
  <VCard class="mb-6">
    <VCardText class="py-12 position-relative">
      <div
        class="d-flex flex-column gap-y-4 mx-auto"
        :class="$vuetify.display.mdAndUp ? 'w-50' : $vuetify.display.xs ? 'w-100' : 'w-75'"
      >
        <h5 class="text-h5 text-center text-wrap mx-auto">
          Formato de campo digital para un sitio de referencia
        </h5>
        <h4 class="text-h4 text-center text-wrap mx-auto text-primary"><small class="text-primary-darken-1">Nombre de la cuenca:</small><br>{{ projectData.name }}<br><small class="text-primary-darken-1">Temporada: </small><small>{{ projectData.season }}</small></h4>
        <p class="text-center text-wrap text-body-1 mx-auto mb-0">
          El formato de campo digital es un formulario con las preguntas necesarias para recolectar los datos del sitio de referencia
        </p>
        <div class="d-flex justify-center align-center gap-4 flex-wrap">
          <DialogFormsApp :url-forms-app="urlFormsApp" v-if="formAvailable" />
        </div>
        <template v-if="!formAvailable">
          <VAlert
            prominent
            type="info"
            variant="tonal"
            color="secondary"
          >
            <template #text>
              {{ `Al parecer el sitio de referencia aún no cuenta con la URL de forms.app, ya haya sido llenado o la cuenca: ${projectData.name} no se encuentra activa.` }} 
            </template>
          </VAlert>
        </template>
      </div>
      <img
        :src="academyCourseIllustration1"
        class="illustration1 d-none d-md-block"
        height="180"
      >
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.illustration1 {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.illustration2 {
  position: absolute;
  inset-block-start: 2rem;
  inset-inline-start: 2.5rem;
}
</style>
