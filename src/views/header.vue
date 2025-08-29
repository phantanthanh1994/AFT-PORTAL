<script setup>
import { useWindowScroll } from '@vueuse/core'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'
import navImg from '@images/front-pages/misc/nav-item-col-img.png'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

import SearchBox from '@/components/SearchBox.vue'

const props = defineProps({ activeId: String })

const display = useDisplay()
const { y } = useWindowScroll()
const route = useRoute()
const router = useRouter()
const sidebar = ref(false)

watch(() => display, () => {
  return display.mdAndUp ? sidebar.value = false : sidebar.value
}, { deep: true })

const isMenuOpen = ref(false)
const isMegaMenuOpen = ref(false)

const slug = (s) =>
  s
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '') // chỉ giữ a-z 0-9, khoảng trắng và dấu -
    .replace(/\s+/g, '-')          // khoảng trắng -> -
    .replace(/-+/g, '-')           // gộp -- -> -
    .replace(/^-+|-+$/g, '')       // bỏ - đầu/cuối

const isActive = (label) => slug(label) === slug(props.activeId ?? '')

const menuItems = [
  {
    listTitle: 'Page',
    listIcon: 'tabler-layout-grid',
    navItems: [
      {
        name: 'Pricing',
        to: { name: 'front-pages-pricing' },
      },
      {
        name: 'Payment',
        to: { name: 'front-pages-payment' },
      },
      {
        name: 'Checkout',
        to: { name: 'front-pages-checkout' },
      },
      {
        name: 'Help Center',
        to: { name: 'front-pages-help-center' },
      },
    ],
  },
  {
    listTitle: 'Auth Demo',
    listIcon: 'tabler-lock-open',
    navItems: [
      {
        name: 'Login (Basic)',
        to: { name: 'pages-authentication-login-v1' },
      },
      {
        name: 'Login (Cover)',
        to: { name: 'pages-authentication-login-v2' },
      },
      {
        name: 'Register (Basic)',
        to: { name: 'pages-authentication-register-v1' },
      },
      {
        name: 'Register (Cover)',
        to: { name: 'pages-authentication-register-v2' },
      },
      {
        name: 'Register (Multi-steps)',
        to: { name: 'pages-authentication-register-multi-steps' },
      },
      {
        name: 'Forgot Password (Basic)',
        to: { name: 'pages-authentication-forgot-password-v1' },
      },
      {
        name: 'Forgot Password (Cover)',
        to: { name: 'pages-authentication-forgot-password-v2' },
      },
      {
        name: 'Reset Password (Basic)',
        to: { name: 'pages-authentication-reset-password-v1' },
      },
      {
        name: 'Reset Password (cover  )',
        to: { name: 'pages-authentication-reset-password-v2' },
      },
    ],
  },
  {
    listTitle: 'Other',
    listIcon: 'tabler-photo',
    navItems: [
      {
        name: 'Under Maintenance',
        to: { name: 'pages-misc-under-maintenance' },
      },
      {
        name: 'Coming Soon',
        to: { name: 'pages-misc-coming-soon' },
      },
      {
        name: 'Not Authorized',
        to: { path: '/not-authorized' },
      },
      {
        name: 'Verify Email (Basic)',
        to: { name: 'pages-authentication-verify-email-v1' },
      },
      {
        name: 'Verify Email (Cover)',
        to: { name: 'pages-authentication-verify-email-v2' },
      },
      {
        name: 'Two Steps (Basic)',
        to: { name: 'pages-authentication-two-steps-v1' },
      },
      {
        name: 'Two Steps (Cover)',
        to: { name: 'pages-authentication-two-steps-v2' },
      },
    ],
  },
]

const isCurrentRoute = to => {
  return route.matched.some(_route => _route.path.startsWith(router.resolve(to).path))

  // ℹ️ Below is much accurate approach if you don't have any nested routes

// return route.matched.some(_route => _route.path === router.resolve(to).path)
}

const isPageActive = computed(() => menuItems.some(item => item.navItems.some(listItem => isCurrentRoute(listItem.to))))
</script>

