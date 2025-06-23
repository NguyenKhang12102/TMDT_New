import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

export const placeOrderAPI = async (data) => {
    const url = API_BASE_URL + '/api/order';
    const headers = getHeaders();
    console.log("🚀 Data gửi đi:", data);
    console.log("🧾 Headers:", headers);

    try {
        const response = await axios(url, {
            method: "POST",
            data: data,
            headers: headers,
        });
        return response?.data;
    } catch (err) {
        console.error("Error:", err);
        throw new Error(err);
    }
};
// API: Admin lấy toàn bộ order (GET /api/order)
export const getAllOrdersAPI = async () => {
    const url = API_BASE_URL + '/api/order';
    try {
        const response = await axios.get(url, { headers: getHeaders() });
        return response?.data;
    } catch (err) {
        console.error("Error:", err);
        throw new Error(err);
    }
};

export const confirmPaymentAPI = async (data)=>{
    const url = API_BASE_URL + '/api/order/update-payment';
    try{
        const response = await axios(url,{
            method:"POST",
            data:data,
            headers:getHeaders()
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}

export const updateOrderStatusAPI = async (orderId, status) => {
    const url = API_BASE_URL + `/api/order/update-status/${orderId}`;
    try {
        const response = await axios(url, {
            method: "POST",
            data: { status: status },
            headers: getHeaders(),
        });
        return response?.data;
    } catch (err) {
        console.error("Error updating order status:", err);
        throw new Error(err);
    }
};
