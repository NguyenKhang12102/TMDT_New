// Services.jsx
import React from 'react';
import './Services.css';
import InforBar from '../../components/InforBar/InforBar.jsx'

import StoreList from '../../components/StoreList/StoreList.jsx'

const Services = () => {
    return (
        <div className="services-page">
            <h2>DỊCH VỤ CỦA CHÚNG TÔI</h2>
            <div className="services-list">
                <div className="service-card">
                    <h3>1. Bán lẻ đồng hồ</h3>
                    <p>Chúng tôi cung cấp đồng hồ chính hãng đến tay khách hàng toàn quốc.</p>
                </div>
                <div className="service-card">
                    <h3>2. Bán sỉ cho doanh nghiệp</h3>
                    <p>Hợp tác với doanh nghiệp, tổ chức quà tặng, khuyến mãi.</p>
                </div>
                <div className="service-card">
                    <h3>3. Phụ kiện chính hãng</h3>
                    <p>Cung cấp dây đeo, pin, hộp, kính và phụ kiện đi kèm.</p>
                </div>
                <div className="service-card">
                    <h3>4. Sửa chữa & bảo hành</h3>
                    <p>Dịch vụ chuyên nghiệp cho tất cả thương hiệu đồng hồ phổ biến.</p>
                </div>
            </div>
            <InforBar />
            <StoreList />

        </div>
    );
};

export default Services;
