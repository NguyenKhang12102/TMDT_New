import React, { useEffect, useState } from 'react';
import {
    Search,
    User,
    ShoppingBag,
    LogOut,
    Bell,
    Menu,
    X
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NotificationPanel from '../Notification/Notification.jsx';
import { fetchCategories } from  '../../api/fetchCategories.js';
import { loadCategories } from '../../store/features/category';
import { setLoading } from '../../store/features/common';
import { logout } from '../../store/features/authSlice';
import { logoutUser } from '../../store/features/user';
import staticCategories from '../../data/staticCategories.js';
import {countCartItems} from "../../store/features/cart.js";
import Cart from '../../pages/Cart/Cart.jsx';
import {selectShowCart, setShowCart} from "../../store/features/uiSlice.jsx";
import "../../components/Header/headerComponent.css";
import logo from "../../assets/logo/logo.png";

const HeaderComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const categories = useSelector(state => state.categoryState.categories);

    const [isOpen, setIsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    // const cartItems = useSelector(selectCartItems);
    const showCart = useSelector(selectShowCart);
    const [showSearch, setShowSearch] = useState(false);


    const [notifications, setNotifications] = useState([
        { title: 'Đơn hàng #1234 đã được giao', time: '2 giờ trước' },
        { title: 'Ưu đãi 20% cho thành viên VIP', time: 'Hôm qua' },
    ]);

    const [showHeader, setShowHeader] = useState(true);
    const [lastScroll, setLastScroll] = useState(0);

    const  cartLength = useSelector(countCartItems);

    useEffect(() => {
        dispatch(loadCategories(staticCategories));
        const loadData = async () => {
            try {
                dispatch(setLoading(true));
                const res = await fetchCategories();
                if (res?.length > 0) dispatch(loadCategories(res));
            } catch (err) {
                console.error('Lỗi khi load category', err);
            } finally {
                dispatch(setLoading(false));
            }
        };
        loadData();
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const current = window.scrollY;
            if (current > lastScroll && current > 80) setShowHeader(false);
            else setShowHeader(true);
            setLastScroll(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScroll]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(logoutUser());
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleClearAll = () => setNotifications([]);

    return (
        <>
            <header
                className={`bg-white border-b border-gray-200 px-0 py-4 font-sans fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="relative flex items-center justify-between w-full px-6">
                    <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-black tracking-widest">
                            <img
                                src={logo}
                                alt="Triple D Logo"
                                height={50}
                                width={40}
                                className="ml-[14px] -mb-[5px]"
                            />
                            <p className="">Triple D</p>
                    </NavLink>

                    <nav
                        className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10 text-base font-semibold text-black">
                        <NavLink to="/"
                                 className={({isActive}) => isActive ? 'text-black' : 'text-gray-500 hover:text-black'}>Trang
                            chủ</NavLink>
                        <NavLink to="/products" className="text-gray-500 hover:text-black">Sản phẩm</NavLink>
                        <NavLink to="/aboutus" className="text-gray-500 hover:text-black">Giới thiệu</NavLink>
                        <NavLink to="/services" className="text-gray-500 hover:text-black">Dịch vụ</NavLink>
                        <NavLink to="/contact" className="text-gray-500 hover:text-black">Liên hệ</NavLink>
                    </nav>

                    <button onClick={() => setShowMenu(!showMenu)} className="md:hidden text-black">
                        {showMenu ? <X size={28}/> : <Menu size={28}/>}
                    </button>

                    <div className="hidden md:flex items-center gap-5 text-xl text-black ml-auto">
                        <button onClick={() => setShowSearch(true)} className="hover:opacity-70">
                            <Search size={24} />
                        </button>



                        <button onClick={() => setIsOpen(true)} className="relative hover:opacity-70">
                            <Bell size={24}/>
                            {notifications.length > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">{notifications.length}</span>
                            )}
                        </button>
                        <button   onClick={() => dispatch(setShowCart(true))} className="relative hover:opacity-70">
                            <ShoppingBag size={24}/>
                            {cartLength > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
            {cartLength}
        </span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <NavLink to="/profile" className="hover:opacity-70"><User size={24}/></NavLink>
                                <button onClick={handleLogout} className="hover:text-red-600"><LogOut size={24}/>
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" className="hover:opacity-70"><User size={24}/></NavLink>
                        )}
                    </div>
                </div>

                {showMenu && (
                    <div className="md:hidden px-6 pb-4 pt-2 space-y-2 bg-white border-t border-gray-200">
                        <NavLink to="/" className="block text-gray-800 font-medium" onClick={() => setShowMenu(false)}>Trang
                            chủ</NavLink>
                        {categories?.map((cat, idx) => (
                            <NavLink key={cat.code + idx} to={`/${cat.code.toLowerCase()}`}
                                     className="block text-gray-800 font-medium" onClick={() => setShowMenu(false)}>
                                Đồng Hồ {cat.name}
                            </NavLink>
                        ))}
                        <NavLink to="/aboutus" className="block text-gray-800 font-medium"
                                 onClick={() => setShowMenu(false)}>Giới thiệu</NavLink>
                        <NavLink to="/services" className="block text-gray-800 font-medium"
                                 onClick={() => setShowMenu(false)}>Dịch vụ</NavLink>
                        <NavLink to="/contact" className="block text-gray-800 font-medium"
                                 onClick={() => setShowMenu(false)}>Liên hệ</NavLink>
                    </div>
                )}
            </header>

            <NotificationPanel
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                notifications={notifications}
                onClearAll={handleClearAll}
            />
            {showCart && <Cart />}
            {showSearch && (
                <>
                    {/* Nền mờ + khóa nền */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                        onClick={() => setShowSearch(false)}
                    />

                    {/* Ô tìm kiếm trung tâm */}
                    <div className="fixed top-[15%] mt-[130px] left-1/2 z-50 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-8 w-[95%] max-w-2xl animate-slide-down relative">

                    <button
                            onClick={() => setShowSearch(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black z-50"
                        >
                            <X size={22} />
                        </button>

                        {/* Ô tìm kiếm */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                autoFocus
                                className="w-full border border-gray-300 px-4 py-2 pr-12 rounded-md focus:outline-none focus:ring focus:border-black"
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                <Search size={20} />
                            </button>
                        </div>

                    </div>
                </>
            )}




            <div className="h-[80px]"></div>
        </>
    );
};

export default HeaderComponent;
