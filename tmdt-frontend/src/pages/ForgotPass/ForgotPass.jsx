// src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './ForgotPass.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const handleResetPassword = (e) => {
        e.preventDefault();
        // Gửi yêu cầu khôi phục mật khẩu cho người dùng (Firebase hoặc hệ thống của bạn)
    };

    return (
        <div className="forgot-password-container">
            <h2>Khôi phục mật khẩu</h2>

            <form onSubmit={handleResetPassword}>
                <div className="form-group">
                    <label htmlFor="email">Nhập email của bạn</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="reset-btn">Khôi phục mật khẩu</button>
            </form>

            <NavLink to="/login">Quay lại đăng nhập</NavLink>
        </div>
    );
};

export default ForgotPasswordPage;
