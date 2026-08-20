import { useEffect, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";
import Loader from "../../common/Loader/Loader";

import { getFeaturedProducts } from "../../../services/productService";

import "./FeaturedProducts.css";

function FeaturedProducts() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadProducts();

    }, []);

    async function loadProducts() {

        try {

            const response = await getFeaturedProducts();
            setProducts(response.data.products);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return <Loader text="Loading Products..." />;

    }

    return (

        <section className="featured-products">

            <div className="container">

                <div className="section-title">

                    <h2>

                        Featured Products

                    </h2>

                    <p>

                        Freshly prepared homemade products.

                    </p>

                </div>

                <div className="products-grid">

                    {

                            products.map(product => (

                                <ProductCard

                                    key={product._id}

                                    product={product}

                                />

                            ))
                    }

                </div>

            </div>

        </section>

    );

}

export default FeaturedProducts;