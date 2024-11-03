<script setup>
import MapFiltersDrawer from '@/views/reports/MapFiltersDrawer.vue';
import SitePanelInfo from '@/views/reports/SitePanelInfo.vue';
import mapboxgl from 'mapbox-gl';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { useDisplay } from 'vuetify';

definePage({
  meta: {
    layout: 'blank',
    public: true,
    layoutWrapperClasses: 'layout-content-height-fixed'
  },
})
const selectedProject = ref()
const selectedMonitoringPeriod = ref()
const selectedSeason = ref()
const state = ref()
const institution = ref()
const dateRange = ref()

const {
  data: siteFilters,
  execute: fetchFilters,
} = await useApi(createUrl(`api/site-filters`, {
  query: {
    project: selectedProject,
    monitoring_period: selectedMonitoringPeriod,
    season: selectedSeason
  }
}))
const projectList = ref(siteFilters.value?.projects)
const statesList = ref(siteFilters.value?.states)
const institutionsList = ref(siteFilters.value?.institution)
const monitoringPeriodList = ref(siteFilters.value?.monitoring_periods)
const seasonsList = ref(siteFilters.value?.seasons)
const institutions = ref(siteFilters.value?.default_project ? siteFilters.value?.default_project['institutions'] : [])
let geoJsonData = siteFilters.value?.default_project['geojson_data']

selectedProject.value = siteFilters.value?.default_project['name']
selectedMonitoringPeriod.value = siteFilters.value?.default_project['monitoring_period']
selectedSeason.value = siteFilters.value?.default_project['season']

const {
  data: sitesData,
  execute: fetchSites,
} = await useApi(createUrl('api/public-sites', {
  query: {
    project: selectedProject,
    monitoring_period: selectedMonitoringPeriod,
    season: selectedSeason,
    state: state,
    institution: institution,
    dates: dateRange,
  }
}))
const sites = computed(() => sitesData.value)

const {
  data: historicalGraphsData,
  execute: fetchHistoricalGraphs,
} = await useApi(createUrl(`api/historical-graphs`, {
  query: {
    project: selectedProject,
    monitoring_period: selectedMonitoringPeriod,
    season: selectedSeason,
    state: state,
    institution: institution,
  }
}))

const featureCollection = ref({
  type: 'FeatureCollection',
  features: []
})
const siteTrackingData = ref([])
const showPanel = ref([])

const fetchFeatureAndTracking = async () => {
  featureCollection.value.features = []
  siteTrackingData.value = []
  showPanel.value = []
  sites.value?.forEach((site, index) => {
    let feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          site.longitud,
          site.latitud,
        ],
      },
      properties: {
        title: `${site.nombre_sitio} - ${site.codigo_sitio}`,
        coordinates: `${site.latitud}, ${site.longitud}`,
        description: `${site.ciudad}, ${site.estado}`,
        score: site.scores.total[0],
        interpretation: `Calidad: ${site.scores.interpretation[0]}`
      }
    }
    featureCollection.value.features.push(feature)
    const monitoringDate = new Date(site.fecha)
    let siteInfo = {
      id: site._id,
      name: site.nombre_sitio,
      is_reference_site: site.es_sitio_referencia,
      type_site: site.es_sitio_referencia ? 'Sitio de referencia' : 'Sitio de interés',
      icon: site.es_sitio_referencia ? 'tabler-map-2' : 'tabler-map-check',
      color: site.scores.total ? site.scores?.total[2]: 'secondary',
      latitude: site.latitud,
      longitude: site.longitud,
      altitude: site.altitud,
      location: `${site.ciudad}, ${site.estado}`,
      city: site.ciudad,
      state: site.estado,
      type_body_water: site.tipo_cuerpo_agua,
      season: site.temporada,
      photo1: site.fotografia1,
      photo2: site.fotografia2,
      water_flow: site.caudal,
      ph: site.ph,
      ammonium: site.amonio,
      orthophosphates: site.ortofosfatos,
      water_temperature: site.temperatura_agua,
      environmental_temperature: site.temperatura_ambiental,
      dissolved_oxygen: site.oxigeno_disuelto,
      saturation: site.saturacion,
      turbidity: site.turbidez,
      nitrates: site.nitratos,
      fecal_coliforms: site.coliformes_fecales,
      total_coliforms: site.coliformes_totales,
      macroinvertebrates_rating: site.calificacion_macroinvertebrados,
      hydromorphological_quality: site.calidad_hidromorfologica,
      riparian_forest_quality: site.calidad_bosque_ribera,
      date: monitoringDate, 
      scores: site.scores,
      site_reference_score: site.reference_site_scores,
    }
    siteTrackingData.value.push(siteInfo)
    showPanel.value.push(false)
  })
}

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()
const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
const map = ref()
const vuetifyDisplay = useDisplay()
const geojson = featureCollection.value
const activeIndex = ref(0)

