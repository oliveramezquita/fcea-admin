<script setup>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  geojsonData: Object,
  onSelect: Function,
})

const emitSelect = id => {
  props.onSelect(id)
}

const mapContainer = ref(null)

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const initializeMap = () => {
  const map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/karla-rivera/clv2lc0hq01oz01pk0afh1c0l',
    center: [-99, 19],
    zoom: 7,
  })

  map.addControl(new mapboxgl.NavigationControl())

  map.on('load', () => {
    console.log(props.geojsonData)
    if (props.geojsonData) {
      addDataToMap(props.geojsonData)
    }
  })

  const addDataToMap = data => {
    map.addSource('sites', {
      type: 'geojson',
      data: data,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    })

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'sites',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#550ae0', 100,
          '#2106ba', 750,
          '#00003c'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20, 100,
          30, 750,
          40
        ]
      }
    })

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'sites',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    })

    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'sites',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 5,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    })
  }

  map.on('click', 'clusters', e => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    })

    const clusterId = features[0].properties.cluster_id

    map.getSource('sites').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      })
    })
  })

  map.on('click', 'unclustered-point', e => {
    // const coordinates = e.features[0].geometry.coordinates.slice()
    const { _id } = e.features[0].properties

    emitSelect(_id)

    // new mapboxgl.Popup()
    //   .setLngLat(coordinates)
    //   .setHTML(`<p>${id}</p>`)
    //   .addTo(map)
  })

  // Cambiar el cursor al pasar sobre puntos clusterizables
  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = ''
  })
}

onMounted(() => {
  initializeMap()
})

watch(() => props.geojsonData, newData => {
  if (mapContainer.value && newData) {
    initializeMap()
  }
}, { deep: true })
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  height: 500px;
}
</style>
