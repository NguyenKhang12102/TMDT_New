import React from 'react';
import './StoreList.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const stores = [
    {
        name: 'WatchStore Trần Đại Nghĩa',
        address: '97 Trần Đại Nghĩa, HBT, Hà Nội',
        mapLink: '#',
    },
    {
        name: 'WatchStore Trần Đăng Ninh',
        address: '58 Trần Đăng Ninh, Cầu Giấy, Hà Nội',
        mapLink: '#',
    },
    {
        name: 'WatchStore Đà Nẵng',
        address: '339 Lê Duẩn, Thanh Khê, Đà Nẵng',
        mapLink: '#',
    },
    {
        name: 'WatchStore Bình Dương',
        address: '642 CMT8, Thủ Dầu Một, Bình Dương',
        mapLink: '#',
    },
    {
        name: 'WatchStore Lê Văn Sỹ',
        address: '90 Lê Văn Sỹ, P11, Phú Nhuận, TP.HCM',
        mapLink: '#',
    },

];

const StoreList = () => {
    return (
        <div className="store-list">
            <h2>DANH SÁCH CỬA HÀNG</h2>
            <div className="store-grid">
                {stores.map((store, index) => (
                    <div className="store-card" key={index}>
                        <div className="store-header">{store.name}</div>
                        <div className="store-body">
                            <p>{store.address}</p>
                            <a href={store.mapLink} className="map-link">
                                <FaMapMarkerAlt className="map-icon" /> Xem chỉ đường
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoreList;
