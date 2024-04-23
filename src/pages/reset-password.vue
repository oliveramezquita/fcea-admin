<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import waterIntro from '@images/illustrations/water_intro.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import CryptoJS from 'crypto-js'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const formResetPassword = ref({
  newPassword: '',
  confirmPassword: '',
})

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const router = useRouter()
const route = useRoute()
const registerToken = route.query.rt

if (!registerToken)
  await router.push('*')

let key = import.meta.env.VITE_ENCRYPT_KEY
key = CryptoJS.enc.Utf8.parse(key)
const decrypted =  CryptoJS.AES.decrypt(registerToken, key, {mode:CryptoJS.mode.ECB})
const user_id = decrypted.toString(CryptoJS.enc.Utf8)

if (!user_id)
  await router.push('*')

const { data: userData } = await useApi(`api/public-user/${ user_id }`)
if (!userData.value || !userData.value.activated)
  await router.push('*')

const isFormValid = ref(false)
const refFormResetPassword = ref()
const isAlertVisible = ref(false)
const alertType = ref() 
const alertMessage = ref() 
const onSubmit = () => {
  refFormResetPassword.value?.validate().then(({ valid }) => {
    if (valid) {
      $api('api/reset-password', {
        method: 'POST',
        body: {
          '_id': userData.value._id,
          ...formResetPassword.value
        },
        onResponse({ response }) {
          if (response.ok) {
            alertType.value = "success"
            alertMessage.value = "La contraseña ha sida restablecida con éxito."
          } else {
            console.log(response)
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
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 150px;"
        >
          <VImg
            :src="waterIntro"
            class="auth-illustration mt-16 mb-2"
            max-height="680"
          />
        </div>

        <img
          class="auth-footer-mask flip-in-rtl"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        >
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-6"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Restablecer la contraseña 🔒
          </h4>
          <p class="mb-0">
            Su nueva contraseña debe ser diferente de las contraseñas utilizadas anteriormente
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refFormResetPassword"
          v-model="isFormValid"
          @submit.prevent="onSubmit">
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="formResetPassword.newPassword"
                  autofocus
                  label="Nueva contraseña"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[requiredValidator, passwordValidator]"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <AppTextField
                  v-model="formResetPassword.confirmPassword"
                  label="Confirmar contraseña"
                  placeholder="············"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[requiredValidator, confirmedValidator(formResetPassword.confirmPassword, formResetPassword.newPassword)]"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <!-- Set password -->
              <VCol cols="12">
                <VBtn block v-if="!isAlertVisible" type="submit">
                  Establecer nueva contraseña
                </VBtn>
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

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    size="20"
                    class="me-1 flip-in-rtl"
                  />
                  <span>Regresar al inicio de sesión</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
