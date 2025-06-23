import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import { addAddressAPI, fetchUserDetails } from "../../api/UserInfo";
import { selectCartItems } from "../../store/features/cart";
import CODCheckoutForm from "./CODCheckoutForm.jsx";
import "./Checkout.css";
import { saveAddress } from "../../store/features/user.js";
import { verifyVoucherAPI } from "../../api/verifyVoucher.js";

const Checkout = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);

    const [userInfo, setUserInfo] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("");
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherId, setVoucherId] = useState(null);

    const [newAddress, setNewAddress] = useState({
        name: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: 'Việt Nam',
        zipCode: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const cities = [/* danh sách tỉnh thành Việt Nam - như cũ */];

    const subTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.subTotal || 0), 0).toFixed(2);
    }, [cartItems]);

    const discountAmount = useMemo(() => {
        return ((parseFloat(subTotal) * discount) / 100).toFixed(2);
    }, [subTotal, discount]);

    const totalAmount = useMemo(() => {
        return (parseFloat(subTotal) - parseFloat(discountAmount)).toFixed(2);
    }, [subTotal, discountAmount]);

    useEffect(() => {
        dispatch(setLoading(true));
        fetchUserDetails()
            .then((res) => {
                setUserInfo(res);
                const defaultAddress = res.addressList?.[0];
                if (defaultAddress) {
                    setNewAddress({
                        name: defaultAddress.name || '',
                        phoneNumber: defaultAddress.phoneNumber || '',
                        street: defaultAddress.street || '',
                        city: defaultAddress.city || '',
                        state: defaultAddress.state || 'Việt Nam',
                        zipCode: defaultAddress.zipCode || ''
                    });
                }
            })
            .catch((err) => console.error(err))
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
            error = "Vui lòng nhập tỉnh/thành phố";
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
            console.log("✅ Voucher hợp lệ:", result);
            setDiscount(result.discountPercentage); // giảm giá %
            setVoucherId(result.voucherId);         // lưu ID voucher để gửi backend khi đặt hàng
        } catch (err) {
            alert(err.message);
        }
    };




    return (
        <div className="checkout-wrapper">
            <div className="checkout-left">
                <h2>Thông tin khách hàng</h2>
                <div className="customer-info-form">
                    <div className="form-group">
                        <label>Họ và tên *</label>
                        <input
                            type="text"
                            name="name"
                            value={newAddress.name}
                            onChange={handleCustomerInfoChange}
                            placeholder="Nhập họ và tên"
                        />
                        {formErrors.name && <p className="form-error">{formErrors.name}</p>}
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại *</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={newAddress.phoneNumber}
                            onChange={handleCustomerInfoChange}
                            placeholder="Số điện thoại"
                        />
                        {formErrors.phoneNumber && <p className="form-error">{formErrors.phoneNumber}</p>}
                    </div>

                    <div className="form-group">
                        <label>Quốc gia</label>
                        <input type="text" name="state" value={newAddress.state} disabled />
                    </div>
                </div>

                <h2>Thông tin nhận hàng</h2>
                <div className="customer-info-form">
                    <div className="form-group">
                        <label>Địa chỉ *</label>
                        <input
                            type="text"
                            name="street"
                            value={newAddress.street}
                            onChange={handleCustomerInfoChange}
                            placeholder="Số nhà - Tên đường - Thôn/Xã"
                        />
                        {formErrors.street && <p className="form-error">{formErrors.street}</p>}
                    </div>

                    <div className="form-group">
                        <label>Tỉnh/Thành phố *</label>
                        <select
                            name="city"
                            value={newAddress.city}
                            onChange={handleCustomerInfoChange}
                        >
                            <option value="">-- Chọn tỉnh/thành phố --</option>
                            {cities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        {formErrors.city && <p className="form-error">{formErrors.city}</p>}
                    </div>
                </div>

                <div className="checkout-form mt-6">
                    <div className="form-group">
                        <p>Phương thức thanh toán</p>
                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Thanh toán khi nhận hàng (COD)
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="CARD"
                                checked={paymentMethod === "CARD"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Thanh toán qua MOMO
                        </label>
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
            </div>

            <div className="checkout-right">
                <div className="product-summary">
                    {cartItems.map((item, index) => (
                        <div key={index} className="product-item flex items-center gap-4 mb-4">
                            <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                            </div>
                            <span className="font-semibold">{item.subTotal.toLocaleString()}₫</span>
                        </div>
                    ))}
                </div>

                <div className="discount-input">
                    <input
                        type="text"
                        placeholder="Mã giảm giá"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <button className="apply-btn" onClick={handleApplyVoucher}>Sử dụng</button>
                </div>

                <div className="totals">
                    <div className="row">
                        <span>Tạm tính</span>
                        <span>{parseFloat(subTotal).toLocaleString()}₫</span>
                    </div>

                    {discount > 0 && (
                        <div className="row text-green-600">
                            <span>Giảm giá ({discount}%)</span>
                            <span>-{parseFloat(discountAmount).toLocaleString()}₫</span>
                        </div>
                    )}

                    <div className="row">
                        <span>Phí vận chuyển</span>
                        <span>Miễn phí</span>
                    </div>

                    <div className="row total font-bold text-lg">
                        <span>Tổng cộng</span>
                        <span>{parseFloat(totalAmount).toLocaleString()}₫</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
