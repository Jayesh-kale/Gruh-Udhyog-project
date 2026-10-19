import "./RelatedProducts.css";

import { useEffect, useState } from "react";
import AOS from "aos";

import { getProduct, getRelatedProducts } from "../../../services/productService";

import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import ProductGrid from "../../../components/customer/Products/ProductGrid/ProductGrid";

function RelatedProducts({

    productId,

    category

}) {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchProducts();

    }, [productId, category]);

    async function fetchProducts() {

        try {

            setLoading(true);

            const response =
                await getRelatedProducts({ category });

            if (response.success) {

                const filteredProducts =
                    response.data.products.filter(

                        product =>
                            product._id !== productId

                    );

                setProducts(filteredProducts);

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

            AOS.refresh();

        }

    }

    if (loading) {

        return <Loader text="Loading Related Products..." />;

    }

    if (!products.length) {

        return (

            <EmptyState

                title="No Related Products"

                description="More products will be available soon."

            />

        );

    }

    return (

        <section
            className="related-products"
            data-aos="fade-up"
        >

            <h3>

                Related Products

            </h3>

            <ProductGrid

                products={products}

            />

        </section>

    );

}

export default RelatedProducts;