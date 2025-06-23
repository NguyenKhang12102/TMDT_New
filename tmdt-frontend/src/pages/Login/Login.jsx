import React, { useCallback, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/features/common.js";
import { loginAPI } from '../../api/authentication.js';
import { saveToken } from "../../utils/jwt-helper.js";
import { setAuthenticated } from "../../store/features/authSlice.jsx";
import { loadUserInfo } from "../../store/features/user.js";
import { fetchUserDetails } from '../../api/UserInfo.js';
import GoogleSignIn from "../../components/Buttons/GoogleSignIn.jsx";

const LoginPage = () => {
    const [values, setValues] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOnChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    }, []);

        const onSubmit = useCallback((e) => {
        e.preventDefault();
        setError('');
        dispatch(setLoading(true));
        loginAPI(values)
            .then(async res => {
                if (res?.token) {
                    saveToken(res.token);
                    dispatch(setAuthenticated(true));
                    navigate('/');
                    try {
                        const user = await fetchUserDetails();
                        dispatch(loadUserInfo(user));
                    } catch (err) {
                        console.error("Lỗi khi tải lại user:", err);
                    }
                } else {
                    setError("Đã xảy ra lỗi, vui lòng thử lại.");
                }
            })
            .catch(() => {
                setError("Thông tin đăng nhập không đúng.");
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, [dispatch, navigate, values]);

    return (
        <div className="flex justify-center items-center h-screen bg-white px-4">
            <div className="w-full max-w-md bg-gray-100 rounded-3xl shadow-sm p-10 border border-gray-200">
                <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">Đăng nhập</h2>
                <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg mt-6">

                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="userName"
                            name="userName"
                            value={values.userName}
                            onChange={handleOnChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={handleOnChange}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 text-center -mt-2">{error}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition duration-200 shadow-sm"
                    >
                        Đăng nhập
                    </button>
                </form>


                <div className="flex justify-between mt-5 text-sm text-gray-600">
                    <NavLink to="/forgotPass" className="hover:underline">Quên mật khẩu?</NavLink>
                    <NavLink to="/register" className="hover:underline">Tạo tài khoản</NavLink>
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm">Hoặc đăng nhập bằng</div>

                <div className="mt-4 flex flex-col gap-3">
                    {/* Google Button */}
                    <GoogleSignIn/>

                    {/* Facebook Button */}
                    <button
                        className="w-full flex items-center justify-center gap-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook"
                             className="w-5 h-5"/>
                        <span className="text-sm font-medium">Đăng nhập với Facebook</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
