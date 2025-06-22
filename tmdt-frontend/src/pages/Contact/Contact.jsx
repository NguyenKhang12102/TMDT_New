// Contact.jsx
import React from 'react';
import './Contact.css';
import InforBar from '../../components/InforBar/InforBar.jsx'

import StoreList from '../../components/StoreList/StoreList.jsx'

const Contact = () => {
    return (
        <div className="contact-page">
            <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>
            <div className="contact-info">
                <div>
                    <h4>Địa chỉ</h4>
                    <p>97 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội</p>
                </div>
                <div>
                    <h4>Số điện thoại</h4>
                    <p>1900 1234</p>
                </div>
                <div>
                    <h4>Email</h4>
                    <p>support@watchstore.vn</p>
                </div>
            </div>
            <form className="contact-form">
                <input type="text" placeholder="Họ và tên" required />
                <input type="email" placeholder="Email" required />
                <textarea placeholder="Nội dung" rows="5" required></textarea>
                <button type="submit">Gửi liên hệ</button>
            </form>
            <InforBar />
            <StoreList />
        </div>
    );
};

export default Contact;
