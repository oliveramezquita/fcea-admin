<script setup>
const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})
const userData = ref(structuredClone(toRaw(props.userData)))
const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const passwordRequirements = [
  'Mínimo 8 caracteres: cuantos más, mejor',
  'Al menos un carácter en mayúscula y minúscula',
]
const settingsSecurityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const isFormValid = ref(false)
const refSettingsSecurityForm = ref()
const isAlertVisible = ref(false)
const alertType = ref() 
const alertMessage = ref() 
const onSubmit = () => {
  refSettingsSecurityForm.value?.validate().then(({ valid }) => {
    if (valid) {
      $api('api/reset-password-inside', {
        method: 'POST',
        body: {
          '_id': userData.value._id,
          ...settingsSecurityForm.value
        },
        onResponse({ response }) {
          if (response.ok) {
            alertType.value = "success"
            alertMessage.value = "El cambio de la contraseña ha sido guardada con éxito."
          } else if (response.status === 403) {
            alertType.value = "warning"
            alertMessage.value = "La contraseña actual es incorrecta"
          } else {
            alertType.value = "error"
            alertMessage.value = `Ocurrió un error al momento de asignar la información: ${response?._data[0]}`
          }
          isAlertVisible.value = true
        },
      })
    }
  })
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Cambiar la contraseña">
        <VForm
          ref="refSettingsSecurityForm"
          v-model="isFormValid"
          @submit.prevent="onSubmit">
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 current password -->
                <AppTextField
                  v-model="settingsSecurityForm.currentPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[requiredValidator, passwordValidator]"
                  label="Contraseña actual"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 new password -->
                <AppTextField
                  v-model="settingsSecurityForm.newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[requiredValidator, passwordValidator]"
                  label="Nueva contraseña"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 confirm password -->
                <AppTextField
                  v-model="settingsSecurityForm.confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[requiredValidator, confirmedValidator(settingsSecurityForm.confirmPassword, settingsSecurityForm.newPassword)]"
                  label="Confirmar nueva contraseña"
                  autocomplete="on"
                  placeholder="············"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <h6 class="text-h6 text-medium-emphasis mb-4">
              Requisitos de contraseña:
            </h6>

            <VList class="card-list">
              <VListItem
                v-for="item in passwordRequirements"
                :key="item"
                :title="item"
                class="text-medium-emphasis"
              >
                <template #prepend>
                  <VIcon
                    size="10"
                    icon="tabler-circle-filled"
                  />
                </template>
              </VListItem>
            </VList>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn v-if="!isAlertVisible" type="submit">Guardar cambios</VBtn>
            <VAlert
              v-model="isAlertVisible"
              closable
              close-label="Close Alert"
              class="mt-5"
              :type="alertType"
              variant="tonal">
              {{ alertMessage }}
            </VAlert>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}

.server-close-btn {
  inset-inline-end: 0.5rem;
}
</style>
