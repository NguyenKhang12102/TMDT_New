import React from 'react'
import { ArrayInput, BooleanInput, Edit, NumberInput, required, SelectInput, SimpleForm, SimpleFormIterator, TextInput } from 'react-admin'
import { colorSelector } from '../../components/Filters/ColorsFilter'
import { sizeSelector } from './CreateProduct'
import ImageOrUrlInput from './compoment/ImageOrUrlInput.jsx'
const EditProduct = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput label="Name" source='name' />
                <TextInput label="Description" source='description' />
                <TextInput label="Price" source='price' type='number' />
                <TextInput label="Brand" source='brand' />

                {/* Thay thế cho ImageField + ImageInput */}
                <ImageOrUrlInput source="thumbnail" label="Thumbnail (file hoặc link)" />

                {/*<ArrayInput source='variants' label={'Edit Variants'}>*/}
                {/*    <SimpleFormIterator inline>*/}
                {/*        <SelectInput source='color' choices={Object.keys(colorSelector)} resettable />*/}
                {/*        <SelectInput source='size' choices={sizeSelector} />*/}
                {/*        <NumberInput source='stockQuantity' />*/}
                {/*    </SimpleFormIterator>*/}
                {/*</ArrayInput>*/}

                <ArrayInput source='productResources'>
                    <SimpleFormIterator inline>
                        <TextInput source='name' validate={[required()]} />
                        {/* Thay cho ImageField + ImageInput */}
                        <ImageOrUrlInput source='url' label="Ảnh (file hoặc link)" />
                        <SelectInput source='type' choices={["image"]} />
                        <BooleanInput source='isPrimary' />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    )
}
export default EditProduct
