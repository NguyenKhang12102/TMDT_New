import {
    List,
    Datagrid,
    TextField,
    DateField,
    ShowButton
} from 'react-admin';

const OrderCustomList = (props) => (
    <List {...props} title="Đơn hàng thiết kế">
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="filename" label="Tên file" />
            <TextField source="requestText" label="Yêu cầu" />
            <TextField source="status" label="Trạng thái" />
            <DateField source="createdAt" label="Ngày tạo" />
            <ShowButton />
        </Datagrid>
    </List>
);

export default OrderCustomList;
