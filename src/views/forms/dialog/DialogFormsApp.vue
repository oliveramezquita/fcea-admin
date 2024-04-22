<script setup>
definePage({
  meta: {
    layoutWrapperClasses: 'layout-content-height-fixed'
  },
})
const props = defineProps({
  urlFormsApp: {
    type: String,
    required: true,
  },
})
const isDialogVisible = ref(false)
const formUrl = ref(structuredClone(toRaw(props.urlFormsApp)))
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

          <VToolbarTitle>Formato de campo digital</VToolbarTitle>
        </VToolbar>
      </div>
      <iframe
        v-if="formUrl"
        :src="formUrl"
        :scrolling="iframeScrollable"
        class="h-100"
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
