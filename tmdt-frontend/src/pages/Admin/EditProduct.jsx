import React from 'react';
import {
    ArrayInput,
    BooleanInput,
    Edit,
    NumberInput,
    required,
    SelectInput,
    SimpleForm,
    SimpleFormIterator,
    TextInput,
    useGetList
} from 'react-admin';

const EditProduct = () => {
    const { data: categoryTypes, isLoading: loadingTypes } = useGetList('category-types');
    const { data: categories, isLoading: loadingCategories } = useGetList('categories');

    return (
        <Edit>
            <SimpleForm>
                <TextInput label="Name" source="name" validate={[required()]} />
                <TextInput label="Description" source="description" />
                <NumberInput label="Price" source="price" validate={[required()]} />
                <TextInput label="Brand" source="brand" validate={[required()]} />
                <TextInput source="thumbnail" label="Thumbnail (link ảnh)" validate={[required()]} />

                <SelectInput
                    label="Category"
                    source="categoryId"
                    choices={categories || []}
                    optionText="name"
                    optionValue="id"
                    validate={[required()]}
                    isLoading={loadingCategories}
                />
                <SelectInput
                    label="Category Type"
                    source="categoryTypeId"
                    choices={categoryTypes || []}
                    optionText="name"
                    optionValue="id"
                    validate={[required()]}
                    isLoading={loadingTypes}
                />

                <ArrayInput source="productResources">
                    <SimpleFormIterator inline>
                        <TextInput source="name" validate={[required()]} />
                        <TextInput source="url" label="Ảnh (link)" validate={[required()]} />
                        <SelectInput source="type" choices={[{ id: 'image', name: 'image' }]} />
                        <BooleanInput source="isPrimary" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};

export default EditProduct;
