<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  project: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      season: '',
      month: '',
      year: '',
    }),
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'update:project',
  'deleteProject'
])

const project = ref(structuredClone(toRaw(props.project)))

watch(props, () => {
  project.value = structuredClone(toRaw(props.project))
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('deleteProject', project.value._id)
}

const onFormReset = () => {
  project.value = structuredClone(toRaw(props.project))
  emit('update:isDialogVisible', false)
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
          Eliminar monitoreo 
        </h4>
        <div class="text-center">{{ project.name }} - {{ project.season }} {{ project.month }} {{ project.year }}</div>

        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <VCol cols="12" class="text-center">
              Al eliminar el monitoreo no se podrán visualizar en el mapa colaborativo el sitio de referencia y los sitios de interés que se hayan capturado, ¿Estás seguro de eliminar el monitoreo?
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
                Cerrar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
