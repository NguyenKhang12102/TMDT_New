import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('❌ Mật khẩu mới và xác nhận không khớp');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('⚠️ Bạn chưa đăng nhập');
            return;
        }

        dispatch(setLoading(true));

        try {
            const response = await axios.put(
                'http://localhost:8080/api/user/change-password',
                {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const message =
                typeof response.data === 'string'
                    ? response.data
                    : response.data?.message || 'Đổi mật khẩu thành công';

            setSuccess(message);
            setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });

            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            const res = err?.response?.data;
            const errMsg =
                typeof res === 'string'
                    ? res
                    : res?.message || res?.error || 'Có lỗi xảy ra';

            console.error('❌ Error:', errMsg);
            setError(errMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Đổi Mật Khẩu</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <div className="text-red-600 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}

                <div>
                    <label className="block mb-1 font-medium">Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Mật khẩu mới</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        minLength={6}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Nhập lại mật khẩu mới</label>
                    <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordPage;
