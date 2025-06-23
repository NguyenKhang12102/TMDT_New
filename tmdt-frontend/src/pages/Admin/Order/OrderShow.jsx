import React from "react";
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    NumberField,
    ArrayField,
    Datagrid,
    FunctionField
} from "react-admin";

const OrderShow = props => (
    <Show {...props} title="Chi tiết đơn hàng">
        <SimpleShowLayout>
            {/* Thông tin đơn hàng */}
            <TextField source="id" label="Mã đơn hàng" />
            <DateField source="orderDate" label="Ngày đặt hàng" showTime />
            <NumberField source="totalAmount" label="Tổng tiền (₫)" options={{ style: 'currency', currency: 'VND' }} />
            <TextField source="orderStatus" label="Trạng thái" />
            <TextField source="shipmentNumber" label="Mã vận đơn" />
            <DateField source="expectedDeliveryDate" label="Ngày giao dự kiến" showTime />

            {/* Thông tin địa chỉ giao hàng */}
            <TextField source="address.name" label="Họ tên người nhận" />
            <TextField source="address.phoneNumber" label="Số điện thoại" />
            <FunctionField
                label="Địa chỉ"
                render={record =>
                    `${record.address.street}, ${record.address.city}, ${record.address.state}`
                }
            />

            {/* Danh sách sản phẩm */}
            <ArrayField source="orderItemList" label="Sản phẩm trong đơn">
                <Datagrid>
                    {/* Hiển thị ảnh sản phẩm nếu có */}
                    <FunctionField
                        label="Ảnh"
                        render={record =>
                            record.product?.resources?.[0]?.url ? (
                                <img
                                    src={record.product.resources[0].url}
                                    alt={record.product.name}
                                    style={{ width: 80, height: 80, objectFit: "cover" }}
                                />
                            ) : (
                                "Không có ảnh"
                            )
                        }
                    />
                    <TextField source="product.name" label="Tên sản phẩm" />
                    <TextField source="product.brand" label="Thương hiệu" />
                    <NumberField source="product.price" label="Đơn giá (₫)" />
                    <NumberField source="quantity" label="Số lượng" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

export default OrderShow;