const fetchMapData = async () => {
  const coordinates = geojson.features[0]?.geometry.coordinates
  map.value.getSource('sites').setData(geojson)
  if (coordinates) map.value.jumpTo({ 'center': [coordinates[0], coordinates[1]], 'zoom': 6.5 })
}

const fetchGeoJsonData = async () => {
  if(geoJsonData && map.value.getSource('cuenca')) {
    map.value.getSource('cuenca').setData(geoJsonData)
  } 
}

onMounted(() => {
  fetchFeatureAndTracking()
  mapboxgl.accessToken = accessToken
  map.value = new mapboxgl.Map({
    container: 'mapContainer',
    
    center: [
    -101.252860,
      22.210026,
    ],
    zoom: 4.5,
  })
  map.value.on('load', async () => {
    map.value.addSource('sites', {
      type: 'geojson',
      data: null,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    })
    map.value.addSource('cuenca', {
      type: 'geojson',
      data: null,
    })
    fetchMapData()
    fetchGeoJsonData()
    // Layer of sites
    map.value.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'sites',
      filter: ['has', 'point_count'],
      paint: {
          'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
          ],
          'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
          ]
      }
    })
    map.value.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'sites',
      filter: ['has', 'point_count'],
      layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 16,
      }
    })
    map.value.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'sites',
      filter: ['!', ['has', 'point_count']],
      paint: {
          'circle-color': [
            'match',
            ['get', 'score'],
            5,
            '#5b961e',
            4,
            '#92d050',
            3,
            '#f6f602',
            2,
            '#ffc000',
            1,
            '#e92312',
            '#737682'
          ],
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000'
      }
    })
    map.value.on('click', 'clusters', (e) => {
      const features = map.value.queryRenderedFeatures(e.point, {
          layers: ['clusters']
      })
      const clusterId = features[0].properties.cluster_id
      map.value.getSource('sites').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
              if (err) return

              map.value.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
              })
          }
      )
    })
    map.value.on('click', 'unclustered-point', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice()
      const title = e.features[0].properties.title
      const cdts = e.features[0].properties.coordinates
      const description = e.features[0].properties.description
      const interpretation = e.features[0].properties.interpretation
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
              `<b>${title}</b><br>${cdts}<br>${description}<br>${interpretation}`
          )
          .addTo(map.value)
    })
    map.value.on('mouseenter', 'clusters', () => {
        map.value.getCanvas().style.cursor = 'pointer'
    })
    map.value.on('mouseleave', 'clusters', () => {
        map.value.getCanvas().style.cursor = ''
    })
    map.value.addLayer({
      'id': 'maine',
      'type': 'fill',
      'source': 'cuenca',
      'layout': {},
      'paint': {
          'fill-color': '#1f97b4', 
          'fill-opacity': 0.5
      }
    })
    map.value.addLayer({
      'id': 'outline',
      'type': 'line',
      'source': 'cuenca',
      'layout': {},
      'paint': {
          'line-color': '#000',
          'line-width': 2
      }
    })
  })
})

const flyToLocation = (geolocation, index) => {
  activeIndex.value = index
  showPanel.value.fill(false)
  showPanel.value[index] = !showPanel.value[index]
  if (vuetifyDisplay.mdAndDown.value)
    isLeftSidebarOpen.value = false
  map.value.flyTo({
    center: geolocation,
    zoom: 16,
  })
}

