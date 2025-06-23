import React from "react";
import "./AboutUs.css";
import StoreList from "../../components/StoreList/StoreList.jsx"

const AboutPage = () => {
    return (
        <div className="about-container">
            <h2 className="about-year">THÀNH LẬP NĂM 2020</h2>
            <h1 className="about-commit">CAM KẾT 100% SẢN PHẨM IN 3D CHẤT LƯỢNG CAO</h1>

            <div className="about-section">
                <h3>
                    <strong>
                        3DHub – Nền tảng chuyên cung cấp sản phẩm in 3D tùy chỉnh hàng đầu tại Việt Nam
                    </strong>
                </h3>
                <p>
                    Được thành lập vào năm 2020, 3DHub.vn không ngừng đổi mới và phát triển để trở thành nền tảng thương mại điện tử hàng đầu trong lĩnh vực in 3D tại Việt Nam.
                    Chúng tôi cung cấp các sản phẩm sáng tạo và dịch vụ in 3D tùy chỉnh với chất lượng vượt trội, phục vụ đa dạng nhu cầu của cá nhân và doanh nghiệp.
                </p>

                <h4>Các cột mốc đáng nhớ:</h4>
                <ul>
                    <li><strong>Năm 2020:</strong> Khởi nghiệp với xưởng in 3D mini tại TP.HCM, phục vụ đặt hàng online nhỏ lẻ.</li>
                    <li><strong>Năm 2021:</strong> Phát triển dịch vụ thiết kế và in 3D theo yêu cầu cho khách hàng doanh nghiệp.</li>
                    <li><strong>Năm 2022:</strong> Ra mắt nền tảng thương mại điện tử bán các sản phẩm 3D mẫu sẵn như mô hình, đồ trang trí, quà tặng cá nhân hóa.</li>
                    <li><strong>Năm 2023:</strong> Mở rộng hợp tác với các nhà thiết kế và nghệ nhân tạo mẫu để đa dạng hóa sản phẩm in 3D.</li>
                </ul>
            </div>

            <h2 className="about-core-title">GIÁ TRỊ CỐT LÕI DOANH NGHIỆP</h2>

            <div className="core-values">
                {[
                    {
                        number: "1",
                        title: "Chất lượng luôn hàng đầu",
                        description: "Tối ưu từng chi tiết trong sản phẩm in 3D để đạt độ chính xác và độ bền cao nhất.",
                    },
                    {
                        number: "2",
                        title: "Lấy khách hàng làm trung tâm",
                        description: "Thiết kế theo nhu cầu và phản hồi nhanh chóng để đảm bảo sự hài lòng tuyệt đối.",
                    },
                    {
                        number: "3",
                        title: "Sáng tạo không giới hạn",
                        description: "Liên tục cập nhật công nghệ mới để mở rộng khả năng tạo hình và ứng dụng của in 3D.",
                    },
                    {
                        number: "4",
                        title: "Minh bạch & trách nhiệm",
                        description: "Cam kết cung cấp sản phẩm đúng mô tả, đúng chất lượng, bảo hành rõ ràng.",
                    },
                    {
                        number: "5",
                        title: "Đồng hành cùng phát triển",
                        description: "Hợp tác cùng cộng đồng thiết kế và startup để phát triển ngành in 3D Việt Nam.",
                    },
                ].map((value) => (
                    <div key={value.number} className="core-value-item">
                        <div className="core-number">{value.number}</div>
                        <h4>{value.title}</h4>
                        <p>{value.description}</p>
                    </div>
                ))}
            </div>

            <h2 className="about-industry-title">LĨNH VỰC HOẠT ĐỘNG</h2>

            <ul className="industry-list">
                <li><strong>Bán lẻ sản phẩm in 3D:</strong> Cung cấp mô hình, đồ decor, quà tặng in 3D mẫu sẵn hoặc tùy chỉnh.</li>
                <li><strong>Dịch vụ in 3D theo yêu cầu:</strong> Nhận file thiết kế từ khách hàng và tiến hành in chính xác theo yêu cầu.</li>
                <li><strong>Thiết kế mẫu 3D:</strong> Đội ngũ thiết kế hỗ trợ dựng file 3D từ ý tưởng hoặc bản phác thảo tay.</li>
                <li><strong>Gia công phụ kiện – mô hình kỹ thuật:</strong> Cung cấp linh kiện và mô hình in 3D cho kỹ sư, sinh viên, nhà sáng chế.</li>
            </ul>

            {/*<StoreList />*/}
        </div>
    );
};

export default AboutPage;
