import React from 'react';
import { Admin, fetchUtils, Resource, withLifecycleCallbacks } from 'react-admin';
import simpleRestProvider from "ra-data-simple-rest";
import { fileUploadAPI } from '../../api/fileUpload.js';
import ProductList from './ProductList.jsx';
import EditProduct from './EditProduct.jsx';
import CreateProduct from './CreateProduct.jsx';
import CategoryList from './Category/CategoryList.jsx';
import CategoryEdit from './Category/CategoryEdit.jsx';
import OrderList from "./Order/OrderList.jsx";
import OrderShow from "./Order/OrderShow.jsx";
import OrderCustomEdit from './OrderCustom/OrderCustomEdit.jsx';
import OrderCustomList from './OrderCustom/OrderCustomList.jsx';

import OrderCustomShow from './OrderCustom/OrderCustomShow.jsx';


import UserList from './User/UserList.jsx';
import UserShow from './User/UserShow.jsx';
import AdminDashboard from './AdminDashboard.jsx'; // ✅ thêm dòng này

const API_BASE_URL = "http://localhost:8080";

const httpClient = (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    if (!options.headers) options.headers = new Headers({ Accept: 'application/json' });
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
};

const baseProvider = simpleRestProvider(`${API_BASE_URL}/api`, httpClient);

const dataProvider = {
    ...baseProvider,
    getList: (resource, params) => {
        if (resource === 'category-types') {
            return httpClient(`${API_BASE_URL}/api/category-types`).then(({ json }) => ({
                data: json.map(item => ({ id: item.id, name: item.name })),
                total: json.length
            }));
        }
        if (resource === 'categories') {
            return httpClient(`${API_BASE_URL}/api/category`).then(({ json }) => ({
                data: json.map(item => ({ id: item.id, name: item.name })),
                total: json.length
            }));
        }

        return baseProvider.getList(resource, params);
    },
    // ✅ Thêm override cho PUT order-custom
    update: (resource, params) => {
        if (resource === 'order-custom') {
            const { id } = params;
            const { status } = params.data;

            return httpClient(`${API_BASE_URL}/api/order-custom/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status }),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                }),
            }).then(() => ({
                data: { id, status },
            }));
        }

        return baseProvider.update(resource, params);
    }
};

const wrappedProvider = withLifecycleCallbacks(
    dataProvider,
    [
        {
            resource: "products",
            beforeSave: async (params) => {
                let requestBody = { ...params };
                let productResList = params?.productResources ?? [];

                if (params?.thumbnail?.rawFile) {
                    const fileName = params.thumbnail.rawFile.name.replaceAll(' ', '-');
                    const formData = new FormData();
                    formData.append("file", params.thumbnail.rawFile);
                    formData.append("fileName", fileName);
                    const res = await fileUploadAPI(formData);
                    if (!res || !res.url) throw new Error("Upload thumbnail thất bại");
                    requestBody.thumbnail = res.url;
                } else if (typeof params.thumbnail === "string") {
                    requestBody.thumbnail = params.thumbnail;
                }

                const newProductResList = await Promise.all(
                    productResList.map(async (productResource) => {
                        if (productResource?.url?.rawFile) {
                            const fileName = productResource.url.rawFile.name.replaceAll(' ', '-');
                            const formData = new FormData();
                            formData.append("file", productResource.url.rawFile);
                            formData.append("fileName", fileName);
                            const res = await fileUploadAPI(formData);
                            if (!res || !res.url) throw new Error("Upload resource thất bại");
                            return { ...productResource, url: res.url };
                        } else if (typeof productResource.url === "string") {
                            return productResource;
                        }
                        return productResource;
                    })
                );

                return {
                    ...requestBody,
                    productResources: newProductResList
                };
            }
        }
    ]
);

export const AdminPanel = () => {
    return (
        <Admin dataProvider={wrappedProvider} basename='/admin' dashboard={AdminDashboard}>
            <Resource name='products' list={ProductList} edit={EditProduct} create={CreateProduct} />
            <Resource name='category' list={CategoryList} edit={CategoryEdit} />
            <Resource name="category-types" />
            <Resource name="categories" />
            <Resource name='order' list={OrderList} show={OrderShow} />
            <Resource name='order-custom' list={OrderCustomList} show={OrderCustomShow}  edit={OrderCustomEdit}/>
            <Resource name='user' list={UserList} show={UserShow} />
        </Admin>
    );
};
