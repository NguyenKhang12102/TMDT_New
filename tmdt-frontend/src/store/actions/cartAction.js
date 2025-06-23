import { addToCart, deleteCart, removeFromCart, updateQuantity } from "../features/cart";

// Thêm sản phẩm vào giỏ
export const addItemToCartAction = (productItem) => {
    return (dispatch, getState) => {
        dispatch(addToCart(productItem));
        updateLocalStorage(getState);
    };
};

// Cập nhật số lượng sản phẩm
export const updateItemToCartAction = (productItem) => {
    return (dispatch, getState) => {
        dispatch(updateQuantity({
            productId: productItem?.productId,
            quantity: productItem?.quantity,
        }));
        updateLocalStorage(getState);
    };
};

// Xoá 1 sản phẩm khỏi giỏ
export const deleteItemFromCartAction = (payload) => {
    return (dispatch, getState) => {
        dispatch(removeFromCart(payload));
        updateLocalStorage(getState);
    };
};

// Xoá toàn bộ giỏ hàng
export const clearCart = () => {
    return (dispatch) => {
        dispatch(deleteCart());
        localStorage.removeItem('cart');
    };
};

// Đồng bộ localStorage
const updateLocalStorage = (getState) => {
    const { cartState } = getState();
    localStorage.setItem('cart', JSON.stringify(cartState?.cart));
};
