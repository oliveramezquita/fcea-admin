<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { default as registerMultiStepIllustrationDark, default as registerMultiStepIllustrationLight } from '@images/pages/laptop-girl.png'
import registerMultiStepBgDark from '@images/pages/register-multi-step-bg-dark.png'
import registerMultiStepBgLight from '@images/pages/register-multi-step-bg-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import CryptoJS from 'crypto-js'

const router = useRouter()
const registerMultiStepBg = useGenerateImageVariant(registerMultiStepBgLight, registerMultiStepBgDark)

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const isCurrentStepValid = ref(true)
const isBeenRegister = ref(false)
const registerMultiStepIllustration = useGenerateImageVariant(registerMultiStepIllustrationLight, registerMultiStepIllustrationDark)

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

const { data: userData } = await useApi(`api/register/${ user_id }`)

if (!userData.value || userData.value.activated)
  await router.push('*') 

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

const refAccountForm = ref()
const refPersonalForm = ref()

const accountForm = ref({
  email: userData.value.email,
  password: '',
  confirm_password: '',
})

const personalForm = ref({
  name: '',
  last_name: '',
  phone: '',
  institution: '',
  city: '',
  state: '',
})

const validateAccountForm = () => {
  refAccountForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validatePersonalForm = () => {
  refPersonalForm.value?.validate().then(valid => {
    if (valid.valid) {
      isCurrentStepValid.value = true
      const data = {
        ...accountForm.value,
        ...personalForm.value,
      }
      $api(`api/register/${ user_id }`, {
        method: 'PUT',
        body: data,
      })
      nextTick(() => {
        isBeenRegister.value = true
      })
    } else {
      isCurrentStepValid.value = false
    }
  })
}
</script>

<template>
  
  <div class="auth-logo d-flex align-center gap-x-3">
    <VNodeRenderer :nodes="themeConfig.app.logo" />
    <h1 class="auth-title">
      {{ themeConfig.app.title }}
    </h1>
  </div>

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
        v-show="!isBeenRegister"
      >
        <AppStepper
          v-model:current-step="currentStep"
          :items="items"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
          :is-active-step-valid="isCurrentStepValid"
          icon-size="22"
          class="stepper-icon-step-bg mb-12"
        />

        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
          style="min-inline-size: 681px;"
        >
          <VWindowItem>
            <VForm
              ref="refAccountForm"
              @submit.prevent="validateAccountForm"
            >
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
                    v-model="accountForm.email"
                    label="Correo electrónico"
                    :readonly="true"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="accountForm.password"
                    label="Contraseña"
                    placeholder="············"
                    :rules="[requiredValidator, passwordValidator]"
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
                    v-model="accountForm.confirm_password"
                    label="Confirmar contraseña"
                    placeholder="············"
                    :rules="[requiredValidator, confirmedValidator(accountForm.confirm_password, accountForm.password)]"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  />
                </VCol>
                <VCol cols="12">
                  <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                    <VBtn
                      color="secondary"
                      variant="tonal"
                      disabled
                    >
                      <VIcon
                        icon="tabler-arrow-left"
                        start
                        class="flip-in-rtl"
                      />
                      Anterior
                    </VBtn>

                    <VBtn type="submit">
                      Siguiente
                      <VIcon
                        icon="tabler-arrow-right"
                        end
                        class="flip-in-rtl"
                      />
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VForm>
          </VWindowItem>

          <VWindowItem>
            <VForm
              ref="refPersonalForm"
              @submit.prevent="validatePersonalForm"
            >
              <h4 class="text-h4">
                Información personal
              </h4>
              <p>
                * Campos obligatorios
              </p>

              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="personalForm.name"
                    label="Nombre(s) *"
                    placeholder=""
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="personalForm.last_name"
                    label="Apellidos *"
                    placeholder=""
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="personalForm.phone"
                    type="number"
                    label="Teléfono *"
                    placeholder=""
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <VCol cols="12">
                  <AppTextField
                    v-model="personalForm.institution"
                    label="Escuela u Organización *"
                    placeholder=""
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="personalForm.city"
                    label="Ciudad"
                    placeholder=""
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                <AppTextField
                    v-model="personalForm.state"
                    label="Estado"
                    placeholder=""
                  />
                </VCol>
                <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="tabler-arrow-left"
                      start
                      class="flip-in-rtl"
                    />
                    Anterior
                  </VBtn>

                  <VBtn
                    color="success"
                    type="submit"
                  >
                    Registrar
                  </VBtn>
                </div>
              </VCol>
              </VRow>
            </VForm>
          </VWindowItem>
        </VWindow>
      </VCard>
      <VCardText 
        v-show="isBeenRegister"
        class="text-center py-4">
        <h4 class="text-h4 text-center">
          Tu registrado se ha realizado exitosamente 
        </h4>
        <p class="my-4 text-body-1">
          Ahora ya eres parte del administrador del Monitoreo de Ecosistemas Acuáticos
        </p>
        <div class="d-flex justify-center gap-4 flex-wrap mt-7">
          <VBtn to="/">Iniciar sesión</VBtn>
        </div>
      </VCardText>
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
