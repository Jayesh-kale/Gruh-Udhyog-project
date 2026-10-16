const API_URL =
  process.env.VITE_API_URL ||
  "http://localhost:5000/api";

export async function createOnlineOrder(orderData) {
  const response = await fetch(
    `${API_URL}/orders/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...orderData,
        orderType: "Online",
        paymentMethod: "Razorpay",
      }),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to create order."
    );
  }

  return result.data || result;
}

export async function verifyRazorpayPayment(paymentData) {
  const response = await fetch(
    `${API_URL}/payments/razorpay/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(paymentData),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Payment verification failed."
    );
  }

  return result.data || result;
}