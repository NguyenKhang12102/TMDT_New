import React from 'react';

const FeaturesSection = () => {
    return (
        <section className="py-16">
            <div className="mx-16 px-4">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Content */}
                    <div>
                        <div className="inline-block bg-black text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                            Tính năng nổi bật
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-8">
                            In ấn chất lượng, <br />
                            không thỏa hiệp
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Chúng tôi cam kết mang đến cho bạn các sản phẩm in 3D chất lượng cao với đầy đủ tính năng vượt trội
                        </p>

                        {/* Features List */}
                        <div className="space-y-6">
                            <div className="border rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">No Minimum Orders</h3>
                                <p className="text-gray-600">
                                    Không có số lượng đặt hàng tối thiểu - đặt hàng bao nhiêu tùy ý
                                </p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">Fast Production</h3>
                                <p className="text-gray-600">
                                    Thời gian sản xuất nhanh chóng, đảm bảo giao hàng đúng hẹn
                                </p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">Premium Materials</h3>
                                <p className="text-gray-600">
                                    Sử dụng vật liệu cao cấp, đảm bảo độ bền và chất lượng sản phẩm
                                </p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">Eco-Friendly Options</h3>
                                <p className="text-gray-600">
                                    Cung cấp các lựa chọn vật liệu thân thiện với môi trường
                                </p>
                            </div>
                        </div>

                        {/* Button */}
                        <button className="mt-8 rounded-full px-6 py-2 bg-black text-white hover:bg-gray-800 transition">
                            Xem thêm về dịch vụ
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="flex justify-center items-center">
                        <img
                            src="/placeholder.svg?height=400&width=400"
                            alt="3D Printer Features"
                            width={400}
                            height={400}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
