<script setup>
import DataFilters from "@core/components/DataFilters.vue";
import MapBox from "@core/components/MapBox.vue";
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const allData = ref([])

const selectedData = ref([])

const geojsonData = ref({
  type: "FeatureCollection",
  features: [],
})

const fetchData = async () => {
  try {
    const response = await axios.get('https://api.calidadagua.mx/monitoreo/api/public-projects')
    const responseJson = JSON.parse(response.data[0].interest_sites_data).answers

    allData.value = responseJson
    geojsonData.value = convertToGeoJSON(responseJson)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const estados = computed(() => {
  const uniqueStates = new Set(allData.value.map(item => item.estado))

  return Array.from(uniqueStates)
})

const sitios = computed(() => {
  const uniqueSites = new Set(allData.value.map(item => item.nombre_sitio))

  return Array.from(uniqueSites)
})


const filterData = ({ estado, sitio, fecha }) => {
  let filteredData = allData.value
  if (estado) {
    filteredData = filteredData.filter(item => item.estado === estado)
  }
  if (sitio) {
    // eslint-disable-next-line camelcase
    filteredData = filteredData.filter(item => item.nombre_sitio === sitio)
  }
  if (fecha) {
    filteredData = filteredData.filter(item => item.fecha.split('T')[0] === fecha)
  }

  geojsonData.value = convertToGeoJSON(filteredData)
}


const handleSelectPointMap = id => {
  const filteredData = allData.value.find(item => item._id === id)

  selectedData.value = filteredData
}

// Función para convertir datos de la API a GeoJSON
const convertToGeoJSON = data => {
  return {
    type: "FeatureCollection",
    features: data.map(item => ({
      type: "Feature",
      properties: {
        _id: item._id,
      },
      geometry: {
        type: "Point",
        coordinates: [parseFloat(item.longitud), parseFloat(item.latitud)],
      },
    })),
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <main class="layout-page-content">
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <h2>Monitoreo</h2>
            <div class="d-flex flex-row gap-4 align-center flex-wrap">
              <DataFilters :estados="estados" :sitios="sitios" :onFilter="filterData" />
            </div>
          </VCardText>
          <VDivider />
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <div class="monitoring-site">
              <MapBox :geojsonData="geojsonData" :onSelect="handleSelectPointMap" />
            </div>
          </VCardText>
          <VDivider />
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <div class="monitoring-site">
              <h2>Información del sitio de monitoreo</h2>
            </div>
            <VImg
              v-if="selectedData && selectedData.fotografia1"
              :src="selectedData.fotografia1"
              width="200px"
              height="150px"
            />
            <div v-if="selectedData && selectedData.ph">
              <h3>pH: {{ selectedData.ph }}</h3>
            </div>
            <div v-if="selectedData && selectedData.nombre_sitio">
              <h3>Nombre: {{ selectedData.nombre_sitio }}</h3>
            </div>
          </VCardText>
          <VDivider />
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <div class="monitoring-site">
              <h2>Evaluación de la calidad ecológica</h2>

            </div>
          </VCardText>
          <VDivider />
        </VCard>
      </VCol>
    </VRow>
  </main>
</template>
