<script setup>
const props = defineProps({
  projectData: {
    type: Object,
    required: true,
  },
  usersData: {
    type: Array,
    required: true,
  },
  referenceSiteData: {
    type: Object,
    required: false,
  }
})

const projectData = ref(structuredClone(toRaw(props.projectData)))
const referenceSiteData = ref(structuredClone(toRaw(props.referenceSiteData ? props.referenceSiteData.answers : [])))
const referenceSite = referenceSiteData.value.filter(function(rfs) { return rfs._id == projectData.value.sitio_referencia_id })
const usersData = ref(structuredClone(toRaw(props.usersData)))
const user = usersData.value.filter(function(u) { return u._id == projectData.value.user_id })
const ignoreKeys = [
  '_id',
  'project_id',
  'es_sitio_referencia',
  'nombre_sitio',
  'create_date',
]
const items = []
Object.keys(projectData.value).forEach(key => {
  if (key === 'user_id') {
    items.push({
      title: 'usuario',
      subtitle: user[0]?.full_name,
    })
    items.push({
      type: 'divider',
    })
  } else if (key === 'fotografia1' || key === 'fotografia2') {
    items.push({
      title: key,
      subtitle: `<a href="${projectData.value[key]}" target="_blank">${projectData.value[key]}</a>`,
    })
    items.push({
      type: 'divider',
    })
  } else if (key === 'macroinvertebrados' || key === 'secciones') {
    let opt = projectData.value[key]
    let list = ''
    opt.forEach(opt => {
      list += '<li>'
      Object.keys(opt).forEach((i,n) => {
        list += n === 0 ? `<b>${i}</b>: ${opt[i]}` : `, <b>${i}</b>: ${opt[i]}`
      })
      list += '</li>'
    })
    items.push({
      title: key,
      subtitle: `<ul>${list}</ul>`,
    })
    items.push({
      type: 'divider',
    })
  } else if (key === 'fecha') {
    const date = new Date(projectData.value[key])
    items.push({
      title: key,
      subtitle: date.toString(),
    })
    items.push({
      type: 'divider',
    })
  } else if (key === 'archivos_adjuntos') {
    let attachments = projectData.value[key]
    let list = ''
    attachments.forEach(att => {
      list += `<li><a href="${att}" target="_blank">"${att}</a></li>`
    })
    items.push({
      title: key,
      subtitle: `<ul>${list}</ul>`,
    })
  } else if (key === 'sitio_referencia_id') {
    items.push({
      title: 'sitio_de_referencia',
      subtitle: referenceSite[0] ? referenceSite[0].nombre_sitio : 'N/A',
    })
    items.push({
      type: 'divider',
    })
  } else if (!(ignoreKeys.includes(key))) {
    items.push({
      title: key,
      subtitle: projectData.value[key],
    })
    items.push({
      type: 'divider',
    })
  }
})
</script>

<template>
  <VList
    :lines="false"
    :items="items"
    item-props
  >
    <template #subtitle="{ subtitle }">
      <div v-html="subtitle" />
    </template>
  </VList>
</template>
