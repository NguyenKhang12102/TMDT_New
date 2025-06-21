import React from "react";
import { Show, SimpleShowLayout, TextField, DateField, NumberField, ArrayField, Datagrid } from "react-admin";

const OrderShow = props => (
    <Show {...props} title="Chi tiết đơn hàng">
        <SimpleShowLayout>
            <TextField source="id" label="Mã đơn"/>
            <DateField source="orderDate" label="Ngày đặt"/>
            <NumberField source="totalAmount" label="Tổng tiền"/>
            <TextField source="orderStatus" label="Trạng thái"/>
            <TextField source="shipmentNumber" label="Mã vận đơn"/>
            <DateField source="expectedDeliveryDate" label="Ngày giao dự kiến"/>
            <TextField source="address.detail" label="Địa chỉ"/>
            <ArrayField source="orderItemList" label="Danh sách sản phẩm">
                <Datagrid>
                    <TextField source="product.name" label="Tên sản phẩm"/>
                    <NumberField source="itemPrice" label="Giá"/>
                    <NumberField source="quantity" label="Số lượng"/>
                    <TextField source="productVariantId" label="Phân loại"/>
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

export default OrderShow;
