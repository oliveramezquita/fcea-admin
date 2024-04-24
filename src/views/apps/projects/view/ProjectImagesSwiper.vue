<script setup>
import { register } from 'swiper/element/bundle'

const props = defineProps({
  image1: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
  },
})
const image1 = ref(structuredClone(toRaw(props.image1)))
const image2 = ref(structuredClone(toRaw(props.image2)))
const images = ref([])

register()
</script>

<template>
  <swiper-container
    pagination="true"
    slides-per-view="3"
    space-between="25"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in images"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>
