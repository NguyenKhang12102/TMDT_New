import React from 'react';
import { List, Datagrid, TextField, EmailField, FunctionField, ShowButton } from 'react-admin';

const UserList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="firstName" label="Họ" />
            <TextField source="lastName" label="Tên" />
            <EmailField source="email" />
            <TextField source="phoneNumber" label="SĐT" />
            <FunctionField
                label="Trạng thái"
                render={record => record && typeof record.enabled !== "undefined"
                    ? (record.enabled
                        ? <span style={{ color: 'green' }}>Hoạt động</span>
                        : <span style={{ color: 'red' }}>Ngưng hoạt động</span>)
                    : "Không rõ"}
            />
            <ShowButton />
        </Datagrid>
    </List>
);

export default UserList;
