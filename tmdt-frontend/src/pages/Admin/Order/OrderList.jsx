import React from 'react'
import { List, Datagrid, TextField, DateField, NumberField, ReferenceField, ShowButton, EditButton } from 'react-admin'

const OrderList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <DateField source="orderDate" label="Ngày đặt" />
            <NumberField source="totalAmount" label="Tổng tiền" />
            <TextField source="orderStatus" label="Trạng thái" />
            <TextField source="shipmentNumber" label="Mã vận đơn" />
            <DateField source="expectedDeliveryDate" label="Ngày giao dự kiến" />
            <ShowButton />
        </Datagrid>
    </List>
)
export default OrderList;
