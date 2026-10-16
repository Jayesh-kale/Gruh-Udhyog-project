import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye, FiStar } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useCart } from "../../../services/context/CartContext";
import { getImageUrl } from "../../../utils/getImageUrl";
import "./ProductCard.css";

function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="product-card">
            <div className="product-image">
                <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
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

                    <button className="cart-btn" onClick={() => { addToCart(product,1); toast.success(`${product.name} added to cart!`); }}>
                        <FiShoppingCart /> Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
