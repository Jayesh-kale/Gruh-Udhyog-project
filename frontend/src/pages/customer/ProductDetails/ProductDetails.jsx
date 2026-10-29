import "./ProductDetails.css";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import { useCart } from "../../../services/context/CartContext";
import { useAuth } from "../../../services/context/authContext.jsx";

import { toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

import { getProductById } from "../../../services/productService";

import Loader from "../../../components/common/Loader/index";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button/index";
import Card from "../../../components/common/Card";
import RelatedProducts from "../../../components/customer/RelatedProducts/RelatedProducts";

import QuantitySelector from "../../../components/customer/QuantitySelector/QuantitySelector";
import ProductImage from "../../../components/customer/ProductImage/ProductImage";
import LoginPromptDialog from "../../../components/common/LoginPromptDialog";

function ProductDetails() {

    const navigate = useNavigate();
    const { addToCart, clearCart } = useCart();
    const { user } = useAuth();

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const availablePackages = product?.packages?.length
        ? product.packages.map((item, index) => ({
            ...item,
            _id: item._id || `package-${index}`,
            packageIndex: index
        }))
        : product
            ? [{
                _id: "default",
                label: `1 ${product.unit}`,
                quantity: 1,
                unit: product.unit,
                price: product.defaultOnlinePrice
            }]
            : [];

    async function fetchProduct() {
        
        try {

            setLoading(true);

            const response =
                await getProductById(id);

            if (response.success) {

                const fetchedProduct = response.data.product;
                const normalizedPackages = fetchedProduct.packages?.map((item, index) => ({
                    ...item,
                    _id: item._id || `package-${index}`,
                    packageIndex: index
                }));
                const normalizedProduct = {
                    ...fetchedProduct,
                    packages: normalizedPackages
                };
                setProduct(normalizedProduct);
                setSelectedPackage(
                    normalizedPackages?.[0] || {
                        _id: "default",
                        label: `1 ${fetchedProduct.unit}`,
                        quantity: 1,
                        unit: fetchedProduct.unit,
                        price: fetchedProduct.defaultOnlinePrice
                    }
                );

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        AOS.refresh();

        fetchProduct();

    }, [id]);

    //function to add the product to card
    const handleAddToCart = () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        addToCart({
            ...product,
            packageId: selectedPackage?._id?.startsWith("package-")
                ? undefined
                : selectedPackage?._id === "default"
                ? undefined
                : selectedPackage?._id,
            packageIndex: selectedPackage?.packageIndex,
            selectedPackage
        }, quantity);

        toast.success("Product added to cart.");

    };

    const handleBuyNow = () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        clearCart();

        addToCart({
            ...product,
            packageId: selectedPackage?._id?.startsWith("package-")
                ? undefined
                : selectedPackage?._id === "default"
                ? undefined
                : selectedPackage?._id,
            packageIndex: selectedPackage?.packageIndex,
            selectedPackage
        }, quantity);

        navigate("/cart");

    };

    const handleLoginConfirm = () => {
        setShowLoginPrompt(false);
        navigate("/login");
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
        
            <Card className="product-details-card" >

                <div className="row align-items-center g-5">

                    <div
                        className="col-lg-5"
                        data-aos="fade-right"
                    >

                        <div className="product-image-large">

                            <ProductImage
                                image={product.image}
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
                                ₹{selectedPackage?.price ?? product.defaultOnlinePrice}
                                <span>
                                    / {selectedPackage?.label ?? product.unit}
                                </span>
                            </h3>

                            <p className="product-description">

                                {

                                    product.description ||

                                    "No description available."

                                }

                            </p>

                            {availablePackages.length > 0 && (
                                <div className="mt-4">
                                    <label className="form-label fw-semibold" htmlFor="product-package">
                                        Select quantity / packaging
                                    </label>
                                    <select id="product-package" className="form-select" value={selectedPackage?._id || ""}
                                        onChange={(event) => setSelectedPackage(
                                            availablePackages.find((item) => item._id === event.target.value)
                                        )}>
                                        {availablePackages.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.label || `${item.quantity} ${item.unit}`} - ₹{item.price}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="text-muted">
                                        Selected: {selectedPackage?.label || `${selectedPackage?.quantity || ""} ${selectedPackage?.unit || ""}`} · ₹{selectedPackage?.price ?? product.defaultOnlinePrice}
                                    </small>
                                </div>
                            )}

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

            <LoginPromptDialog
                open={showLoginPrompt}
                onConfirm={handleLoginConfirm}
                onCancel={() => setShowLoginPrompt(false)}
            />

        </section>

    );

}

export default ProductDetails;