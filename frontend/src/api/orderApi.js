import { API_URL } from "../config/env";

async function parseResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || fallbackMessage);
  }

  return result.data || result;
}

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

  return parseResponse(response, "Unable to create order.");
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

  return parseResponse(response, "Payment verification failed.");
}