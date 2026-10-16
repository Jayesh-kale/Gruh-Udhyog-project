import "./Checkout.css";
import toast from "react-hot-toast";
import {
    createOrder,
    verifyRazorpayPayment
} from "../../../services/orderService";


import { loadRazorpayScript } from "../../../utils/loadRazorpay";

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
import { getImageUrl } from "../../../utils/getImageUrl";



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
        paymentMethod: "Razorpay"

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
    // Function to handle placing the order and initiating Razorpay payment
    async function handlePlaceOrder() {
        if (!formData.fullName.trim()) {
            toast.error("Full name is required.");
            return;
        }

        if (!formData.phone.trim()) {
            toast.error("Phone number is required.");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
            toast.error("Enter a valid 10-digit phone number.");
            return;
        }

        if (!formData.village.trim()) {
            toast.error("Village is required.");
            return;
        }

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        try {
            setLoading(true);

            const razorpayLoaded =
                await loadRazorpayScript();

            if (!razorpayLoaded) {
                throw new Error(
                    "Razorpay Checkout could not be loaded."
                );
            }

            const payload = {
                customer: {
                    customerId: user?._id || null,
                    name: formData.fullName.trim(),
                    phone: formData.phone.trim(),
                    village: formData.village.trim()
                },

                items: cartItems.map((item) => ({
                    productId: item._id,
                    quantity: Number(item.quantity)
                })),

                orderType: "Online",

                // Razorpay is the gateway.
                // UPI will be available inside Razorpay Checkout.
                paymentMethod: "Razorpay",

                // Do not send paidAmount for online payment.
                // The backend must set it to 0 until confirmation.
            };

            const response = await createOrder(payload);

            console.log("Create order response:", response);

            const data = response.data || response;

            if (!data.razorpay) {
                throw new Error(
                    "Razorpay order information was not returned."
                );
            }

            const razorpayOptions = {
                key: data.razorpay.keyId,

                amount: data.razorpay.amount,
                currency: data.razorpay.currency,
                order_id: data.razorpay.orderId,

                name: "Jay Gyruh Udyog Pathardi",
                description:
                    data.razorpay.description ||
                    `Order ${data.order?.orderNumber || ""}`,

                prefill: {
                    name: formData.fullName.trim() || user?.name,
                    contact: formData.phone.trim() || user?.phone,
                    email: user?.email
                },

                notes: {
                    village: formData.village.trim(),
                },

                theme: {
                    color: "#F5F5F5 "
                },

                handler: async function (paymentResponse) {
                    try {
                        setLoading(true);

                        toast.loading(
                            "Payment received. Verifying...",
                            {
                                id: "payment-verification"
                            }
                        );

                        const verificationResponse =
                            await verifyRazorpayPayment({
                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,

                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,

                                razorpay_signature:
                                    paymentResponse.razorpay_signature
                            });

                        toast.dismiss("payment-verification");

                        if (
                            !verificationResponse.success
                        ) {
                            throw new Error(
                                verificationResponse.message ||
                                "Payment verification failed."
                            );
                        }

                        const createdOrder =
                            verificationResponse.data?.order;

                        if (!createdOrder?.orderNumber) {
                            throw new Error(
                                "Payment was verified, but the order confirmation was not returned."
                            );
                        }

                        setOrderNumber(
                            createdOrder.orderNumber
                        );

                        clearCart();
                        setShowSuccess(true);

                        toast.success(
                            "Payment verified successfully."
                        );
                    } catch (error) {
                        toast.dismiss("payment-verification");

                        console.error(
                            "Payment verification error:",
                            error
                        );

                        toast.error(
                            error.response?.data?.message ||
                            error.message ||
                            "Payment verification failed."
                        );
                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        setLoading(false);

                        toast.error(
                            "Payment window closed. Your order is still unpaid."
                        );
                    }
                }
            };

            const checkout =
                new window.Razorpay(razorpayOptions);

            checkout.on(
                "payment.failed",
                function (failedResponse) {
                    console.error(
                        "Razorpay payment failed:",
                        failedResponse
                    );

                    toast.error(
                        failedResponse.error?.description ||
                        "Payment failed. Please try again."
                    );

                    setLoading(false);
                }
            );

            checkout.open();
        } catch (error) {
            console.error("Create payment order error:", error);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to start payment."
            );

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
                                        value="Razorpay"
                                        checked={
                                            formData.paymentMethod === "Razorpay"
                                        }
                                        onChange={handleChange}
                                    />

                                    UPI / Cards / Net Banking
                                </label>
                            </div>

                            <small className="payment-help-text">
                                You will complete payment securely through Razorpay.
                            </small>
                        </div>

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

                                        src={getImageUrl(item.image)}

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
                                Razorpay
                            </Badge>

                        </div>

                        <div>

                            <span>

                                Status

                            </span>

                            <Badge variant="success">
                                Payment Verified
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