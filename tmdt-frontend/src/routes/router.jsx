import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout.jsx";
import Home from "../pages/Home/Home.jsx";
import ListProductComponent from "../pages/ProductList/ProductList.jsx";
import ProductDetail from "../pages/ProductDetail/Productdetail.jsx";
import Cart from "../pages/Cart/Cart.jsx";
import Checkout from "../pages/Checkout/Checkout.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import ForgotPasswordForm from "../pages/forgotPassword/ForgotPassword.jsx";
import ResetPasswordForm from "../pages/forgotPassword/ResetPassword.jsx";
import Contact from "../pages/Contact/Contact.jsx";
import AboutUs from "../pages/AboutUs/AboutUs.jsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.jsx";

import { loadProductBySlug } from "./products.js";
import Profile from "../pages/Profile/Profile.jsx";
import OAuth2LoginCallback from "../pages/OAuth2LoginCallback.jsx";
import OrderConfirmed from "../pages/OrderConfirmed/OrderConfirmed.jsx";
import { AdminPanel } from "../pages/Admin/AdminPanel.jsx";

import ChangePasswordPage from "../pages/ChangePassword/ChangePasswordPage.jsx";
import Custom from "../pages/Custom/Custom.jsx";

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/products", element: <ListProductComponent categoryType={""} /> },
            { path: "/custom", element: <Custom /> },
            { path: "/women", element: <ListProductComponent categoryType={"WOMEN"} /> },
            { path: "/men", element: <ListProductComponent categoryType={"MEN"} /> },

            {
                path: "/product/:slug",
                element: <ProductDetail />,
                loader: loadProductBySlug,
            },

            { path: "/cart", element: <Cart /> },
            { path: "/checkout", element: <Checkout /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/forgot-password", element: <ForgotPasswordForm /> },     // 🔄 Sửa route
            { path: "/reset-password", element: <ResetPasswordForm /> },       // 🔄 Thêm route
            { path: "/contact", element: <Contact /> },
            { path: "/aboutus", element: <AboutUs /> },
            { path: "/profile", element: <Profile /> },
            { path: "/oauth2/callback", element: <OAuth2LoginCallback /> },
            { path: "/orderConfirmed", element: <OrderConfirmed /> },
            { path: "/change-password", element: <ChangePasswordPage /> },
        ],
    },
    {
        path: "/admin/*",
        element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
    },
]);

export default router;
