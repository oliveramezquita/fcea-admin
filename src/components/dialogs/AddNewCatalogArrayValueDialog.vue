<script setup>
const props = defineProps({
  valueData: {
    type: Object,
    required: false,
  },
  valueDetail: {
    type: Object,
    required: true,
    default: () => ({
      value: '',
    }),
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  isNewValue: {
    type: Boolean,
    required: true,
  }
})

const value = ref()
const emit = defineEmits([
  'valueData',
  'update:isDialogVisible',
  'update:isNewValue',
  'update:valueDetail',
])

const valueData = ref(structuredClone(toRaw(props.valueData)))

watch(props, () => {
  valueData.value = structuredClone(toRaw(props.valueData))
  value.value = props.valueDetail
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('valueData', value.value)
}

const onFormReset = () => {
  valueData.value = structuredClone(toRaw(props.valueData))
  emit('update:isDialogVisible', false)
}

const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <h4 class="text-h4 text-center mb-2">
          {{ props.isNewValue ? 'Agregar valores al catálogo' : 'Editar valores del catálogo' }} 
        </h4>

        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <VCol cols="12" md="3"></VCol>
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="value.value"
                label="Valor"
                placeholder=""
              />
            </VCol>
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn 
                type="submit">
                {{ props.isNewValue ? 'Guardar' : 'Actualizar' }}
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
