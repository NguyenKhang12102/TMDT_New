import React, { useState, useEffect } from 'react';
import { Eye, X, Facebook, MessageCircle, Twitter, PrinterIcon, Link as LinkIcon } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const ProductCard = ({
                             id,
                         title,
                         price,
                         discountPrice,
                         brand,
                         thumbnail,
                         slug,
                         images = [],
                         stockQuantity,
                         insideSlider = false,
                     }) => {
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [mainImage, setMainImage] = useState(thumbnail);

    useEffect(() => {
        if (!isQuickViewOpen) setMainImage(thumbnail);
    }, [isQuickViewOpen, thumbnail]);

    return (
        <>
            <div className="relative text-center px-2 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition w-full max-w-[240px] mx-auto group">

            {/* Quick View button */}
                {!insideSlider && (
                    <button
                        onClick={() => setIsQuickViewOpen(true)}
                        className="absolute top-2 right-2 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-full p-1"
                    >
                        <Eye size={14} />
                    </button>
                )}

                <RouterLink to={`/product/${slug}`} className="block">
                    <img
                        src={thumbnail}
                        alt={title}
                        className="mx-auto object-contain h-[180px] mb-4"
                    />
                    <h5 className="text-gray-800 text-sm font-medium mb-2 line-clamp-2 min-h-[40px]">
                        {title}
                    </h5>
                    <p className="text-red-600 font-bold text-base">
                        {(discountPrice || price).toLocaleString()} <span className="text-sm font-normal">₫</span>
                    </p>

                </RouterLink>

            </div>

            {/* Quick View Modal */}
            {isQuickViewOpen && (
                <div  className="fixed inset-0 z-[99999] bg-black/40 flex justify-center items-center px-2 modal-overlay transition-all duration-300"
                     onClick={(e) => e.target.classList.contains('modal-overlay') && setIsQuickViewOpen(false)}>
                    <div className="bg-white rounded-lg shadow-md p-4 max-w-sm w-full relative text-sm"
                         onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            onClick={() => setIsQuickViewOpen(false)}
                        >
                            <X size={16}/>
                        </button>
                        <div className="grid gap-3">
                            <div>
                                <img src={mainImage} alt={title} className="rounded w-full h-[180px] object-contain"/>
                                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                                    {[thumbnail, ...images].map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            onClick={() => setMainImage(img)}
                                            alt={`thumb-${idx}`}
                                            className={`w-9 h-9 border rounded cursor-pointer object-cover ${
                                                mainImage === img ? 'border-blue-500 ring-2 ring-blue-400' : 'border-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 text-base">{title}</h4>
                                <p className="text-gray-600 text-sm">Thương hiệu: <span
                                    className="font-medium">{brand}</span></p>
                                <p className="text-gray-600 text-sm mb-1">
                                    Tình trạng:
                                    <span
                                        className={`font-medium ml-1 ${stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                                </p>
                                <div className="text-red-600 font-bold text-base">
                                    {(discountPrice || price).toLocaleString()}đ
                                    {discountPrice && (
                                        <span
                                            className="ml-1 text-gray-400 line-through text-sm">{price.toLocaleString()}đ</span>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-3 text-gray-500">
                                    <Facebook size={12}/>
                                    <MessageCircle size={12}/>
                                    <Twitter size={12}/>
                                    <PrinterIcon size={12}/>
                                    <LinkIcon size={12}/>
                                </div>
                                <RouterLink
                                    to={`/product/${slug}`}
                                    className="block mt-2 text-blue-600 hover:underline text-xs"
                                >
                                    Xem chi tiết sản phẩm
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;
