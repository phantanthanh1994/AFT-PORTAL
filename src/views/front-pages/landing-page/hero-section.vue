<script setup>
import { register } from 'swiper/element/bundle'
import swiper1 from '@images/banner/banner-aft-1.jpg'

register()
</script>

<template>
    <swiper-container
        pagination="true"
        events-prefix="swiper-"
    >
        <swiper-slide
            v-for="swiperImg in [
                  swiper1,
            ]"
            :key="swiperImg"
        >
            <VImg :src="swiperImg" />
        </swiper-slide>
    </swiper-container>
</template>
