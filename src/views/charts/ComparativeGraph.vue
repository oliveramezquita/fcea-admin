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
    },
    formatter: (val) => {
      return val
    }
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: props.categories,
    labels: {
      formatter: (val) => {
        return val
      }
    }
  },
  title: {
      text: props.title,
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
  },
  annotations: {}
}
if (props.title === 'Calidad General') {
  chartOptions.dataLabels.formatter = (val) => {
    return val + ' puntos'
  }
  chartOptions.xaxis.labels.formatter = (val) => {
    return val + ' puntos'
  }
}
if (props.title === 'Temperatura') {
  chartOptions.dataLabels.formatter = (val) => {
    return val + ' ºC'
  }
  chartOptions.xaxis.labels.formatter = (val) => {
    return val + ' ºC'
  }
}
if (props.title === 'Oxígeno Disuelto' || props.title === 'Nitratos' || props.title === 'Amonio' || props.title === 'Ortofosfatos') {
  chartOptions.dataLabels.formatter = (val) => {
    return val + ' mg/L'
  }
  chartOptions.xaxis.labels.formatter = (val) => {
    return (Math.round(val * 100) / 100).toFixed(2) + ' mg/L'
  }
}
if (props.title === 'Turbidez') {
  chartOptions.dataLabels.formatter = (val) => {
    return val + ' JTU'
  }
  chartOptions.xaxis.labels.formatter = (val) => {
    return (Math.round(val * 100) / 100).toFixed(2) + ' JTU'
  }
}
if (props.title === 'Calidad de Bosque de Ribera' || props.title === 'Calidad Hidromorfológica' || props.title === 'Macroinvertebrados') {
  chartOptions.dataLabels.formatter = (val) => {
    return val + ' pts'
  }
  chartOptions.xaxis.labels.formatter = (val) => {
    return val + ' pts'
  }
}
if (props.title === 'Caudal') {
  chartOptions.dataLabels.formatter = (val) => {
    return (val ? val : 0) + ' m³/s'
  }
  chartOptions.xaxis.labels.formatter = (val) => {
    return (Math.round(val * 100) / 100).toFixed(2) + ' m³/s'
  }
}
if (props.title === 'Bacterias Coliformes') {
  chartOptions.annotations = {
    xaxis: [
    {
      x: 3,
      borderColor: '#e92312',
      label: {
        borderColor: 'transparent',
        style: {
          color: '#000',
          background: 'transparent',
        },
        text: 'Presencia',
      }
    },
    {
      x: 1,
      borderColor: '#5b961e',
      label: {
        borderColor: 'transparent',
        style: {
          color: '#000',
          background: 'transparent',
        },
        text: 'Ausencia',
      }
    }]
  }
  chartOptions.dataLabels = {
    enabled: false,
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

<style lang="scss">
.apexcharts-legend-series:first-child {
  .apexcharts-legend-text {
    font-weight: bold !important;
  }
}
</style>
