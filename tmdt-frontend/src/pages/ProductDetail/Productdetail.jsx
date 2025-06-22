import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { getAllProducts } from '../../api/fetchProducts';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../ProductList/ProductCard.jsx';
import { addItemToCartAction } from '../../store/actions/cartAction';
import CustomerReviewDetail from "../../components/CustomerReviewDetail/CustomerReviewDetail.jsx";
import { setShowCart } from "../../store/features/uiSlice.jsx";

const ProductDetail = () => {
    const { product } = useLoaderData();
    const dispatch = useDispatch();
    const categories = useSelector((state) => state?.categoryState?.categories);
    // const navigate = useNavigate();
    const [image, setImage] = useState(product?.thumbnail || '');
    const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [error, setError] = useState('');

    const productCategory = useMemo(() => {
        return categories?.find((c) => c.id === product.categoryId);
    }, [categories, product]);

    useEffect(() => {
        setBreadCrumbLinks([
            { title: 'Trang chủ', path: '/' },
            { title: productCategory?.name || 'Sản phẩm', path: '/products' },
            { title: product.name }
        ]);
    }, [productCategory, product]);

    useEffect(() => {
        getAllProducts(product?.categoryId, product?.categoryTypeId)
            .then((res) => {
                const filtered = res?.filter((item) => item?.id !== product?.id);
                setSimilarProducts(filtered);
            })
            .catch(() => {});
    }, [product?.categoryId, product?.categoryTypeId, product?.id]);

    const addItemToCart = useCallback(() => {
        if (product?.stockQuantity <= 0) {
            setError('Sản phẩm tạm hết hàng');
            return;
        }

        dispatch(addItemToCartAction({
            productId: product?.id,
            thumbnail: product?.thumbnail,
            name: product?.name,
            variant: null,
            quantity: 1,
            subTotal: product?.price,
            price: product?.price,
        }));
        dispatch(setShowCart(true));

    }, [dispatch, product]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto font-sans">
            {/* Breadcrumb */}
            <nav className="text-gray-500 text-sm mb-6 flex flex-wrap items-center">
                {breadCrumbLinks.map((link, i) =>
                    link.path ? (
                        <React.Fragment key={i}>
                            <Link
                                to={link.path}
                                className="hover:underline hover:text-blue-600 transition-colors"
                            >
                                {link.title}
                            </Link>
                            {i !== breadCrumbLinks.length - 1 && (
                                <span className="mx-2 text-gray-400">/</span>
                            )}
                        </React.Fragment>
                    ) : (
                        <span key={i} className="text-gray-800 font-semibold">
                            {link.title}
                        </span>
                    )
                )}
            </nav>

            {/* Product Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Product Images */}
                <div>
                    <div className="border rounded-xl overflow-hidden shadow-md bg-white">
                        <img
                            src={image}
                            alt={product.name}
                            className="w-full h-auto object-contain max-h-[480px] p-4"
                        />
                    </div>
                    <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
                        {(product.images ?? []).map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${product.name}-${idx}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                                    image === img
                                        ? 'border-blue-500 ring-2 ring-blue-300'
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}
                                onClick={() => setImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-3xl font-bold text-gray-900 leading-snug">
                        {product.name}
                    </h3>

                    <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                        {product.description}
                    </p>

                    <div className="text-2xl font-bold text-red-600">
                        Giá: {Number(product.price).toLocaleString()}₫
                    </div>

                    {/* Thông tin ưu đãi và bảo hành */}
                    <div className="space-y-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                        <div className="text-green-700 font-medium">
                            🎁 Ưu đãi:
                            <p className="text-gray-700 ml-2">Giảm giá 10% cho đơn hàng đầu tiên. Miễn phí giao hàng toàn quốc.</p>
                        </div>
                        <div className="text-blue-700 font-medium">
                            🛡️ Bảo hành:
                            <p className="text-gray-700 ml-2">Bảo hành chính hãng 12 tháng, đổi trả trong 7 ngày.</p>
                        </div>
                    </div>

                    <button
                        disabled={product?.stockQuantity <= 0}
                        onClick={addItemToCart}
                        className={`relative group w-fit px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ease-in-out transform shadow-lg overflow-hidden
    ${product?.stockQuantity <= 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 hover:shadow-xl'}
  `}
                    >
  <span className="relative z-10 flex items-center gap-2">
    🛒 Thêm vào giỏ hàng
  </span>
                        <span
                            className="absolute left-0 top-0 h-full w-0 bg-white opacity-10 transition-all duration-500 group-hover:w-full"
                        ></span>
                    </button>


                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>
            </div>

            {/* Similar Products */}
            <div className="mt-16">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                    Sản phẩm tương tự
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {similarProducts.length > 0 ? (
                        similarProducts.map((p) => (
                            <ProductCard
                                key={`${p.id}-${p.slug}`}
                                id={p.id}
                                title={p.name}
                                description={p.description}
                                price={p.price}
                                brand={p.brand}
                                thumbnail={p.thumbnail}
                                slug={p.slug}
                                rating={p.rating}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full">
                            Không có sản phẩm tương tự
                        </p>
                    )}
                </div>
            </div>

            <CustomerReviewDetail productId={product.id} />
        </div>
    );
};

export default ProductDetail;
