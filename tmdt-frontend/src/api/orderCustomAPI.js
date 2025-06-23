
export const uploadCustomOrder = async (formData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:8080/api/order-custom/upload', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, // ✅ gửi token ở đây
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Tải lên thất bại');
    }

    return response.json();
};


