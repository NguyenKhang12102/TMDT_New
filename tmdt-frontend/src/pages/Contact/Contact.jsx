import React from 'react';
import './Contact.css';
import InforBar from '../../components/InforBar/InforBar.jsx';
import StoreList from '../../components/StoreList/StoreList.jsx';

const Contact = () => {
    return (
        <div className="contact-page">
            <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>

            <div className="contact-info">
                <div>
                    <h4>Trụ sở chính</h4>
                    <p>97 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội</p>
                </div>
                <div>
                    <h4>Hotline tư vấn in 3D</h4>
                    <p>1900 3DPRINT (1900 373 7468)</p>
                </div>
                <div>
                    <h4>Email hỗ trợ</h4>
                    <p>support@3dhub.vn</p>
                </div>
                <div>
                    <h4>Thời gian làm việc</h4>
                    <p>Thứ 2 – Thứ 7: 8:00 – 18:00</p>
                </div>
            </div>

            <form className="contact-form">
                <input type="text" placeholder="Họ và tên" required />
                <input type="email" placeholder="Email" required />
                <textarea placeholder="Nội dung tin nhắn hoặc yêu cầu in 3D" rows="5" required></textarea>
                <button type="submit">Gửi liên hệ</button>
            </form>

            <InforBar />
            {/*<StoreList />*/}
        </div>
    );
};

export default Contact;
