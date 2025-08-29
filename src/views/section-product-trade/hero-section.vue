<script setup>
import { register } from 'swiper/element/bundle'
import swiper1 from '@images/banner/banner-aft-1.jpg'
import swiper2 from '@images/banner/banner-hero-2.png'

register()
</script>

<template>
    <div class="hero-banner section my-4">
        <VContainer class="py-0">
            <div class="hero-banner-box">
                <swiper-container
                    pagination="true"
                    events-prefix="swiper-"
                >
                    <swiper-slide
                        v-for="swiperImg in [
                            swiper2,
                            swiper1
                        ]"
                        :key="swiperImg"
                    >
                        <div class="image-cover" style="padding-top: 34%;">
                            <img :src="swiperImg" />
                        </div>
                    </swiper-slide>
                </swiper-container>
            </div>
        </VContainer>
    </div>
</template>

<style lang="scss" scoped>
    .hero-banner-box{
        border-radius: 10px;
        overflow: hidden;
    }
    .image-cover{
        background-position: 50% 50%;
        background-size: cover;
        height: auto;
        overflow: hidden;
        padding-top: 100%;
        position: relative;
    }
    .image-cover img{
        bottom: 0;
        font-family: "object-fit: cover;";
        height: 100%;
        left: 0;
        -o-object-fit: cover;
        object-fit: cover;
        -o-object-position: 50% 50%;
        object-position: 50% 50%;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
    }
</style>
