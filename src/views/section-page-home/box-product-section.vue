<script setup>
import product1 from '@images/products/img-product-1.png'
import product2 from '@images/products/img-product-2.png'
import product3 from '@images/products/img-product-3.png'
import product4 from '@images/products/img-product-4.png'
import product5 from '@images/products/img-product-5.png'
import product6 from '@images/products/img-product-6.png'
import product7 from '@images/products/img-product-7.png'
import product8 from '@images/products/img-product-8.png'
import dautu1 from '@images/products/ing-dau-tu-1.png'
import dautu2 from '@images/products/ing-dau-tu-2.png'
import dautu3 from '@images/products/ing-dau-tu-3.png'
import AFTCARE from '@images/icons/AFTCARE.png'

const currentTabdautu = ref('item-nha-dau-tu')
const currentTabchuyengiao = ref('item-giai-phap-cong-nghe')
const rating = ref(4.5)

const annualMonthlyPlanPriceToggler = ref(true)

const pricingPlans = [
    {
        title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
        image: product1,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'giao-thuong',
        current: false,
    },
    {
        title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
        image: product2,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'dau-tu',
        current: false,
    },
    {
        title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
        image: product3,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
    {
        title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
        image: product4,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
    {
        title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
        image: product5,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
    {
        title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
        image: product6,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
    {
        title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
        image: product7,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
    {
        title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
        image: product8,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
]

const dautus = [
    {
        title: 'Green Future Capital',
        image: dautu1,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'giao-thuong',
        current: false,
    },
    {
        title: 'Green Future Capital',
        image: dautu2,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'dau-tu',
        current: false,
    },
    {
        title: 'Green Future Capital',
        image: dautu3,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
]

const chuyengiaos = [
    {
        title: 'Máy bay phun thuốc tự động',
        des: 'Giải pháp bay điều khiển thông minh tích hợp AI, tiết kiệm 40......',
        image: product1,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'giao-thuong',
        current: false,
    },
    {
        title: 'Máy bay phun thuốc tự động',
        des: 'Giải pháp bay điều khiển thông minh tích hợp AI, tiết kiệm 40......',
        image: product2,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'dau-tu',
        current: false,
    },
    {
        title: 'Máy bay phun thuốc tự động',
        des: 'Giải pháp bay điều khiển thông minh tích hợp AI, tiết kiệm 40......',
        image: product3,
        companyName: 'Công ty TNHH ACB',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
]
</script>

<template>
    <div class="pb-15" id="products-list">
        <VContainer>
            <VRow>
                <VCol cols="12" md="12">
                    <div class="product-section" style="margin-top: -200px;">
                        <div class="headers d-flex justify-center flex-column align-center">
                            <h2 class="text-center text-h2 mb-4 text-primary">
                                Sản phẩm nổi bật
                            </h2>
                        </div>
                        <VRow>
                            <VCol cols="12" md="3"
                              v-for="(plan, index) in pricingPlans"
                              :key="index"
                            >
                                <div class="product-item">
                                    <VCard class="border" style="box-shadow: none;">
                                        <a href="/">
                                            <div class="box-image">
                                                <div class="image-cover">
                                                    <img :src="plan.image" width="100" height="100" />
                                                </div>
                                            </div>
                                        </a>
                                        <VCardText class="pa-3">
                                            <h4 class="text-h5 mb-4 product-title">
                                                <a href="/">
                                                    {{ plan.title }}
                                                </a>
                                            </h4>
                                            <div class="card-text">
                                                <div class="list-attr mb-1">
                                                    <div class="item-attr">
                                                        <span class="lable-attr">Đặt tối thiểu: </span>
                                                        <span class="font-weight-bold">1 Tấn</span>
                                                    </div>
                                                </div>
                                                <div class="company-name">{{plan.companyName}}</div>
                                            </div>
                                            <VBtn
                                                block
                                                variant="outlined"
                                                class="mt-4"
                                                color="primary"
                                                :to="plan.btnLink"
                                            >
                                                Gửi yêu cầu ngay
                                            </VBtn>
                                        </VCardText>
                                    </VCard>
                                </div>
                            </VCol>
                        </VRow>
                        <div class="text-center">
                            <VBtn class="mt-4" color="primary">Xem tất cả</VBtn>
                        </div>
                    </div>
                </VCol>
                <VCol cols="12" md="6">
                    <div class="product-section">
                        <div class="headers d-flex justify-center flex-column align-center">
                            <h2 class="text-center text-h2 mb-2 text-primary">
                                Đầu tư
                            </h2>
                        </div>
                        <VTabs class="mb-4" align-tabs="center" v-model="currentTabdautu">
                            <VTab>Nhà đầu tư</VTab>
                            <VTab>Kêu gọi đầu tư</VTab>
                        </VTabs>
                        <VWindow v-model="currentTabdautu">
                            <VWindowItem key="item-nha-dau-tu" value="item-nha-dau-tu">
                                <VRow>
                                    <VCol cols="12" md="4"
                                      v-for="(plan, index) in dautus"
                                      :key="index"
                                    >
                                        <div class="product-item invest-item">
                                            <VCard class="border" style="box-shadow: none;">
                                                <a href="/">
                                                    <div class="box-image text-center">
                                                        <img :src="plan.image" width="100" height="100" />
                                                    </div>
                                                </a>
                                                <VCardText class="pa-3">
                                                    <h4 class="text-h5 mb-2 product-title">
                                                        <a href="/">
                                                            {{ plan.title }}
                                                        </a>
                                                    </h4>
                                                    <div class="text-center"><img :src="AFTCARE" width="122" height="33" /></div>
                                                    <div class="text-center mb-2"><VRating size="x-small" v-model="rating" density="compact" /></div>
                                                    <div class="card-text">
                                                        <div class="list-attr mb-1">
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Loại hình: </span>
                                                                <span class="font-weight-bold">Nhà đầu tư thiên thần</span>
                                                            </div>
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Ngân sách đầu tư: </span>
                                                                <span class="font-weight-bold">500 triệu – 5 tỷ</span>
                                                            </div>
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Lĩnh vực ưu tiên: </span>
                                                                <span class="font-weight-bold">Trồng trọt công nghệ cao</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <VBtn
                                                        block
                                                        variant="outlined"
                                                        class="mt-4"
                                                        color="primary"
                                                        :to="plan.btnLink"
                                                    >
                                                        Gửi yêu cầu ngay
                                                    </VBtn>
                                                </VCardText>
                                            </VCard>
                                        </div>
                                    </VCol>
                                </VRow>
                                <div class="text-center">
                                    <VBtn class="mt-4" color="primary">Xem tất cả</VBtn>
                                </div>
                            </VWindowItem>
                            <VWindowItem key="item-kieu-goi-dau-tu" value="item-kieu-goi-dau-tu">
                                <VRow>
                                    <VCol cols="12" md="4"
                                      v-for="(plan, index) in dautus"
                                      :key="index"
                                    >
                                        <div class="product-item invest-item">
                                            <VCard class="border" style="box-shadow: none;">
                                                <a href="/">
                                                    <div class="box-image text-center">
                                                        <img :src="plan.image" width="100" height="100" />
                                                    </div>
                                                </a>
                                                <VCardText class="pa-3">
                                                    <h4 class="text-h5 mb-2 product-title">
                                                        <a href="/">
                                                            {{ plan.title }}
                                                        </a>
                                                    </h4>
                                                    <div class="text-center"><img :src="AFTCARE" width="122" height="33" /></div>
                                                    <div class="text-center mb-2"><VRating size="x-small" v-model="rating" density="compact" /></div>
                                                    <div class="card-text">
                                                        <div class="list-attr mb-1">
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Loại hình: </span>
                                                                <span class="font-weight-bold">Nhà đầu tư thiên thần</span>
                                                            </div>
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Ngân sách đầu tư: </span>
                                                                <span class="font-weight-bold">500 triệu – 5 tỷ</span>
                                                            </div>
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Lĩnh vực ưu tiên: </span>
                                                                <span class="font-weight-bold">Trồng trọt công nghệ cao</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <VBtn
                                                        block
                                                        variant="outlined"
                                                        class="mt-4"
                                                        color="primary"
                                                        :to="plan.btnLink"
                                                    >
                                                        Gửi yêu cầu ngay
                                                    </VBtn>
                                                </VCardText>
                                            </VCard>
                                        </div>
                                    </VCol>
                                </VRow>
                                <div class="text-center">
                                    <VBtn class="mt-4" color="primary">Xem tất cả</VBtn>
                                </div>
                            </VWindowItem>
                        </VWindow>
                    </div>
                </VCol>
                <VCol cols="12" md="6">
                    <div class="product-section">
                        <div class="headers d-flex justify-center flex-column align-center">
                            <h2 class="text-center text-h2 mb-2 text-primary">
                                Chuyển giao công nghệ
                            </h2>
                        </div>
                        <VTabs class="mb-4" align-tabs="center" v-model="currentTabchuyengiao">
                            <VTab>Giải pháp công nghệ</VTab>
                            <VTab>Nhu cầu chuyển giao</VTab>
                        </VTabs>
                        <VWindow v-model="currentTabchuyengiao">
                            <VWindowItem key="item-giai-phap-cong-nghe" value="item-giai-phap-cong-nghe">
                                <VRow>
                                    <VCol cols="12" md="4"
                                      v-for="(plan, index) in chuyengiaos"
                                      :key="index"
                                    >
                                        <div class="product-item technology-item">
                                            <VCard class="border" style="box-shadow: none;">
                                                <a href="/">
                                                    <div class="box-image">
                                                        <div class="image-cover">
                                                            <img :src="plan.image" />
                                                        </div>
                                                    </div>
                                                </a>
                                                <VCardText class="pa-3">
                                                    <h4 class="text-h5 mb-2 product-title">
                                                        <a href="/">
                                                            {{ plan.title }}
                                                        </a>
                                                    </h4>
                                                    <div><p>{{plan.des}}</p></div>
                                                    <div class="card-text">
                                                        <div class="list-attr mb-1">
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Chi phí: </span>
                                                                <span class="font-weight-bold">Thỏa thuận</span>
                                                            </div>
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Lĩnh vực:</span>
                                                                <span class="font-weight-bold">Cây ăn trái, lúa</span>
                                                            </div>
                                                        </div>
                                                        <div class="company-name">{{plan.companyName}}</div>
                                                    </div>
                                                    <VBtn
                                                        block
                                                        variant="outlined"
                                                        class="mt-4"
                                                        color="primary"
                                                        :to="plan.btnLink"
                                                    >
                                                        Gửi yêu cầu ngay
                                                    </VBtn>
                                                </VCardText>
                                            </VCard>
                                        </div>
                                    </VCol>
                                </VRow>
                                <div class="text-center">
                                    <VBtn class="mt-4" color="primary">Xem tất cả</VBtn>
                                </div>
                            </VWindowItem>
                            <VWindowItem key="item-nhu-cau-chuyen-giao" value="item-nhu-cau-chuyen-giao">
                                <VRow>
                                    <VCol cols="12" md="4"
                                      v-for="(plan, index) in chuyengiaos"
                                      :key="index"
                                    >
                                        <div class="product-item">
                                            <VCard class="border" style="box-shadow: none;">
                                                <a href="/">
                                                    <div class="box-image">
                                                        <div class="image-cover">
                                                            <img :src="plan.image" />
                                                        </div>
                                                    </div>
                                                </a>
                                                <VCardText class="pa-3">
                                                    <h4 class="text-h5 mb-2 product-title">
                                                        <a href="/">
                                                            {{ plan.title }}
                                                        </a>
                                                    </h4>
                                                    <div><p>{{plan.des}}</p></div>
                                                    <div class="card-text">
                                                        <div class="list-attr mb-1">
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Chi phí: </span>
                                                                <span class="font-weight-bold">Thỏa thuận</span>
                                                            </div>
                                                            <div class="item-attr">
                                                                <span class="lable-attr">Lĩnh vực:</span>
                                                                <span class="font-weight-bold">Cây ăn trái, lúa</span>
                                                            </div>
                                                        </div>
                                                        <div class="company-name">{{plan.companyName}}</div>
                                                    </div>
                                                    <VBtn
                                                        block
                                                        variant="outlined"
                                                        class="mt-4"
                                                        color="primary"
                                                        :to="plan.btnLink"
                                                    >
                                                        Gửi yêu cầu ngay
                                                    </VBtn>
                                                </VCardText>
                                            </VCard>
                                        </div>
                                    </VCol>
                                </VRow>
                                <div class="text-center">
                                    <VBtn class="mt-4" color="primary">Xem tất cả</VBtn>
                                </div>
                            </VWindowItem>
                        </VWindow>
                    </div>
                </VCol>
            </VRow>
        </VContainer>
    </div>
</template>

<style lang="scss" scoped>
    #products-list{
        position: relative;
        background-color: #D9F7E3;
    }
    .product-section{
        background-color: #fff;
        border-radius: 10px;
        padding: 15px;
    }
    .product-item .image-cover{
        padding-top: 60%;
    }
    .product-item.technology-item .image-cover{
        padding-top: 84%;
    }
    .product-item .product-title a{
        color: #1A1A1A;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        align-self: stretch;
        overflow: hidden;
    }
    .item-attr{
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 7px;
    }
    .item-attr .font-weight-bold,
    .product-item .company-name{
        color: #1A1A1A;
    }
    .product-item .company-name{
        font-weight: bold;
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
