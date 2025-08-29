<script setup>
import img1 from '@images/products/img-cat-product-1.png'
import img2 from '@images/products/img-cat-product-2.png'
import img3 from '@images/products/img-cat-product-3.png'
import img4 from '@images/products/img-cat-product-4.png'
import img5 from '@images/products/img-cat-product-5.png'
import img6 from '@images/products/img-cat-product-6.png'

const annualMonthlyPlanPriceToggler = ref(true)

const pricingPlans = [
    {
        title: 'Rau củ',
        image: img1,
        btnLink: 'giao-thuong',
        current: false,
    },
    {
        title: 'Trái cây',
        image: img2,
        btnLink: 'dau-tu',
        current: false,
    },
    {
        title: 'Cà phê',
        image: img3,
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
    {
        title: 'Ngũ cốc',
        image: img4,
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
    {
        title: 'Dược liệu',
        image: img5,
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
    {
        title: 'Gạo',
        image: img6,
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
]
</script>

<template>
    <div class="category-products section mb-4">
        <VContainer class="py-0">
            <div class="category-products-box pa-3">
                <div class="headers d-flex justify-space-between align-center px-3 mb-4">
                    <h2 class="text-h3 text-primary">Sản phẩm mua nhiều trong tháng</h2>
                    <VBtn variant="plain">Xem tất cả<VIcon end icon="tabler-chevron-right" /></VBtn>
                </div>
                <VRow>
                    <VCol cols="12" md="2"
                      v-for="(plan, index) in pricingPlans"
                      :key="index"
                    >
                        <a class="d-block px-6" href="/">
                            <div class="box-image mb-2">
                                <div class="image-cover">
                                    <img :src="plan.image" class="mx-auto mb-2"/>
                                </div>
                            </div>
                            <h3 class="text-h5 text-center">
                                {{ plan.title }}
                            </h3>
                        </a>
                    </VCol>
                </VRow>
            </div>
        </VContainer>
    </div>
</template>

<style lang="scss" scoped>
    .category-products.section .category-products-box{
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
    }
    .category-products-box .box-image{
        border-radius: 99px;
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
