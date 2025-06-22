import { getToken } from "../utils/jwt-helper";

export const API_BASE_URL = "http://localhost:8080";

export const API_URLS = {
    GET_PRODUCTS_BY_CATEGORY_TYPE: (typeId) => `/api/products/by-category-type/${typeId}`, // ✅ Sửa lại chỗ này
    POST_PRODUCT: "/api/products",
    GET_PRODUCTS: "/api/products",
     UPDATE_PRODUCT: (id) => `/api/products/${id}`,
     DELETE_PRODUCT: (id) => `/api/products/${id}`,
    GET_CATEGORIES: "/api/category-types",
     GET_CATEGORY: (id) => `/api/category/${id}`,
};

export const getHeaders = (isJson = true) => {
    const token = getToken();

    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (isJson) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
};
