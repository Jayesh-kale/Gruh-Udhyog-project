import "./Checkout.css";
import toast from "react-hot-toast";
import { createOrder } from "../../../services/orderService";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";

import { useAuth } from "../../../services/context/authContext";
import { useCart } from "../../../services/context/CartContext";

import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Badge from "../../../components/common/Badge";



function Checkout() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const {

        cartItems,
        cartTotal,
        totalItems,
        clearCart

    } = useCart();

    const [formData, setFormData] = useState({

        fullName: "",
        phone: "",
        village: "",
        paymentMethod: "Cash",
        upiTransactionId: ""

    });

    const [loading, setLoading] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);

    const [orderNumber, setOrderNumber] = useState("");

    useEffect(() => {

        AOS.refresh();

    }, []);

    useEffect(() => {

        if (user) {

            setFormData((prev) => ({

                ...prev,

                fullName: user.name || "",

                phone: user.phone || "",

                village: user.village || ""

            }));

        }

    }, [user]);

    function handleChange(e) {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

    }

    // Function to handle order placement
    async function handlePlaceOrder() {

        if (!formData.fullName.trim()) {

            toast.error("Full name is required.");

            return;

        }

        if (!formData.phone.trim()) {

            toast.error("Phone number is required.");

            return;

        }

        if (!formData.village.trim()) {

            toast.error("Village is required.");

            return;

        }

        if (

            formData.paymentMethod === "UPI" &&

            !formData.upiTransactionId.trim()

        ) {

            toast.error("Enter UPI Transaction ID.");

            return;

        }

        try {

            setLoading(true);

            const payload = {

                customer: {

                    customerId: user._id,

                    name: user.name,

                    phone: user.phone,

                    village: formData.village

                },

                items: (Array.isArray(cartItems) ? cartItems : [cartItems]).map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),

                orderType: "Online",

                paymentMethod: formData.paymentMethod,

                paidAmount: formData.paymentMethod === "UPI"
                    ? cartTotal
                    : 0,
            };

            const response = await createOrder(payload);
            console.log("Checkout Payload", response);

            console.log("in checkout response: ", response.data.orderNumber);

            setOrderNumber(

                response.data.orderNumber

            );

            clearCart();

            setShowSuccess(true);

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to place order."

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <section className="checkout-page container py-5">

            <PageHeader

                title="Checkout"

                subtitle="Review your order and place it."

            />

            <div className="checkout-grid">

                {/* Left Section */}

                <Card
                    padding="lg"
                    className="checkout-card"
                    data-aos="fade-right"
                >

                    <h4>

                        Customer Information

                    </h4>

                    <div className="checkout-form">

                        <Input

                            label="Full Name"

                            name="fullName"

                            value={formData.fullName}

                            onChange={handleChange}

                            placeholder="Enter your full name"

                            required

                        />

                        <Input

                            label="Phone Number"

                            name="phone"

                            value={formData.phone}

                            onChange={handleChange}

                            placeholder="Enter your phone number"

                            required

                        />

                        <Input

                            label="Village"

                            name="village"

                            value={formData.village}

                            onChange={handleChange}

                            placeholder="Enter your village"

                            required

                        />

                        <div className="payment-section">

                            <label className="payment-title">

                                Payment Method

                            </label>

                            <div className="payment-options">

                                <label className="payment-option">

                                    <input

                                        type="radio"

                                        name="paymentMethod"

                                        value="Cash"

                                        checked={formData.paymentMethod === "Cash"}

                                        onChange={handleChange}

                                    />

                                    Cash

                                </label>

                                <label className="payment-option">

                                    <input

                                        type="radio"

                                        name="paymentMethod"

                                        value="UPI"

                                        checked={formData.paymentMethod === "UPI"}

                                        onChange={handleChange}

                                    />

                                    UPI

                                </label>

                            </div>

                        </div>

                        {

                            formData.paymentMethod === "UPI" && (

                                <Input

                                    label="UPI Transaction ID"

                                    name="upiTransactionId"

                                    value={formData.upiTransactionId}

                                    onChange={handleChange}

                                    placeholder="Enter transaction ID"

                                    required

                                />

                            )

                        }

                    </div>

                </Card>

                {/* Right Section */}

                <Card
                    padding="lg"
                    className="checkout-card"
                    data-aos="fade-left"
                >

                    <h4>

                        Order Summary

                    </h4>

                    {/* Summary added next */}
                    <div className="order-summary">

                        {

                            cartItems.map((item) => (

                                <div

                                    key={item._id}

                                    className="summary-product"

                                >

                                    <img

                                        src={
                                            item.image?.url ||
                                            "/images/product-placeholder.png"
                                        }

                                        alt={item.name}

                                    />

                                    <div className="summary-product-info">

                                        <h6>

                                            {item.name}

                                        </h6>

                                        <small>

                                            {item.quantity} {item.unit}

                                        </small>

                                    </div>

                                    <strong>

                                        ₹{

                                            item.defaultOnlinePrice *

                                            item.quantity

                                        }

                                    </strong>

                                </div>

                            ))

                        }

                        <hr />

                        <div className="summary-row">

                            <span>

                                Items ({totalItems})

                            </span>

                            <strong>

                                ₹{cartTotal}

                            </strong>

                        </div>

                        <div className="summary-row">

                            <span>

                                Delivery

                            </span>

                            <Badge variant="success">

                                Paid/ Free

                            </Badge>

                        </div>

                        <div className="summary-row grand-total">

                            <span>

                                Grand Total

                            </span>

                            <strong>

                                ₹{cartTotal}

                            </strong>

                        </div>

                        <div className="secure-payment">

                            🔒 100% Secure Checkout

                        </div>

                        <Button

                            fullWidth

                            loading={loading}

                            onClick={handlePlaceOrder}

                        >

                            Place Order

                        </Button>

                        <Button

                            variant="secondary"

                            fullWidth

                            className="mt-3"

                            onClick={() => navigate("/cart")}

                        >

                            ← Back to Cart

                        </Button>

                    </div>

                </Card>

            </div>

            {/* Success Modal */}

            <Modal

                open={showSuccess}

                title=""

                onClose={() => setShowSuccess(false)}

            >

                {/* Success UI */}

                <div className="order-success">

                    <div className="success-icon">

                        ✓

                    </div>

                    <h3>

                        Order Placed Successfully!

                    </h3>

                    <p>

                        Thank you for shopping with GruhUdyog.

                    </p>

                    <div className="order-number-card">

                        <small>

                            Order Number

                        </small>

                        <h5>

                            {orderNumber}

                        </h5>

                    </div>

                    <div className="success-status">

                        <div>

                            <span>

                                Payment

                            </span>

                            <Badge variant="primary">

                                {formData.paymentMethod}

                            </Badge>

                        </div>

                        <div>

                            <span>

                                Status

                            </span>

                            <Badge variant="warning">

                                Pending

                            </Badge>

                        </div>

                    </div>

                    <p className="success-message">

                        We'll notify you once your order is confirmed and ready.

                    </p>

                    <div className="success-buttons">

                        <Button

                            fullWidth

                            onClick={() => navigate("/products")}

                        >

                            Continue Shopping

                        </Button>

                        <Button

                            variant="secondary"

                            fullWidth

                            onClick={() => navigate("/orders")}

                        >

                            View Orders

                        </Button>

                    </div>

                </div>

            </Modal>

        </section>

    );

}

export default Checkout;