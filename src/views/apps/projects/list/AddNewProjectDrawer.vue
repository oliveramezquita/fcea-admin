<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'projectData',
])

const isFormValid = ref(false)
const refForm = ref()
const name = ref('')
const season = ref()
const year = ref()
const month = ref()
const admins = ref()
const yearList = ref(generateArrayOfYears())
const monthList = ref(['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'])

const {
  data: usersData
} = await useApi(createUrl('api/users', {
  query: {
    status: true,
    role: 'ADMIN',
  }
}))

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
      emit('projectData', {
        name: name.value,
        season: season.value,
        year: year.value,
        month: month.value,
        admin_users: admins.value,
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
      title="Agregar nueva cuenca"
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
              <!-- 👉 Proyect -->
              <VCol cols="12">
                <AppTextField
                  v-model="name"
                  :rules="[requiredValidator]"
                  label="Nombre"
                  placeholder="Nombre de la cuenca"
                />
              </VCol>
              <!-- 👉 Season -->
              <VCol cols="12">
                <AppSelect
                  v-model="season"
                  label="Temporada"
                  placeholder="Selecciona una temporada"
                  :rules="[requiredValidator]"
                  :items="['Secas', 'Lluvias']"
                />
              </VCol>
              <!-- 👉 Year -->
              <VCol cols="12">
                <AppSelect
                  v-model="year"
                  label="Año"
                  placeholder="Selecciona un año"
                  :rules="[requiredValidator]"
                  :items="yearList"
                />
              </VCol>
               <!-- 👉 Month -->
               <VCol cols="12">
                <AppSelect
                  v-model="month"
                  label="Mes"
                  placeholder="Selecciona un mes"
                  :rules="[requiredValidator]"
                  :items="monthList"
                />
              </VCol>
              <VCol cols="12">
                <AppAutocomplete
                  v-model="admins"
                  multiple
                  chips
                  closable-chips
                  :items="usersData.data"
                  item-title="full_name"
                  item-value="_id"
                  placeholder="Selecciona un administrador"
                  label="Administrador"
                >
                  <template #chip="{ props, item }">
                    <VChip
                      v-bind="props"
                      :text="item.raw.full_name"
                    />
                  </template>

                  <template #item="{ props, item }">
                    <VListItem
                      v-bind="props"
                      :title="item?.raw?.full_name"
                      :subtitle="item?.raw?.institution"
                    />
                  </template>
                </AppAutocomplete>
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
