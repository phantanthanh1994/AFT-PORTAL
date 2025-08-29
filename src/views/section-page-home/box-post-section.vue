<script setup>
    import boyWithLogo from '@images/pages/image-aft-1.png'
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

    const posts = [
        {
            title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
            des: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
            image: product1,
            companyName: 'Công ty TNHH ACB',
            btnLink: 'giao-thuong',
            current: false,
        },
        {
            title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
            des: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
            image: product2,
            companyName: 'Công ty TNHH ACB',
            btnLink: 'dau-tu',
            current: false,
        },
        {
            title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
            des: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
            image: product3,
            companyName: 'Công ty TNHH ACB',
            btnLink: 'chuyen-giao-cong-nghe',
            current: false,
        },
        {
            title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
            des: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
            image: product4,
            companyName: 'Công ty TNHH ACB',
            btnLink: 'chuyen-giao-cong-nghe',
            current: false,
        },
        {
            title: 'Lorem ipsum dolor sit amet, adipiscin elit sed do eiusmod sed do eiusmod',
            des: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
            image: product5,
            companyName: 'Công ty TNHH ACB',
            btnLink: 'chuyen-giao-cong-nghe',
            current: false,
        },
    ]
</script>

<template>
    <div id="blogs" class="py-10">
        <VContainer>
            <!-- 👉 Header  -->
            <div class="blog-section">
                <div class="headers flex-column">
                    <h2 class="text-h2 text-center text-primary mb-4">Tin tức nóng</h2>
                </div>
                <div class="post-list">
                    <div class="post-item" v-for="post in posts">
                        <div class="col-inner">
                            <div class="box">
                                <div class="box-image">
                                    <div class="image-cover">
                                        <a href="/">
                                            <img :src="post.image" />
                                        </a>
                                    </div>
                                </div>
                                <div class="box-text text-left">
                                    <div class="box-text-inner blog-post-inner">
                                        <div class="post-meta">06/07/2025</div>
                                        <h4 class="post-title text-h5 mb-2"><a href="/">{{post.title}}</a></h4>
                                        <p class="from_the_blog_excerpt">{{post.des}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <VBtn class="mt-4" color="primary">Xem tất cả</VBtn>
                </div>
            </div>
        </VContainer>
    </div>
</template>

<style lang="scss" scoped>
    .post-list:before,
    .post-list:after{
        content: "";
        display: table;
        margin-left: -10px;
        margin-right: -10px;
    }
    .post-list:after{
        clear: both;
    }
    .post-list .post-item:first-child{
        width: 66.66666666%;
    }
    .post-list .post-item:first-child .box .box-text{
        padding-top: 20px;
    }
    .post-list .post-item{
        padding-left: 10px;
        padding-right: 10px;
        float: left;
        width: 33.33333333%;
        margin-bottom: 20px;
    }
    .post-list .post-item .post-title a,
    .post-list .post-item:not(:first-child) .from_the_blog_excerpt{
        color: #1A1A1A;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        align-self: stretch;
        overflow: hidden;
    }
    .post-list .post-item:not(:first-child) .box:before,
    .post-list .post-item:not(:first-child) .box:after{
        content: "";
        display: table;
    }
    .post-list .post-item:not(:first-child) .box:after{
        clear: both;
    }
    .post-list .post-item .box .box-image{
        border-radius: 10px;
        overflow: hidden;
    }
    .post-list .post-item:not(:first-child) .box .box-image{
        width: 37%;
        float: left;
    }
    .post-list .post-item:not(:first-child) .box .box-text{
        width: 60%;
        float: right;
    }
    .post-list .post-item .from_the_blog_excerpt{
        color: #666666;
    }
    .post-list .post-item:first-child .image-cover{
        padding-top: 60%;
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
    @media (max-width: 960px){
        .post-list .post-item{
            width: 100% !important;
        }
        .post-list .post-item:first-child .from_the_blog_excerpt{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            align-self: stretch;
            overflow: hidden;
        }
    }
</style>

