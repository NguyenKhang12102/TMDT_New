import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../store/features/cart';
import { createOrderRequest } from '../../utils/order-util';
import { placeOrderAPI } from '../../api/order';
import { setLoading } from '../../store/features/common';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/actions/cartAction.js';
import { saveAddress } from '../../store/features/user.js';

const CODCheckoutForm = ({ userId, addressId, newAddress, handleAddAddress }) => {
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

            // Nếu có hàm handleAddAddress, gọi nó để lưu địa chỉ mới
            if (handleAddAddress) {
                const addedAddress = await handleAddAddress();
                if (addedAddress?.id) {
                    finalAddressId = addedAddress.id;
                    dispatch(saveAddress(addedAddress));
                }
            }

            const orderRequest = createOrderRequest(cartItems, userId, finalAddressId);
            orderRequest.paymentMethod = "TIEN MAT";

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
    }, [addressId, cartItems, dispatch, navigate, userId, handleAddAddress]);

    return (
        <form className='items-center p-2 mt-4 w-[320px]' onSubmit={handleSubmit}>
            <p className='mb-2 text-sm text-gray-600'>Xác nhận đơn hàng và thanh toán khi nhận hàng</p>
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
