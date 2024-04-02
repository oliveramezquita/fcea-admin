<script setup>
const props = defineProps({
  userData: {
    type: Object,
    required: false,
  },
  userDetail: {
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

const user = ref()

const emit = defineEmits([
  'userData',
  'update:isDialogVisible',
  'update:userDetail',
])

const userData = ref(structuredClone(toRaw(props.userData)))

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
  user.value = props.userDetail
})

const onFormSubmit = () => {
  console.log(user)
  emit('update:isDialogVisible', false)
  emit('userData', user.value._id)
}

const onFormReset = () => {
  userData.value = structuredClone(toRaw(props.userData))
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
          Eliminar usuario 
        </h4>
        <div class="text-center">{{ user.email }}</div>

        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <VCol cols="12" class="text-center">
              Al eliminar el usuario se designará de las cuencas a las que haya sido asignado y no se tomarán en cuenta los formularios llenados por el usuario.
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
