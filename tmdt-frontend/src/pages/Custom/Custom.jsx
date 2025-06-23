import React, { useState, useRef } from 'react';
import './Custom.css'; // đảm bảo đúng đường dẫn
import { Upload } from 'lucide-react';
import { uploadCustomOrder } from '../../api/orderCustomAPI'; // ✅ sửa đúng file API mới

const Custom = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const fileInputRef = useRef(null);
    const requestTextRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setUploadStatus('');
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmitRequest = async () => {
        if (!selectedFile) {
            setUploadStatus('❌ Chưa chọn file.');
            return;
        }

        const requestText = requestTextRef.current?.value || '';
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('requestText', requestText);

        try {
            setUploadStatus('⏳ Đang tải lên...');
            const data = await uploadCustomOrder(formData);
            setUploadedFileUrl(data.url);
            setUploadStatus('✅ Tải lên thành công!');
        } catch (error) {
            console.error('Lỗi upload:', error);
            setUploadStatus(`❌ Lỗi tải lên: ${error.message}`);
        }
    };

    return (
        <div className="custom-page-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <p className="hero-discount">Khách hàng mới giảm 15%</p>
                    <h1 className="hero-title">Thiết Kế Của Bạn,<br />In Hoàn Hảo</h1>
                    <p className="hero-description">
                        Tạo sản phẩm tùy chỉnh theo thiết kế của bạn,<br />
                        không có đơn hàng tối thiểu, không cần lo lắng<br />
                        về hàng tồn kho, chỉ có sản phẩm chất lượng<br />
                        được giao hàng tận nơi
                    </p>
                    <div className="hero-buttons">
                        <button className="start-button">Bắt đầu tạo <span className="arrow">→</span></button>
                        <a href="#" className="explore-link">Khám phá sản phẩm</a>
                    </div>
                    <div className="customer-satisfaction">
                        <div className="customer-icons"></div>
                        <p>4,000+ khách hàng hài lòng</p>
                    </div>
                </div>
                <div className="hero-image-container">
                    <img src="/banner.png" alt="3D Printer" className="hero-image" />
                </div>
            </div>

            {/* Brands Section */}
            <div className="brands-section">
                <h2 className="brands-title">Dùng bởi các thương hiệu trên thế giới</h2>
                <div className="brand-logos">
                    <img src="/partner1.png" alt="Partner 1" className="brand-logo" />
                    <img src="/partner2.png" alt="Partner 2" className="brand-logo" />
                    <img src="/partner3.png" alt="Partner 3" className="brand-logo" />
                    <img src="/partner4.png" alt="Partner 4" className="brand-logo" />
                    <img src="/partner5.png" alt="Partner 5" className="brand-logo" />
                    <img src="/partner6.png" alt="Partner 6" className="brand-logo" />
                </div>
            </div>

            {/* Custom Upload */}
            <div className="create-section">
                <h1 className="create-main-title">Bạn muốn tạo gì?</h1>
                <p className="create-subtitle">Chọn từ nhiều sản phẩm chất lượng cao và tùy chỉnh với thiết kế của bạn</p>
            </div>

            <div className="custom-sections-wrapper">
                <div className="custom-upload-section">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                    <Upload size={48} className="upload-icon" onClick={handleUploadClick} />
                    <h2 className="upload-title">Tải bản thiết kế</h2>
                    <p className="upload-description">Tải tác phẩm nghệ thuật của bạn lên.</p>
                    {selectedFile && <p>📄 File đã chọn: {selectedFile.name}</p>}
                    {uploadStatus && <p>{uploadStatus}</p>}
                    {uploadedFileUrl && (
                        <p>
                            📎 Xem file: <a href={`http://localhost:8080${uploadedFileUrl}`} target="_blank" rel="noopener noreferrer">{uploadedFileUrl}</a>
                        </p>
                    )}
                </div>

                <div className="custom-request-section">
                    <textarea
                        className="request-textarea"
                        placeholder="Điền yêu cầu và mô tả sản phẩm của bạn ở đây..."
                        ref={requestTextRef}
                    ></textarea>
                    <button className="send-request-button" onClick={handleSubmitRequest}>Gửi yêu cầu</button>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="custom-bottom-section">
                <h2 className="bottom-title">Sẵn Sàng Biến Thiết Kế Của Bạn Thành Hiện Thực</h2>
                <p className="bottom-subtitle">Không có đơn hàng tối thiểu, không có rắc rối về hàng tồn kho. Bắt đầu tạo sản phẩm tùy chỉnh ngay hôm nay!</p>
                <div className="bottom-image-placeholders">
                    <img src="/demo1.png" alt="Demo 1" className="image-placeholder" />
                    <img src="/demo2.png" alt="Demo 2" className="image-placeholder" />
                </div>
            </div>
        </div>
    );
};

export default Custom;
