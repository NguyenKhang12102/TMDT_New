// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHome, AiOutlineLogout } from 'react-icons/ai';

const AdminDashboard = () => {
    const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });
    const navigate = useNavigate();

    // Giả sử bạn lưu thông tin admin vào localStorage khi login
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        if (userData) {
            setAdminInfo({
                name: userData.name || 'Admin',
                email: userData.email || '',
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <div style={{ padding: 24 }}>


            <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '10px 16px',
                        backgroundColor: '#c1c4d3',
                        color: '#fff',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 500
                    }}
                >
                    <AiFillHome size={20} style={{ marginRight: 8 }} />
                    Về trang chủ
                </Link>

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '10px 16px',
                        backgroundColor: '#2087bf',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}
                >
                    <AiOutlineLogout size={20} style={{ marginRight: 8 }} />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
