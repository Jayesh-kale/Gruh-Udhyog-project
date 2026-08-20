import "./Cart.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";

import { useCart } from "../../../services/context/CartContext";

import PageHeader from "../../../components/common/PageHeader";
import EmptyState from "../../../components/common/EmptyState";

import CartItem from "../../../components/customer/Card/CartItem/CartItem";
import CartSummary from "../../../components/customer/Card/CartSummary/CartSummary";

function Cart() {

    const navigate = useNavigate();

    const {

        cartItems,

        totalItems,

        cartTotal,

        updateQuantity,

        removeFromCart

    } = useCart();

    useEffect(() => {

        AOS.refresh();

    }, []);

    if (cartItems.length === 0) {

        return (

            <div className="container py-5 " data-aos="fade-up">

                <EmptyState

                    title="Your Cart is Empty"

                    description="Looks like you haven't added any products yet."

                    action={

                        <button

                            className="btn btn-success"

                            onClick={() => navigate("/products")}

                        >

                            Shop Now

                        </button>

                    }

                />

            </div>

        );

    }

    return (

        <section className="cart-page container py-5">

            <PageHeader

                title="Shopping Cart"

                subtitle={`${totalItems} Item${totalItems > 1 ? "s" : ""} in your cart`}

            />

            <div className="cart-layout">

                <div
                    className="cart-items"
                    data-aos="fade-up"
                >

                    {

                        cartItems.map((item, index) => (

                            <div

                                key={item._id}

                                data-aos="fade-up"

                                data-aos-delay={index * 100}

                            >

                                <CartItem

                                    item={item}

                                    onUpdateQuantity={updateQuantity}

                                    onRemove={removeFromCart}

                                />

                            </div>

                        ))

                    }

                </div>

                <div
                    data-aos="fade-left"
                >

                    <CartSummary

                        totalItems={totalItems}

                        subTotal={cartTotal}

                        deliveryCharge={0}

                        onCheckout={() => navigate("/checkout")}

                    />

                </div>

            </div>

        </section>

    );

}

export default Cart;