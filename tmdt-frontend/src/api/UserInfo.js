import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

// Get user profile
export const fetchUserDetails = async () => {
    const url = API_BASE_URL + '/api/user/profile';
    try {
        const response = await axios.get(url, { headers: getHeaders() });
        return response?.data;
    } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        throw new Error(err?.response?.data?.message || "Lỗi khi lấy thông tin người dùng.");
    }
};

// Add new address
export const addAddressAPI = async (data) => {
    const url = API_BASE_URL + '/api/address';
    try {
        const response = await axios.post(url, data, { headers: getHeaders() });
        return response?.data;
    } catch (err) {
        console.error("Lỗi khi thêm địa chỉ:", err);
        throw new Error(err?.response?.data?.message || "Lỗi khi thêm địa chỉ.");
    }
};

// Delete address
export const deleteAddressAPI = async (id) => {
    const url = API_BASE_URL + `/api/address/${id}`;
    try {
        const response = await axios.delete(url, { headers: getHeaders() });
        return response?.data;
    } catch (err) {
        console.error("Lỗi khi xóa địa chỉ:", err);
        throw new Error(err?.response?.data?.message || "Lỗi khi xóa địa chỉ.");
    }
};

// Fetch all orders of user
export const fetchOrderAPI = async () => {
    const url = API_BASE_URL + `/api/order/user`;
    try {
        const response = await axios.get(url, { headers: getHeaders() });
        return response?.data;
    } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        throw new Error(err?.response?.data?.message || "Lỗi khi lấy đơn hàng.");
    }
};

// Cancel order
export const cancelOrderAPI = async (id) => {
    const url = API_BASE_URL + `/api/order/cancel/${id}`;
    try {
        const response = await axios.post(url, {}, { headers: getHeaders() });
        return response?.data;
    } catch (err) {
        console.error("Lỗi khi hủy đơn hàng:", err);
        throw new Error(err?.response?.data?.message || "Lỗi khi hủy đơn hàng.");
    }
};
