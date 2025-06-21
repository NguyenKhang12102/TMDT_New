import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection.jsx';
import BrandSection from '../../components/BrandSection/BrandSection.jsx';
import InforBar from '../../components/InforBar/InforBar.jsx'

import StoreList from '../../components/StoreList/StoreList.jsx'
import CustomerReview from '../../components/CustomerReview/CustomerReview.jsx'
import DiscountProduct from "../../components/DiscountProduct/DiscountProduct.jsx";
// import { useDispatch, useSelector } from "react-redux";
const HomePage = () => {
    return (
        <div>
            <HeroSection />
            <BrandSection />
            <DiscountProduct />

            <StoreList />
            <InforBar />
            <CustomerReview />

        </div>
    );
};

export default HomePage;
