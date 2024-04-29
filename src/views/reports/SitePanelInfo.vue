<script setup>
const props = defineProps({
  siteInfo: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits([
  'update:siteInfo',
])
const siteInfo = ref(structuredClone(toRaw(props.siteInfo)))
const siteReference = ref(siteInfo.value.siteReferenceScore)
const panel = ref()
const score = ref(totalScore([
  calculatePhGrade(siteInfo.value.ph, siteReference.value?.ph),
  calculateTemperatureGrade(siteInfo.value.water_temperature, siteReference.value?.temperatura_agua),
  calculateTemperatureGrade(siteInfo.value.environmental_temperature, siteReference.value?.temperatura_ambiental),
  calculateSaturationGrade(siteInfo.value.dissolved_oxygen, siteReference.value?.oxigeno_disuelto),
  calculateTurbidityGrade(siteInfo.value.turbidity, siteReference.value?.turbidez),
  calculateNitratesGrade(siteInfo.value.nitrates, siteReference.value?.nitratos),
  calculateAmmoniumGrade(siteInfo.value.ammonium, siteReference.value?.amonio),
  calculateOrthophosphatesGrade(siteInfo.value.orthophosphates, siteReference.value?.ortofosfatos),
  calculateBioticGrade(siteInfo.value.macroinvertebrates_rating),
  calculateColiformsGrade(siteInfo.value.fecal_coliforms),
  calculateChGrade(siteInfo.value.hydromorphological_quality),
  calculateCbrGrade(siteInfo.value.riparian_forest_quality),
]))
const full = ref(100)
watch(props, () => {
  siteInfo.value = structuredClone(toRaw(props.siteInfo))
  siteReference.value = siteInfo.value.siteReferenceScore
  score.value = totalScore([
    calculatePhGrade(siteInfo.value.ph, siteReference.value?.ph),
    calculateTemperatureGrade(siteInfo.value.water_temperature, siteReference.value?.temperatura_agua),
    calculateTemperatureGrade(siteInfo.value.environmental_temperature, siteReference.value?.temperatura_ambiental),
    calculateSaturationGrade(siteInfo.value.dissolved_oxygen, siteReference.value?.oxigeno_disuelto),
    calculateTurbidityGrade(siteInfo.value.turbidity, siteReference.value?.turbidez),
    calculateNitratesGrade(siteInfo.value.nitrates, siteReference.value?.nitratos),
    calculateAmmoniumGrade(siteInfo.value.ammonium, siteReference.value?.amonio),
    calculateOrthophosphatesGrade(siteInfo.value.orthophosphates, siteReference.value?.ortofosfatos),
    calculateBioticGrade(siteInfo.value.macroinvertebrates_rating),
    calculateColiformsGrade(siteInfo.value.fecal_coliforms),
    calculateChGrade(siteInfo.value.hydromorphological_quality),
    calculateCbrGrade(siteInfo.value.riparian_forest_quality),
  ])
})
</script>
<template>
  <VExpansionPanels
    variant="accordion"
    class="expansion-panels-width-border"
    v-model="panel"
  >
    <VExpansionPanel>
      <VExpansionPanelTitle
        collapse-icon="tabler-minus"
        expand-icon="tabler-plus"
      >
      Información del sitio de monitoreo
      </VExpansionPanelTitle>

      <VExpansionPanelText>
        <VList class="card-list mb-5">
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Tipo de sitio
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                  {{ siteInfo.type_site }}
              </div>
            </template>
          </VListItem>
          <VListItem v-if="siteInfo.siteReferenceScore">
            <VListItemTitle class="font-weight-medium me-4">
              Sitio de referencia
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                {{ siteInfo.siteReferenceScore?.nombre_sitio }}
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Municipio
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                  {{ siteInfo.city }}
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Estado
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                {{ siteInfo.state }}
              </div>
            </template>
          </VListItem>
        </VList>
        <VDivider />
        <VList class="card-list mb-5 mt-5">
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Latitud
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                  {{ siteInfo.latitude }}
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Longitud
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                  {{ siteInfo.longitude }}
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Altitud
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                {{ siteInfo.altitude }}
              </div>
            </template>
          </VListItem>
        </VList>
        <VDivider />
        <VList class="card-list mb-5 mt-5">
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              <a :href="siteInfo.photo1" target="_blank">Fotografía 1</a>
            </VListItemTitle>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              <a :href="siteInfo.photo2" target="_blank">Fotografía 2</a>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VExpansionPanelText>
    </VExpansionPanel>
    <VExpansionPanel>
      <VExpansionPanelTitle
        collapse-icon="tabler-minus"
        expand-icon="tabler-plus"
      >
      Evaluación de la calidad ecológica
      </VExpansionPanelTitle>

      <VExpansionPanelText>
        <VList class="card-list">
          <VListItem>
            <template #prepend>
              <VProgressCircular
                v-model="full"
                :size="54"
                class="me-4"
                :color="score.color"
              >
                <span class="text-body-1 text-high-emphasis font-weight-medium">
                  {{ score.total }}
                </span>
              </VProgressCircular>
            </template>
            <VListItemTitle class="font-weight-medium mb-2 me-2">
              {{ score.message.category }}
            </VListItemTitle>
          </VListItem>
        </VList>
        <div class="text-body-2 mt-3">
          {{ score.message.interpretation }}
        </div>
        <h3 class="mt-5">Parámetros físico-químicos</h3>
        <VDivider class="mt-3 mb-5" />
        <VList class="card-list mb-5">
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Temperatura del agua
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateTemperatureGrade(siteInfo.water_temperature, siteReference?.temperatura_agua)"
                >
                  {{ siteInfo.water_temperature }}ºC
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Temperatura del ambiente
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateTemperatureGrade(siteInfo.environmental_temperature, siteReference?.temperatura_ambiental)"
                >
                  {{ siteInfo.environmental_temperature }}ºC
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              pH
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculatePhGrade(siteInfo.ph, siteReference?.ph)"
                >
                  {{ siteInfo.ph }}
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Oxígeno disuelto
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateSaturationGrade(siteInfo.dissolved_oxygen, siteReference?.oxigeno_disuelto)"
                >
                  {{ siteInfo.dissolved_oxygen }} mg/L
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Turbidez
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateTurbidityGrade(siteInfo.turbidity, siteReference?.turbidez)"
                >
                  {{ siteInfo.turbidity }} JTU
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Nitratos
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateNitratesGrade(siteInfo.nitrates, siteReference?.nitratos)"
                >
                  {{ siteInfo.nitrates }} mg/L
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Amonio
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateAmmoniumGrade(siteInfo.ammonium, siteReference?.amonio)"
                >
                  {{ siteInfo.ammonium }} mg/L
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Fosfatos
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateOrthophosphatesGrade(siteInfo.orthophosphates, siteReference?.ortofosfatos)"
                >
                  {{ siteInfo.orthophosphates }} mg/L
                </VChip>
              </div>
            </template>
          </VListItem>
        </VList>
        <h3>Parámetros paisajísticos</h3>
        <VDivider class="mt-3 mb-5" />
        <VList class="card-list mb-5">
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              CH
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateChGrade(siteInfo.hydromorphological_quality)"
                >
                  {{ siteInfo.hydromorphological_quality }} puntos
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              CBR
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateCbrGrade(siteInfo.riparian_forest_quality)"
                >
                  {{ siteInfo.riparian_forest_quality }} puntos
                </VChip>
              </div>
            </template>
          </VListItem>
        </VList>
        <h3>Parámetros biológicos</h3>
        <VDivider class="mt-3 mb-5" />
        <VList class="card-list">
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Coliformes totales
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateColiformsGrade(siteInfo.fecal_coliforms)"
                >
                  {{ siteInfo.total_coliforms }}
                </VChip>
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Macroinvertebrados
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                <VChip
                  label
                  size="small"
                  variant="elevated"
                  :color="calculateBioticGrade(siteInfo.macroinvertebrates_rating)"
                >
                  {{ siteInfo.macroinvertebrates_rating }} puntos
                </VChip>
              </div>
            </template>
          </VListItem>
        </VList>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>
