import { createSlice } from '@reduxjs/toolkit';

// Lấy token từ localStorage khi khởi tạo slice
const authToken = localStorage.getItem('authToken');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: !!authToken, // true nếu có token, false nếu không
    },
    reducers: {
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
        }
    }
});

export const { setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
