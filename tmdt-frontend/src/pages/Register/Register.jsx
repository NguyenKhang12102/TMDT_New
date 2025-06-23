import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerAPI } from '../../api/authentication.js';
import { setLoading } from '../../store/features/common.js';
import VerifyCode from './VerifyCode.jsx';

const RegisterPage = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
    });

    const [error, setError] = useState('');
    const [enableVerify, setEnableVerify] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setError('');
        dispatch(setLoading(true));

        const phoneRegex = /^0\d{9}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;


        const nameRegex = /^[A-Za-zÀ-Ỹà-ỹ\s']+$/;



        if (!nameRegex.test(values.firstName) || !nameRegex.test(values.lastName)) {
            setError('Họ và tên không được chứa số');
            dispatch(setLoading(false));
            return;
        }



        if (!phoneRegex.test(values.phone)) {
            setError('Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0)');
            dispatch(setLoading(false));
            return;
        }

        if (!passwordRegex.test(values.password)) {
            setError('Mật khẩu phải từ 6 ký tự, có ít nhất 1 chữ và 1 số');
            dispatch(setLoading(false));
            return;
        }

        if (values.password !== values.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            dispatch(setLoading(false));
            return;
        }

        registerAPI(values)
            .then((res) => {
                if (res?.code === 200) {
                    setEnableVerify(true);
                }
            })
            .catch(() => {
                setError('Email đã tồn tại hoặc không hợp lệ!');
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }, [dispatch, values]);



    if (enableVerify) {
        return <VerifyCode email={values.email} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 px-3 py-12">
            <div
                className="w-full max-w-md bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-3xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-8">
                    Đăng ký
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Họ & Tên */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lastName"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ</label>
                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                                placeholder="Nguyễn"
                                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="firstName"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên</label>
                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                                placeholder="Văn A"
                                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện
                            thoại</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            placeholder="0123456789"
                            className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mật
                            khẩu</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword"
                               className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xác nhận mật
                            khẩu</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition"
                    >
                        Đăng ký
                    </button>
                </form>

                <div className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
                    Đã có tài khoản?{' '}
                    <NavLink to="/login"
                             className="text-black dark:text-white underline hover:text-gray-800 dark:hover:text-gray-200">
                        Đăng nhập
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
