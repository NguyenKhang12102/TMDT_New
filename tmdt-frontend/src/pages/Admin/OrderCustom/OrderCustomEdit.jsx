// src/admin/OrderCustom/OrderCustomEdit.jsx
import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';

const OrderCustomEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput disabled source="filename" label="Tên file" />
            <TextInput disabled source="requestText" label="Yêu cầu" />
            <SelectInput source="status" label="Trạng thái" choices={[
                { id: 'Tiếp nhận', name: 'Tiếp nhận' },
                { id: 'Hủy', name: 'Hủy' },
            ]} />
        </SimpleForm>
    </Edit>
);

export default OrderCustomEdit;
