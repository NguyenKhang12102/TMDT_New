import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../../api/fetchCategories'; // ✅ Danh mục
import { getProductByTypeId } from '../../api/fetchProducts';     // ✅ Đúng tên hàm export

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCateId, setSelectedCateId] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchCategories();
                setCategories(data || []);

                // ✅ Nếu có danh mục, gọi load sản phẩm cho danh mục đầu tiên
                if (data && data.length > 0) {
                    const firstCateId = data[0].id;
                    setSelectedCateId(firstCateId); // cập nhật state
                    const res = await getProductByTypeId(firstCateId);
                    setProducts(res);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        })();
    }, []);




    const handleCategoryClick = async (cateId) => {
        if (!cateId) return;
        setSelectedCateId(cateId);
        setLoading(true);

        try {
            const res = await getProductByTypeId(cateId); // ✅ Gọi đúng hàm trả về mảng
            setProducts(res);
        } catch (err) {
            console.error("Lỗi khi load sản phẩm:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };


    const selectedCategory = categories.find((c) => c.id === selectedCateId);

    return (
        <section className="px-6 md:px-16 py-16 bg-white rounded-2xl shadow-inner">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Khám phá sản phẩm theo danh mục</h2>
                <p className="text-gray-600 mb-8">
                    Hãy chọn danh mục để xem các sản phẩm nổi bật được in bằng công nghệ 3D hiện đại.
                </p>

                {/* Category Buttons */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {categories.map((cate) => (
                        <button
                            key={cate.id}
                            onClick={() => handleCategoryClick(cate.id)}
                            className={`px-5 py-2 rounded-full text-sm font-medium border transition duration-200 shadow-sm ${
                                selectedCateId === cate.id
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            {cate.name}
                        </button>
                    ))}
                </div>

                {/* Products Section */}
                {loading ? (
                    <p className="text-gray-500">Đang tải sản phẩm...</p>
                ) : selectedCateId ? (
                    <>
                        <h3 className="text-lg font-semibold mb-4">
                            {selectedCategory?.name
                                ? `Sản phẩm thuộc danh mục: ${selectedCategory.name}`
                                : 'Không tìm thấy tên danh mục'}
                        </h3>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((prod) => (
                                    <div
                                        key={prod.id}
                                        className="bg-white border p-4 rounded-xl shadow hover:shadow-lg transition"
                                    >
                                        <img
                                            src={prod.thumbnail || '/placeholder.jpg'}
                                            alt={prod.name}
                                            className="w-full h-40 object-cover rounded-lg mb-3"
                                        />
                                        <h4 className="text-base font-semibold text-gray-800 truncate">
                                            {prod.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {prod.price?.toLocaleString?.() || 0}₫
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Không có sản phẩm nào trong danh mục này.</p>
                        )}
                    </>
                ) : (
                    <p className="text-gray-400 italic">Vui lòng chọn một danh mục để bắt đầu.</p>
                )}
            </div>
        </section>
    );
};

export default CategorySection;
