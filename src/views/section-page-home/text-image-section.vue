<script setup>
    import boyWithLogo from '@images/pages/image-aft-1.png'
</script>

<template>
    <div id="faq">
        <VContainer>
            <!-- 👉 Header  -->
            <div class="faq-section">
                <VRow class="align-center">
                    <VCol cols="12" md="6">
                        <div class="headers flex-column">
                            <h2 class="text-h2 text-primary mb-4">
                                Mục Tiêu của AFT
                            </h2>
                            <div class="text-body-1 mb-5">
                                <p>
                                    Hiệp hội Thực phẩm Minh bạch (AFT) là một tổ chức xã hội nghề nghiệp, hoạt động vì cộng đồng nhà sản xuất, vì nền sản xuất thực phẩm an toàn, minh bạch, không lệ thuộc hóa chất.
                                </p>
                                <p>
                                    Là nơi hội tụ của các nhà sản xuất nông nghiệp chân chính, tử tế, các nhà kinh doanh, chế biến thực phẩm minh bạch, có uy tín, và cả những người tiêu dùng thông minh, tiêu dùng có trách nhiệm.
                                </p>
                            </div>
                            <VBtn>Tìm hiểu thêm</VBtn>
                        </div>
                    </VCol>

                    <VCol cols="12" md="6" >
                          <div class="pt-10 d-flex align-center justify-center h-100">
                              <VImg
                                :src="boyWithLogo"
                                height="522"
                                width="654"
                              />
                          </div>
                    </VCol>
                </VRow>
            </div>
        </VContainer>
    </div>
</template>

<style lang="scss" scoped>
    
</style>

