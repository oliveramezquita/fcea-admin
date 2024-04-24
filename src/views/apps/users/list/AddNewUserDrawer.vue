<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  isSuperAdminRule: {
    type: Boolean,
    required: true
  },
})
const emit = defineEmits([
  'update:isDrawerOpen',
  'isSuperAdminRule',
  'userData',
])
const isFormValid = ref(false)
const refForm = ref()
const email = ref('')
const roles = ref([
  { title: 'Super Administrador', value: 'SUPER_ADMIN'},
  { title: 'Administrador', value: 'ADMIN' }, 
  { title: 'Brigadista', value: 'BRIGADIER' },
])
const role = ref()

watch(props, () => {
  role.value = !props.isSuperAdminRule ? 'BRIGADIER' : null
})

// 👉 drawer close
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
      emit('userData', {
        role: role.value,
        email: email.value,
      })
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
      title="Agregar nuevo usuario"
      @cancel="closeNavigationDrawer"
    />

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect
                  v-model="role"
                  label="Seleccionar cargo"
                  placeholder="Seleccionar cargo"
                  :rules="[requiredValidator]"
                  :items="roles"
                  :readonly="!props.isSuperAdminRule"
                />
              </VCol>
              <!-- 👉 Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Correo electrónico"
                  placeholder="johndoe@email.com"
                />
              </VCol>
              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Agregar
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
