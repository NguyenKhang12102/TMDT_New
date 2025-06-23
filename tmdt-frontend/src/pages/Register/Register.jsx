import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerAPI } from '../../api/authentication.js';
import { setLoading } from '../../store/features/common.js';
import VerifyCode from './VerifyCode.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: ''
    });

    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [enableVerify, setEnableVerify] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const validateStep = () => {
        const errors = {};
        if (step === 1) {
            if (!values.lastName.trim()) errors.lastName = 'Họ không được để trống';
            if (!values.firstName.trim()) errors.firstName = 'Tên không được để trống';
        }
        if (step === 2) {
            if (!values.email.trim()) errors.email = 'Email không được để trống';
            if (!values.phoneNumber.trim()) errors.phoneNumber = 'Số điện thoại không được để trống';
        }
        if (step === 3) {
            if (!values.dateOfBirth) errors.dateOfBirth = 'Ngày sinh không được để trống';
        }

        if (step === 4) {
            if (!values.password.trim()) errors.password = 'Mật khẩu không được để trống';
            if (!values.confirmPassword.trim()) errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        setError('');
        if (validateStep()) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        setError('');
        setFieldErrors({});
        setStep((prev) => prev - 1);
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        dispatch(setLoading(true));

        const phoneRegex = /^0\d{9}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        const nameRegex = /^[A-Za-zÀ-Ỹà-ỹ\s']+$/;

        const errors = {};

        // Check trống
        if (!values.firstName.trim()) errors.firstName = 'Tên không được để trống';
        if (!values.lastName.trim()) errors.lastName = 'Họ không được để trống';
        if (!values.email.trim()) errors.email = 'Email không được để trống';
        if (!values.phoneNumber.trim()) errors.phoneNumber = 'Số điện thoại không được để trống';
        if (!values.dateOfBirth) errors.dateOfBirth = 'Ngày sinh không được để trống';
        if (!values.password.trim()) errors.password = 'Mật khẩu không được để trống';
        if (!values.confirmPassword.trim()) errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';

        // Nếu có lỗi trống thì dừng luôn
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            dispatch(setLoading(false));
            return;
        }

        // Kiểm tra định dạng sau khi đã đảm bảo không trống
        if (!nameRegex.test(values.firstName)) errors.firstName = 'Tên không hợp lệ';
        if (!nameRegex.test(values.lastName)) errors.lastName = 'Họ không hợp lệ';
        if (!phoneRegex.test(values.phoneNumber)) errors.phoneNumber = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
        if (new Date(values.dateOfBirth) > new Date()) errors.dateOfBirth = 'Ngày sinh không được lớn hơn hiện tại';
        if (!passwordRegex.test(values.password)) errors.password = 'Mật khẩu phải từ 6 ký tự, ít nhất 1 chữ và 1 số';
        if (values.password !== values.confirmPassword) errors.confirmPassword = 'Mật khẩu xác nhận không khớp';

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
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
                <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-8">Đăng ký</h2>

                <div className="flex items-center justify-between mb-6">
                    {step > 1 ? (
                        <button type="button" onClick={prevStep} title="Quay lại">
                            <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-black dark:hover:text-white"/>
                        </button>
                    ) : (<div className="w-6"/>)}

                    {step < 4 ? (
                        <button type="button" onClick={nextStep} title="Tiếp theo">
                            <ArrowRight className="w-6 h-6 text-gray-600 hover:text-black dark:hover:text-white"/>
                        </button>
                    ) : (<div className="w-6"/>)}
                </div>
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 justify-center">
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (step < 4) nextStep();
                            }
                        }}
                        className="relative min-h-[280px] bg-white rounded-2xl shadow-xl p-6"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{opacity: 0, x: 50}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: -50}}
                                transition={{duration: 0.25}}
                            >
                                <div className="w-[280px] space-y-5">
                                    {step === 1 && (
                                        <>
                                            <div>
                                                <label
                                                    className="block text-sm font-semibold text-gray-700 mb-1">Họ</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={values.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Nguyễn"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                />
                                                {fieldErrors.lastName && (
                                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.lastName}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    className="block text-sm font-semibold text-gray-700 mb-1">Tên</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={values.firstName}
                                                    onChange={handleChange}
                                                    placeholder="Văn A"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                />
                                                {fieldErrors.firstName && (
                                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.firstName}</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <div>
                                                <label
                                                    className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    placeholder="you@example.com"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                />
                                                {fieldErrors.email && (
                                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Số
                                                    điện thoại</label>
                                                <input
                                                    name="phoneNumber"
                                                    value={values.phoneNumber}
                                                    onChange={handleChange}
                                                    placeholder="0123456789"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                />
                                                {fieldErrors.phoneNumber && (
                                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.phoneNumber}</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày
                                                sinh</label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={values.dateOfBirth}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                            />
                                            {fieldErrors.dateOfBirth && (
                                                <p className="text-red-600 text-sm mt-1">{fieldErrors.dateOfBirth}</p>
                                            )}
                                        </div>
                                    )}

                                    {step === 4 && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật
                                                    khẩu</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                />
                                                {fieldErrors.password && (
                                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Xác
                                                    nhận mật khẩu</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={values.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                                />
                                                {fieldErrors.confirmPassword && (
                                                    <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-black to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition mt-2 shadow-md"
                                            >
                                                Đăng ký
                                            </button>
                                        </>
                                    )}

                                    {error && (
                                        <p className="text-sm text-red-600 text-center mt-2">{error}</p>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </form>

                </div>

                <div className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
                    Đã có tài khoản?{' '}
                    <NavLink
                        to="/login"
                        className="text-black dark:text-white underline hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        Đăng nhập
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