const resetPolygonData = async() => {
  if (map.value.getLayer('maine')) map.value.removeLayer('maine')
  if (map.value.getLayer('outline')) map.value.removeLayer('outline')
  if (map.value.getSource('cuenca')) map.value.removeSource('cuenca')
}

const updateMap = async filters => {
  selectedProject.value = filters.project
  selectedMonitoringPeriod.value = filters.monitoringPeriod
  selectedSeason.value = filters.season
  state.value = filters.state
  institution.value = filters.institution
  dateRange.value = filters.dates
  //resetPolygonData()
  await fetchFilters()
  await fetchSites()
  await fetchHistoricalGraphs()
}

const isMapFiltersDrawerVisible = ref(false)

watch(siteFilters, () => {
  statesList.value = siteFilters.value?.states
  institutionsList.value = siteFilters.value?.institution
  geoJsonData = siteFilters.value?.default_project['geojson_data']
  institutions.value = siteFilters.value?.default_project['institutions']
  fetchGeoJsonData()
})

watch(sites, () => {
  fetchHistoricalGraphs()
  fetchFeatureAndTracking()
  fetchMapData()
})

const currentTab = ref('Información')
const tabsData = [
  {
    title: 'Información',
    icon: 'tabler-list-check'
  },
  {
    title: 'Gráficas',
    icon: 'tabler-chart-infographic'
  },
  {
    title: 'Archivos',
    icon: 'tabler-file-spreadsheet'
  },
]
const radioGroup = ref(1)
const graphsList = [
  {
    title: 'Calidad General',
    value: 'calidad_general'
  },
  {
    title: 'Temperatura',
    value: 'temperatura_agua,water_temperature'
  },
  {
    title: 'pH',
    value: 'ph,ph'
  },
  {
    title: 'Oxígeno Disuelto',
    value: 'oxigeno_disuelto,saturation'
  },
  {
    title: 'Turbidez',
    value: 'turbidez,turbidity'
  },
  {
    title: 'Nitrógeno de Nitratos',
    value: 'nitratos,nitrates'
  },
  {
    title: 'Nitrógeno Amoniacal ',
    value: 'amonio,ammonium'
  },
  {
    title: 'Ortofosfatos',
    value: 'ortofosfatos,orthophosphates'
  },
  {
    title: 'Calidad de Bosque de Ribera',
    value: 'calidad_bosque_ribera,cbr'
  },
  {
    title: 'Calidad Hidromorfológica',
    value: 'calidad_hidromorfologica,ch',
  },
  {
    title: 'Macroinvertebrados',
    value: 'calificacion_macroinvertebrados,macroinvertebrates_rating'
  },
  {
    title: 'Bacterias Coliformes',
    value: 'coliformes_totales'
  },
  {
    title: 'Caudal',
    value: 'caudal'
  }
]
const isGraphDialogVisible = ref(false)
const graphItem = ref()
const updateGraph = async graph => {
  isGraphDialogVisible.value = true
  graphItem.value = graph
}
</script>

