<script setup>
const props = defineProps({
  siteInfo: {
    type: Object,
    required: true,
  },
})
const siteInfo = ref(structuredClone(toRaw(props.siteInfo)))
const siteReference = ref(JSON.parse('site_reference' in siteInfo.value ? siteInfo.value.site_reference : '[]')[0])
const panel = ref(0)
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
        <h3>Parámetros físico-químicos</h3>
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
                  :color="calculateTemperatureGrade(siteInfo.water_temperature, siteReference?.water_temperature)"
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
                  :color="calculateTemperatureGrade(siteInfo.environmental_temperature, siteReference?.environmental_temperature)"
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
                  :color="calculateOxygenGrade(siteInfo.dissolved_oxygen)"
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
                  :color="calculateTurbidityGrade(siteInfo.turbidity, siteReference?.turbidity)"
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
                  :color="calculateLakeNitratesGrade(siteInfo.nitrates)"
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
                  :color="calculateAmmoniumGrade(siteInfo.ammonium, siteReference?.ammonium)"
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
                  :color="calculateOrthophosphatesGrade(siteInfo.orthophosphates, siteReference?.orthophosphates)"
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