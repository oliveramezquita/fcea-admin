<script setup>
import { ref } from 'vue';

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})
const userData = ref(structuredClone(toRaw(props.userData)))
const isFormValid = ref(false)
const refAccountForm = ref()
const isAlertVisible = ref(false)
const alertType = ref() 
const alertMessage = ref() 
const onSubmit = () => {
  refAccountForm.value?.validate().then(({ valid }) => {
    if (valid) {
      $api(`api/user/${userData.value._id}`, {
        method: 'PATCH',
        body: userData.value,
        onResponse({ response }) {
          if (response.ok) {
            alertType.value = "success"
            alertMessage.value = "Los cambios han sido guardados exitosamente."
          } else {
            alertType.value = "error"
            alertMessage.value = `Ocurrió un error al momento de asignar la información: ${response?._data?.message}`
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
      <VCard>
        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm
            class="mt-3"
            ref="refAccountForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="userData.name"
                  placeholder="Nombre"
                  label="Nombre"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="userData.last_name"
                  placeholder="Apellidos"
                  label="Apellidos"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="userData.email"
                  label="Correo electrónico"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  :readonly="true"
                />
              </VCol>

              <!-- 👉 Organization -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="userData.institution"
                  label="Institución goburnamental o educativa"
                  placeholder="Institución goburnamental o educativa"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="userData.phone"
                  label="Teléfono"
                  placeholder="Teléfono"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 City -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="userData.city"
                  label="Ciudad"
                  placeholder="Ciudad"
                />
              </VCol>

              <!-- 👉 State -->
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="userData.state"
                  label="Estado"
                  placeholder="Estado"
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
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
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
