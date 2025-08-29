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
</script>

<template>
    <div class="box-sponsor">
        <swiper-container
            navigation="true"
            slides-per-view="5"
            space-between="10"
            events-prefix="swiper-"
            :breakpoints="{
                1024: {
                  slidesPerView: 5,
                },
                768: {
                  slidesPerView: 4,
                },
                640: {
                  slidesPerView: 3,
                },
                320: {
                  slidesPerView: 2,
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
    </div>
</template>

<style lang="scss" scoped>
    .box-sponsor{
        background-color: #ffffff;
        border-radius: 7px;
        overflow: hidden;
    }
    .box-sponsor .swiper-button-next, .box-sponsor .swiper-button-prev{
        width: 20px;
        height: 20px;
    }
</style>