import "./ProductDetails.css";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import { useCart } from "../../../services/context/CartContext";

import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

import { getProductById } from "../../../services/productService";

import Loader from "../../../components/common/Loader/index";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button/index";
import Card from "../../../components/common/Card";
import RelatedProducts from "../../../components/customer/RelatedProducts/RelatedProducts";

import QuantitySelector from "../../../components/customer/QuantitySelector/QuantitySelector";

function ProductDetails() {

    const navigate = useNavigate();
    const { addToCart, buyNow,clearCart } = useCart();

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {

        AOS.refresh();

        fetchProduct();

    }, [id]);

    async function fetchProduct() {

        try {

            setLoading(true);

            const response =
                await getProductById(id);

            if (response.success) {

                setProduct(response.data.product);

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    //function to add the product to card
    const handleAddToCart = () => {

        addToCart(product, quantity);

        toast.success("Product added to cart.");

    };

    const handleBuyNow = () => {

        clearCart();

        addToCart(product, quantity);

        navigate("/cart");

    };

    if (loading) {

        return <Loader text="Loading Product..." />;

    }

    if (!product) {

        return (

            <div className="container py-5">

                <h3>Product not found.</h3>

            </div>

        );

    }

    return (

        <section className="container py-5">

            <div
                className="back-btn"
                data-aos="fade-down"
            >

                <Link to="/products">

                    <FaArrowLeft />

                    Back to Products

                </Link>

            </div>

            <Card className="product-details-card">

                <div className="row align-items-center g-5">

                    <div
                        className="col-lg-5"
                        data-aos="fade-right"
                    >

                        <div className="product-image-large">

                            <img

                                src={
                                    product.image?.url ||
                                    "/images/product-placeholder.png"
                                }

                                alt={product.name}

                            />

                        </div>

                    </div>

                    <div
                        className="col-lg-7"
                        data-aos="fade-left"
                    >

                        <div className="product-info">

                            <div className="d-flex gap-2 flex-wrap mb-3">

                                <Badge>

                                    {product.category}

                                </Badge>

                                {

                                    product.isSeasonal &&

                                    <Badge variant="warning">

                                        Seasonal

                                    </Badge>

                                }

                            </div>

                            <h2>

                                {product.name}

                            </h2>

                            {

                                product.type &&

                                <h6>

                                    {product.type}

                                </h6>

                            }

                            <h3 className="product-price">

                                ₹{product.defaultOnlinePrice}

                                <span>

                                    / {product.unit}

                                </span>

                            </h3>

                            <p className="product-description">

                                {

                                    product.description ||

                                    "No description available."

                                }

                            </p>

                            <div className="mt-4">

                                <h6>

                                    Quantity

                                </h6>

                                <QuantitySelector

                                    quantity={quantity}

                                    onIncrease={() =>
                                        setQuantity(quantity + 1)
                                    }

                                    onDecrease={() =>
                                        setQuantity(quantity - 1)
                                    }

                                />

                            </div>

                            <div className="product-actions">

                                <Button
                                    variant="primary"
                                    onClick={handleAddToCart}
                                >

                                    Add to Cart

                                </Button>

                                <Button
                                    variant="outlier"
                                    onClick={handleBuyNow}
                                >

                                    Buy Now

                                </Button>

                            </div>

                        </div>

                    </div>

                </div>

            </Card>

            <RelatedProducts

                productId={product._id}

                category={product.category}

            />

        </section>

    );

}

export default ProductDetails;