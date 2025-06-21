import React, { useState } from 'react';
import Img1 from '../../assets/hero.jpg';
import Img2 from '../../assets/banner2.jpg';
import Img3 from '../../assets/banner3.jpg';
import './HeroSection.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const HeroSection = () => {
    const images = [ Img3,Img2, Img1];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex(prevIndex =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div
            className="hero-section"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
            <div className="overlay"></div>

            {/* Icon prev ở giữa bên trái */}
            <button className="icon-center left" onClick={handlePrev} aria-label="Previous">
                <IoIosArrowBack />
            </button>

            {/* Icon next ở giữa bên phải */}
            <button className="icon-center right" onClick={handleNext} aria-label="Next">
                <IoIosArrowForward />
            </button>

            <main className="hero-content">
                <div className="hero-text">
                    <h2>Bộ Sưu Tập Mới</h2>
                </div>
                <p className="hero-title">Đồng Hồ Cao Cấp</p>
                <p className="hero-subtitle">Tinh tế / Chính xác / Đẳng cấp</p>
                <button className="hero-button">Mua Ngay</button>
            </main>
        </div>
    );
};

export default HeroSection;
