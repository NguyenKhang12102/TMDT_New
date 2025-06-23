import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { setAuthenticated } from "../../store/features/authSlice";
import { addAddressAPI } from '../../api/UserInfo.js';
import {saveAddress, selectUserInfo, selectIsUserAdmin} from '../../store/features/user.js';
import { Link } from "react-router-dom";

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

        dispatch(setLoading(true));
        const timeout = setTimeout(() => {
            dispatch(setLoading(false));
            dispatch(setAuthenticated(true));
        }, 300);

        return () => clearTimeout(timeout);
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


    const latestAddress = user?.addressList?.[user.addressList.length - 1] ?? null;
    const hasAvatar = Boolean(user?.avatarUrl);

    return (

        <div className="w-full max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl font-sans min-h-[550px] mb-12">
            {isUserAdmin && <div className="text-right"><Link to={"/admin"} className="text-lg text-blue-900 underline">Manage Admin</Link></div>}
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

                    {user && user.email ?    (
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
                                            <div>
                                                <div> {latestAddress.street}, {latestAddress.city}, {latestAddress.state}</div>
                                            </div>

                                        </li>
                                    </ul>
                                ) : (
                                    <span className="text-gray-500">Chưa có địa chỉ nào</span>
                                )}
                            </div>
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
