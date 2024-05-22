<script setup>
const props = defineProps({
  series: {
    type: Array,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
})
const chartOptions = {
  chart: {
    height: 350,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 10,
      left: 5,
      blur: 5,
      opacity: 0.2
    },
    stacked: false,
    zoom: {
      enabled: false
    },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
      }
    }
  },
  stroke: {
    width: 3,
    curve: 'smooth',
    //dashArray: 5
  },
  colors: [
    '#2196f3',
    '#009688',
    '#3f51b5',
    '#e91e63',
    '#ffc107',
    '#795548',
    '#ff5722',
    '#03a9f4',
    '#4caf50',
    '#673ab7',
    '#00bcd4',
    '#8bc34a',
    '#9c27b0',
    '#f44336',
    '#ff9800',
    '#9e9e9e',
    '#cddc39',
    '#607d8b',
    '#ffeb3b',
  ],
  dataLabels: {
    enabled: true,
    style: {
      colors: [function ({ seriesIndex,dataPointIndex,  w }) {
        if (w.config.series[seriesIndex].data[dataPointIndex] >= 85 & w.config.series[seriesIndex].data[dataPointIndex] <= 89) {
          return "#5b961e";
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 75 & w.config.series[seriesIndex].data[dataPointIndex] <= 84) {
          return "#92d050";
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 65 & w.config.series[seriesIndex].data[dataPointIndex] <= 74) {
          return "#f6f602"
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 54 & w.config.series[seriesIndex].data[dataPointIndex] <= 64) {
          return "#ffc000"
        } else if (w.config.series[seriesIndex].data[dataPointIndex] <= 53) {
          return "#e92312"
        }
      }]
    }
  },
  fill: {
    type:'solid',
    opacity: [0.25,1],
  },
  // labels: ['Secas Enero 2024', 'Lluvias Abril 2024','Lluvias Julio 2024','Secas Octubre 2024'],
  labels: props.labels,
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  markers: {
    size: 1
  },
  // xaxis: {
  //   type: 'datetime'
  // },
  yaxis: {
    title: {
      text: 'Puntaje',
    },
    min: 0,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5,
    }
  },
  title: {
    // text: 'Calidad General',
    text: props.title,
    align: 'center',
    floating: true
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if (typeof y !== "undefined") {
          return y.toFixed(0) + " puntos";
        }
        return y;
  
      }
    }
  }
}
// const series = [
//   {
//     name: 'La Granada',
//     type: 'area',
//     data: [89,76,66,64]
//   }, 
//   {
//     name: 'Río Los Patos',
//     type: 'line',
//     data: [82,78,80,75]
//   }, 
//   {
//     name: 'Río El Filo',
//     type: 'line',
//     data: [77,70,65,60]
//   }, 
//   {
//     name: 'Parte Baja',
//     type: 'line',
//     data: [67,60,69,72]
//   }, 
//   {
//     name: 'Después de la Presa',
//     type: 'line',
//     data: [71,67,60,59]
//   }, 
//   {
//     name: 'Jalcomulco',
//     type: 'line',
//     data: [84,81,86,78]
//   }
// ]
</script>

<template>
  <VueApexCharts
    type="line"
    height="400"
    :options="chartOptions"
    :series="props.series"
  />
</template>
