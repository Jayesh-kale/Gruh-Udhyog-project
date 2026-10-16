import { useState } from "react";
import {
  createOnlineOrder,
  verifyRazorpayPayment,
} from "../api/orderApi";
import { loadRazorpayScript } from "../utils/loadRazorpay";

function OnlinePayment({ items, customer }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handlePayment() {
    try {
      setLoading(true);
      setMessage("");

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Razorpay Checkout could not be loaded."
        );
      }

      const orderData =
        await createOnlineOrder({
          customer,
          items,
        });

      if (!orderData.razorpay) {
        throw new Error(
          "Razorpay order details are missing."
        );
      }

      const razorpayOptions = {
        key: orderData.razorpay.keyId,

        amount: orderData.razorpay.amount,
        currency: orderData.razorpay.currency,
        order_id: orderData.razorpay.orderId,

        name: "Gyruh Udyog",
        description:
          orderData.razorpay.description,

        prefill: {
          name: customer.name,
          contact: customer.phone,
        },

        notes: {
          village: customer.village,
        },

        theme: {
          color: "#198754",
        },

        handler: async function (response) {
          try {
            setMessage(
              "Payment received. Verifying..."
            );

            await verifyRazorpayPayment({
              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_signature:
                response.razorpay_signature,
            });

            setMessage(
              "Payment submitted successfully. Order confirmation will follow."
            );
          } catch (error) {
            console.error(error);

            setMessage(
              "Payment was received, but confirmation is pending. Please contact Gyruh Udyog."
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setMessage(
              "Payment window closed. You can try again."
            );

            setLoading(false);
          },
        },
      };

      const checkout =
        new window.Razorpay(razorpayOptions);

      checkout.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response.error
          );

          setMessage(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      checkout.open();
    } catch (error) {
      console.error("Payment error:", error);

      setMessage(
        error.message ||
          "Unable to start payment."
      );

      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading || !items?.length}
      >
        {loading
          ? "Processing..."
          : "Pay with UPI / Razorpay"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default OnlinePayment;