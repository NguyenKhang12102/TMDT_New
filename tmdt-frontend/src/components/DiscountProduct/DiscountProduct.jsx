import './DiscountProduct.css';
import { Link } from 'react-router-dom';
import ProductCard from '../../pages/ProductList/ProductCard.jsx';
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { setLoading } from "../../store/features/common.js";
import { getAllProducts } from "../../api/fetchProducts.js";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = ({ onClick }) => (
    <div className="slick-arrow slick-next" onClick={onClick}>
        ›
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div className="slick-arrow slick-prev" onClick={onClick}>
        ‹
    </div>
);

const DiscountProduct = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);

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

    const discountedProducts = products.slice(0, 20);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 },
            },
        ],
    };


    return (
        <div className="discount-preview-section py-10 px-4 bg-gray-50">
            <h2 className="text-center text-2xl font-bold text-red-600 mb-8">Khuyến Mãi Hot</h2>

            <div className="product-slider-wrapper px-3 max-w-screen-xl mx-auto">
                <Slider {...sliderSettings}>
                    {discountedProducts.map((item) => (

                        <div className="overflow-visible">
                            <ProductCard
                                key={`${item.id}-${item.slug}`}
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


            <Link to="/products" className="view-all-button">
                Xem tất cả sản phẩm <b>khuyến mãi</b>
            </Link>

        </div>
    );
};

export default DiscountProduct;
