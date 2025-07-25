import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { getAllProducts } from "../../api/fetchProducts";
import ProductCard from "./ProductCard";
import FilterSection from "../../components/Filters/FilterSection";
import PriceRangeSelector from "../../components/Filters/PriceRangeSelector";
import Pagination from "../../components/Pagination";
import { FiSearch } from "react-icons/fi";
import { fetchCategories } from "../../api/fetchCategories";

const ProductListPage = ({ categoryType, useStaticData = true }) => {
    const dispatch = useDispatch();
    const categoryData = useSelector((state) => state?.categoryState?.categories);
    const [sortOption, setSortOption] = useState("default");
    const [filters, setFilters] = useState({
        categories: [],
        types: [],
        colors: [],
        priceRange: { min: 0, max: 30000000 },
    });

    const [dynamicFilters, setDynamicFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [openFilterKey, setOpenFilterKey] = useState(null);
    const [filterOpen, setFilterOpen] = useState(true);

    const productsPerPage = 12;

    // Lấy category đang chọn
    const category = useMemo(() => {
        return selectedCategory || categoryData?.find(el => el?.code === categoryType) || null;
    }, [categoryType, categoryData, selectedCategory]);

    // Cập nhật selectedCategory nếu categoryType thay đổi
    useEffect(() => {
        if (categoryType && categoryData?.length > 0) {
            const found = categoryData.find((el) => el.code === categoryType);
            setSelectedCategory(found || null);
        }
    }, [categoryType, categoryData]);

    // Lấy danh sách danh mục từ API và tạo dynamic filters
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const categories = await fetchCategories();
                if (Array.isArray(categories)) {
                    const options = categories.map((cat) => cat.name);
                    setDynamicFilters([
                        {
                            key: "categories", // mới: đổi từ 'brands' → 'categories'
                            title: "Danh mục",
                            options: options,
                        }
                    ]);
                }
            } catch (error) {
                console.error("❌ Lỗi khi tải bộ lọc danh mục:", error);
            }
        };

        fetchFilterOptions();
    }, []);

    // Lấy danh sách sản phẩm và lọc theo filters
    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setLoading(true));
            try {
                const allProducts = category?.id
                    ? await getAllProducts(category.id)
                    : await getAllProducts();

                const filtered = allProducts.filter((p) => {
                    const matchCategory = !filters.categories.length || filters.categories.includes(p.categoryName); // ✅ lọc theo category name
                    const matchType = !filters.types.length || filters.types.includes(p.categoryTypeName);
                    const matchPrice = p.price >= filters.priceRange.min && p.price <= filters.priceRange.max;
                    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

                    return matchCategory && matchType && matchPrice && matchSearch;
                });

                if (sortOption === "priceAsc") {
                    filtered.sort((a, b) => a.price - b.price);
                } else if (sortOption === "priceDesc") {
                    filtered.sort((a, b) => b.price - a.price);
                } else if (sortOption === "latest") {
                    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }

                setProducts(filtered);
                setPage(1);
            } catch (error) {
                console.error("❌ Lỗi khi lấy sản phẩm:", error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProducts();
    }, [category?.id, filters, searchTerm, sortOption, useStaticData]);

    // Scroll về đầu trang khi đổi trang
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const displayedProducts = products.slice((page - 1) * productsPerPage, page * productsPerPage);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const toggleSelected = (filterKey) => (value) => {
        setFilters((prev) => {
            const currentList = prev[filterKey];
            const newList = currentList.includes(value)
                ? currentList.filter((item) => item !== value)
                : [...currentList, value];
            return { ...prev, [filterKey]: newList };
        });
    };

    return (
        <div className="relative min-h-screen font-sans text-gray-800 bg-gray-100">
            <div className="flex">
                {filterOpen && (
                    <aside className="relative z-10 w-72 bg-white p-4 border-r border-gray-200 shadow-lg min-h-screen">
                        <h4 className="text-lg font-bold mb-6 text-blue-800">Bộ lọc sản phẩm</h4>

                        <div className="relative mt-8 max-w-md mx-auto mb-5">
                            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl z-10" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow transition duration-200"
                            />
                        </div>

                        <div className="mb-6">
                            <PriceRangeSelector
                                currentMin={filters.priceRange.min}
                                currentMax={filters.priceRange.max}
                                onChange={({ currentMin, currentMax }) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        priceRange: { min: currentMin, max: currentMax },
                                    }))
                                }
                            />
                        </div>

                        {/* Hiển thị dynamic filters từ API */}
                        {dynamicFilters.map(({ key, title, options }) => (
                            <FilterSection
                                key={key}
                                title={title}
                                options={options}
                                selected={filters[key]}
                                onChange={toggleSelected(key)}
                                isOpen={openFilterKey === key}
                                onToggleOpen={() =>
                                    setOpenFilterKey((prev) => (prev === key ? null : key))
                                }
                            />
                        ))}
                    </aside>
                )}

                <main className="flex-1 p-6 transition-all duration-300 max-w-screen-xl mx-auto">
                    {!filterOpen && (
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="hidden lg:flex absolute top-1/2 left-0 transform -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-full items-center justify-center shadow hover:bg-blue-700 z-40"
                        >
                            <span className="text-lg font-bold">{'>'}</span>
                        </button>
                    )}

                    <div className="flex flex-col gap-4 md:flex-row justify-between items-center px-4 md:px-16 mt-2 pt-2">
                        <p className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight drop-shadow-md leading-snug">
                            {category?.description || 'Tất cả sản phẩm'}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-700">
                            {products.length.toLocaleString()} sản phẩm

                            <div className="w-px h-5 bg-gray-300" />

                            <div className="flex items-center gap-2">
                                <label htmlFor="sort" className="text-xs md:text-sm text-gray-700 font-medium">
                                    Sắp xếp:
                                </label>
                                <select
                                    id="sort"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="text-xs md:text-sm py-2 px-4 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="default">Mặc định</option>
                                    <option value="latest">Mới nhất</option>
                                    <option value="priceAsc">Giá tăng dần</option>
                                    <option value="priceDesc">Giá giảm dần</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {displayedProducts.length === 0 ? (
                        <p className="text-center text-gray-500 text-base">
                            Không có sản phẩm nào phù hợp.
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300">
                                {displayedProducts.map((item) => (
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
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductListPage;
