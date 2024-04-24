<script setup>
import SitePanelInfo from '@/views/reports/SitePanelInfo.vue';
import mapboxgl from 'mapbox-gl';
import {
  onMounted,
  ref
} from 'vue';
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
const selectedState = ref()
const selectedInstitution = ref()
const selectedSites = ref()
const dateRange = ref()
const selectedParameter = ref()

const {
  data: siteFilters,
  execute: fetchFilters,
} = await useApi(createUrl(`api/site-filters`, {
  query: {
    project: selectedProject,
  }
}))
const projectList = siteFilters.value?.projects
const statesList = siteFilters.value?.states
const institutionsList = siteFilters.value?.institution
const sitesList = siteFilters.value?.sites

selectedProject.value = siteFilters.value?.default_project 

const {
  data: sitesData,
  execute: fetchSites,
} = await useApi(createUrl('api/public-sites', {
  query: {
    project: selectedProject,
    state: selectedState,
    institution: selectedInstitution,
    site: selectedSites,
    dates: dateRange,
  }
}))
const sites = computed(() => sitesData.value)

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

      }
    }
    featureCollection.value.features.push(feature)
    let siteInfo = {
      id: site._id,
      name: site.nombre_sitio,
      type_site: site.es_sitio_referencia ? 'Sitio de referencia' : 'Sitio de interés',
      icon: site.es_sitio_referencia ? 'tabler-map-2' : 'tabler-map-check',
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
      date: site.fecha, 
      site_reference: JSON.stringify(siteTrackingData.value.filter(s => s.id === site.sitio_referencia_id)),
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
  const coordinates = geojson.features[0].geometry.coordinates
  map.value.getSource('sites').setData(geojson)
  map.value.jumpTo({ 'center': [coordinates[0], coordinates[1]], 'zoom': 6.5 })
  map.value.addSource('cuenca', {
      type: 'geojson',
      data: '../src/assets/geojson/ManiatepecCuenca.geojson',
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
    });
    fetchMapData()
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
    });
    map.value.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'sites',
      filter: ['has', 'point_count'],
      layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
      }
    });
    map.value.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'sites',
      filter: ['!', ['has', 'point_count']],
      paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
      }
    });
    map.value.on('click', 'clusters', (e) => {
      const features = map.value.queryRenderedFeatures(e.point, {
          layers: ['clusters']
      });
      const clusterId = features[0].properties.cluster_id;
      map.value.getSource('sites').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
              if (err) return;

              map.value.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
              });
          }
      );
    });
    map.value.on('click', 'unclustered-point', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const title = e.features[0].properties.title;
      const cdts = e.features[0].properties.coordinates;
      const description = e.features[0].properties.description;
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
              `<b>${title}</b><br>${cdts}<br>${description}`
          )
          .addTo(map.value);
    });

    map.value.on('mouseenter', 'clusters', () => {
        map.value.getCanvas().style.cursor = 'pointer';
    });
    map.value.on('mouseleave', 'clusters', () => {
        map.value.getCanvas().style.cursor = '';
    });
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
const updateProjects = async () => {
  await fetchFilters()
  await fetchSites()
}

watch(sites, () => {
  fetchFeatureAndTracking()
  fetchMapData()
})
</script>

<template>
  <VRow class="filters-layout">
    <!-- 👉 Select Role -->
    <VCol
      cols="12"
      sm="4"
    >
      <AppSelect
        v-model="selectedProject"
        placeholder="Seleccionar cuenca"
        :items="projectList"
        @update:model-value="updateProjects"
      />
    </VCol>
    <!-- 👉 Select Role -->
    <VCol
      cols="12"
      sm="4"
    >
      <AppSelect
        v-model="selectedState"
        placeholder="Seleccionar estado"
        :items="statesList"
        clearable
        clear-icon="tabler-x"
        @update:model-value="updateProjects"
      />
    </VCol>
    <!-- 👉 Select Plan -->
    <VCol
      cols="12"
      sm="4"
    >
      <AppSelect
        v-model="selectedInstitution"
        placeholder="Seleccionar institución"
        :items="institutionsList"
        clearable
        clear-icon="tabler-x"
        @update:model-value="updateProjects"
      />
    </VCol>
    <!-- 👉 Select Status -->
    <VCol
      cols="12"
      sm="4"
    >
      <AppSelect
        v-model="selectedSites"
        placeholder="Seleccionar sitio"
        :items="sitesList"
        clearable
        clear-icon="tabler-x"
        @update:model-value="updateProjects"
      />
    </VCol>
    <VCol
      cols="12"
      sm="4"
    >
    <AppDateTimePicker
      v-model="dateRange"
      placeholder="Selecciona una fecha"
      :config="{ mode: 'range' }"
      @update:model-value="updateProjects"
    />
    </VCol>
    <VCol
      cols="12"
      sm="4"
    >
      <AppSelect
        v-model="selectedParameter"
        placeholder="Seleccionar parámetro"
        :items="[]"
        clearable
        clear-icon="tabler-x"
        @update:model-value="updateProjects"
      />
    </VCol>
  </VRow> 
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
        <VCardItem>
          <VCardTitle>
            Mapa Colaborativo
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

        <!-- 👉 Perfect Scrollbar -->
        <PerfectScrollbar
          :options="{ wheelPropagation: false, suppressScrollX: true }"
          style="block-size: calc(100% - 60px);"
        >
          <VCardText class="pt-0">
            <div
              v-for="(site, index) in siteTrackingData"
              :key="index"
              class="mb-6"
            >
              <div
                class="d-flex align-center justify-space-between cursor-pointer"
                @click="flyToLocation(geojson.features[index].geometry.coordinates, index)"
              >
                <div class="d-flex gap-x-4 align-center">
                  <VAvatar
                    :icon="site.icon"
                    variant="tonal"
                    color="secondary"
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
          </VCardText>
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
        <!-- 👉 Fleet map  -->
        <div
          id="mapContainer"
          class="basemap"
        />
      </div>
    </VMain>
  </VLayout>
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

/* stylelint-disable-next-line selector-id-pattern */
#mapContainer {
  block-size: 100vh !important;
}
</style>
