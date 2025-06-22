import React from "react";
import "./AboutUs.css";
import StoreList from "../../components/StoreList/StoreList.jsx"

const AboutPage = () => {
    return (
        <div className="about-container">
            <h2 className="about-year">THÀNH LẬP NĂM 2020</h2>
            <h1 className="about-commit">CAM KẾT 100% HÀNG CHÍNH HÃNG</h1>

            <div className="about-section">
                <h3>
                    <strong>
                        WatchStore – Trung Tâm Nhà Phân Phối Đồng hồ Casio, Tissot, Longines, Daniel Klein… Chính Hãng Ở Việt Nam
                    </strong>
                </h3>
                <p>
                    Trải qua nhiều năm thành lập, với những nỗ lực không ngừng, WatchStore.vn đã gặt hái nhiều thành công trong hoạt động kinh doanh và chiếm lĩnh trên thị trường.
                    WatchStore.vn đã đăng ký hoạt động thương mại điện tử với Bộ Công Thương (Xem giấy phép) và cam kết 100% sản phẩm chính hãng.
                </p>

                <h4>Các cột mốc đáng ghi nhớ:</h4>
                <ul>
                    <li><strong>Năm 2020:</strong> Trở thành đại lý bán lẻ chính thức của thương hiệu đồng hồ Casio.</li>
                    <li><strong>Năm 2021:</strong> Được cấp giấy chứng nhận đại lý ủy quyền bán lẻ Seiko.</li>
                    <li><strong>Năm 2022:</strong> Chính thức nhận đại lý các thương hiệu Frederique Constant, Daniel Klein…</li>
                    <li><strong>Năm 2023:</strong> Đại lý ủy quyền chính thức của Citizen, Olym Pianus, Ogival, Carnival…</li>
                </ul>
            </div>

            <h2 className="about-core-title">GIÁ TRỊ CỐT LÕI DOANH NGHIỆP</h2>

            <div className="core-values">
                {[
                    {
                        number: "1",
                        title: "Chất lượng luôn hàng đầu xe",
                        description: "Luôn mang đến cho khách hàng sản phẩm chất lượng tốt nhất",
                    },
                    {
                        number: "2",
                        title: "Cam kết luôn tận tâm",
                        description: "Luôn đặt khách hàng là trung tâm trong mọi việc, có trách nhiệm với những sản phẩm bán ra",
                    },
                    {
                        number: "3",
                        title: "Chính sách thu hút nhân tài",
                        description: "Luôn tạo môi trường làm việc tốt nhất, có nhiều cơ hội thể hiện năng lực, tạo dựng sự nghiệp",
                    },
                    {
                        number: "4",
                        title: "Luôn hoàn thiện & đổi mới",
                        description: "Luôn nỗ lực đổi mới hoàn thiện dịch vụ khách hàng",
                    },
                    {
                        number: "5",
                        title: "Phát triển bền vững",
                        description: "Luôn hợp tác với đại lý, nhà phân phối, xây dựng thị trường đồng hồ chính hãng trong sạch",
                    },
                ].map((value) => (
                    <div key={value.number} className="core-value-item">
                        <div className="core-number">{value.number}</div>
                        <h4>{value.title}</h4>
                        <p>{value.description}</p>
                    </div>
                ))}
            </div>

            <h2 className="about-industry-title">NGÀNH NGHỀ KINH DOANH</h2>

            <ul className="industry-list">
                <li><strong>Bán lẻ đồng hồ:</strong> WatchStore.vn là thương hiệu đồng hồ uy tín phục vụ khách hàng toàn quốc.</li>
                <li><strong>Bán sỉ cho doanh nghiệp:</strong> Cung cấp đồng hồ làm quà tặng uy tín cho các công ty, đối tác.</li>
                <li><strong>Phân phối dây và phụ kiện chính hãng:</strong> Cung cấp dây, phụ kiện chính hãng đa dạng mẫu mã.</li>
                <li><strong>Sửa chữa & bảo dưỡng:</strong> Dịch vụ sửa chữa và bảo dưỡng đồng hồ chuyên nghiệp.</li>
            </ul>
            <StoreList />
        </div>
    );
};

export default AboutPage;
