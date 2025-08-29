// src/services/catalog.js
import api from './api';

// ===== PUBLIC CATALOG =====
export const CatalogApi = {
    // Products
    listProducts(params = {}) {
      // params: { search, type, category_id, brand_id, price_min, price_max, per_page, sort, direction, include }
      return api.get('/products', { params }).then(r => r.data);
    },
    getProductBySlug(slug) {
      return api.get(`/products/${slug}`).then(r => r.data);
    },

    // Categories / Brands / Attributes / Tags
    listProductCate(params = {}) {
      return api.get('/get_product_category', { params }).then(r => r.data);
    },
    listBrands(params = {}) {
      return api.get('/brands', { params }).then(r => r.data);
    },
    listAttributes(params = {}) {
      return api.get('/attributes', { params }).then(r => r.data);
    },
    listTags(params = {}) {
      return api.get('/tags', { params }).then(r => r.data);
    },
};

// ===== PROTECTED (AUTH REQUIRED) =====
// (Dùng cho trang quản trị portal của doanh nghiệp)
export const ProductApi = {
    create(payload) {
      return api.post('/products', payload).then(r => r.data);
    },
    get(id) {
      return api.get(`/products/${id}`).then(r => r.data);
    },
    update(id, payload) {
      return api.put(`/products/${id}`, payload).then(r => r.data);
    },
    delete(id) {
      return api.delete(`/products/${id}`).then(r => r.data);
    },
    // upload ảnh 1 file
    uploadImage(productId, file, { role = 'gallery', sort = 0 } = {}) {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('role', role);
      fd.append('sort', String(sort));
      return api.post(`/products/${productId}/images`, fd).then(r => r.data);
    },
    deleteImage(productId, imageId) {
      return api.delete(`/products/${productId}/images/${imageId}`).then(r => r.data);
    },
};
