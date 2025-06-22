import React from 'react';
import { Star } from 'lucide-react'; // Nếu bạn chưa cài: npm install lucide-react

const CustomerReview = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="mx-16 px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Các khách hàng nói gì?</h2>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Dưới đây là một số đánh giá từ khách hàng đã trải nghiệm dịch vụ của chúng tôi. Chúng tôi luôn nỗ lực để
                    đáp ứng và vượt quá mong đợi của khách hàng.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Review Card 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-gray-600">
                            "Chất lượng in ấn tuyệt vời, chi tiết sắc nét và dịch vụ khách hàng rất tận tâm. Tôi rất hài lòng với sản phẩm nhận được."
                        </p>
                        <div className="pt-4 border-t">
                            <div className="font-medium">Nguyễn Văn A</div>
                            <div className="text-sm text-gray-500">Hà Nội</div>
                        </div>
                    </div>

                    {/* Review Card 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-gray-600">
                            "Thời gian giao hàng nhanh hơn dự kiến và chất lượng sản phẩm vượt quá mong đợi của tôi. Chắc chắn sẽ quay lại."
                        </p>
                        <div className="pt-4 border-t">
                            <div className="font-medium">Trần Thị B</div>
                            <div className="text-sm text-gray-500">TP. Hồ Chí Minh</div>
                        </div>
                    </div>

                    {/* Review Card 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-gray-600">
                            "Đội ngũ hỗ trợ rất chuyên nghiệp và nhiệt tình. Họ đã giúp tôi điều chỉnh thiết kế để có kết quả tốt nhất."
                        </p>
                        <div className="pt-4 border-t">
                            <div className="font-medium">Lê Văn C</div>
                            <div className="text-sm text-gray-500">Đà Nẵng</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerReview;
