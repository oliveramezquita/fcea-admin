<script setup>
import { VForm } from 'vuetify/components/VForm';
// import ProjectImagesSwiper from '@/views/apps/projects/view/ProjectImagesSwiper.vue'
import ProjectListResults from '@/views/apps/projects/view/ProjectListResults.vue';

const props = defineProps({
  projectData: {
    type: Object,
    required: true,
  },
  usersData: {
    type: Array,
    required: true,
  }
})

const projectData = ref(structuredClone(toRaw(props.projectData)))
const usersData = ref(structuredClone(toRaw(props.usersData)))
const brigadeUsers = ref(usersData.value.filter(user => user.role === 'BRIGADIER' && user.activated))
const brigadiers = ref()
const isFormValid = ref(false)
const interest_sites_url = ref()
const interest_sites = ref()
const istForm = ref()

watch(props, () => {
  projectData.value = structuredClone(toRaw(props.projectData))
})

const objReferenceSite = ref(JSON.parse(projectData.value.reference_sites_data))
const objInterestSite = ref(JSON.parse(projectData.value.interest_sites_data))
interest_sites.value = objInterestSite.value.answers ? objInterestSite.value.answers : []
brigadiers.value = objInterestSite.value.users ? objInterestSite.value.users : null
interest_sites_url.value = objInterestSite.value.url_form ? objInterestSite.value.url_form : null

const isAlertVisible = ref(false)
const alertType = ref() 
const alertMessage = ref()
const onSubmit = () => {
  istForm.value?.validate().then(({ valid }) => {
    if (valid) {
      $api(`api/project/${projectData.value._id}`, {
        method: 'PUT',
        body: {
          'site_type': 'its_data',
          'its_data': {
            'url_form': interest_sites_url.value,
            'users': brigadiers.value,
          }
        },
        onResponse({ response }) {
          if (response.ok) {
            alertType.value = "success"
            alertMessage.value = "El formato de campo digital para el sitio de interés ha sido asignado exitosamente."
            
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
  <VForm
    ref="istForm"
    v-model="isFormValid"
    @submit.prevent="onSubmit"
    class="istForm"
  >
    <div>
      <VRow>
        <VCol cols="12">
          <label class="v-card-title mb-2">Asignar formato de campo digital para los sitios de interés</label>
          <AppTextField
            v-model="interest_sites_url"
            prepend-inner-icon="tabler-world-www"
            label="Forms.app URL"
            persistent-placeholder
            placeholder="Debe ser una URL de forms.app"
            :rules="[requiredValidator, urlValidator]"
          />
        </VCol>
        <VCol cols="12">
          <AppAutocomplete
            v-model="brigadiers"
            chips
            closable-chips
            multiple
            :items="brigadeUsers"
            :rules="[requiredValidator]"
            item-title="full_name"
            item-value="_id"
            placeholder="Selecciona un brigadista"
            label="Brigadistas"
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
      </VRow>
    </div>
    <div class="mt-5">
      <VBtn v-if="!isAlertVisible" type="submit">
        Guardar
      </VBtn>
    </div>
    <VAlert
      v-model="isAlertVisible"
      closable
      close-label="Close Alert"
      class="mt-5"
      :type="alertType"
      variant="tonal">
      {{ alertMessage }}
    </VAlert>
  </VForm>
  <VDivider class="mb-5 mt-5" />
  <div v-if="objInterestSite.hasOwnProperty('answers')">
    <VExpansionPanels
      variant="accordion"
      class="expansion-panels-width-border"
    >
      <VExpansionPanel
        v-for="item in interest_sites"
        :key="item._id"
        elevation="0"
      >
        <VExpansionPanelTitle
          collapse-icon="tabler-minus"
          expand-icon="tabler-plus"
        >
          Sitio: {{ item.nombre_sitio }}
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <ProjectListResults :project-data="item" :users-data="usersData" :reference-site-data="objReferenceSite" />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss" scoped>
.istForm {
  .v-card-title {
    padding-inline-start: 0 !important;
  }
}
</style>
