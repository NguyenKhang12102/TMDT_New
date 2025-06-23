import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showCart: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setShowCart: (state, action) => {
            state.showCart = action.payload;
        },
    },
});

export const { setShowCart } = uiSlice.actions;
export const selectShowCart = (state) => state.ui.showCart;
export default uiSlice.reducer;
