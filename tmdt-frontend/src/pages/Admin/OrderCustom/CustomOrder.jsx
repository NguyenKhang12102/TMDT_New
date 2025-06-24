import React, { useEffect, useState } from 'react';

const CustomOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/order-custom')
            .then(res => res.json())
            .then(setOrders)
            .catch(console.error);
    }, []);

    const handleUpdateStatus = (id, status) => {
        fetch(`http://localhost:8080/api/order-custom/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        }).then(() => {
            setOrders(prev =>
                prev.map(order => order.id === id ? { ...order, status } : order)
            );
        });
    };

    return (
        <div className="admin-orders">
            <h2>Đơn hàng thiết kế tùy chỉnh</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>File</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>
                            <a href={`http://localhost:8080${order.fileUrl}`} target="_blank" rel="noopener noreferrer">
                                {order.filename}
                            </a>
                        </td>
                        <td>
                            <button onClick={() => alert(order.requestText)}>Xem mô tả</button>
                        </td>
                        <td>{order.status}</td>
                        <td>
                            <button onClick={() => handleUpdateStatus(order.id, 'Tiếp nhận')}>Tiếp nhận</button>
                            <button onClick={() => handleUpdateStatus(order.id, 'Hủy')}>Hủy</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomOrders;
