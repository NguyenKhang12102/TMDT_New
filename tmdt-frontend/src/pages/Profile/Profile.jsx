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
                alert(`Đổi thành công! Nhận được voucher ${data.discountPercentage}%`);
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
        <div className="w-full max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl font-sans min-h-[550px] mb-12">
            {isUserAdmin && (
                <div className="text-right">
                    <Link to={"/admin"} className="text-lg text-blue-900 underline">Manage Admin</Link>
                </div>
            )}
            <div className="flex flex-col lg:flex-row gap-8">
                {hasAvatar && (
                    <div className="flex justify-center lg:justify-start">
                        <img
                            src={user.avatarUrl}
                            alt="Avatar"
                            className="rounded-full w-28 h-28 border-4 border-blue-600 shadow-md object-cover"
                        />
                    </div>
                )}
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-blue-800 mb-10 text-center lg:text-left pb-4">
                        Thông Tin Cá Nhân
                    </h2>

                    {user && user.email ? (
                        <div className="flex flex-col gap-8 text-gray-800 text-base">
                            <div className="flex justify-between border-b pb-3">
                                <span className="font-semibold w-1/3">Họ tên:</span>
                                <span className="text-right flex-1">{(user.lastName ?? '') + ' ' + (user.firstName ?? '') || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-3">
                                <span className="font-semibold w-1/3">Email:</span>
                                <span className="break-all text-right flex-1">{user.email}</span>
                            </div>
                            {!user.phoneNumber && (
                                <div className="flex justify-between border-b pb-3 mt-4">
                                    <span className="font-semibold w-1/3">Số điện thoại:</span>
                                    <span className="text-right flex-1 text-gray-500 italic">Chưa cập nhật</span>
                                </div>
                            )}

                            <div className="border-b pb-3">
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
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            placeholder="Số nhà, tên đường, phường"
                                            className="border p-2 rounded"
                                            value={newAddress.street}
                                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Thành phố"
                                            className="border p-2 rounded"
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Quốc gia"
                                            className="border p-2 rounded"
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Số điện thoại"
                                            className="border p-2 rounded"
                                            value={newAddress.phoneNumber}
                                            onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                                        />
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            onClick={handleAddAddress}
                                        >
                                            Lưu địa chỉ
                                        </button>
                                    </div>
                                ) : latestAddress ? (
                                    <ul className="list-disc ml-5 text-gray-700">
                                        <li className="flex justify-between items-start gap-4 mb-2">
                                            <div>{latestAddress.street}, {latestAddress.city}, {latestAddress.state}</div>
                                        </li>
                                    </ul>
                                ) : (
                                    <span className="text-gray-500">Chưa có địa chỉ nào</span>
                                )}
                            </div>

                            <div className="flex justify-between border-b pb-3">
                                <span className="font-semibold w-1/3">Điểm thưởng:</span>
                                <span className="text-right flex-1 text-blue-600 font-bold">{user?.points ?? 0} điểm</span>
                            </div>

                            {user?.points >= 500 && (
                                <div className="mt-6">
                                    <p className="text-sm text-gray-600 mb-2">Bạn có thể đổi điểm để nhận voucher:</p>
                                    <button
                                        onClick={() => handleRedeem(500)}
                                        className="bg-green-500 text-white py-2 px-4 rounded mr-3 hover:bg-green-600"
                                        disabled={user.points < 500}
                                    >
                                        Đổi 500 điểm lấy voucher 10%
                                    </button>
                                    <button
                                        onClick={() => handleRedeem(1000)}
                                        className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                                        disabled={user.points < 1000}
                                    >
                                        Đổi 1000 điểm lấy voucher 20%
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-6">Đang tải thông tin người dùng...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