<template>
  <VLayout class="fleet-app-layout">
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      width="460"
      absolute
      touchless
      location="start"
      border="none"
    >
      <VCard
        class="h-100 fleet-navigation-drawer"
        flat
      >
        <VCardItem class="pb-2">
          <VCardTitle>
            <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap">
              <div>
                <h5 class="text-h5" v-if="selectedProject && selectedMonitoringPeriod">{{ `${selectedProject} - ${selectedMonitoringPeriod}` }}</h5>
                <h5 class="text-body-1">Mapa Colaborativo</h5>
              </div>
              <div v-for="institution in institutions.filter(i => i.name === selectedProject)">
                <a class="basin-logo" :href="institution.url" target="_blank"><img :src="institution.logo" :alt="institution.name" width="140"></a>
              </div>
            </div>
            <h4 class="text-body-1 mt-2">Donantes:</h4>
            <VTabs class="v-tabs-pill">
              <VTab class="logo-tab" v-if="institutions.length > 0">
                <a href="https://sertull.org.mx/" target="_blank"><img src="https://api.calidadagua.mx/media/images/sertull-logo.svg" alt="Fundación sertull" width="120"></a>
              </VTab>
              <VTab class="logo-tab" v-for="institution in institutions.filter(i => i.name !== selectedProject)">
                <a :href="institution.url" target="_blank"><img :src="institution.logo" :alt="institution.name" width="120"></a>
              </VTab>
            </VTabs>
          </VCardTitle>

          <template #append>
            <IconBtn
              class="d-lg-none navigation-close-btn"
              @click="isLeftSidebarOpen = !isLeftSidebarOpen"
            >
              <VIcon icon="tabler-x" />
            </IconBtn>
          </template>
        </VCardItem>

        <!-- <VTabs
          v-model="currentTab"
          grow
          stacked
          class="disable-tab-transition"
        >
          <VTab
            v-for="(tab, index) in tabsData"
            :key="index"
          >
            <VIcon
              :icon="tab.icon"
              class="mb-2"
            />
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs> -->
        <!-- 👉 Perfect Scrollbar -->
        <PerfectScrollbar
          :options="{ wheelPropagation: false, suppressScrollX: true }"
          style="block-size: calc(100% - 80px);"
        >
          <!-- <VWindow v-model="currentTab">
            <VWindowItem> -->
              <VTabs
                v-model="currentTab"
                class="disable-tab-transition"
              >
                <VTab
                  v-for="(tab, index) in tabsData"
                  :key="index"
                >
                  {{ tab.title }}
                </VTab>
              </VTabs>
              <VCardText class="pt-0">
                <VWindow v-model="currentTab">
                  <VWindowItem>
                    <div
                      v-for="(site, index) in siteTrackingData"
                      :key="index"
                      class="mb-6 mt-5"
                    >
                      <div
                        class="d-flex align-center justify-space-between cursor-pointer"
                        @click="flyToLocation(geojson.features[index].geometry.coordinates, index)"
                      >
                        <div class="d-flex gap-x-4 align-center">
                          <VAvatar
                            :icon="site.icon"
                            :color="site.color"
                          />
                          <div>
                            <div class="text-body-1 text-high-emphasis">
                              {{ site.name }}
                            </div>
                            <div class="text-body-1">
                              {{ site.location }}
                            </div>
                          </div>
                        </div>
                        <IconBtn size="small">
                          <VIcon
                            :icon="showPanel[index] ? 'tabler-chevron-down' : $vuetify.locale.isRtl ? 'tabler-chevron-left' : 'tabler-chevron-right'"
                            class="text-high-emphasis"
                          />
                        </IconBtn>
                      </div>
                      <VExpandTransition mode="out-in">
                        <div v-show="showPanel[index]">
                          <div class="mt-5">
                            <SitePanelInfo :site-info="site" />
                          </div>
                        </div>
                      </VExpandTransition>
                    </div>
                    <template v-if="siteTrackingData.length === 0">
                      <VAlert
                        prominent
                        type="info"
                        variant="tonal"
                        color="secondary"
                        class="mt-5"
                      >
                        <template #text>
                          <div v-if="!selectedProject">No existen cuencas con sitios dados de alta hasta el momento</div>
                          <div v-if="selectedProject">No existen sitios con las fechas seleccionadass: {{ dateRange }}</div>
                        </template>
                      </VAlert>
                    </template>
                  </VWindowItem>
                  <VWindowItem>
                    <VRadioGroup
                      v-model="radioGroup"
                      false-icon="tabler-chart-histogram"
                      true-icon="tabler-chart-histogram"
                      class="mt-5"
                    >
                      <VRadio
                        v-for="(graph, index) in graphsList"
                        :key="index"
                        :label="graph.title"
                        :value="graph.value"
                        class="mb-2"
                        @click="updateGraph(graph)"
                      />
                    </VRadioGroup>
                    <GraphDialog
                      v-model:isDialogVisible="isGraphDialogVisible"
                      :sites="sites"
                      :graph-item="graphItem"
                      :historical-data="historicalGraphsData" />
                  </VWindowItem>
                  <VWindowItem>
                    <VBtn
                      color="primary"
                      variant="plain"
                      :href="siteFilters.default_project.excel_file"
                      target="_blank"
                      class="download-btn mt-4">
                      <VIcon
                        start
                        icon="tabler-file-spreadsheet"
                      />Datos en Excel
                    </VBtn>
                  </VWindowItem>
                </VWindow>
              </VCardText>
            <!-- </VWindowItem>
            <VWindowItem>
              <VCardText class="pt-5">
                <VRadioGroup
                  v-model="radioGroup"
                  false-icon="tabler-chart-histogram"
                  true-icon="tabler-chart-histogram"
                >
                  <VRadio
                    v-for="(graph, index) in graphsList"
                    :key="index"
                    :label="graph.title"
                    :value="graph.value"
                    class="mb-2"
                    @click="updateGraph(graph)"
                  />
                </VRadioGroup>
                <GraphDialog
                  v-model:isDialogVisible="isGraphDialogVisible"
                  :title="graphTitle" />
              </VCardText>
            </VWindowItem>
          </VWindow> -->
        </PerfectScrollbar>
      </VCard>
    </VNavigationDrawer>
    <VMain>
      <div class="h-100">
        <IconBtn
          class="d-lg-none navigation-toggle-btn rounded-sm"
          variant="elevated"
          @click="isLeftSidebarOpen = true"
        >
          <VIcon icon="tabler-menu-2" />
        </IconBtn>
        <VBtn
          class="d-lg-block filter-toggle-btn rounded-sm"
          variant="elevated"
          color="white"
          @click="isMapFiltersDrawerVisible = true"
          v-if="siteFilters"
        >
          <VIcon start icon="tabler-filter-pin" />
          Filtros
        </VBtn>
        <!-- 👉 Fleet map  -->
        <div
          id="mapContainer"
          class="basemap"
        />
      </div>
    </VMain>
  </VLayout>
  <MapFiltersDrawer
    v-model:isDrawerOpen="isMapFiltersDrawerVisible"
    :selected-project="selectedProject"
    :selected-monitoring-period="selectedMonitoringPeriod"
    :selected-season="selectedSeason"
    :project-list="projectList"
    :monitoring-period-list="monitoringPeriodList"
    :seasons-list="seasonsList"
    :states-list="statesList"
    :institutions-list="institutionsList"
    @update-map="updateMap"
  />
