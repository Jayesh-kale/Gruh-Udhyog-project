import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye, FiStar } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../services/context/authContext.jsx";
import { useCart } from "../../../services/context/CartContext";
import LoginPromptDialog from "../../common/LoginPromptDialog";
import ProductImage from "../ProductImage/ProductImage";
import "./ProductCard.css";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const handleAddToCart = () => {
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        addToCart(product, 1);
        toast.success(`${product.name} added to cart!`);
    };

    const handleLoginConfirm = () => {
        setShowLoginPrompt(false);
        navigate("/login");
    };

    return (
        <div className="product-card card">
            <div className="product-image">
                <ProductImage
                    image={product.image}
                    alt={product.name}
                    className="img-fluid rounded mb-3 h-100"
                />
                <span className="product-category">{product.category}</span>
            </div>

            <div className="product-content">
                <h3>{product.name}</h3>
                <div className="rating">
                    <FiStar />
                    <span>4.8</span>
                </div>
                <p className="description">{product.description}</p>
                <div className="price">
                    ₹{product.defaultOnlinePrice}
                    <small> / {product.unit}</small>
                </div>

                <div className="product-actions">
                    <Link to={`/products/${product._id}`} className="view-btn">
                        <FiEye /> View
                    </Link>

                    <button className="cart-btn" onClick={handleAddToCart}>
                        <FiShoppingCart /> Add
                    </button>
                </div>

                <LoginPromptDialog
                    open={showLoginPrompt}
                    onConfirm={handleLoginConfirm}
                    onCancel={() => setShowLoginPrompt(false)}
                />
            </div>
        </div>
    );
}

export default ProductCard;
