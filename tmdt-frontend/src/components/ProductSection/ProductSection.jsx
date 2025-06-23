// src/components/ProductSection/ProductSection.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ProductCard/ProductCard';

const ProductSection = ({ title, products = [] }) => {
    return (
        <section className="my-8 px-4">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={4} // Số sản phẩm hiển thị trong 1 hàng
                navigation
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default ProductSection;
