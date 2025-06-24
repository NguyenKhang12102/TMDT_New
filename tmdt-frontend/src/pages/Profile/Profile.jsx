import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { setAuthenticated } from "../../store/features/authSlice";
import { addAddressAPI, fetchUserDetails } from '../../api/UserInfo.js';
import { loadUserInfo, saveAddress, selectUserInfo, selectIsUserAdmin } from '../../store/features/user.js';

import { Link } from "react-router-dom";
import { getToken } from "../../utils/jwt-helper.js";

const ProfilePage = () => {
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const isUserAdmin = useSelector(selectIsUserAdmin);
    const [isEditing, setIsEditing] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: ''
    });

    useEffect(() => {
        const loadData = async () => {
            dispatch(setLoading(true));
            try {
                const data = await fetchUserDetails();
                dispatch(loadUserInfo(data));
                dispatch(setAuthenticated(true));
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng:", err);
            } finally {
                dispatch(setLoading(false));
            }
        };
        loadData();
    }, [dispatch]);

    const handleAddAddress = async () => {
        const { street, city, state, phoneNumber } = newAddress;
        if (!street || !city || !state || !phoneNumber) {
            alert("Vui lòng nhập đầy đủ địa chỉ, thành phố, tỉnh và số điện thoại");
            return;
        }

        try {
            const added = await addAddressAPI(newAddress);
            dispatch(saveAddress(added));
            alert("Đã lưu địa chỉ thành công");
            setNewAddress({ street: '', city: '', state: '', zipCode: '', phoneNumber: '' });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi lưu địa chỉ");
        }
    };

    const handleRedeem = async (requiredPoints) => {
        try {
            const token = getToken();

            const res = await fetch(`http://localhost:8080/api/vouchers/redeem?points=${requiredPoints}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const text = await res.text();

            if (res.ok) {
                const data = JSON.parse(text);
                alert(`🎉 Đổi thành công! Bạn nhận được voucher ${data.discountPercentage}% - Mã: ${data.code}`);
                window.location.reload();
            } else {
                alert(text); // ví dụ: "Bạn không đủ điểm để đổi voucher này."
            }
        } catch (err) {
            console.error("Lỗi khi gọi API đổi điểm:", err);
            alert("Đã xảy ra lỗi khi gọi API đổi điểm.");
        }
    };


    const latestAddress = user?.addressList?.[user.addressList.length - 1] ?? null;
    const hasAvatar = Boolean(user?.avatarUrl);

    return (
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-3xl shadow-lg font-sans min-h-[550px] mb-12">

            {/* Link admin nếu admin */}
            {isUserAdmin && (
                <div className="text-right mb-6">
                    <Link to="/admin" className="text-blue-700 underline font-medium hover:text-blue-900">
                        Quản lý Admin
                    </Link>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
                {/* Avatar */}
                {hasAvatar && (
                    <div className="flex-shrink-0">
                        <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="rounded-full w-32 h-32 border-4 border-blue-500 shadow-md object-cover"
                        />
                    </div>
                )}

                {/* Thông tin cá nhân */}
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-blue-800 mb-8 border-b pb-3">
                        Thông Tin Cá Nhân
                    </h2>

                    {user && user.email ? (
                        <div className="space-y-6 text-gray-800 text-base">
                            <div className="flex justify-between">
                                <span className="font-semibold w-1/3">Họ tên:</span>
                                <span
                                    className="flex-1 text-right">{(user.lastName ?? '') + ' ' + (user.firstName ?? '') || 'Chưa cập nhật'}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-semibold w-1/3">Email:</span>
                                <span className="flex-1 text-right break-words">{user.email}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-semibold w-1/3">Số điện thoại:</span>
                                {user.phoneNumber ? (
                                    <span className="flex-1 text-right">{user.phoneNumber}</span>
                                ) : (
                                    <span className="flex-1 text-right text-gray-400 italic">Chưa cập nhật</span>
                                )}
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">Địa chỉ:</span>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        {isEditing ? 'Hủy' : 'Chỉnh sửa / Thêm'}
                                    </button>
                                </div>

                                {isEditing ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Số nhà, tên đường, phường"
                                            className="border rounded px-3 py-2"
                                            value={newAddress.street}
                                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Thành phố"
                                            className="border rounded px-3 py-2"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Quốc gia"
                                            className="border rounded px-3 py-2"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Số điện thoại"
                                            className="border rounded px-3 py-2"
                                            value={newAddress.phoneNumber}
                                            onChange={(e) => setNewAddress({
                                                ...newAddress,
                                                phoneNumber: e.target.value
                                            })}
                                        />
                                        <button
                                            className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                            onClick={handleAddAddress}
                                        >
                                            Lưu địa chỉ
                                        </button>
                                    </div>
                                ) : latestAddress ? (
                                    <p className="text-gray-700 ml-4">{latestAddress.street}, {latestAddress.city}, {latestAddress.state}</p>
                                ) : (
                                    <p className="text-gray-400 italic ml-4">Chưa có địa chỉ nào</p>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <span className="font-semibold w-1/3">Điểm thưởng:</span>
                                <span
                                    className="flex-1 text-right text-blue-600 font-bold">{user?.points ?? 0} điểm</span>
                            </div>

                            {/* Voucher đổi điểm */}
                            {user?.points >= 500 && (
                                <div className="space-y-3 pt-4 border-t">
                                    <p className="text-gray-600 text-sm">Bạn có thể đổi điểm để nhận voucher:</p>
                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => handleRedeem(500)}
                                            disabled={user.points < 500}
                                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 transition"
                                        >
                                            Đổi 500 điểm lấy voucher 10%
                                        </button>
                                        <button
                                            onClick={() => handleRedeem(1000)}
                                            disabled={user.points < 1000}
                                            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50 transition"
                                        >
                                            Đổi 1000 điểm lấy voucher 20%
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-8">Đang tải thông tin người dùng...</p>
                    )}
                </div>
            </div>

            <div className="mt-10 text-right">
                <Link
                    to="/change-password"
                    className="inline-block px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition"
                >
                    Đổi mật khẩu
                </Link>
            </div>
        </div>

    );
};

export default ProfilePage;
