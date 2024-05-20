<script setup>
const props = defineProps({
  series: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
}) 

// const series = [{
//   data: [7.5, 7.5, 7, 9, 7.5, 8]
// }]
const chartOptions = {
  chart: {
    type: 'bar',
    height: 380
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      distributed: true,
      horizontal: true,
      borderRadius: 4,
      borderRadiusApplication: 'end',
      dataLabels: {
        position: 'center'
      },
    }
  },
  // colors: ['#5b961e','#5b961e','#5b961e','#f6f602','#5b961e','#5b961e'],
  colors: props.colors,
  
  dataLabels: {
    enabled: true,
    textAnchor: 'start',
    style: {
      colors: ['#fff']
    },
    offsetX: 0,
    dropShadow: {
      enabled: true
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    //categories: ['La Granada','Río Los Patos','Rio El Filo','Parte Baja','Después de la Presa','Jalcomulco'],
    categories: props.categories,
  },
  title: {
      text: props.title,
      //text: 'Calidad General',
      align: 'center',
      floating: true
  },
  tooltip: {
    theme: 'dark',
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function () {
          return ''
        }
      }
    }
  }
}
</script>

<template>
  <VueApexCharts
    type="bar"
    height="400"
    :options="chartOptions"
    :series="props.series"
  />
</template>