<template>
  <!-- 👉 Navigation drawer for mobile devices  -->
  <VNavigationDrawer
    v-model="sidebar"
    width="275"
    data-allow-mismatch
    disable-resize-watcher
  >
    <PerfectScrollbar
      :options="{ wheelPropagation: false }"
      class="h-100"
    >
      <!-- Nav items -->
      <div>
        <div class="d-flex flex-column gap-y-4 pa-4">
          <RouterLink
            v-for="(item, index) in ['Home', 'Features', 'Team', 'FAQ', 'Contact us']"
            :key="index"
            :to="{ name: 'front-pages-landing-page', hash: `#${item.toLowerCase().replace(' ', '-')}` }"
            class="nav-link font-weight-medium"
            :class="[props.activeId?.toLocaleLowerCase().replace('-', ' ') === item.toLocaleLowerCase() ? 'active-link' : '']"
          >
            {{ item }}
          </RouterLink>

          <div class="font-weight-medium cursor-pointer">
            <div
              :class="[isMenuOpen ? 'mb-6 active-link' : '', isPageActive ? 'active-link' : '']"
              style="color: rgba(var(--v-theme-on-surface));"
              class="page-link"
              @click="isMenuOpen = !isMenuOpen"
            >
              Pages <VIcon :icon="isMenuOpen ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
            </div>

            <div
              class="px-4"
              :class="isMenuOpen ? 'd-block' : 'd-none'"
            >
              <div
                v-for="(item, index) in menuItems"
                :key="index"
              >
                <div class="d-flex align-center gap-x-3 mb-4">
                  <VAvatar
                    variant="tonal"
                    color="primary"
                    rounded
                    :icon="item.listIcon"
                  />
                  <div class="text-body-1 text-high-emphasis font-weight-medium">
                    {{ item.listTitle }}
                  </div>
                </div>
                <ul class="mb-6">
                  <li
                    v-for="listItem in item.navItems"
                    :key="listItem.name"
                    style="list-style: none;"
                    class="text-body-1 mb-4 text-no-wrap"
                  >
                    <RouterLink
                      :to="listItem.to"
                      :target="item.listTitle === 'Page' ? '_self' : '_blank'"
                      class="mega-menu-item"
                      :class="isCurrentRoute(listItem.to) ? 'active-link' : 'text-high-emphasis'"
                    >
                      <VIcon
                        icon="tabler-circle"
                        :size="10"
                        class="me-2"
                      />
                      <span>  {{ listItem.name }}</span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <RouterLink
            to="/"
            target="_blank"
            class="font-weight-medium nav-link"
          >
            Admin
          </RouterLink>
        </div>
      </div>

      <!-- Navigation drawer close icon -->
      <VIcon
        id="navigation-drawer-close-btn"
        icon="tabler-x"
        size="20"
        @click="sidebar = !sidebar"
      />
    </PerfectScrollbar>
  </VNavigationDrawer>

  <!-- 👉 Navbar for desktop devices  -->
  <div class="front-page-navbar">
    <div class="front-page-navbar">
        <div id="masthead" class="header-main">
            <VContainer class="py-2">
                <div class="d-flex align-center">
                    <VAppBarTitle class="me-2 me-md-4 me-lg-6">
                        <RouterLink
                          to="/"
                          class="d-flex gap-x-4"
                          :class="$vuetify.display.mdAndUp ? 'd-none' : 'd-block'"
                        >
                          <div class="app-logo">
                            <VNodeRenderer :nodes="themeConfig.app.logo" />
                          </div>
                        </RouterLink>
                    </VAppBarTitle>
                    <div class="d-flex flex-fill">
                        <SearchBox
                              categories-endpoint="/get_product_category"
                              results-path="/search.html"
                              category-param="category_id"
                              keyword-param="q"
                        />
                        <IconBtn
                            color="white"
                            id="vertical-nav-toggle-btn"
                            class="ms-2 d-inline-block d-md-none"
                            @click="sidebar = !sidebar"
                          >
                            <VIcon
                              size="26"
                              icon="tabler-menu-2"
                              color="white"
                            />
                          </IconBtn>
                    </div>
                    <div class="d-none d-md-flex">
                        <div class="v-list-item py-0">
                            <div class="v-list-item__prepend">
                                <div class="v-avatar v-theme--light text-secondary v-avatar--density-default v-avatar--variant-tonal me-1">
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.1345 26.4375V27.2884C17.1345 27.4614 17.1995 27.6129 17.3295 27.7429C17.4593 27.8726 17.6106 27.9375 17.7836 27.9375H18.7069C18.8876 27.9375 19.0458 27.8698 19.1813 27.7343C19.3168 27.5985 19.3845 27.4403 19.3845 27.2595V26.4375H21.2595C21.5782 26.4375 21.8455 26.3296 22.0612 26.1139C22.2768 25.8984 22.3845 25.6313 22.3845 25.3125V20.8125C22.3845 20.4938 22.2768 20.2266 22.0612 20.0111C21.8455 19.7954 21.5782 19.6875 21.2595 19.6875H16.3845V17.4375H21.2595C21.5782 17.4375 21.8455 17.3296 22.0612 17.1139C22.2768 16.8981 22.3845 16.6309 22.3845 16.3121C22.3845 15.9931 22.2768 15.726 22.0612 15.5107C21.8455 15.2952 21.5782 15.1875 21.2595 15.1875H19.3845V14.3366C19.3845 14.1634 19.3196 14.0119 19.1899 13.8821C19.0601 13.7524 18.9088 13.6875 18.7358 13.6875H17.8125C17.6318 13.6875 17.4736 13.7552 17.3381 13.8907C17.2024 14.0265 17.1345 14.1848 17.1345 14.3655V15.1875H15.2595C14.9408 15.1875 14.6736 15.2954 14.4581 15.5111C14.2424 15.7266 14.1345 15.9938 14.1345 16.3125V20.8125C14.1345 21.1313 14.2424 21.3984 14.4581 21.6139C14.6736 21.8296 14.9408 21.9375 15.2595 21.9375H20.1345V24.1875H15.2595C14.9408 24.1875 14.6736 24.2954 14.4581 24.5111C14.2424 24.7269 14.1345 24.9941 14.1345 25.3129C14.1345 25.6319 14.2424 25.899 14.4581 26.1143C14.6736 26.3298 14.9408 26.4375 15.2595 26.4375H17.1345ZM9.46163 32.25C8.70387 32.25 8.0625 31.9875 7.5375 31.4625C7.0125 30.9375 6.75 30.2961 6.75 29.5384V6.46163C6.75 5.70387 7.0125 5.0625 7.5375 4.5375C8.0625 4.0125 8.70387 3.75 9.46163 3.75H22.2979L29.25 10.7021V29.5384C29.25 30.2961 28.9875 30.9375 28.4625 31.4625C27.9375 31.9875 27.2961 32.25 26.5384 32.25H9.46163ZM9.46163 30H26.5384C26.6539 30 26.7596 29.9519 26.8556 29.8556C26.9519 29.7596 27 29.6539 27 29.5384V11.8268H22.5289C22.1446 11.8268 21.8226 11.6969 21.5629 11.4371C21.3031 11.1774 21.1733 10.8554 21.1733 10.4711V6H9.46163C9.34613 6 9.24038 6.04812 9.14438 6.14437C9.04813 6.24037 9 6.34613 9 6.46163V29.5384C9 29.6539 9.04813 29.7596 9.14438 29.8556C9.24038 29.9519 9.34613 30 9.46163 30Z" fill="#209547"/>
                                    </svg>
                                    <div class="v-list-item__spacer"></div>
                                </div>
                            </div>
                            <div class="v-list-item__content text-body-1">
                                <div class="v-list-item-title" style="line-height: 1.4;">Đăng yêu cầu<br/>mua hàng</div>
                            </div>
                        </div>
                        <div class="v-list-item py-0 px-0">
                            <div class="v-list-item__prepend">
                                <div class="v-avatar v-theme--light text-secondary v-avatar--density-default v-avatar--variant-tonal me-1">
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.0345 25.9384C10.3095 24.9924 11.6985 24.2453 13.2015 23.697C14.7043 23.149 16.3038 22.875 18 22.875C19.6963 22.875 21.2958 23.149 22.7985 23.697C24.3015 24.2453 25.6905 24.9924 26.9655 25.9384C27.898 24.9134 28.6369 23.7269 29.1821 22.3789C29.7274 21.0309 30 19.5713 30 18C30 14.675 28.8313 11.8438 26.4938 9.50625C24.1563 7.16875 21.325 6 18 6C14.675 6 11.8438 7.16875 9.50625 9.50625C7.16875 11.8438 6 14.675 6 18C6 19.5713 6.27263 21.0309 6.81788 22.3789C7.36313 23.7269 8.102 24.9134 9.0345 25.9384ZM18.0004 19.125C16.6309 19.125 15.476 18.655 14.5358 17.715C13.5953 16.7748 13.125 15.6199 13.125 14.2504C13.125 12.8809 13.595 11.726 14.535 10.7858C15.4753 9.84525 16.6301 9.375 17.9996 9.375C19.3691 9.375 20.524 9.845 21.4643 10.785C22.4048 11.7252 22.875 12.8801 22.875 14.2496C22.875 15.6191 22.405 16.774 21.465 17.7143C20.5248 18.6548 19.3699 19.125 18.0004 19.125ZM18 32.25C16.0213 32.25 14.165 31.8779 12.4313 31.1336C10.6975 30.3894 9.18938 29.3759 7.90688 28.0931C6.62413 26.8106 5.61063 25.3025 4.86638 23.5688C4.12213 21.835 3.75 19.9788 3.75 18C3.75 16.0213 4.12213 14.165 4.86638 12.4313C5.61063 10.6975 6.62413 9.18937 7.90688 7.90687C9.18938 6.62412 10.6975 5.61063 12.4313 4.86638C14.165 4.12213 16.0213 3.75 18 3.75C19.9788 3.75 21.835 4.12213 23.5688 4.86638C25.3025 5.61063 26.8106 6.62412 28.0931 7.90687C29.3759 9.18937 30.3894 10.6975 31.1336 12.4313C31.8779 14.165 32.25 16.0213 32.25 18C32.25 19.9788 31.8779 21.835 31.1336 23.5688C30.3894 25.3025 29.3759 26.8106 28.0931 28.0931C26.8106 29.3759 25.3025 30.3894 23.5688 31.1336C21.835 31.8779 19.9788 32.25 18 32.25ZM18 30C19.3538 30 20.659 29.7823 21.9158 29.3468C23.1725 28.911 24.2884 28.3019 25.2634 27.5194C24.2884 26.7654 23.187 26.1779 21.9593 25.7569C20.7313 25.3356 19.4115 25.125 18 25.125C16.5885 25.125 15.2664 25.3331 14.0336 25.7494C12.8009 26.1659 11.7019 26.7559 10.7366 27.5194C11.7116 28.3019 12.8275 28.911 14.0842 29.3468C15.341 29.7823 16.6463 30 18 30ZM18 16.875C18.7463 16.875 19.3702 16.624 19.872 16.122C20.374 15.6202 20.625 14.9963 20.625 14.25C20.625 13.5038 20.374 12.8798 19.872 12.378C19.3702 11.876 18.7463 11.625 18 11.625C17.2538 11.625 16.6298 11.876 16.128 12.378C15.626 12.8798 15.375 13.5038 15.375 14.25C15.375 14.9963 15.626 15.6202 16.128 16.122C16.6298 16.624 17.2538 16.875 18 16.875Z" fill="#209547"/>
                                    </svg>
                                    <div class="v-list-item__spacer"></div>
                                </div>
                            </div>
                            <div class="v-list-item__content" data-no-activator="">
                                <div class="v-list-item-title" style="line-height: 1.4;"><a href="/login" class="text-body-1">Đăng nhập/</a><br/><a class="text-body-1" href="/register">Đăng ký</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </VContainer>
        </div>
        <div id="wide-nav" class="header-bottom d-none d-md-block">
            <VContainer class="py-0">
                <div class="nav-row d-flex justify-space-between align-center">
                    <div class="left-group d-flex align-center">
                        <VMenu open-on-hover close-on-content-click>
                            <template #activator="{ props: act }">
                              <VBtn
                                v-bind="act"
                                color="white"
                                variant="text"
                                class="cat-btn"
                                append-icon="tabler-chevron-down"
                              >
                                <VIcon icon="tabler-category" start />
                                Danh mục
                              </VBtn>
                            </template>

                            <VList max-height="60vh" min-width="280">
                              <VListItem v-if="loadingCats">
                                <VListItemTitle>Đang tải danh mục…</VListItemTitle>
                              </VListItem>

                              <template v-else>
                                <VListItem
                                  v-for="c in categories"
                                  :key="c.id"
                                  @click="goCategory(c)"
                                >
                                  <VListItemTitle>{{ c.name }}</VListItemTitle>
                                </VListItem>

                                <VListItem v-if="!categories.length">
                                  <VListItemTitle>Chưa có danh mục</VListItemTitle>
                                </VListItem>
                              </template>
                            </VList>
                        </VMenu>
                        <nav class="primary-nav">
                            <RouterLink
                                v-for="(item, index) in ['Giao thương', 'Đầu tư', 'Chuyển giao công nghệ']"
                                :key="index"
                                :to="`/${slug(item)}.html`"
                                class="nav-link py-2 px-2 px-lg-4"
                                :class="{ 'active-link': isActive(item) }"
                            >
                                {{ item }}
                            </RouterLink>
                        </nav>
                    </div>
                    <nav class="right-nav">
                        <RouterLink
                            v-for="(item, index) in ['Hoạt động - sự kiện', 'Tin tức - tri thức', 'Giới thiệu']"
                            :key="index"
                            :to="`/${slug(item)}.html`"
                            class="nav-link py-2 px-2 px-lg-4"
                            :class="{ 'active-link': isActive(item) }"
                          >
                            {{ item }}
                        </RouterLink>
                    </nav>
                </div>
            </VContainer>
        </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .header-main{
        background-color: #F2FCF6;
    }
    .header-main .v-toolbar-title{
        flex: none;
    }
    .nav-menu {
      display: flex;
      gap: 2rem;
    }
    .header-bottom {
        background: rgba(var(--v-theme-primary));
    }
    .header-bottom .nav-link {
      &:not(:hover) {
        color: #f8f8f8;
      }
    }
    .header-bottom .nav-link:hover{
        color: #ffffff;
    }
    .page-link {
      &:hover {
        color: #ffffff !important;
      }
    }

    @media (max-width: 1280px) {
      .nav-menu {
        gap: 2.25rem;
      }
    }

    @media (min-width: 1920px) {
      .front-page-navbar {
        .v-toolbar {
          max-inline-size: calc(1440px - 32px);
        }
      }
    }

    @media (min-width: 1280px) and (max-width: 1919px) {
      .front-page-navbar {
        .v-toolbar {
          max-inline-size: calc(1200px - 32px);
        }
      }
    }

    @media (min-width: 960px) and (max-width: 1279px) {
      .front-page-navbar {
        .v-toolbar {
          max-inline-size: calc(900px - 32px);
        }
      }
    }

    @media (min-width: 600px) and (max-width: 959px) {
      .front-page-navbar {
        .v-toolbar {
          max-inline-size: calc(100% - 64px);
        }
      }
    }

    @media (max-width: 959px){
        .header-main{
            background-color: rgb(var(--v-theme-primary));
        }
    }

    @media (max-width: 600px) {
      .front-page-navbar {
        .v-toolbar {
          max-inline-size: calc(100% - 32px);
        }
      }
    }

    .nav-item-img {
      border: 10px solid rgb(var(--v-theme-background));
      border-radius: 10px;
    }

    .active-link {
      color: rgb(var(--v-theme-primary)) !important;
    }

    .app-bar-light {
      border: 2px solid rgba(var(--v-theme-surface), 68%);
      border-radius: 0.5rem;
      background-color: rgba(var(--v-theme-surface), 38%);
      transition: all 0.1s ease-in-out;
    }

    .app-bar-dark {
      border: 2px solid rgba(var(--v-theme-surface), 68%);
      border-radius: 0.5rem;
      background-color: rgba(255, 255, 255, 4%);
      transition: all 0.1s ease-in-out;
    }

    .app-bar-scrolled {
      border: 2px solid rgb(var(--v-theme-surface));
      border-radius: 0.5rem;
      background-color: rgb(var(--v-theme-surface)) !important;
      transition: all 0.1s ease-in-out;
    }
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutMixins;

.mega-menu {
  position: fixed !important;
  inset-block-start: 5.4rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);

  @include layoutMixins.rtl {
    transform: translateX(50%);
  }
}

.front-page-navbar {
  .v-toolbar__content {
    padding-inline: 30px !important;
  }

  .v-toolbar {
    inset-inline: 0 !important;
    margin-block-start: 1rem !important;
    margin-inline: auto !important;
  }
}

.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

#navigation-drawer-close-btn {
  position: absolute;
  cursor: pointer;
  inset-block-start: 0.5rem;
  inset-inline-end: 1rem;
}
</style>
