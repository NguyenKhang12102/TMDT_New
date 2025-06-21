import React from 'react';
import { Show, SimpleShowLayout, TextField, EmailField, FunctionField } from 'react-admin';

const UserShow = props => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="firstName" label="Họ" />
            <TextField source="lastName" label="Tên" />
            <EmailField source="email" label="Email" />
            <TextField source="phoneNumber" label="SĐT" />
            <FunctionField
                label="Trạng thái"
                render={record =>
                    record.enabled
                        ? <span style={{ color: 'green', fontWeight: 600 }}>Hoạt động</span>
                        : <span style={{ color: 'red', fontWeight: 600 }}>Ngưng hoạt động</span>
                }
            />
            {/* Hiển thị địa chỉ, phân quyền nếu cần */}
        </SimpleShowLayout>
    </Show>
);

export default UserShow;
