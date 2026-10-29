import "./ProductsCard.css";

import Card from "../../../common/Card";
import Badge from "../../../common/Badge";
import Button from "../../../common/Button";
import ProductImage from "../../ProductImage/ProductImage";

function ProductCard({ product }) {

    return (

        <Card className="product-card">

            <div className="product-image">

                <ProductImage
                    image={product.image}
                    alt={product.name}
                />

            </div>

            <div className="product-content">

                <div className="product-badges">

                    {

                        product.isSeasonal &&

                        <Badge variant="warning">

                            Seasonal

                        </Badge>

                    }

                    <Badge variant="primary">

                        {product.category}

                    </Badge>

                </div>

                <h5>

                    {product.name}

                </h5>

                {

                    product.description && (

                        <p>

                            {product.description.length > 80

                                ? `${product.description.substring(0, 80)}...`

                                : product.description}

                        </p>

                    )

                }

                <div className="product-price">

                    From ₹{product.packages?.[0]?.price ?? product.defaultOnlinePrice}

                    <span>

                        / {product.packages?.[0]?.label ?? product.unit}

                    </span>

                </div>

                <Button

                    to={`/products/${product._id}`}

                    fullWidth

                >

                    View Details

                </Button>

            </div>

        </Card>

    );

}

export default ProductCard;