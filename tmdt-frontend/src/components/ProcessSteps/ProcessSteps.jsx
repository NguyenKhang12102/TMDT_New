import React from 'react';
import { ArrowUp } from 'lucide-react'; // Nếu bạn chưa cài: npm install lucide-react
import { CiDeliveryTruck } from "react-icons/ci";
import { FaProductHunt } from "react-icons/fa";
const ProcessSteps = () => {
    return (
        <section className="py-16 bg-gray-50 rounded-lg mx-4 md:mx-8">
            <div className="mx-16 px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Quy trình 3 bước</h2>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Từ thiết kế đến giao hàng - Chúng tôi đảm bảo khách hàng tận hưởng sự đơn giản và thành công
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                            <ArrowUp className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold">TẢI THIẾT KẾ</h3>
                        <p className="text-gray-600">
                            Tải mô hình thiết kế của bạn lên hoặc sử dụng các mẫu có sẵn từ thư viện của chúng tôi
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                            <FaProductHunt  size={32}/>
                        </div>
                        <h3 className="font-bold">CHỌN SẢN PHẨM</h3>
                        <p className="text-gray-600">
                            Lựa chọn vật liệu, màu sắc, độ phân giải và các tùy chọn khác phù hợp với nhu cầu của bạn
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                            <CiDeliveryTruck size={32} />
                        </div>
                        <h3 className="font-bold">GIAO HÀNG</h3>
                        <p className="text-gray-600">
                            Chúng tôi sẽ in và giao sản phẩm đến tận nơi cho bạn với thời gian nhanh chóng
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessSteps;
