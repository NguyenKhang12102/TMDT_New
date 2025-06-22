import { createSlice } from "@reduxjs/toolkit";

// Trạng thái ban đầu
export const initialState = {
    userInfo: {},
    orders: [],
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        loadUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },

        // Thêm địa chỉ mới vào danh sách
        saveAddress: (state, action) => {
            const existing = state.userInfo.addressList ?? [];
            state.userInfo.addressList = [...existing, action.payload];
        },

        // Xoá địa chỉ theo ID
        removeAddress: (state, action) => {
            state.userInfo.addressList = state.userInfo.addressList?.filter(
                (address) => address.id !== action.payload
            );
        },

        // Load danh sách đơn hàng
        loadOrders: (state, action) => {
            state.orders = action.payload;
        },

        // Huỷ một đơn hàng theo ID
        cancelOrder: (state, action) => {
            state.orders = state.orders.map((order) =>
                order.id === action.payload
                    ? { ...order, orderStatus: 'CANCELLED' }
                    : order
            );
        },

        // Logout: Xoá toàn bộ thông tin user & orders
        logoutUser: (state) => {
            state.userInfo = {};
            state.orders = [];
        },
    },
});

// Export action
export const {
    loadUserInfo,
    saveAddress,
    removeAddress,
    loadOrders,
    cancelOrder,
    logoutUser,
} = userSlice.actions;

// Selector
export const selectUserInfo = (state) => state.userState.userInfo ?? {};
export const selectAllOrders = (state) => state.userState.orders ?? [];

    export const selectIsUserAdmin = (state) =>
    state.userState.userInfo?.authorityList?.some(
        (auth) => auth.roleCode === 'ADMIN' && auth.authority === 'ADMIN'
    );

// Export reducer
export default userSlice.reducer;
