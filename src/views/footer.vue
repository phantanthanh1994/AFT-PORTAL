<script setup>
    import ListSponsor from '@/views/partials/sponsor.vue'
    import appleImg from '@images/front-pages/landing-page/apple-icon.png'
    import googlePlayImg from '@images/front-pages/landing-page/google-play-icon.png'
    import footerDarkBg from '@images/front-pages/backgrounds/footer-bg-dark.png'
    import footerLightBg from '@images/front-pages/backgrounds/footer-bg-light.png'
    import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
    import { themeConfig } from '@themeConfig'

    const footerBg = useGenerateImageVariant(footerLightBg, footerDarkBg)

    const pagesList = [
        {
            name: 'Điều lệ AFT',
            to: {name: 'front-pages-pricing'},
        },
        {
            name: 'Quy tắc hiệp hội',
            to: {name: 'front-pages-payment'},
            isNew: true,
        },
        {
            name: 'Cơ chế kiểm tra, giám sát chéo',
            to: {name: 'front-pages-checkout'},
        },
        {
            name: 'Bộ tiêu chuẩn minh bạch',
            to: {name: 'front-pages-help-center'},
        },
    ]

    const demoList = [
        {
            title: 'Trang chủ',
            to: '/',
        },
        {
            title: 'Giao thương',
            to: '/giao-thuong',
        },
        {
            title: 'Đầu tư',
            to: '/dau-tu',
        },
        {
            title: 'Chuyển giao công nghệ',
            to: '/chuyen-giao-cong-nghe',
        },
        {
            title: 'Hoạt động - Sự kiện',
            to: '/hoat-dong-su-kien',
        },
        {
            title: 'Tin tức - Tri thức',
            to: '/tin-tuc-tri-thuc',
        },
        {
            title: 'Giới thiệu',
            to: '/gioi-thieu',
        },
        {
            title: 'Tham gia cùng AFT',
            to: '/tham-gia-cung-aft',
        },
    ]
</script>

<template>
    <div class="footer">
        <div class="footer-top pt-11 pb-16">
            <VContainer>
                <VRow>
                    <!-- 👉 Footer  -->
                    <VCol cols="12" md="6">
                        <div class="mb-4" :class="$vuetify.display.smAndDown ? 'w-100' : 'w-75'">
                            <div class="app-logo mb-6">
                                <VNodeRenderer :nodes="themeConfig.app.logo" />
                            </div>

                            <div class="mb-6" :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'">
                                <p>P.09 Tòa nhà A - Viện Nghiên Cứu Nuôi Trồng Thủy Sản 2 - 116 Nguyễn Đình Chiểu, Đa Kao, Quận 1, Thành phố Hồ Chí Minh</p>
                                <p>HOTLINE: 0944 815 995</p>
                                <p>Email: info@thucphamminhbach.org</p>
                            </div>
                            <div><ListSponsor /></div>
                        </div>
                    </VCol>

                    <!-- 👉 Demos -->
                    <VCol md="3" sm="4" xs="6">
                        <div class="footer-links">
                            <h6 class="footer-title text-h6 mb-6">
                                Menu
                            </h6>
                            <ul style="list-style: none;">
                                <li
                                    v-for="(item, index) in demoList"
                                    :key="index"
                                    class="mb-4"
                                    >
                                    <a
                                        :href="item.to"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
                                        >
                                        {{ item.title }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </VCol>

                    <!-- 👉 Pages  -->
                    <VCol md="3" sm="4" xs="6">
                        <div class="footer-links">
                            <h6 class="footer-title text-h6 mb-6">
                                Chính sách
                            </h6>
                            <ul style="list-style: none;">
                                <li
                                    v-for="(item, index) in pagesList"
                                    :key="index"
                                    class="mb-4"
                                    >
                                <RouterLink
                                    :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
                                    class="me-2"
                                    :to="item.to"
                                    >
                                    {{ item.name }}
                                </RouterLink>
                                <template v-if="item.isNew">
                                    <VChip
                                        color="primary"
                                        variant="elevated"
                                        label
                                        size="small"
                                        >
                                        New
                                    </VChip>
                                </template>
                                </li>
                            </ul>
                        </div>
                        <div class="mt-6">
                            <h6 class="footer-title text-h6 mb-6">
                                Kết nối với chúng tôi
                            </h6>

                            <div>
                                <VBtn
                                    v-for="(item, index) in [
                                    { image: appleImg, store: 'App Store' },
                                    { image: googlePlayImg, store: 'Google Play' },
                                    ]"
                                    :key="index"
                                    color="#282c3e"
                                    height="56"
                                    class="mb-4 d-block"
                                    >
                                    <template #default>
                                        <div class="d-flex align-center gap-x-8 footer-logo-buttons">
                                            <VImg
                                                :src="item.image"
                                                height="34"
                                                width="34"
                                                />
                                            <div class="d-flex flex-column justify-content-start">
                                                <div :class="$vuetify.theme.current.dark ? 'text-body-2' : 'text-white-variant text-body-2'">
                                                    Download on the
                                                </div>
                                                <h6
                                                    class="text-h6 text-start"
                                                    :class="$vuetify.theme.current.dark ? 'text-body-1' : 'footer-title'"
                                                    >
                                                    {{ item.store }}
                                                </h6>
                                            </div>
                                        </div>
                                    </template>
                                </VBtn>
                            </div>
                        </div>
                    </VCol>
                </VRow>
            </VContainer>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    .footer-title {
        color: rgba(255, 255, 255, 92%);
    }

    .footer-top {
        background-color: rgba(var(--v-theme-primary));
        border-radius: 60px 60px 0 0;
        background-size: 88%;
        color: #fff;
        background-image: url(images/bg-footer.svg);
        background-repeat: no-repeat;
        background-position-y: bottom;
    }

    .footer-links {
        .text-white-variant,
        .text-body-1 {
            &:hover {
                color: #fff;
            }
        }
    }

    .footer-line {
        background: #282c3e;
    }
</style>

<style lang="scss">
    .subscribe-form {
        .v-label {
            color: rgba(225, 222, 245, 90%) !important;
        }

        .v-field {
            border-end-end-radius: 0;
            border-end-start-radius: 10px;
            border-start-end-radius: 0;
            border-start-start-radius: 10px;

            input.v-field__input::placeholder {
                color: rgba(225, 222, 245, 40%) !important;
            }

            input.v-field__input {
                color: rgba(255, 255, 255, 78%);
            }
        }
    }

    .footer {
        border-radius: 50%;

        @media (min-width: 600px) and (max-width: 960px) {
            .v-container {
                padding-inline: 2rem !important;
            }

            .footer-logo-buttons {
                gap: 0.75rem;
            }
        }
    }
</style>