import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

/**
 * Lấy sản phẩm theo categoryTypeId (ví dụ: "Chậu cây", "Trang trí", ...)
 */
export const getProductByTypeId = async (typeId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}${API_URLS.GET_PRODUCTS_BY_CATEGORY_TYPE(typeId)}`,
            {
                headers: getHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API theo categoryTypeId:", error);
        return [];
    }
};

export const getAllProducts = async (categoryId, typeId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${API_URLS.GET_PRODUCTS}`, {
            headers: getHeaders(),
            params: {
                ...(categoryId && { categoryId }),
                ...(typeId && { typeId }),
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi gọi API tất cả sản phẩm:", error);
        return [];
    }
};

export const getProductBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${API_URLS.GET_PRODUCTS}`, {
            headers: getHeaders(),
            params: { slug },
        });
        return response.data?.[0] || null;
    } catch (error) {
        console.error("Lỗi khi gọi API theo slug:", error);
        return null;
    }
};
