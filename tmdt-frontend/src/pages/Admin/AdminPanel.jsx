import React from 'react'
import { Admin, fetchUtils, Resource, withLifecycleCallbacks, CustomRoutes, Menu, MenuItemLink } from 'react-admin'
import simpleRestProvider from "ra-data-simple-rest";
import ProductList from './ProductList.jsx';
import EditProduct from './EditProduct';
import CreateProduct from './CreateProduct';
import CategoryList from './Category/CategoryList';
import CategoryEdit from './Category/CategoryEdit';
import { fileUploadAPI } from '../../api/fileUpload';
import OrderList from "./Order/OrderList.jsx";
import OrderShow from "./Order/OrderShow.jsx";
import UserList from './User/UserList';
import UserShow from './User/UserShow';
import Dashboard from './Dashboard.jsx';
import { Route } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ProductIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import OrderIcon from '@mui/icons-material/ShoppingCart';
import UserIcon from '@mui/icons-material/People';

const httpClient = (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    if (!options.headers) options.headers = new Headers();
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
}

const dataProvider = withLifecycleCallbacks(
    simpleRestProvider('http://localhost:8080/api', httpClient),
    [
        {
            resource: "products",
            beforeSave: async (params) => {
                let requestBody = { ...params };
                let productResList = params?.productResources ?? [];

                // Upload thumbnail nếu có file mới
                if (params?.thumbnail?.rawFile) {
                    const fileName = params.thumbnail.rawFile.name.replaceAll(' ', '-');
                    const formData = new FormData();
                    formData.append("file", params.thumbnail.rawFile);
                    formData.append("fileName", fileName);
                    const res = await fileUploadAPI(formData);
                    if (!res || !res.url) throw new Error("Upload thumbnail thất bại");
                    requestBody.thumbnail = res.url;
                } else if (typeof params.thumbnail === "string") {
                    // Nếu là link cũ, giữ nguyên
                    requestBody.thumbnail = params.thumbnail;
                }

                // Upload từng productResource nếu có file mới
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
                            return productResource; // giữ nguyên link cũ
                        }
                        return productResource;
                    })
                );

                const request = {
                    ...requestBody,
                    productResources: newProductResList
                };
                return request;
            }
        }
    ]
);

// Custom Menu Component
const MyMenu = (props) => (
    <Menu {...props}>
        <MenuItemLink to="/dashboard" primaryText="Dashboard" leftIcon={<DashboardIcon />} />
        <MenuItemLink to="/products" primaryText="Products" leftIcon={<ProductIcon />} />
        <MenuItemLink to="/category" primaryText="Categories" leftIcon={<CategoryIcon />} />
        <MenuItemLink to="/order" primaryText="Orders" leftIcon={<OrderIcon />} />
        <MenuItemLink to="/user" primaryText="Users" leftIcon={<UserIcon />} />
    </Menu>
);

export const AdminPanel = () => {
    return (
        <Admin dataProvider={dataProvider} basename='/admin' menu={MyMenu}>
            <CustomRoutes>
                <Route path="/dashboard" element={<Dashboard />} />
            </CustomRoutes>
            <Resource name='products' list={ProductList} edit={EditProduct} create={CreateProduct} />
            <Resource name='category' list={CategoryList} edit={CategoryEdit} />
            <Resource
                name='order'
                list={OrderList}
                show={OrderShow}
            />
            <Resource name='user' list={UserList} show={UserShow} />
        </Admin>
    )
}
