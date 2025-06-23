import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { getAllProducts } from "../../api/fetchProducts";
import ProductCard from "./ProductCard";
import FilterSection from "../../components/Filters/FilterSection";
import PriceRangeSelector from "../../components/Filters/PriceRangeSelector";
import Pagination from "../../components/Pagination";
import { FiSearch } from "react-icons/fi";

const ProductListPage = ({ categoryType, useStaticData = true }) => {
    const dispatch = useDispatch();
    const categoryData = useSelector((state) => state?.categoryState?.categories);
    const [sortOption, setSortOption] = useState("default");


    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        brands: [],
        types: [],
        colors: [],
        priceRange: { min: 0, max: 30000000 },
    });
    const [openFilterKey, setOpenFilterKey] = useState(null);
    const [filterOpen, setFilterOpen] = useState(true);

    const productsPerPage = 12;

    const filterConfigs = [
        { key: "brands", title: "danh mục", options: ["Phụ kiện & Link kiện", "Trang trí", "Quà tặng", "Mô hình","Chậu cây"] },
        // { key: "types", title: "Loại đồng hồ", options: ["Dây cao su", "Dây kim loại", "Dây da"] },
    ];

    const category = useMemo(() => {
        return selectedCategory || categoryData?.find(el => el?.code === categoryType) || null;
    }, [categoryType, categoryData, selectedCategory]);

    useEffect(() => {
        if (categoryType && categoryData?.length > 0) {
            const found = categoryData.find((el) => el.code === categoryType);
            setSelectedCategory(found || null);
        }
    }, [categoryType, categoryData]);

    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setLoading(true));
            try {
                const allProducts = category?.id ? await getAllProducts(category.id) : await getAllProducts();

                const filtered = allProducts.filter((p) => {
                    const matchBrand = !filters.brands.length || filters.brands.includes(p.brand);
                    const matchType = !filters.types.length || filters.types.includes(p.categoryTypeName);
                    const matchPrice = p.price >= filters.priceRange.min && p.price <= filters.priceRange.max;
                    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

                    return matchBrand && matchType && matchPrice && matchSearch;
                });

                setProducts(filtered);
                setPage(1);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchProducts();
    }, [category?.id, filters, searchTerm, useStaticData]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);
    useEffect(() => {
        const fetchProducts = async () => {
            dispatch(setLoading(true));
            try {
                const allProducts = category?.id
                    ? await getAllProducts(category.id)
                    : await getAllProducts();

                let filtered = allProducts.filter((p) => {
                    const matchBrand = !filters.brands.length || filters.brands.includes(p.brand);
                    const matchType = !filters.types.length || filters.types.includes(p.categoryTypeName);
                    const matchPrice =
                        p.price >= filters.priceRange.min && p.price <= filters.priceRange.max;
                    const matchSearch =
                        !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchBrand && matchType && matchPrice && matchSearch;
                });

                // Sorting logic
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
                console.error("Lỗi khi lấy sản phẩm:", error);
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchProducts();
    }, [category?.id, filters, useStaticData, searchTerm, sortOption]);


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
                {/* Sidebar */}
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

                        {filterConfigs.map(({ key, title, options }) => (
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


                    <div className="flex flex-col gap-4 md:flex-row justify-between items-center px-4 md:px-16 mt-[10px]  pt-[10px]">
                    {/* Title bên trái */}
                        <p className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight drop-shadow-md leading-snug">
                            {category?.description || 'Tất cả sản phẩm'}
                        </p>


                        {/* Sort + Kết quả bên phải */}
                        <div className="flex items-center space-x-4 text-sm text-gray-700">
                            {/* Tổng số sản phẩm */}

                                {products.length.toLocaleString()} sản phẩm


                            {/* Divider */}
                            <div className="w-px h-5 bg-gray-300" />

                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 10h14M3 16h10" />
                                </svg>
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
