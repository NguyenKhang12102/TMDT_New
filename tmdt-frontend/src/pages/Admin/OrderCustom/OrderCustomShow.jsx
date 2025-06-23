import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    useRecordContext,
    useUpdate
} from 'react-admin';
import { useState, useEffect } from 'react';

const OrderResponseSection = () => {
    const record = useRecordContext();
    const [update] = useUpdate();

    const [response, setResponse] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (record) {
            setResponse(record.responseText || '');
            setPrice(record.priceQuote || '');
            setStatus(record.status || '');
        }
    }, [record]);

    const handleSubmit = async () => {
        try {
            await update('order-custom', {
                id: record.id,
                data: {
                    ...record,
                    responseText: response,
                    priceQuote: price,
                    status: status
                },
                previousData: record
            });
            alert("✅ Đã gửi phản hồi và cập nhật đơn hàng");
        } catch (err) {
            console.error("❌ Gửi thất bại", err);
            alert("Gửi phản hồi thất bại!");
        }
    };

    if (!record) return null;

    return (
        <div style={{ marginTop: '2rem' }}>
            <label>Phản hồi khách hàng:</label><br />
            <textarea
                rows={4}
                style={{ width: '100%' }}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
            />

            <label style={{ marginTop: '1rem', display: 'block' }}>Giá báo (VNĐ):</label>
            <input
                type="number"
                style={{ width: '100%', padding: '4px' }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <label style={{ marginTop: '1rem', display: 'block' }}>Trạng thái:</label>
            <select
                style={{ width: '100%', padding: '4px' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Hủy">Hủy</option>
            </select>

            <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>💬 Gửi phản hồi</button>
        </div>
    );
};

const OrderCustomShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="filename" />
            <TextField source="fileUrl" label="Đường dẫn file" />
            <TextField source="requestText" label="Yêu cầu" />
            <TextField source="status" label="Trạng thái hiện tại" />
            <TextField source="priceQuote" label="Giá báo" />
            <DateField source="createdAt" label="Ngày tạo" />
            <TextField source="user.firstName" label="Người gửi" />
            <TextField source="user.phoneNumber" label="SĐT" />
            <TextField source="user.addressList[0].street" label="Địa chỉ" />
            <OrderResponseSection />
        </SimpleShowLayout>
    </Show>
);

export default OrderCustomShow;
