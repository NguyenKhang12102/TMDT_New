import React from 'react';
import './InforBar.css';
import { FaClock, FaPhoneAlt, FaCog } from 'react-icons/fa';

const InfoBar = () => {
    return (
        <div className="info-bar">
            <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                    <div className="info-title">MUA HÀNG ONLINE 24/7</div>
                    <div className="info-subtitle">Tất cả các ngày trong tuần</div>
                </div>
            </div>
            <div className="info-item">
                <FaPhoneAlt className="info-icon" />
                <div>
                    <div className="info-title">HOTLINE BÁN HÀNG</div>
                    <div className="info-subtitle">1800 6785</div>
                </div>
            </div>
            <div className="info-item">
                <FaCog className="info-icon" />
                <div>
                    <div className="info-title">HỖ TRỢ KĨ THUẬT</div>
                    <div className="info-subtitle">HN: 1800.6785 Nhánh 2<br />HCM: 1800.6785 Nhánh 3</div>
                </div>
            </div>
        </div>
    );
};

export default InfoBar;
