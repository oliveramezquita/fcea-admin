<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  institutionData: {
    type: Object,
    required: false,
    default: () => ({
      name: '',
      logo: null,
    })
  },
  typeForm: {
    type: String,
    required: true,
  }
})
const emit = defineEmits([
  'update:isDrawerOpen',
  'update:institutionData',
  'update:typeForm',
  'addOrEditInstitution',
])
const institution = ref(structuredClone(toRaw(props.institutionData)))
const logo = ref()
const isFormValid = ref(false)
const refForm = ref()

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}
const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      const formData = new FormData()
      formData.set('name', institution.value.name)
      formData.set('url', institution.value.url)
      if (logo.value?.length > 0)
        formData.set('logo', logo.value[0])
      emit('addOrEditInstitution', {formData: formData, type: props.typeForm})
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })
}
const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
watch(props, () => {
  institution.value = structuredClone(toRaw(props.institutionData))
  if (institution.value.logo) {
    $api(institution.value.logo, {
      method: 'GET',
      onResponse({ response }) {
        const filename = institution.value.logo.replace(/^.*[\\/]/, '')
        logo.value = [new File([response._data], filename, {type: "text/json;charset=utf-8"})]
      }
    })
  } else {
    logo.value = null
  }
})
</script>
<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Agregar nueva institución"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="institution.name"
                  :rules="[requiredValidator]"
                  label="Nombre"
                  placeholder="Nombre de la institución"
                  prepend-icon="tabler-circle-plus"
                />
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="institution.url"
                  :rules="[requiredValidator]"
                  label="Sitio Web"
                  placeholder="URL de Sitio Web"
                  prepend-icon="tabler-world-www"
                />
              </VCol>
              <VCol cols="12">
                <VFileInput
                  accept="image/*"
                  v-model="logo"
                  label="Logotipo"
                  variant="outlined"
                />
              </VCol>
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  {{ props.typeForm === 'new' ? 'Agregar' : 'Actualizar' }}
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancelar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
