import React, { useEffect, useState } from 'react';
import './CustomerReviewDetail.css';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import userImage from '../../assets/pngtree-user-icon-png-image_1796659.jpg';
import { useSelector } from "react-redux";
import {getHeaders} from "../../api/constant.js";
import {fetchUserDetails} from "../../api/UserInfo.js";

// Nhận productId từ props hoặc context
const CustomerReviews = ({ productId }) => {
    const [userReview, setUserReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const user = useSelector(state => state.userState.userInfo);
    const token = useSelector(state => state.userState.token);

    // Lấy đánh giá từ API khi load component
    useEffect(() => {
        if (!productId) return;
        fetchUserDetails()
        fetch(`http://localhost:8080/api/products/${productId}/reviews`, {
            headers: getHeaders()
        })
            .then(res => {
                console.log('Fetch reviews status:', res.status);
                if (!res.ok) {
                    throw new Error(`Lỗi khi lấy reviews: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Reviews data:', data);
                setReviews(data);
            })
            .catch(err => console.error(err));
    }, [productId, token]);

    const [error, setError] = useState("");
    const reviewRegex = /[a-zA-Z0-9À-ỹ]/;

    const handleSubmit = () => {
        if (!user) {
            alert('Vui lòng đăng nhập để gửi đánh giá.');
            return;
        }

        const trimmedReview = userReview.trim();
        if (!user) {
            setError("Vui lòng đăng nhập để gửi đánh giá.");
            return;
        }

        if (!trimmedReview) {
            setError("Vui lòng nhập nội dung đánh giá.");
            return;
        }

        if (trimmedReview.length < 5) {
            setError("Nội dung phải có ít nhất 5 ký tự.");
            return;
        }

        if (!reviewRegex.test(trimmedReview)) {
            setError("Nội dung không hợp lệ (phải có chữ hoặc số).");
            return;
        }

        // ✅ Nếu hợp lệ: Xóa lỗi và gửi API
        setError("");

        const reviewToSend = {
            userId: user.id,
            content: trimmedReview,
        };

            fetch(`http://localhost:8080/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Thêm token vào header
                },
                body: JSON.stringify(reviewToSend),
            })
                .then(res => res.json())
                .then(newReview => {
                    setReviews(prev => [newReview, ...prev]);
                    setUserReview('');
                })
                .catch(err => console.error(err));


    };


    // Lấy 4 đánh giá mới nhất
    const latestReviews = reviews
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

    return (
        <div className="reviews-section">
            <h3>Đánh giá của khách hàng</h3>
            <p>WatchStore tự hào là website có lượng đánh giá nhiều nhất tại Việt Nam</p>
            <div className="stars">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                ))}
            </div>
            <a href="/" className="see-more">Xem thêm đánh giá</a>

            <div className="review-cards">
                {latestReviews.map((r, i) => (
                    <div className="review-card" key={i}>
                        <img src={userImage} alt="user" />
                        <p>{r.content}</p>
                        <div className="reviewer">
                            <strong>{r.userId ? `Người dùng ${r.userId}` : 'Ẩn danh'}</strong>
                            <div className="verified">
                                <FaCheckCircle className="check-icon" />
                                <span>Đã mua hàng</span>
                            </div>
                            <div className="review-date">
                                {new Date(r.createdAt).toLocaleString('vi-VN')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="review-form">
                <h4>Gửi đánh giá của bạn</h4>
                <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Viết đánh giá của bạn..."
                />{error && (
                <div style={{ color: "red", marginTop: 5, fontSize: 14 }}>{error}</div>
            )}
                <button onClick={handleSubmit}>Gửi đánh giá</button>
            </div>
        </div>
    );
};

export default CustomerReviews;
