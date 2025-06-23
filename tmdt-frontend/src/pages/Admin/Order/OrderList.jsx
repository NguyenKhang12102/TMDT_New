import React from 'react'
import { List, Datagrid, TextField, DateField, NumberField, ReferenceField, ShowButton, FunctionField } from 'react-admin'
import EditableOrderStatusField from './EditableOrderStatusField';


const OrderList = props => (
    <List {...props}>
        <Datagrid rowClick={false}>
            <TextField source="id" />
            <DateField source="orderDate" label="Ngày đặt" />
            <NumberField source="totalAmount" label="Tổng tiền" />
            <FunctionField label="Trạng thái" render={record => <EditableOrderStatusField record={record} source="orderStatus" />} />
            <TextField source="shipmentNumber" label="Mã vận đơn" />
            <DateField source="expectedDeliveryDate" label="Ngày giao dự kiến" />
            <ShowButton />
        </Datagrid>
    </List>
)
export default OrderList;
