<script setup>
const isDialogVisible = ref(false)
const formUrl = ref('https://my.forms.app/fceamonitoreo/sitio-de-interes#660de40912e6a30b0371acb6=fcea.monitoreo%40gmail.com&65fb1147f6611a08cebe037c=Cuenca%20Prueba&65fb12f9f6611a08cebe03e0=La%20Granada')
</script>
<template>
  <VDialog
    v-model="isDialogVisible"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props">
        Abrir formato
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard>
      <!-- Toolbar -->
      <div>
        <VToolbar color="primary">
          <VBtn
            icon
            variant="plain"
            @click="isDialogVisible = false"
          >
            <VIcon
              color="white"
              icon="tabler-x"
            />
          </VBtn>

          <VToolbarTitle>Formato de campo digital: Sitio de interés</VToolbarTitle>
        </VToolbar>
      </div>
      <iframe
        v-if="formUrl"
        :src="formUrl"
        :scrolling="iframeScrollable"
        :height="735"
        allowtransparency="true"
        style="inline-size: 0; min-inline-size: 100% !important;"
        frameborder="0"
      />
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
