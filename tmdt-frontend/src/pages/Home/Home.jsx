// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import HeroSection from '../../components/HeroSection/HeroSection.jsx';
import CategorySection from '../../components/CategorySection/CategorySection.jsx';
import ProcessSteps from '../../components/ProcessSteps/ProcessSteps.jsx';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection.jsx';
import CustomerReview from '../../components/CustomerReview/CustomerReview.jsx';
import ProductSection from "../../components/ProductSection/ProductSection.jsx";

const HomePage = () => {
    const [bestSelling, setBestSelling] = useState([]);
    const [newest, setNewest] = useState([]);
    const [mostViewed, setMostViewed] = useState([]);


    useEffect(() => {
        fetchHomeProductSections();
    }, []);

    const fetchHomeProductSections = async () => {
        try {
            const [
                bestSellingRes,
                newestRes,
                mostViewedRes
            ] = await Promise.all([
                axios.get('/api/products/best-selling?limit=8'),
                axios.get('/api/products/newest?limit=8'),
                axios.get('/api/products/most-viewed?limit=8'),
            ]);

            console.log("Best selling response:", bestSellingRes.data); // ✅ nên log để kiểm tra

            // Không có `.data.data`, vì trả về trực tiếp mảng
            setBestSelling(bestSellingRes.data);
            setNewest(newestRes.data);
            setMostViewed(mostViewedRes.data);
        } catch (err) {
            console.error('❌ Error fetching home sections:', err);
        }
    };


    return (
        <div className="bg-gray-50">
            <HeroSection />

            <section className="py-12 px-4 md:px-12 bg-white">
                <ProductSection title="🔥 Bán chạy nhất" products={bestSelling} />
            </section>

            <section className="py-12 px-4 md:px-12 bg-gray-100">
                <ProductSection title="🆕 Sản phẩm mới" products={newest} />
            </section>

            <section className="py-12 px-4 md:px-12 bg-white">
                <ProductSection title="👀 Xem nhiều nhất" products={mostViewed} />
            </section>

            <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <CategorySection />
            </section>

            <section className="py-16 bg-gray-100">
                <ProcessSteps />
            </section>

            <section className="py-16 bg-white">
                <FeaturesSection />
            </section>

            <section className="py-16 bg-gray-50">
                <CustomerReview />
            </section>
        </div>
    );
};

export default HomePage;
