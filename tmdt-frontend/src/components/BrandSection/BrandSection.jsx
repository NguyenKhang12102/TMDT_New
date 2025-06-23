// BrandSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import './BrandSection.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import omegaLogo from '../../assets/brands/omega.png';
import casioLogo from '../../assets/brands/casi.png';
import seikoLogo from '../../assets/brands/seik.png';
import tissotLogo from '../../assets/brands/tissot.png';

import ProductCard from '../../pages/ProductList/ProductCard';
import { setLoading } from '../../store/features/common';
import { getAllProducts } from '../../api/fetchProducts';
import { useDispatch } from 'react-redux';
import {addProduct} from "../../store/features/product.js";

const brands = [
    { name: 'All', logo: null },
    { name: 'Citizen', logo: null },
    { name: 'Omega', logo: omegaLogo },
    { name: 'Casio', logo: casioLogo },
    { name: 'Seiko', logo: seikoLogo },
    { name: 'Tissot', logo: tissotLogo },
];

const BrandSection = () => {
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();



    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setLoading(true));
            try {
                const allProducts = await getAllProducts();
                setProducts(allProducts);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchProducts();
    }, [dispatch]);

    const filteredProducts = (selectedBrand === 'All'
            ? products
            : products.filter(p => p.brand === selectedBrand)
    ).slice(0, 20);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };
    return (
        <section className="brand-section bg-gray-50 py-10 px-4">
            <div className="brand-logos flex justify-center gap-4 flex-wrap mb-6">
                {brands.filter(b => b.logo).map(brand => (
                    <div key={brand.name} className="brand-logo-item">
                        <img src={brand.logo} alt={brand.name} className="h-10 object-contain"/>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Thương hiệu đồng hồ</h2>

            <div className="brand-tabs flex justify-center gap-2 flex-wrap mb-6">
                {brands.map(brand => (
                    <button
                        key={brand.name}
                        className={`px-4 py-1.5 border rounded-full text-sm ${
                            selectedBrand === brand.name
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white border-gray-300 text-gray-800'
                        }`}
                        onClick={() => setSelectedBrand(brand.name)}
                    >
                        {brand.name}
                    </button>
                ))}
            </div>

            <div className="product-slider-wrapper px-3 max-w-screen-xl mx-auto relative overflow-visible">
                <Slider {...sliderSettings}>
                    {filteredProducts.map((item) => (
                        <div key={item.id} className="overflow-visible px-2"> {/* ✅ Tách riêng wrapper */}
                            <ProductCard
                                id={item.id}
                                title={item.name}
                                description={item.description}
                                price={item.price}
                                brand={item.brand}
                                thumbnail={item.thumbnail}
                                slug={item.slug}
                                rating={item.rating}
                                images={item.images}
                                discountPrice={item.discountPrice}
                                stockQuantity={item.stockQuantity}
                                insideSlider={true}
                            />
                        </div>
                    ))}
                </Slider>

            </div>

            <div className="view-all mt-8 text-center">
                <Link
                    to="/products"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Xem tất cả sản phẩm
                </Link>
            </div>
        </section>
    );
};

export default BrandSection;
