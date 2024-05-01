<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  deleteGeoJsonFile: {
    type: Object,
    required: true
  },
  cancelDeleteFile: {
    type: Object,
    required: true
  },
  projectData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'deleteGeoJsonFile',
  'cancelDeleteFile',
  'update:isDialogVisible',
])

const projectData = ref(structuredClone(toRaw(props.projectData)))
watch(props, () => {
  projectData.value = structuredClone(toRaw(props.projectData))
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('deleteGeoJsonFile', projectData.value)
}

const onFormReset = () => {
  emit('update:isDialogVisible', false)
  emit('cancelDeleteFile')
}

const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-1">
          Eliminar archivo GeoJSON 
        </h4>
      
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <VCol cols="12" class="text-center">
              Al eliminar el archivo GeoJSON el polígono en el mapa dejará de verse
            </VCol>

            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn 
                color="error"
                type="submit">
                Eliminar
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                @click="onFormReset"
              >
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
