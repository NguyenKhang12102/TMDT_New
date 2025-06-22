export const createOrderRequest = (cartItems, userId, addressId) => {
    const orderItems = cartItems.map(item => {
        const productId = item.productId || item.product?.id || item.id;

        if (!productId) {
            console.error("🚫 Không tìm thấy productId cho item:", item);
            throw new Error("Thiếu productId trong giỏ hàng");
        }

        return {
            productId,
            productVariantId: item?.variant?.id || null,
            discount: 0,
            quantity: item.quantity
        };
    });

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);

    return {
        userId,
        addressId,
        orderDate: new Date().toISOString(),
        orderItemRequests: orderItems,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        discount: 0,
        paymentMethod: "CARD",
        expectedDeliveryDate: "2024-10-05T21:11:46.202Z",
        currency: "đ"
    };
};



export const getStepCount = {
    'PENDING':1,
    'IN_PROGRESS':2,
    'SHIPPED':3,
    'DELIVERED':4
}