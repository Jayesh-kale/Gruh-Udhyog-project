import Hero from "../../components/customer/Hero/Hero";
import CategorySection from "../../components/customer/CategorySection/CategorySection.jsx";
import FeaturedProducts from "../../components/customer/FeaturedProducts/FeaturedProducts.jsx";
import WhyChooseUs from "../../components/customer/WhyChooseUs.jsx";
import SeasonalProducts from "../../components/customer/SeasonalSection/SeasonalProducts.jsx";
import HowItWorks from "../../components/customer/HowItsWork/HowItWorks.jsx";
import CallToAction from "../../components/customer/CallToAction/CallToAction.jsx";
import ProductDetails from "./ProductDetails/ProductDetails.jsx";

function Home() {

    return (

        <>

            <Hero />
            <CategorySection/>
            <FeaturedProducts />
            <WhyChooseUs/>
            <SeasonalProducts/>
            <HowItWorks/>
            <CallToAction/>
          
        </>

    );

}

export default Home;
