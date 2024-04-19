<script setup>
import { ref } from 'vue'
import AppSelect from "@core/components/app-form-elements/AppSelect.vue"

const props = defineProps({
  estados: Array,
  sitios: Array,
  onFilter: Function,
})

const selectedEstado = ref(null)
const selectedSitio = ref(null)
const selectedFecha = ref(null)

const emitFilter = () => {
  props.onFilter({
    estados: selectedEstado.value,
    sitio: selectedSitio.value,
    fecha: selectedFecha.value,
  })
}
</script>

<template>
  <div class="filters">
    <AppSelect
      v-model="selectedEstado"
      style="max-inline-size: 14.5rem;min-inline-size: 14.5rem;"
      :items="estados"
      @update:model-value="emitFilter"
    />
    <AppSelect
      v-model="selectedSitio"
      style="max-inline-size: 14.5rem;min-inline-size: 14.5rem;"
      :items="sitios"
      @update:model-value="emitFilter"
    />
    <input type="date" v-model="selectedFecha" @change="emitFilter">
  </div>
</template>

<style scoped>
.filters select, .filters input {
  margin-right: 10px;
}
</style>
