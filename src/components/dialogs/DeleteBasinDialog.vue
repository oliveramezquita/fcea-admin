<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  basin: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
    }),
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'update:basin',
  'deleteBasin'
])

const basin = ref(structuredClone(toRaw(props.basin)))

watch(props, () => {
  basin.value = structuredClone(toRaw(props.basin))
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('deleteBasin', basin.value._id)
}

const onFormReset = () => {
  basin.value = structuredClone(toRaw(props.basin))
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
          Eliminar cuenca 
        </h4>
        <div class="text-center">{{ basin.name }}</div>

        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <VCol cols="12" class="text-center">
              Al eliminar la cuenta los proyectos y sitios que dependen de ella serán desactivados, ¿Estás seguro de eliminar la cuenca?
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
