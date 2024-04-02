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
  isUserEditable: {
    type: Boolean,
    required: true,
  }
})

const user = ref()

const emit = defineEmits([
  'userData',
  'update:isDialogVisible',
  'update:isUserEditable',
  'update:userDetail',
])

const userData = ref(structuredClone(toRaw(props.userData)))

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
  user.value = props.userDetail
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('userData', user.value)
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
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-10 pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          {{ props.isUserEditable ? 'Editar información de usuario' : 'Información de usuario' }} 
        </h4>

        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 First Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="user.name"
                label="Nombre(s)"
                placeholder=""
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="user.last_name"
                label="Apellidos"
                placeholder=""
              />
            </VCol>

            <!-- Email -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="user.email"
                label="Email"
                placeholder=""
              />
            </VCol>

            <!-- Phone -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="user.phone"
                label="Teléfono"
                type="number"
                placeholder=""
              />
            </VCol>

            <!-- 👉 Institution -->
            <VCol 
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="user.institution"
                label="Institución"
                placeholder=""
              />
            </VCol>

            <!-- 👉 Status -->
            <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                v-model="user.activated"
                label="Estatus"
                placeholder="Active"
                :items="[{ title: 'Activo', value: true}, { title: 'Desactivo', value: false }]"
              />
            </VCol>

            <!-- 👉 City -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="user.city"
                label="Ciudad"
                placeholder=""
              />
            </VCol>

            <!-- 👉 Contact -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="user.state"
                label="Estado"
                placeholder=""
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn 
                v-if="props.isUserEditable"
                type="submit">
                Actualizar
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
