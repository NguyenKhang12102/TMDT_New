import axios from "axios";
import { API_BASE_URL, API_URLS,getHeaders } from "./constant";

/**
 * Lấy danh sách các category type (ví dụ: Chậu cây, Trang trí, ...)
 */
export const fetchCategories = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`,
            {
                headers: getHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi load category types:", error);
        return [];
    }
};
