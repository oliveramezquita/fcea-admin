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
const panel = ref()
const percentScore = ref(siteInfo.value.scores.total[0] * 20)
watch(props, () => {
  siteInfo.value = structuredClone(toRaw(props.siteInfo))
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
          <VListItem v-if="siteInfo.site_reference_score">
            <VListItemTitle class="font-weight-medium me-4">
              Sitio de referencia
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                {{ siteInfo.site_reference_score?.nombre_sitio }}
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
                {{ siteInfo.altitude }} m
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Caudal
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                {{ siteInfo.water_flow }} m³/s
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Fecha del monitoreo
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                {{ `${("0" + siteInfo.date.getDate()).slice(-2)}/${("0"+(siteInfo.date.getMonth()+1)).slice(-2)}/${siteInfo.date.getFullYear()}` }}
              </div>
            </template>
          </VListItem>
          <VListItem>
            <VListItemTitle class="font-weight-medium me-4">
              Hora del monitoreo
            </VListItemTitle>
            <template #append>
              <div class="d-flex align-center gap-x-4">
                {{ `${("0" + siteInfo.date.getHours()).slice(-2)}:${("0" + siteInfo.date.getMinutes()).slice(-2)}` }}
              </div>
            </template>
          </VListItem>
        </VList>
        <VDivider />
        <div>
          <VBtn
            :href="siteInfo.photo1"
            target="_blank"
            variant="plain"
            v-if="siteInfo.photo1"
          >
            <VIcon
              start
              icon="tabler-photo-scan"
            />
            Fotografía 1
          </VBtn>
          <VBtn
            :href="siteInfo.photo2"
            target="_blank"
            variant="plain"
            v-if="siteInfo.photo2"
          >
            <VIcon
              start
              icon="tabler-photo-scan"
            />
            Fotografía 2
          </VBtn>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
    <VExpansionPanel>
      <VExpansionPanelTitle
        collapse-icon="tabler-minus"
        expand-icon="tabler-plus"
      >
        <span v-if="!siteInfo.is_reference_site">Evaluación de la calidad ecológica</span>
        <span v-if="siteInfo.is_reference_site">Resultados de la calidad ecológica</span>
      </VExpansionPanelTitle>

      <VExpansionPanelText>
        <VList class="card-list">
          <VListItem>
            <template #prepend>
              <VProgressCircular
                v-model="percentScore"
                :size="38"
                class="me-4"
                :color="siteInfo.scores.total ? siteInfo.scores?.total[2] : null"
              >
                <span class="text-body-1 text-high-emphasis font-weight-medium">
                  {{ siteInfo.scores?.total[0] }}
                </span>
              </VProgressCircular>
            </template>
            <VListItemTitle class="font-weight-medium mb-2 me-2">
              {{ siteInfo.scores?.interpretation[0] }}
            </VListItemTitle>
          </VListItem>
        </VList>
        <div class="text-body-2 mt-3">
          {{ siteInfo.scores?.interpretation[1] }}
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
                  :color="siteInfo.scores.water_temperature ? siteInfo.scores?.water_temperature[1] : null"
                >
                  {{ siteInfo.water_temperature }}ºC
                </VChip>
              </div>
            </template>
          </VListItem>
          <!--<VListItem>
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
          </VListItem>-->
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
                  :color="siteInfo.scores.ph ? siteInfo.scores?.ph[1] : null"
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
                  :color="siteInfo.scores.saturation ? siteInfo.scores?.saturation[1] : null"
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
                  :color="siteInfo.scores.turbidity ? siteInfo.scores?.turbidity[1] : null"
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
                  :color="siteInfo.scores.nitrates ? siteInfo.scores?.nitrates[1] : null"
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
                  :color="siteInfo.scores.ammonium ? siteInfo.scores?.ammonium[1] : null"
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
                  :color="siteInfo.scores.orthophosphates ? siteInfo.scores?.orthophosphates[1] : null"
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
                  :color="siteInfo.scores?.ch[1]"
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
                  :color="siteInfo.scores?.cbr[1]"
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
                  :color="siteInfo.scores?.fecal_coliforms[1]"
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
                  :color="siteInfo.scores?.macroinvertebrates_rating[1]"
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
