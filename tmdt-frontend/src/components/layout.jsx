
import FooterComponent from "./Footer/FooterComponent.jsx";
import HeaderComponent from "./Header/HeaderComponent.jsx"
import { Outlet } from "react-router-dom";
import Spinner from "./Spinner/Spinner.jsx";
import React from "react";
import {useSelector } from "react-redux";


export default function MainLayout() {

    const isLoading = useSelector((state) => state?.commonState?.loading);
    return (
        <>
            <HeaderComponent />
            <Outlet />
            {isLoading &&  <Spinner/>}
            <FooterComponent />

        </>
    );
}
