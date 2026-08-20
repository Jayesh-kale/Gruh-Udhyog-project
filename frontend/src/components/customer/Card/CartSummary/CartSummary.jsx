import "./CartSummary.css";

import Card from "../../../common/Card";
import Button from "../../../common/Button";

function CartSummary({

    totalItems,

    subTotal,

    deliveryCharge = 0,

    onCheckout

}) {

    const grandTotal = subTotal + deliveryCharge;

    return (

        <Card
            className="cart-summary"
            padding="lg"
        >

            <h3>

                Order Summary

            </h3>

            <div className="summary-row">

                <span>

                    Items ({totalItems})

                </span>

                <strong>

                    ₹{subTotal}

                </strong>

            </div>

            <div className="summary-row">

                <span>

                    Delivery

                </span>

                <strong
                    className="delivery-free"
                >

                    {

                        deliveryCharge === 0

                            ? "FREE"

                            : `₹${deliveryCharge}`

                    }

                </strong>

            </div>

            <hr />

            <div className="summary-row total-row">

                <span>

                    Grand Total

                </span>

                <strong>

                    ₹{grandTotal}

                </strong>

            </div>

            <div className="secure-checkout">

                🔒 Secure Checkout

            </div>

            <Button

                fullWidth

                onClick={onCheckout}

                disabled={totalItems === 0}


            >

                Proceed to Checkout

            </Button>

            <Button

                variant="outline"

                fullWidth

                className="mt-3"

                to="/products"

            >

                Continue Shopping

            </Button>

        </Card>

    );

}

export default CartSummary;