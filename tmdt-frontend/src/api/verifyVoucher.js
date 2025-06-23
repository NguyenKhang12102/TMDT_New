import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

export const verifyVoucherAPI = async (code, userId) => {
    const url = `${API_BASE_URL}/api/vouchers/verify?code=${code}&userId=${userId}`;
    try {
        const response = await axios.get(url, {
            headers: getHeaders()
        });
        return response?.data; // { discountPercentage, voucherId }
    } catch (err) {
        console.error("❌ Lỗi xác minh voucher:", err);
        const message = err.response?.data || "Lỗi xác minh voucher.";
        throw new Error(message);
    }
};
