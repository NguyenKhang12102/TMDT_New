
import React from 'react'
import { ArrayInput, BooleanInput, Create, ImageField, ImageInput, NumberInput, ReferenceInput, required, SelectField, SelectInput, SimpleForm, SimpleFormIterator, TextInput } from 'react-admin'
import CategoryTypeInput from './Category/CategoryTypeInput';
import { colorSelector } from '../../components/Filters/ColorsFilter.jsx';
import ImageOrUrlInput from './compoment/ImageOrUrlInput.jsx';
export const sizeSelector =[""]

const CreateProduct = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source='name' validate={[required()]}/>
                <TextInput source='slug' validate={[required()]}/>
                <TextInput source='description' validate={[required()]}/>
                <NumberInput source='price' validate={[required()]}/>
                <TextInput source='brand' validate={[required()]}/>
                <ReferenceInput source='categoryId' reference='category'/>
                <CategoryTypeInput />

                {/* Dùng custom input cho thumbnail */}
                <ImageOrUrlInput source='thumbnail' label="Thumbnail (file hoặc link)" />

                {/*<ArrayInput source='variants'>*/}
                {/*    <SimpleFormIterator inline>*/}
                {/*        <SelectInput source='color' choices={Object.keys(colorSelector)} resettable/>*/}
                {/*        <SelectInput source='size' choices={sizeSelector}/>*/}
                {/*        <NumberInput source='stockQuantity'/>*/}
                {/*    </SimpleFormIterator>*/}
                {/*</ArrayInput>*/}

                <ArrayInput source='productResources'>
                    <SimpleFormIterator inline>
                        <TextInput source='name' validate={[required()]}/>
                        {/* Dùng custom input cho từng resource */}
                        <ImageOrUrlInput source='url' label="Ảnh (file hoặc link)" />
                        <SelectInput source='type' choices={["image"]}/>
                        <BooleanInput source='isPrimary'/>
                    </SimpleFormIterator>
                </ArrayInput>

                <NumberInput source='rating'/>
                <BooleanInput source='newArrival'/>
            </SimpleForm>
        </Create>
    )
}


export default CreateProduct
