import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { verifyAPI } from '../../api/authentication';

const VerifyCode = ({ email }) => {
    const [values, setValues] = useState({
        userName: email,
        code: '',
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            setError('');
            dispatch(setLoading(true));

            verifyAPI(values)
                .then((res) => {
                    setMessage(
                        'Cảm ơn bạn! Email của bạn đã được xác minh thành công. Bây giờ bạn có thể đăng nhập.'
                    );
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

    const handleOnChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                {!message ? (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
                            Xác minh tài khoản
                        </h2>

                        <p className="text-sm text-gray-700 text-center">
                            Mã xác minh đã được gửi đến <span className="font-medium">{email}</span>. Vui lòng nhập mã để hoàn tất đăng ký.
                        </p>

                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            <input
                                type="text"
                                name="code"
                                value={values.code}
                                onChange={handleOnChange}
                                maxLength={6}
                                placeholder="Nhập mã 6 chữ số"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-center text-lg tracking-widest"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Xác minh
                            </button>
                        </form>

                        {error && (
                            <p className="mt-4 text-sm text-center text-red-600">{error}</p>
                        )}
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-green-700 text-lg font-medium">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyCode;
