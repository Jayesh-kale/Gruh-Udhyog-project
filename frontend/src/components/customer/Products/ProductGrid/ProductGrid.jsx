import "./ProductGrid.css";

import ProductCard from "../ProductsCard/ProductsCard.jsx";

function ProductGrid({ products = [] }) {

    return (

        <div className="row g-4">

            {

                products.map((product, index) => (

                    <div

                        key={product._id}

                        className="col-6 col-lg-4 col-xxl-3"

                        data-aos="zoom-in"

                        data-aos-delay={index * 100}

                    >

                        <ProductCard

                            product={product}

                        />

                    </div>

                ))

            }

        </div>

    );

}

export default ProductGrid;