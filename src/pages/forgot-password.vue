<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import imageLogin2 from '@images/illustrations/login_water.png'
import imageLogin3 from '@images/illustrations/water_intro.png'
import imageLogin1 from '@images/illustrations/water_login_2.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const email = ref('')

const authThemeImg = useGenerateImageVariant(imageLogin1, imageLogin2, imageLogin3)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})
const isFormValid = ref(false)
const refForgotPasswordForm = ref()
const isAlertVisible = ref(false)
const alertType = ref() 
const alertMessage = ref() 
const onSubmit = () => {
  refForgotPasswordForm.value?.validate().then(({ valid }) => {
    if (valid) {
      $api('api/forgot-password', {
        method: 'POST',
        body: {email: email.value},
        onResponse({ response }) {
          if (response.ok) {
            alertType.value = "success"
            alertMessage.value = "Se ha mandado un mensaje con el enlace al correo electrónico para restablecer la contraseña."
          } else {
            alertType.value = response.status === 404 ? "warning" : "error"
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
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow
    class="auth-wrapper bg-surface"
    no-gutters
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
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
            max-width="740"
          />
        </div>

        <img
          class="auth-footer-mask"
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
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <h4 class="text-h5 mb-1">
            ¿Has olvidado tu contraseña? 🔒
          </h4>
          <p class="mb-0">
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refForgotPasswordForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  autofocus
                  label="Correo electrónico"
                  type="email"
                  placeholder="correo@email.com"
                />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block v-if="!isAlertVisible" type="submit">
                  Enviar enlace
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
