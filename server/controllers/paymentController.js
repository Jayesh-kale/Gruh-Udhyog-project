const crypto = require("crypto");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");

const Order = require("../models/order");
const PendingPayment = require("../models/pendingPayment");
const WebhookEvent = require("../models/webhookEventModel");


const buildOrderItems = require("../utils/buildOrderItems");
const calculatePayment = require("../utils/calculatePayment");
const generateOrderNumber = require("../utils/generateOrderNumber");
const syncCreditBook = require("../utils/syncCreditBook");
const { syncProductionQueue } = require("../utils/syncProductionQueue");
const { sendSuccess, sendError } = require("../utils/sendResponse");
const {
  isWhatsAppConfigured,
  sendPaymentReceipt,
} = require("../utils/whatsappService");


function getRazorpay() {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET
  ) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
    );
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

function toPaise(amountInRupees) {
  const amount = Number(amountInRupees);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount.");
  }

  return Math.round(amount * 100);
}

function safeEqual(firstValue, secondValue) {
  const first = Buffer.from(firstValue || "");
  const second = Buffer.from(secondValue || "");

  return (
    first.length === second.length &&
    crypto.timingSafeEqual(first, second)
  );
}

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      customer: customerData,
      orderType,
      rawMaterials = [],
      notes = orderType === "Online" ? "Online Order" : "",
    } = req.body;

    const paymentMethod =
      orderType === "Online"
        ? "Razorpay"
        : req.body.paymentMethod;

    // Never trust paidAmount from the browser for online orders.
    const paidAmount =
      orderType === "Online"
        ? 0
        : Number(req.body.paidAmount || 0);

    let items = Array.isArray(req.body.items)
      ? req.body.items
      : [];

    items = items.map((item) => ({
      ...item,
      productId: item.productId || item.productID,
    }));

    if (!["Online", "Offline"].includes(orderType)) {
      throw new Error("Invalid order type.");
    }

    if (orderType === "Online" && !customerData) {
      throw new Error("Customer details are required.");
    }

    if (
      orderType === "Online" &&
      (!customerData.name ||
        !customerData.phone ||
        !customerData.village)
    ) {
      throw new Error(
        "Name, phone, and village are required."
      );
    }

    if (orderType === "Offline") {
      if (req.user?.role !== "admin") {
        await session.abortTransaction();

        return sendError(
          res,
          403,
          "Only admin can create offline orders."
        );
      }

      if (!customerData) {
        throw new Error("Customer details are required.");
      }

      if (!["Cash", "UPI"].includes(paymentMethod)) {
        throw new Error(
          "Offline payment method must be Cash or UPI."
        );
      }
    }

    if (!items.length) {
      throw new Error("At least one product is required.");
    }

    const customer =
      orderType === "Online"
        ? {
            customerId: customerData.customerId || null,
            name: customerData.name,
            phone: customerData.phone,
            village: customerData.village,
          }
        : customerData;

    const { orderItems, totalAmount } =
      await buildOrderItems(
        items,
        orderType,
        session
      );

    if (!Number.isFinite(Number(totalAmount)) || totalAmount <= 0) {
      throw new Error("Invalid calculated order amount.");
    }

    if (orderType === "Online") {
      const razorpay = getRazorpay();
      const razorpayOrder = await razorpay.orders.create({
        amount: toPaise(totalAmount),
        currency: "INR",
        receipt: `Jay-${Date.now()}`,
        notes: {
          customerName: String(customer.name),
          customerPhone: String(customer.phone),
        },
      });

      await PendingPayment.create(
        [
          {
            userId: req.user.id,
            razorpayOrderId: razorpayOrder.id,
            customer,
            items: items.map((item) => ({
              productId: item.productId,
              quantity: Number(item.quantity),
            })),
            totalAmount,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      return sendSuccess(
        res,
        201,
        "Payment order created successfully.",
        {
          razorpay: {
            keyId: process.env.RAZORPAY_KEY_ID,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Gyruh Udyog",
            description: "Secure payment for your cart",
            prefill: {
              name: customer.name,
              contact: customer.phone,
            },
          },
        }
      );
    }

    const { remainingAmount, paymentStatus } =
      calculatePayment(totalAmount, paidAmount);

    if (
      !Number.isFinite(paidAmount) ||
      paidAmount < 0 ||
      paidAmount > totalAmount
    ) {
      throw new Error("Paid amount must be between zero and the total amount.");
    }

    const orderNumber = await generateOrderNumber();

    const orders = await Order.create(
      [
        {
          orderNumber,
          customer,
          items: orderItems,
          orderType,
          paymentMethod,
          totalAmount,

          paidAmount,

          remainingAmount:
            orderType === "Online"
              ? Number(totalAmount)
              : remainingAmount,

          paymentStatus:
            orderType === "Online"
              ? "Pending"
              : paymentStatus,

          paymentGateway:
            orderType === "Online"
              ? "Razorpay"
              : null,

          razorpayOrderId: null,

          razorpayPaymentId: null,

          rawMaterials,
          notes,

          paymentHistory:
            paidAmount > 0
              ? [
                  {
                    amount: paidAmount,
                    paymentMethod,
                    status: "Success",
                    paidAt: new Date(),
                  },
                ]
              : [],

          editHistory: [
            {
              action: "Created",
              editedBy:
                req.user?.id ||
                customerData?.customerId ||
                null,
              reason: "Order created.",
            },
          ],
        },
      ],
      { session }
    );

    const createdOrder = orders[0];

    await session.commitTransaction();

    return sendSuccess(
      res,
      201,
      "Order created successfully.",
      {
        order: createdOrder,

        razorpay: null,
      }
    );
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Create order error:", error);

    return sendError(
      res,
      500,
      error.message || "Unable to create order."
    );
  } finally {
    await session.endSession();
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const {
      razorpay_payment_id: paymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: signature,
    } = req.body;

    if (!paymentId || !razorpayOrderId || !signature) {
      return sendError(
        res,
        400,
        "Payment verification details are missing."
      );
    }

    const pendingPayment = await PendingPayment.findOne({
      razorpayOrderId,
      userId: req.user.id,
      status: "Pending",
    });

    if (!pendingPayment) {
      return sendError(
        res,
        404,
        "Pending payment not found or already completed."
      );
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(`${pendingPayment.razorpayOrderId}|${paymentId}`)
      .digest("hex");

    if (!safeEqual(generatedSignature, signature)) {
      return sendError(
        res,
        400,
        "Invalid payment signature."
      );
    }

    const payment = await razorpay.payments.fetch(paymentId);

    if (
      payment.order_id !== razorpayOrderId ||
      Number(payment.amount) !== toPaise(pendingPayment.totalAmount)
    ) {
      return sendError(
        res,
        400,
        "Payment details do not match the order."
      );
    }

    if (!["captured", "authorized"].includes(payment.status)) {
      return sendError(
        res,
        400,
        `Payment is not successful: ${payment.status}.`
      );
    }

    if (payment.status !== "captured") {
      return sendError(
        res,
        400,
        "Payment was authorized but not captured. The order was not placed."
      );
    }

    const session = await mongoose.startSession();
    let createdOrder;

    try {
      session.startTransaction();

      const { orderItems, totalAmount } = await buildOrderItems(
        pendingPayment.items,
        "Online",
        session
      );

      if (totalAmount !== pendingPayment.totalAmount) {
        throw new Error(
          "The cart total changed while payment was in progress."
        );
      }

      const orderNumber = await generateOrderNumber();
      const orders = await Order.create(
        [
          {
            orderNumber,
            customer: pendingPayment.customer,
            items: orderItems,
            orderType: "Online",
            paymentMethod: "Razorpay",
            totalAmount,
            paidAmount: totalAmount,
            remainingAmount: 0,
            paymentStatus: "Paid",
            paymentGateway: "Razorpay",
            razorpayOrderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: signature,
            paymentCapturedAt: new Date(),
            whatsappReceiptStatus: isWhatsAppConfigured()
              ? "Pending"
              : "Disabled",
            paymentHistory: [
              {
                amount: totalAmount,
                paymentMethod: "Razorpay",
                transactionId: paymentId,
                razorpayPaymentId: paymentId,
                razorpayOrderId,
                status: "Success",
                paidAt: new Date(),
              },
            ],
            notes: "Online Order",
            editHistory: [
              {
                action: "Created",
                editedBy: req.user.id,
                reason: "Order created after successful payment.",
              },
            ],
          },
        ],
        { session }
      );

      createdOrder = orders[0];
      await PendingPayment.updateOne(
        { _id: pendingPayment._id, status: "Pending" },
        { $set: { status: "Completed" } },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      await session.endSession();
    }

    let receiptMessage =
      "Payment verified and order placed successfully.";

    if (isWhatsAppConfigured()) {
      try {
        await sendPaymentReceipt(createdOrder);
        await Order.updateOne(
          { _id: createdOrder._id },
          {
            $set: {
              whatsappReceiptStatus: "Sent",
              whatsappReceiptSentAt: new Date(),
              whatsappReceiptError: null,
            },
          }
        );
      } catch (receiptError) {
        console.error("WhatsApp receipt error:", receiptError);
        await Order.updateOne(
          { _id: createdOrder._id },
          {
            $set: {
              whatsappReceiptStatus: "Failed",
              whatsappReceiptError: receiptError.message,
            },
          }
        );
        receiptMessage +=
          " Payment succeeded, but the WhatsApp receipt could not be sent.";
      }
    }

    return sendSuccess(
      res,
      200,
      receiptMessage,
      {
        order: createdOrder,
        orderId: createdOrder._id,
        razorpayOrderId,
        paymentId,
        paymentStatus: "Paid",
      }
    );
  } catch (error) {
    console.error("Verify payment error:", error);

    return sendError(
      res,
      500,
      error.message || "Payment verification failed."
    );
  }
};

exports.handleRazorpayWebhook = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      console.error(
        "Razorpay webhook is not configured. Set RAZORPAY_WEBHOOK_SECRET."
      );

      return res.status(500).json({
        success: false,
        message: "Razorpay webhook is not configured.",
      });
    }

    const receivedSignature =
      req.headers["x-razorpay-signature"];

    const eventId =
      req.headers["x-razorpay-event-id"];

    if (!receivedSignature) {
      return res.status(400).json({
        success: false,
        message: "Missing webhook signature.",
      });
    }

    // req.body must be the raw Buffer.
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body));

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET
      )
      .update(rawBody)
      .digest("hex");

    if (
      !safeEqual(
        expectedSignature,
        receivedSignature
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    const payload = JSON.parse(
      rawBody.toString("utf8")
    );

    const event = payload.event;

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Webhook event is missing.",
      });
    }

    // Ignore duplicate webhook events.
    if (eventId) {
      try {
        await WebhookEvent.create({
          eventId,
          event,
        });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(200).json({
            success: true,
            message: "Duplicate event ignored.",
          });
        }

        throw error;
      }
    }

    const paymentEntity =
      payload?.payload?.payment?.entity;

    if (!paymentEntity) {
      return res.status(200).json({
        success: true,
        message: "Webhook received.",
      });
    }

    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;
    const amountInRupees =
      Number(paymentEntity.amount || 0) / 100;

    if (!razorpayOrderId) {
      return res.status(200).json({
        success: true,
        message: "No Razorpay order ID found.",
      });
    }

    const order = await Order.findOne({
      razorpayOrderId,
    });

    if (!order) {
      console.error(
        "Order not found:",
        razorpayOrderId
      );

      // Acknowledge unknown/old events.
      return res.status(200).json({
        success: true,
        message: "Local order not found.",
      });
    }

    if (event === "payment.captured") {
      if (
        Number(amountInRupees) !==
        Number(order.totalAmount)
      ) {
        console.error("Payment amount mismatch.", {
          expected: order.totalAmount,
          received: amountInRupees,
        });

        return res.status(400).json({
          success: false,
          message: "Payment amount mismatch.",
        });
      }

      if (
        order.paymentStatus === "Paid" &&
        order.razorpayPaymentId ===
          razorpayPaymentId
      ) {
        return res.status(200).json({
          success: true,
          message: "Payment already processed.",
        });
      }

      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        const updatedOrder =
          await Order.findOneAndUpdate(
            {
              _id: order._id,
              paymentStatus: { $ne: "Paid" },
            },
            {
              $set: {
                paidAmount: amountInRupees,
                remainingAmount: 0,
                paymentStatus: "Paid",
                paymentGateway: "Razorpay",
                razorpayPaymentId,
              },
              $push: {
                paymentHistory: {
                  amount: amountInRupees,
                  paymentMethod: "Razorpay",
                  transactionId: razorpayPaymentId,
                  paidAt: new Date(),
                },
              },
            },
            {
              new: true,
              session,
            }
          );

        if (updatedOrder) {
          if (updatedOrder.orderStatus !== "Pending") {
            await syncCreditBook(updatedOrder, session);
          }
        }

        await session.commitTransaction();

        return res.status(200).json({
          success: true,
          message: "Payment marked as paid.",
        });
      } catch (error) {
        if (session.inTransaction()) {
          await session.abortTransaction();
        }

        throw error;
      } finally {
        await session.endSession();
      }
    }

    if (event === "payment.failed") {
      const failureReason =
        paymentEntity.error_description ||
        paymentEntity.error_reason ||
        "Payment failed.";

      await Order.updateOne(
        {
          _id: order._id,
          paymentStatus: { $ne: "Paid" },
        },
        {
          $set: {
            paymentStatus: "Failed",
            paymentGateway: "Razorpay",
            razorpayPaymentId,
            paymentFailureReason: failureReason,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Payment failure recorded.",
      });
    }

    if (event === "payment.authorized") {
      await Order.updateOne(
        {
          _id: order._id,
          paymentStatus: {
            $nin: ["Paid", "Failed"],
          },
        },
        {
          $set: {
            paymentStatus: "Authorized",
            paymentGateway: "Razorpay",
            razorpayPaymentId,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Payment authorization recorded.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Event ${event} received.`,
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
};