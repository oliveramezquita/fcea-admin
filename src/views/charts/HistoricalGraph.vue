<script setup>
const props = defineProps({
  series: {
    type: Object,
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
    style: {}
  },
  fill: {
    type:'solid',
    opacity: [0.25,1],
  },
  labels: props.labels,
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
  },
  markers: {
    size: 1
  },
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
    text: props.title,
    align: 'center',
    floating: true
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {}
  }
}
if (props.title === 'Calidad General') {
  chartOptions.dataLabels.style = {
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
  chartOptions.tooltip.y = {
    formatter: function (y) {
      if (typeof y !== "undefined") {
        return y.toFixed(0) + " puntos";
      }
      return y;
    }
  }
}
if (props.title === 'Temperatura') {
  chartOptions.tooltip.y = {
    formatter: function (y) {
      if (typeof y !== "undefined") {
        return y.toFixed(0) + " ºC";
      }
      return y;
    }
  }
}
if (props.title === 'Oxígeno Disuelto' || props.title === 'Nitratos' || props.title === 'Amonio' || props.title === 'Ortofosfatos') {
  chartOptions.tooltip.y = {
    formatter: function (y) {
      if (typeof y !== "undefined") {
        return y.toFixed(2) + " mg/L";
      }
      return y;
    }
  }
}
if (props.title === 'Turbidez') {
  chartOptions.tooltip.y = {
    formatter: function (y) {
      if (typeof y !== "undefined") {
        return y.toFixed(0) + " JTU";
      }
      return y;
    }
  }
}
if (props.title === 'Calidad de Bosque de Ribera' || props.title === 'Calidad Hidromorfológica') {
  chartOptions.tooltip.y = {
    formatter: function (y) {
      if (typeof y !== "undefined") {
        return y.toFixed(0) + " pts";
      }
      return y;
    }
  }
  if (props.title === 'Calidad Hidromorfológica') {
    chartOptions.dataLabels.style = {
      colors: [function ({ seriesIndex,dataPointIndex,  w }) {
        if (w.config.series[seriesIndex].data[dataPointIndex] > 100) {
          return "#5b961e";
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 85) {
          return "#92d050";
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 47) {
          return "#f6f602"
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 13) {
          return "#ffc000"
        } else if (w.config.series[seriesIndex].data[dataPointIndex] <= 12) {
          return "#e92312"
        }
      }]
    }
  }
  if (props.title === 'Calidad de Bosque de Ribera') {
    chartOptions.dataLabels.style = {
      colors: [function ({ seriesIndex,dataPointIndex,  w }) {
        if (w.config.series[seriesIndex].data[dataPointIndex] > 95) {
          return "#5b961e";
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 75) {
          return "#92d050";
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 55) {
          return "#f6f602"
        } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 30) {
          return "#ffc000"
        } else if (w.config.series[seriesIndex].data[dataPointIndex] <= 29) {
          return "#e92312"
        }
      }]
    }
  }
}
if (props.title === 'Macroinvertebrados') {
  chartOptions.tooltip.y = {
    formatter: function (y) {
      if (typeof y !== "undefined") {
        return y.toFixed(2) + " pts";
      }
      return y;
    }
  }
  chartOptions.dataLabels.style = {
    colors: [function ({ seriesIndex,dataPointIndex,  w }) {
      if (w.config.series[seriesIndex].data[dataPointIndex] >= 6.1) {
        return "#5b961e";
      } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 5.1) {
        return "#92d050";
      } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 4.1) {
        return "#f6f602"
      } else if (w.config.series[seriesIndex].data[dataPointIndex] >= 3.1) {
        return "#ffc000"
      } else if (w.config.series[seriesIndex].data[dataPointIndex] <= 3) {
        return "#e92312"
      }
    }]
  }
}
if (props.title === 'Caudal') {
  chartOptions.tooltip.y = {
    formatter: function (y) {
      if (typeof y !== "undefined") {
        return y.toFixed(2) + " m³/s";
      }
      return y;
    }
  }
}
</script>

<template>
  <VueApexCharts
    type="line"
    height="400"
    :options="chartOptions"
    :series="props.series"
  />
</template>
