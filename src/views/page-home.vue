<script setup>
import Header from '@/views/header.vue'
import Footer from '@/views/footer.vue'
import HeroSection from '@/views/front-pages/landing-page/hero-section.vue'
import ListCompanySection from '@/views/section-page-home/list-company-section.vue'
import TextImageSection from '@/views/section-page-home/text-image-section.vue'
import TextBoxImageSection from '@/views/section-page-home/textbox-image-section.vue'
import BoxItemSection from '@/views/section-page-home/box-item-section.vue'
import BoxProductSection from '@/views/section-page-home/box-product-section.vue'
import BoxPostSection from '@/views/section-page-home/box-post-section.vue'
import { useConfigStore } from '@core/stores/config'

const store = useConfigStore()

store.skin = 'default'
definePage({
  meta: {
        layout: 'blank',
        public: true,
  },
})

const activeSectionId = ref()
const refHome = ref()
const refFeatures = ref()
const refTeam = ref()
const refContact = ref()
const refFaq = ref()

useIntersectionObserver([
  refHome,
  refFeatures,
  refTeam,
  refContact,
  refFaq,
], ([{ isIntersecting, target }]) => {
  if (isIntersecting)
    activeSectionId.value = target.id
}, { threshold: 0.25 })
</script>

<template>
  <div class="landing-page-wrapper">
    <Header :active-id="activeSectionId" />

    <HeroSection />

    <div class="py-3" :style="{ 'background-color': '#ffffff' }">
        <div class="px-5 px-lg-15">
            <ListCompanySection />
        </div>
    </div>

    <div class="py-12" :style="{ 'background-color': '#F2FCF6' }">
        <div class="px-5 px-lg-15">
            <TextImageSection />
        </div>
    </div>

    <div class="py-15" :style="{ 'background-color': '#209547' }">
        <div class="px-5 px-lg-15">
            <BoxItemSection />
        </div>
    </div>

    <TextBoxImageSection />

    <BoxProductSection />

    <BoxPostSection />

    <!-- 👉 Footer -->
    <Footer />
  </div>
</template>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
  .landing-page-wrapper {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>

