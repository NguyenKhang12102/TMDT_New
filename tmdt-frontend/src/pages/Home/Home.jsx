// src/pages/HomePage.jsx
import React  from 'react';
import HeroSection from '../../components/HeroSection/HeroSection.jsx';
import CategorySection from '../../components/CategorySection/CategorySection.jsx';
import ProcessSteps from '../../components/ProcessSteps/ProcessSteps.jsx';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection.jsx';
import CustomerReview from '../../components/CustomerReview/CustomerReview.jsx';


const HomePage = () => {

    return (
        <div>
            <HeroSection />
            {/*<CategorySection*/}
            {/*    categories={categories}*/}
            {/*    productList={productList}*/}
            {/*    selectedCateId={selectedCateId}*/}
            {/*    setSelectedCateId={setSelectedCateId}*/}
            {/*    loadingCate={loadingCate}*/}
            {/*/>*/}
            <CategorySection />
            <ProcessSteps />
            <FeaturesSection />
            <CustomerReview />
        </div>
    );
};

export default HomePage;
