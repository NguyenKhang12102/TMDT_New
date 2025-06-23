import React from 'react';
import './Notification.css';

const NotificationPanel = ({ isOpen, onClose, notifications, onClearAll }) => {
    return (
        <div className={`notification-panel ${isOpen ? 'open' : ''}`}>
            <div className="panel-header">
                <h3>Thông báo</h3>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="panel-content">
                {notifications.length === 0 ? (
                    <p className="empty">Không có thông báo nào.</p>
                ) : (
                    notifications.map((item) => (
                        <div key={item.id} className="notification-item">
                            <p>📦 Đơn #{item.id} - <span className="text-green-600">{item.status}</span></p>
                            <p>🕒 {new Date(item.createdAt).toLocaleString()}</p>
                            <p>✍️ Yêu cầu: {item.requestText}</p>
                            <p>
                                📎 File:{" "}
                                <a
                                    href={`http://localhost:8080${item.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {item.filename}
                                </a>
                            </p>
                        </div>
                    ))
                )}
            </div>


            {notifications.length > 0 && (
                <div className="panel-actions">
                    <button className="clear-btn" onClick={onClearAll}>Xóa tất cả</button>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
