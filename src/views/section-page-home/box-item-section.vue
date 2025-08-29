<script setup>
import paperPlane from '@images/front-pages/icons/Trade.png'
import plane from '@images/front-pages/icons/Invest.png'
import shuttleRocket from '@images/front-pages/icons/Technology.png'

const annualMonthlyPlanPriceToggler = ref(true)

const pricingPlans = [
    {
        title: 'Giao thương',
        image: paperPlane,
        text: 'Kết nối bên mua và nhà cung cấp trong chuỗi nông sản minh bạch. Đăng sản phẩm, gửi yêu cầu báo giá và theo dõi giao dịch dễ dàng, an toàn.',
        btnText: 'Khám phá giao thương',
        btnLink: 'giao-thuong',
        current: false,
    },
    {
        title: 'Đầu tư',
        image: plane,
        text: 'Cổng kết nối nhà đầu tư với các dự án nông nghiệp sạch và bền vững. Cập nhật tiến độ – báo cáo minh bạch – hiệu quả rõ ràng.',
        btnText: 'Xem dự án đầu tư',
        btnLink: 'dau-tu',
        current: false,
    },
    {
        title: 'Chuyển giao công nghệ',
        image: shuttleRocket,
        text: 'Giới thiệu – kết nối – ứng dụng các mô hình, công nghệ tiên tiến cho nông nghiệp. Hỗ trợ triển khai thực tế, đào tạo và tư vấn kỹ thuật.',
        btnText: 'Xem công nghệ mới',
        btnLink: 'chuyen-giao-cong-nghe',
        current: false,
    },
]
</script>

<template>
    <div id="pricing-plan">
        <VContainer>
            <div class="pricing-plans">
                <VRow>
                    <VCol
                      v-for="(plan, index) in pricingPlans"
                      :key="index"
                    >
                        <VCard :style="plan.current ? 'border:2px solid rgb(var(--v-theme-primary))' : ''">
                            <VCardText class="pa-8 pt-12">
                                <VImg
                                  :src="plan.image"
                                  width="224"
                                  height="224"
                                  class="mx-auto mb-8"
                                />
                                <h3 class="text-h4 text-center text-primary mb-4">
                                    {{ plan.title }}
                                </h3>
                                <div class="card-text text-center">
                                    {{plan.text}}
                                </div>
                                <VBtn
                                    block
                                    class="mt-8"
                                    color="primary"
                                    :to="plan.btnLink"
                                >
                                    {{plan.btnText}}
                                </VBtn>
                            </VCardText>
                        </VCard>
                    </VCol>
                </VRow>
            </div>
        </VContainer>
    </div>
</template>

<style lang="scss" scoped>
    
</style>
