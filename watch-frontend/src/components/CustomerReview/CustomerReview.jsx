import React from 'react';
import './CustomerReview.css';
import { FaStar, FaCheckCircle } from 'react-icons/fa';

const reviews = [
    {
        name: 'Lam Hoang Anh',
        text: 'Sản phẩm k tì vết, đóng gói chỉn chu, đem tặng thoải mái con gà mái luôn nha mng...',
        image: 'https://via.placeholder.com/60', // thay bằng ảnh thật
    },
    {
        name: 'Tuyên',
        text: 'Máy bằng nhựa dây đeo ọp ẹp',
        image: 'https://via.placeholder.com/60',
    },
    {
        name: 'Đạt',
        text: 'Rất uy tín và chất lượng. Đã mua 3 lần ở shop',
        image: 'https://via.placeholder.com/60',
    },
];

const CustomerReviews = () => {
    return (
        <div className="reviews-section">
            <h3>Đánh giá của khách hàng</h3>
            <p>WatchStore tự hào là website có lượng đánh giá nhiều nhất tại Việt Nam</p>
            <div className="stars">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                ))}
            </div>
            <a href="/" className="see-more">Xem thêm 2815 đánh giá</a>

            <div className="review-cards">
                {reviews.map((r, i) => (
                    <div className="review-card" key={i}>
                        <img src={r.image} alt="review" />
                        <p>{r.text}</p>
                        <div className="reviewer">
                            <strong>{r.name}</strong>
                            <div className="verified">
                                <FaCheckCircle className="check-icon" />
                                <span>Đã mua hàng</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dots">
                <span className="dot active" />
                <span className="dot" />
                <span className="dot" />
            </div>
        </div>
    );
};

export default CustomerReviews;
