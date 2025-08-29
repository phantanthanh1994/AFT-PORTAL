import axios from 'axios'

const API_BASE = 'http://core.demo/api'

// Lấy danh sách quốc gia
export const getAllCountries = async () => {
    try {
        const response = await axios.get(`${API_BASE}/countries`)
        return response.data
    } catch (error) {
        console.error('Lỗi lấy quốc gia:', error)
        throw error
    }
}

// Lấy danh sách tỉnh/thành theo country_id
export const getProvinces = async (countryId) => {
    try {
        const response = await axios.get(`${API_BASE}/provinces`, {
          params: { country_id: countryId }
        })
        return response.data
    } catch (error) {
        console.error('Lỗi lấy tỉnh thành:', error)
        throw error
    }
}

// Lấy danh sách quận/huyện theo province_id
export const getDistricts = async (provinceId) => {
    try {
        const response = await axios.post(`${API_BASE}/districts`, {
            provinceId: provinceId
        })
        return response.data
    } catch (error) {
        console.error('Lỗi lấy quận huyện:', error)
        throw error
    }
}

// Lấy danh sách phường/xã theo district_id
export const getWards = async (districtId) => {
    try {
        const response = await axios.post(`${API_BASE}/wards`, {
            districtId: districtId
        })
        return response.data
    } catch (error) {
        console.error('Lỗi lấy quận huyện:', error)
        throw error
    }
}