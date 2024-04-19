<script setup>
import SitePanelInfo from '@/views/reports/SitePanelInfo.vue'
import fleetImg from '@images/misc/markerMap.png'
import mapboxgl from 'mapbox-gl'
import {
  onMounted,
  ref,
} from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'

definePage({
  meta: {
    layout: 'blank',
    public: true,
    layoutWrapperClasses: 'layout-content-height-fixed'
  },
})

const {
  data: projectsData,
} = await useApi(createUrl('api/public-projects'))
const projects = computed(() => projectsData.value)
const featureCollection = ref({
  type: 'FeatureCollection',
  features: []
})
const siteTrackingData = ref([])

projects.value.forEach(project => {
  let processedProject = {
    id: project._id,
    name: project.name,
    season: project.season,
    referenceSites: JSON.parse(project.reference_sites_data).answers,
    interestSites: JSON.parse(project.interest_sites_data).answers,
  }
  processedProject.referenceSites?.forEach(site => {
    let feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          site.longitud,
          site.latitud,
        ],
      },
    }
    featureCollection.value.features.push(feature)
    let siteInfo = {
      id: site._id,
      name: site.nombre_sitio,
      type_site: 'Sitio de referencia',
      icon: 'tabler-map-2',
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
    }
    siteTrackingData.value.push(siteInfo)
  })
  processedProject.interestSites?.forEach(site => {
    let feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          site.longitud,
          site.latitud,
        ],
      },
    }
    featureCollection.value.features.push(feature)
    let siteInfo = {
      id: site._id,
      name: site.nombre_sitio,
      type_site: 'Sitio de interés',
      icon: 'tabler-map-check',
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
  })  
})

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()
const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
const map = ref()
const vuetifyDisplay = useDisplay()

const carImgs = ref([
  fleetImg,
  fleetImg,
  fleetImg,
  fleetImg,
  fleetImg,
  fleetImg,
])

const refCars = ref([])

const showPanel = ref([
  true,
  false,
  false,
  false,
  false
])

const geojson = featureCollection.value
const activeIndex = ref(0)

onMounted(() => {
  mapboxgl.accessToken = accessToken
  map.value = new mapboxgl.Map({
    container: 'mapContainer',
    center: [
    -101.252860,
      22.210026,
    ],
    zoom: 5.5,
  })
  for (let index = 0; index < geojson.features.length; index++)
    new mapboxgl.Marker({ element: refCars.value[index] }).setLngLat(geojson.features[index].geometry.coordinates).addTo(map.value)
  refCars.value[activeIndex.value].classList.add('marker-focus')
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

watch(activeIndex, () => {
  refCars.value.forEach((car, index) => {
    if (index === activeIndex.value)
      car.classList.add('marker-focus')
    else
      car.classList.remove('marker-focus')
  })
})
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

        <img
          v-for="(car, index) in carImgs"
          :key="index"
          ref="refCars"
          :src="car"
          alt="car Img marker"
          height="42"
          width="42"
        >
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

/* stylelint-disable-next-line selector-id-pattern */
#mapContainer {
  block-size: 100vh !important;
}
</style>
