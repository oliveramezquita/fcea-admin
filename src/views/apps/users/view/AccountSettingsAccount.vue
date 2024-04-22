<script setup>
const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})
const userData = ref(structuredClone(toRaw(props.userData)))
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-3">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="userData.name"
                  placeholder="John"
                  label="Nombre"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="userData.last_name"
                  placeholder="Doe"
                  label="Apellidos"
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
                  placeholder="ThemeSelection"
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
                  placeholder="+1 (917) 543-9876"
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
                <VBtn>Guardar cambios</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
