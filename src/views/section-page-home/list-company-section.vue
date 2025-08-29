<script setup lang="ts">
    import { register } from 'swiper/element/bundle'
    import swiper1 from '@images/banner/partner-1.png'
    import swiper2 from '@images/banner/partner-2.png'
    import swiper3 from '@images/banner/partner-3.png'
    import swiper4 from '@images/banner/partner-4.png'
    import swiper5 from '@images/banner/partner-5.png'
    import swiper6 from '@images/banner/partner-6.png'
    import swiper7 from '@images/banner/partner-7.png'
    import swiper8 from '@images/banner/partner-8.png'
    import swiper9 from '@images/banner/partner-9.png'
    import swiper10 from '@images/banner/partner-10.png'
    import swiper11 from '@images/banner/partner-11.png'

    register()
</script>

<template>
  <swiper-container
    slides-per-view="11"
    space-between="25"
    events-prefix="swiper-"
    :breakpoints="{
        1024: {
          slidesPerView: 11,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 6,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        320: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
    }"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper1,
        swiper2,
        swiper3,
        swiper4,
        swiper5,
        swiper6,
        swiper7,
        swiper8,
        swiper9,
        swiper10,
        swiper11,
        swiper7,
        swiper2,
      ]"
      :key="swiperImg"
    >
      <VImg :src="swiperImg" />
    </swiper-slide>
  </swiper-container>
</template>