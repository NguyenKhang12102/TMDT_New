import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { addAddressAPI, fetchUserDetails } from "../../api/UserInfo";
import { selectCartItems } from "../../store/features/cart";
import { saveAddress } from "../../store/features/user";
import { verifyVoucherAPI } from "../../api/verifyVoucher";
import CODCheckoutForm from "./CODCheckoutForm";

const Checkout = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);

    const [userInfo, setUserInfo] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherId, setVoucherId] = useState(null);

    const [newAddress, setNewAddress] = useState({
        name: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "Việt Nam",
        zipCode: "",
    });

    const cities = [
        "Hà Nội",
        "Hồ Chí Minh",
        "Đà Nẵng",
        "Hải Phòng",
        "Cần Thơ",
        "Bình Dương",
        "Đồng Nai",
        "Khánh Hòa",
        "Lâm Đồng",
        "Quảng Ninh",
        "Thừa Thiên Huế",
        "Bắc Ninh",
        "Thanh Hóa",
        "Nghệ An",
        "Hải Dương",
        "Vĩnh Phúc",
    ];

    const [formErrors, setFormErrors] = useState({});

    const subTotal = useMemo(
        () => cartItems.reduce((total, item) => total + (item.subTotal || 0), 0).toFixed(2),
        [cartItems]
    );

    const discountAmount = useMemo(
        () => ((parseFloat(subTotal) * discount) / 100).toFixed(2),
        [subTotal, discount]
    );

    const totalAmount = useMemo(
        () => (parseFloat(subTotal) - parseFloat(discountAmount)).toFixed(2),
        [subTotal, discountAmount]
    );

    useEffect(() => {
        dispatch(setLoading(true));
        fetchUserDetails()
            .then((res) => {
                setUserInfo(res);
                const defaultAddress = res.addressList?.[0];
                if (defaultAddress) {
                    setNewAddress({
                        name: defaultAddress.name || "",
                        phoneNumber: defaultAddress.phoneNumber || "",
                        street: defaultAddress.street || "",
                        city: defaultAddress.city || "",
                        state: defaultAddress.state || "Việt Nam",
                        zipCode: defaultAddress.zipCode || "",
                    });
                }
            })
            .catch(console.error)
            .finally(() => dispatch(setLoading(false)));
    }, [dispatch]);

    const validateField = (name, value) => {
        let error = "";
        if (name === "phoneNumber") {
            const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
            if (!value.trim()) error = "Vui lòng nhập số điện thoại";
            else if (!phoneRegex.test(value)) error = "Số điện thoại không hợp lệ";
        }
        if (name === "street" && (!value.trim() || value.length < 5)) {
            error = "Địa chỉ phải có ít nhất 5 ký tự";
        }
        if (name === "city" && !value.trim()) {
            error = "Vui lòng chọn tỉnh/thành phố";
        }
        setFormErrors((prev) => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const fields = ["phoneNumber", "street", "city"];
        let isValid = true;
        fields.forEach((field) => {
            const value = newAddress[field];
            validateField(field, value);
            if (!value || formErrors[field]) isValid = false;
        });
        return isValid;
    };

    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleAddAddress = async () => {
        if (!validateForm()) return;
        try {
            const added = await addAddressAPI(newAddress);
            dispatch(saveAddress(added));
            setNewAddress({ name: '', phoneNumber: '', street: '', city: '', state: 'Việt Nam', zipCode: '' });
            setFormErrors({});
            return added;
        } catch (err) {
            alert("Có lỗi xảy ra khi lưu địa chỉ");
            throw err;
        }
    };

    const handleApplyVoucher = async () => {
        try {
            const result = await verifyVoucherAPI(voucherCode, userInfo.id);
            setDiscount(result.discountPercentage);
            setVoucherId(result.voucherId);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
                    <div className="space-y-4">
                        {['name', 'phoneNumber'].map((field) => (
                            <div key={field} className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field === 'name' ? 'Họ và tên *' : 'Số điện thoại *'}
                                </label>
                                <input
                                    type={field === 'phoneNumber' ? 'tel' : 'text'}
                                    name={field}
                                    value={newAddress[field]}
                                    onChange={handleCustomerInfoChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
                                />
                                {formErrors[field] && (
                                    <p className="text-sm text-red-500">{formErrors[field]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Thông tin nhận hàng</h2>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Địa chỉ *</label>
                            <input
                                type="text"
                                name="street"
                                value={newAddress.street}
                                onChange={handleCustomerInfoChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
                            />
                            {formErrors.street && <p className="text-sm text-red-500">{formErrors.street}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tỉnh/Thành phố *</label>
                            <select
                                name="city"
                                value={newAddress.city}
                                onChange={handleCustomerInfoChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
                            >
                                <option value="">-- Chọn tỉnh/thành phố --</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-lg font-semibold">Phương thức thanh toán</p>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                id="payment-cod"
                                className="w-4 h-4"
                            />
                            <label htmlFor="payment-cod" className="text-sm">Thanh toán khi giao hàng (COD)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="payment"
                                value="VNPAY"
                                checked={paymentMethod === "VNPAY"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                id="payment-vnpay"
                                className="w-4 h-4"
                            />
                            <label htmlFor="payment-vnpay" className="text-sm">Thanh toán qua VNPAY</label>
                        </div>
                    </div>
                </div>

                <CODCheckoutForm
                    userId={userInfo?.id}
                    addressId={userInfo?.addressList?.[0]?.id}
                    newAddress={newAddress}
                    handleAddAddress={handleAddAddress}
                    discount={discount}
                    voucherId={voucherId}
                    totalAmount={totalAmount}
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
                <div className="space-y-4">
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={item.thumbnail} alt={item.name} className="w-14 h-14 object-cover rounded"/>
                                <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                </div>
                            </div>
                            <span className="font-medium">{item.subTotal.toLocaleString()}₫</span>
                        </div>
                    ))}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 p-2 border border-gray-300 rounded"
                            placeholder="Mã giảm giá"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                        />
                        <button
                            onClick={handleApplyVoucher}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Áp dụng
                        </button>
                    </div>

                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Tạm tính</span>
                            <span>{parseFloat(subTotal).toLocaleString()}₫</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Giảm giá ({discount}%)</span>
                                <span>-{parseFloat(discountAmount).toLocaleString()}₫</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Phí vận chuyển</span>
                            <span>Miễn phí</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Tổng cộng</span>
                            <span>{parseFloat(totalAmount).toLocaleString()}₫</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Checkout;