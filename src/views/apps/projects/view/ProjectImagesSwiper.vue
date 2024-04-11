<script setup>
import { register } from 'swiper/element/bundle'
import swiper31 from '@images/banner/banner-31.jpg'
import swiper32 from '@images/banner/banner-32.jpg'
import swiper33 from '@images/banner/banner-33.jpg'
import swiper34 from '@images/banner/banner-34.jpg'
import swiper35 from '@images/banner/banner-35.jpg'

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
console.log(image1.value, image2.value)

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
