<script setup>
import DialogReferenceSiteForm from '@/views/forms/dialog/DialogReferenceSiteForm.vue';
import academyCourseIllustration1 from '@images/pages/academy-course-illustration1.png';
definePage({
  meta: {
    action: 'read',
    subject: 'brigadier',
  },
})
</script>
<template>
  <div>
    <VCard class="mb-6">
      <VCardText class="py-12 position-relative">
        <div
          class="d-flex flex-column gap-y-4 mx-auto"
          :class="$vuetify.display.mdAndUp ? 'w-50' : $vuetify.display.xs ? 'w-100' : 'w-75'"
        >
          <h4
            class="text-h4 text-center text-wrap mx-auto"
            :class="$vuetify.display.mdAndUp ? 'w-75' : 'w-100'"
          >
            Formarto de campo digital para los <span class="text-primary text-no-wrap"> Sitios de referencia</span>
          </h4>
          <p class="text-center text-wrap text-body-1 mx-auto mb-0">
            El formato de campo digital es un formulario con las preguntas necesarias para recolectar los datos del sitio de referencia
          </p>
          <div class="d-flex justify-center align-center gap-4 flex-wrap">
            <DialogReferenceSiteForm />
          </div>
        </div>
        <img
          :src="academyCourseIllustration1"
          class="illustration1 d-none d-md-block"
          height="180"
        >
      </VCardText>
    </VCard>
  </div>
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
