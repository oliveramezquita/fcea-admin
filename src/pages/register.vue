<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { default as registerMultiStepIllustrationDark, default as registerMultiStepIllustrationLight } from '@images/pages/laptop-girl.png'
import registerMultiStepBgDark from '@images/pages/register-multi-step-bg-dark.png'
import registerMultiStepBgLight from '@images/pages/register-multi-step-bg-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const registerMultiStepBg = useGenerateImageVariant(registerMultiStepBgLight, registerMultiStepBgDark)

definePage({ meta: { layout: 'blank' } })

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const registerMultiStepIllustration = useGenerateImageVariant(registerMultiStepIllustrationLight, registerMultiStepIllustrationDark)

const radioContent = [
  {
    title: 'Starter',
    desc: 'A simple start for everyone.',
    value: '0',
  },
  {
    title: 'Standard',
    desc: 'For small to medium businesses.',
    value: '99',
  },
  {
    title: 'Enterprise',
    desc: 'Solution for big organizations.',
    value: '499',
  },
]

const items = [
  {
    title: 'Cuenta',
    subtitle: 'Detalles de la cuenta',
    icon: 'tabler-file-analytics',
  },
  {
    title: 'Personal',
    subtitle: 'Ingrese información',
    icon: 'tabler-user',
  },
]

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  link: '',
  firstName: '',
  lastName: '',
  mobile: '',
  pincode: '',
  address: '',
  landmark: '',
  city: '',
  state: null,
  selectedPlan: '0',
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
})

const onSubmit = () => {

  // eslint-disable-next-line no-alert
  alert('Submitted..!!')
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
    class="auth-wrapper"
  >
    <VCol
      md="4"
      class="d-none d-md-flex"
    >
      <!-- here your illustration -->
      <div class="d-flex justify-center align-center w-100 position-relative">
        <VImg
          :src="registerMultiStepIllustration"
          class="illustration-image flip-in-rtl"
        />

        <img
          class="bg-image position-absolute w-100 flip-in-rtl"
          :src="registerMultiStepBg"
          alt="register-multi-step-bg"
          height="340"
        >
      </div>
    </VCol>

    <VCol
      cols="12"
      md="8"
      class="auth-card-v2 d-flex align-center justify-center pa-10"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        class="mt-12 mt-sm-10"
      >
        <AppStepper
          v-model:current-step="currentStep"
          :items="items"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
          icon-size="22"
          class="stepper-icon-step-bg mb-12"
        />

        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
          style="min-inline-size: 681px;"
        >
          <VForm>
            <VWindowItem>
              <h4 class="text-h4">
                Información de la cuenta
              </h4>
              <p class="text-body-1 mb-6">
                Ingrese los detalles de su cuenta
              </p>

              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.email"
                    label="Correo electrónico"
                    placeholder="johndoe@email.com"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.password"
                    label="Contraseña"
                    placeholder="············"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.confirmPassword"
                    label="Confirmar contraseña"
                    placeholder="············"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            <VWindowItem>
              <h4 class="text-h4">
                Información personal
              </h4>
              <p>
                Ingrese su información personal
              </p>

              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.name"
                    label="Nombre(s)"
                    placeholder="John"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.lastName"
                    label="Apellidos"
                    placeholder="Doe"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.phone"
                    type="number"
                    label="Teléfono"
                    placeholder="+1 123 456 7890"
                  />
                </VCol>

                <VCol cols="12">
                  <AppTextField
                    v-model="form.institution"
                    label="Institución Goburnamental o Educativa"
                    placeholder="Near Central Park"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.city"
                    label="Ciudad"
                    placeholder="New York"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="form.state"
                    label="Estado"
                    placeholder="Seleccionar estado"
                    :items="['New York', 'California', 'Florida', 'Washington', 'Texas']"
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            
          </VForm>
        </VWindow>

        <div class="d-flex flex-wrap justify-space-between gap-x-4 mt-6">
          <VBtn
            color="secondary"
            :disabled="currentStep === 0"
            variant="tonal"
            @click="currentStep--"
          >
            <VIcon
              icon="tabler-arrow-left"
              start
              class="flip-in-rtl"
            />
            Atrás
          </VBtn>

          <VBtn
            v-if="items.length - 1 === currentStep"
            color="success"
            @click="onSubmit"
          >
            Enviar
          </VBtn>

          <VBtn
            v-else
            @click="currentStep++"
          >
            Siguiente

            <VIcon
              icon="tabler-arrow-right"
              end
              class="flip-in-rtl"
            />
          </VBtn>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.illustration-image {
  block-size: 250px;
  inline-size: 248px;
}

.bg-image {
  inset-block-end: 0;
}
</style>
