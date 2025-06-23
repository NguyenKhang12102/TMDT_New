import React, { useState } from 'react';
import { useUpdate, useNotify, useRefresh, useRecordContext } from 'react-admin';
import { updateOrderStatusAPI } from '../../../api/order';

const orderStatuses = [
    { id: 'PENDING', name: 'Pending' },
    { id: 'PROCESSING', name: 'Processing' },
    { id: 'SHIPPED', name: 'Shipped' },
    { id: 'DELIVERED', name: 'Delivered' },
    { id: 'CANCELLED', name: 'Cancelled' },
];

const EditableOrderStatusField = ({ source }) => {
    const record = useRecordContext();
    const [status, setStatus] = useState(record[source]);
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleChange = async (event) => {
        event.stopPropagation();
        const newStatus = event.target.value;
        
        // Validation logic
        if ((record[source] === 'SHIPPED' || record[source] === 'DELIVERED') && newStatus !== record[source]) {
            notify('Không thể thay đổi trạng thái đơn hàng đã giao thành công hoặc đã giao.', { type: 'error' });
            return;
        }

        if (record[source] === 'CANCELLED' && newStatus !== 'CANCELLED') {
            notify('Không thể thay đổi trạng thái đơn hàng đã hủy.', { type: 'error' });
            return;
        }

        setStatus(newStatus);
        try {
            await updateOrderStatusAPI(record.id, newStatus);
            notify('Trạng thái đơn hàng đã được cập nhật', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Lỗi cập nhật trạng thái: ' + error.message, { type: 'error' });
            setStatus(record[source]); // Revert to original status on error
        }
    };

    return (
        <select value={status} onChange={handleChange} style={{ minWidth: 120 }}>
            {orderStatuses.map((choice) => (
                <option key={choice.id} value={choice.id}>
                    {choice.name}
                </option>
            ))}
        </select>
    );
};

export default EditableOrderStatusField; 