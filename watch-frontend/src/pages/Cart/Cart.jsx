// src/components/Cart/Cart.jsx
import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteItemFromCartAction,
    updateItemToCartAction,
} from '../../store/actions/cartAction';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../../utils/jwt-helper';
import { selectCartItems } from "../../store/features/cart";
import { setShowCart } from '../../store/features/uiSlice'; // 🔥 Quan trọng

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const showCart = useSelector((state) => state.ui.showCart); // 🔥 trạng thái mở/đóng từ Redux
    const navigate = useNavigate();
    const isLoggedIn = isTokenValid();

    const onChangeQuantity = (value, productId) => {
        if (value < 1) return;
        dispatch(updateItemToCartAction({ productId, quantity: value }));
    };

    const onDeleteProduct = (productId) => {
        dispatch(deleteItemFromCartAction({ productId }));
    };

    const subTotal = cartItems.reduce((acc, item) => acc + (item.subTotal || 0), 0).toFixed(2);

    const handleClose = () => {
        dispatch(setShowCart(false)); // 🔥 Đóng bằng Redux
    };

    return (
        <div className={`fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-lg z-[9999] transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b shrink-0">
                    <h3 className="text-xl font-semibold">Giỏ hàng</h3>
                    <button onClick={handleClose} className="text-gray-600 hover:text-black text-lg">×</button>
                </div>

                {/* Nếu giỏ trống */}
                {cartItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Giỏ hàng trống
                    </div>
                ) : (
                    <>
                        {/* Nội dung scroll */}
                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <div className="space-y-4">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-start border-b pb-3">
                                        <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h5 className="font-semibold text-sm">{item.name}</h5>
                                                <button
                                                    onClick={() => onDeleteProduct(item.productId)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => onChangeQuantity(item.quantity - 1, item.productId)}
                                                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-2 text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onChangeQuantity(item.quantity + 1, item.productId)}
                                                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="text-red-600 font-medium text-sm">
                                                    {item.price.toLocaleString()}₫
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer cố định */}
                        <div className="px-4 py-3 border-t shrink-0 bg-white">
                            <div className="flex justify-between text-sm mb-3">
                                <span>Tạm tính:</span>
                                <span className="text-green-600 font-semibold">{Number(subTotal).toLocaleString()}₫</span>
                            </div>
                            <button
                                onClick={() => {
                                    navigate(isLoggedIn ? '/checkout' : '/login');
                                    handleClose();
                                }}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                {isLoggedIn ? 'Thanh toán ngay' : 'Đăng nhập để thanh toán'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

};

export default Cart;
