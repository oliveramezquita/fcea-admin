<script setup>
const props = defineProps({
  catalogData: {
    type: Object,
    required: false,
  },
  catalogDetail: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
    }),
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const catalog = ref()

const emit = defineEmits([
  'catalogData',
  'update:isDialogVisible',
  'update:catalogDetail',
])

const catalogData = ref(structuredClone(toRaw(props.catalogData)))

watch(props, () => {
  catalogData.value = structuredClone(toRaw(props.catalogData))
  catalog.value = props.catalogDetail
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('catalogData', catalog.value._id)
}

const onFormReset = () => {
  catalogData.value = structuredClone(toRaw(props.catalogData))
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
          Eliminar catálogo 
        </h4>
        <div class="text-center">{{ catalog.name }}</div>

        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <VCol cols="12" class="text-center">
              Algunos valores de los proyectos o sitios dependen de los catálogos, ¿Estás seguro de eliminar el catálogo?
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
