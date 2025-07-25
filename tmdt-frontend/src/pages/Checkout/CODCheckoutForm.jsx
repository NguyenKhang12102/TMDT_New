import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart.js';
import { createOrderRequest } from '../../utils/order-util.js';
import { placeOrderAPI } from '../../api/order.js';
import { setLoading } from '../../store/features/common.js';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/actions/cartAction.js';
import { saveAddress } from '../../store/features/user.js';

const CODCheckoutForm = ({  userId,
                             addressId,
                             newAddress,
                             handleAddAddress,
                             discount,
                             voucherId,
                             totalAmount }) => {
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        dispatch(setLoading(true));

        try {
            let finalAddressId = addressId;

            if (handleAddAddress) {
                const addedAddress = await handleAddAddress();
                if (addedAddress?.id) {
                    finalAddressId = addedAddress.id;
                    dispatch(saveAddress(addedAddress));
                }
            }

            const originalTotal = cartItems.reduce((total, item) => total + (item.subTotal || 0), 0);

            const orderRequest = {
                userId,
                addressId: finalAddressId,
                orderItemRequests: cartItems.map(item => ({
                    productId: item.productId,
                    productVariantId: item.productVariantId,
                    quantity: item.quantity
                })),
                paymentMethod: "TIEN MAT",
                discount, // % gửi lên
                voucherId,
                totalAmount: parseFloat(originalTotal), // ❗ gửi tổng gốc chưa giảm
                orderDate: new Date(),
                expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            };


            const res = await placeOrderAPI(orderRequest);
            if (res?.orderId) {
                dispatch(clearCart());
                navigate(`/orderConfirmed?orderId=${res.orderId}`);
            } else {
                setError("Không thể tạo đơn hàng.");
            }
        } catch (err) {
            console.error(err);
            setError("Đã xảy ra lỗi khi tạo đơn hàng.");
        } finally {
            dispatch(setLoading(false));
        }
    }, [addressId, cartItems, dispatch, navigate, userId, handleAddAddress, discount, voucherId, totalAmount]);


    return (
        <form className='items-center p-2 mt-4 w-[320px]' onSubmit={handleSubmit}>
            <button
                type='submit'
                className='w-[150px] items-center h-[48px] bg-black border rounded-lg mt-4 text-white hover:bg-gray-800'
            >
                Đặt hàng (COD)
            </button>
            {error && <p className='text-sm pt-4 text-red-600'>{error}</p>}
        </form>
    );
};

export default CODCheckoutForm;
