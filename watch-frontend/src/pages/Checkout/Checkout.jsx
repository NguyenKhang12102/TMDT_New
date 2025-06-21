import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

import { setLoading } from "../../store/features/common";
import { addAddressAPI, fetchUserDetails } from "../../api/UserInfo";
import { selectCartItems } from "../../store/features/cart";

import CODCheckoutForm from "./CODCheckoutForm.jsx";
import "./Checkout.css";
import { saveAddress } from "../../store/features/user.js";

const Checkout = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);

    const [userInfo, setUserInfo] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("");

    const [newAddress, setNewAddress] = useState({
        name: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: 'Việt Nam',
        zipCode: ''
    });

    const cities = [
        "Hà Nội",
        "TP Hồ Chí Minh",
        "Đà Nẵng",
        "Hải Phòng",
        "Cần Thơ",
        "An Giang",
        "Bà Rịa - Vũng Tàu",
        "Bắc Giang",
        "Bắc Kạn",
        "Bạc Liêu",
        "Bắc Ninh",
        "Bến Tre",
        "Bình Định",
        "Bình Dương",
        "Bình Phước",
        "Bình Thuận",
        "Cà Mau",
        "Cao Bằng",
        "Đắk Lắk",
        "Đắk Nông",
        "Điện Biên",
        "Đồng Nai",
        "Đồng Tháp",
        "Gia Lai",
        "Hà Giang",
        "Hà Nam",
        "Hà Tĩnh",
        "Hải Dương",
        "Hậu Giang",
        "Hòa Bình",
        "Hưng Yên",
        "Khánh Hòa",
        "Kiên Giang",
        "Kon Tum",
        "Lai Châu",
        "Lâm Đồng",
        "Lạng Sơn",
        "Lào Cai",
        "Long An",
        "Nam Định",
        "Nghệ An",
        "Ninh Bình",
        "Ninh Thuận",
        "Phú Thọ",
        "Phú Yên",
        "Quảng Bình",
        "Quảng Nam",
        "Quảng Ngãi",
        "Quảng Ninh",
        "Quảng Trị",
        "Sóc Trăng",
        "Sơn La",
        "Tây Ninh",
        "Thái Bình",
        "Thái Nguyên",
        "Thanh Hóa",
        "Thừa Thiên Huế",
        "Tiền Giang",
        "Trà Vinh",
        "Tuyên Quang",
        "Vĩnh Long",
        "Vĩnh Phúc",
        "Yên Bái"
    ];


    const [formErrors, setFormErrors] = useState({});

    const subTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.subTotal || 0), 0).toFixed(2);
    }, [cartItems]);

    useEffect(() => {
        dispatch(setLoading(true));
        fetchUserDetails()
            .then((res) => {
                setUserInfo(res);
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(setLoading(false)));
    }, [dispatch]);

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "phoneNumber":
                { const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
                if (!value.trim()) {
                    error = "Vui lòng nhập số điện thoại";
                } else if (!phoneRegex.test(value)) {
                    error = "Số điện thoại không hợp lệ (bắt đầu bằng 0 hoặc +84, 10–11 số)";
                }
                break; }

            case "street":
                if (!value.trim() || value.length < 5) {
                    error = "Địa chỉ phải có ít nhất 5 ký tự";
                }
                break;

            case "city":
                if (!value.trim()) {
                    error = "Vui lòng nhập tỉnh/thành phố";
                }
                break;

            default:
                break;
        }

        setFormErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
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

    const handleAddAddress = async () => {
        if (!validateForm()) return;

        try {
            const added = await addAddressAPI(newAddress);
            dispatch(saveAddress(added));
            setNewAddress({
                name: '',
                phoneNumber: '',
                street: '',
                city: '',
                state: 'Việt Nam',
                zipCode: ''
            });
            setFormErrors({});
            return added;
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi lưu địa chỉ");
            throw err;
        }
    };

    return (
        <div className="checkout-wrapper">
            <div className="checkout-left">
                <h2>Thông tin khách hàng</h2>
                <div className="customer-info-form">

                    <div className="form-group">
                        <label>Số điện thoại *</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={newAddress.phoneNumber}
                            onChange={handleCustomerInfoChange}
                            placeholder="Số điện thoại"
                        />
                        {formErrors.phoneNumber && (
                            <p className="form-error">{formErrors.phoneNumber}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Quốc gia</label>
                        <input
                            type="text"
                            name="state"
                            value={newAddress.state}
                            disabled
                        />
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
                        {formErrors.street && (
                            <p className="form-error">{formErrors.street}</p>
                        )}
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
                        {formErrors.city && (
                            <p className="form-error">{formErrors.city}</p>
                        )}

                    </div>
                </div>

                {/* Chọn phương thức thanh toán */}
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
                    <input type="text" placeholder="Mã giảm giá" />
                    <button className="apply-btn">Sử dụng</button>
                </div>

                <div className="totals">
                    <div className="row">
                        <span>Tạm tính</span>
                        <span>{parseFloat(subTotal).toLocaleString()}₫</span>
                    </div>
                    <div className="row">
                        <span>Phí vận chuyển</span>
                        <span>Miễn phí</span>
                    </div>
                    <div className="row total">
                        <span>Tổng cộng</span>
                        <span>{parseFloat(subTotal).toLocaleString()}₫</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
