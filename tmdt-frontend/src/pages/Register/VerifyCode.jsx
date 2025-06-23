import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { verifyAPI, resendVerificationAPI } from '../../api/authentication';
import { useNavigate } from 'react-router-dom';

const VerifyCode = ({ email }) => {
    const [values, setValues] = useState({
        userName: email,
        code: '',
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendMessage, setResendMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleVerify = useCallback(
        (e) => {
            e.preventDefault();
            setError('');
            dispatch(setLoading(true));

            verifyAPI(values)
                .then(() => {
                    setMessage('Xác minh thành công! Đang chuyển đến trang đăng nhập...');
                })
                .catch(() => {
                    setError('Mã xác minh không chính xác hoặc đã hết hạn.');
                })
                .finally(() => {
                    dispatch(setLoading(false));
                });
        },
        [dispatch, values]
    );

    const handleResendCode = () => {
        setError('');
        setResendMessage('');

        if (resendCooldown > 0) return;

        dispatch(setLoading(true));
        resendVerificationAPI(email)
            .then(() => {
                setResendMessage('Mã xác minh mới đã được gửi đến email.');
                setResendCooldown(180); // 3 phút
            })
            .catch((err) => {
                const backendMessage = err.response?.data;
                setError(backendMessage || 'Không thể gửi lại mã. Vui lòng thử lại sau.');
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendCooldown]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                {!message ? (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                            Xác minh tài khoản
                        </h2>
                        <p className="text-sm text-gray-700 text-center mb-4">
                            Mã xác minh đã được gửi đến <span className="font-medium">{email}</span>.
                        </p>

                        <form onSubmit={handleVerify} className="space-y-4">
                            <input
                                type="text"
                                name="code"
                                value={values.code}
                                onChange={handleInputChange}
                                maxLength={6}
                                required
                                placeholder="Nhập mã xác minh"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring focus:ring-blue-500 mb-4"
                            />
                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-6"
                            >
                                Xác minh
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendCooldown > 0}
                                className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                            >
                                {resendCooldown > 0
                                    ? `Gửi lại mã sau ${resendCooldown}s`
                                    : 'Gửi lại mã xác minh'}
                            </button>
                            {resendMessage && (
                                <p className="mt-2 text-green-600 text-sm">{resendMessage}</p>
                            )}
                        </div>

                        {error && (
                            <p className="mt-4 text-sm text-center text-red-600">{error}</p>
                        )}
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-green-700 text-lg font-medium">{message}</p>
                        <p className="text-sm text-gray-500 mt-2">Đang chuyển hướng đến trang đăng nhập...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyCode;
