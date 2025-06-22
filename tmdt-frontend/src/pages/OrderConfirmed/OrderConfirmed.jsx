import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const OrderConfirmed = () => {

    const location = useLocation();

    const orderId = useMemo(() => {
        const query = new URLSearchParams(location.search);
        return query.get('orderId');
    }, [location.search]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
                <h1 className="text-3xl font-semibold text-green-600 mb-4">
                     Cảm ơn bạn đã mua hàng
                </h1>
                <p className="text-gray-700 text-lg">
                    Đơn hàng của bạn đã được đặt thành công.
                </p>
                <p className="mt-2 text-gray-800">
                    Mã đơn hàng của bạn là:{" "}
                    <span className="font-bold text-black">{orderId}</span>
                </p>
                <div className="mt-6">
                    <a
                        href="/"
                        className="inline-block px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                        Quay lại trang chủ
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmed;