</template>

<style lang="scss">
@use "@styles/variables/vuetify.scss";
@use "@core/scss/base/mixins.scss";
@import "mapbox-gl/dist/mapbox-gl.css";

.fleet-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-fleet-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-fleet-app-layout);
    }
  }
}

.navigation-toggle-btn {
  position: absolute;
  z-index: 1;
  inset-block-start: 1rem;
  inset-inline-start: 1rem;
}

.filter-toggle-btn {
  position: absolute;
  z-index: 1;
  inset-block-start: 1rem;
  inset-inline-end: 1rem;
}

.navigation-close-btn {
  position: absolute;
  z-index: 1;
  inset-block-start: 1rem;
  inset-inline-end: 1rem;
}

.basemap {
  block-size: 100%;
  inline-size: 100%;
}

.marker-focus {
  filter: drop-shadow(0 0 7px rgb(var(--v-theme-primary)));
}

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right {
  display: none;
}

.fleet-navigation-drawer {
  .v-timeline .v-timeline-divider__dot .v-timeline-divider__inner-dot {
    box-shadow: none;
  }
}

.fleet-timeline {
  &.v-timeline .v-timeline-item:not(:last-child) {
    .v-timeline-item__body {
      margin-block-end: 0.25rem;
    }
  }
}

.filters-layout {
  background-color: white !important;
  padding-block: 15px;
  padding-inline: 10px;
}

.logo-tab {
  border-radius: 0 !important;
  background-color: transparent !important;
  box-shadow: none !important;
  padding-block: 0 !important;
  padding-inline: 0 10px !important;
}

.download-btn {
  text-transform: none !important;
}

/* stylelint-disable-next-line selector-id-pattern */
#mapContainer {
  block-size: 100vh !important;
}
</style>
