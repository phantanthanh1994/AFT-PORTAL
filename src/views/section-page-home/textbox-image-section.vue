<script setup>
    import boyWithLogo from '@images/pages/image-map-vietnam.png'
</script>

<template>
    <div class="py-15 section-bg-img-2">
        <div class="px-5 px-lg-15">
            <VContainer>
                <div class="faq-section">
                    <VRow class="align-center">
                        <VCol cols="12" md="6" >
                              <div class="pt-10 d-flex align-center justify-center h-100">
                                  <VImg
                                    :src="boyWithLogo"
                                    height="792"
                                    width="544"
                                  />
                              </div>
                        </VCol>
                        <VCol cols="12" md="6">
                            <VCard class="box-primary">
                                <VCardText class="text-white">
                                    <h2 class="text-h2 text-white text-center mb-4">Bản đồ doanh nghiệp</h2>
                                    <VRow class="justify-center">
                                        <VCol cols="12" md="4" >
                                            <h3 class="text-h1 text-white font-weight-bold">
                                                100+
                                            </h3>
                                            <p class="font-weight-medium mb-0 text-wrap">
                                                Hội viên tham gia
                                            </p>
                                        </VCol>
                                        <VCol cols="12" md="4" >
                                            <h3 class="text-h1 text-white font-weight-bold">
                                                40+
                                            </h3>
                                            <p class="font-weight-medium mb-0 text-wrap">
                                                Hội viên đạt huy hiệu AFT
                                            </p>
                                        </VCol>
                                    </VRow>
                                </VCardText>
                            </VCard>
                        </VCol>
                    </VRow>
                </div>
            </VContainer>
        </div>
        <div style="padding-bottom: 200px;"></div>
    </div>
</template>

<style lang="scss" scoped>
    .section-bg-img-2{
        position: relative;
        background-color: #fff;
        background-image: url(images/bg-section-2.png);
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center;
    }
    .section-bg-img-2:before{
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
    }
    .box-primary{
        background-color: #209547;
    }
</style>

