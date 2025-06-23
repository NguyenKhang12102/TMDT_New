import axios from "axios";

export const getMyCustomOrders = async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('http://localhost:8080/api/order-custom/my-customorder', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};