import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
    name: "cartState",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;

            const existingIndex = state.cart.findIndex(
                (item) => item.productId === newItem.productId
            );

            if (existingIndex !== -1) {
                // Nếu đã có thì cộng dồn
                state.cart[existingIndex].quantity += newItem.quantity;
                state.cart[existingIndex].subTotal =
                    state.cart[existingIndex].quantity * state.cart[existingIndex].price;
            } else {
                // Chưa có thì thêm mới
                newItem.subTotal = newItem.quantity * newItem.price;
                state.cart.push(newItem);
            }
        },

        removeFromCart: (state, action) => {
            const { productId } = action.payload;
            state.cart = state.cart.filter((item) => item.productId !== productId);
        },

        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const target = state.cart.find((item) => item.productId === productId);
            if (target) {
                target.quantity = quantity;
                target.subTotal = quantity * target.price;
            }
        },

        deleteCart: (state) => {
            state.cart = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, deleteCart } = cartSlice.actions;

export const countCartItems = (state) => state.cartState.cart.length;
export const selectCartItems = (state) => state.cartState.cart ?? [];

export default cartSlice.reducer;
