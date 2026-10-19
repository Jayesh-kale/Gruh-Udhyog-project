import { useEffect, useState } from "react";
import SeasonalProductCard from "./SeasonalProductCard";
import { getSeasonalProducts } from "../../../services/productService";
import {FiCreditCard} from "react-icons/fi";


function SeasonalProducts() {

    const [seasonalProducts, setSeasonalProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSeasonalProducts();
    }, []);

    async function loadSeasonalProducts() {
        const products = await getSeasonalProducts();
        // Check if products exists AND is an array
        if (!products || !Array.isArray(products)) {
            setLoading(false);
            return;
        }

        setSeasonalProducts(products);
        setLoading(false);
    }

    return (

        <section className="py-5">

            <div className="container">

                <div className="text-center mb-5">

                    <h2 className="fw-bold">

                        Seasonal Specials

                    </h2>

                    <p className="text-muted">

                        Fresh homemade products available this season.

                    </p>

                </div>

                {
                    loading ? <div className="text-center">Loading...</div>
                        :
                        <div className="row g-4 " style={{ justifyContent: "center" }}>

                            {

                                seasonalProducts.map((product) => {
                                    return (
                                        <div
                                            key={product._id}
                                            className="col-md-6 col-lg-3"
                                        >

                                            <SeasonalProductCard icon={<FiCreditCard />}

                                                product={product}

                                            />

                                        </div>

                                    );
                                })

                            }

                        </div>
                }



            </div>

        </section>

    );

}

export default SeasonalProducts;