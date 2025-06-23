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
                    notifications.map((item, index) => (
                        <div key={index} className="notification-item">
                            <p className="title">{item.title}</p>
                            <p className="time">{item.time}</p>
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
