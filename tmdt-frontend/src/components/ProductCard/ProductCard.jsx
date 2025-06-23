// src/components/ProductCard/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="relative w-full h-56 overflow-hidden">
                <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">{product.description || 'Đồng hồ chính hãng'}</p>
                <div className="mt-2">
                    <span className="text-xl font-bold text-red-500">
                        {product.price.toLocaleString()}₫
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
