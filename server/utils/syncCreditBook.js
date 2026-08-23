// Create a CreditBook entry if it doesn't exist.
// Update an existing entry.
// Mark it as Pending or Cleared.
// Update remainingAmount.
// Update paymentHistory.
// Update productSummary.
// Update clearedAt.
const CreditBook = require("../models/creditBook");

const syncCreditBook = async (order, session) => {

    const creditEntry = await CreditBook.findOne({
        orderId: order._id
    }).session(session);

    const productSummary = order.items
        .map(item =>
            `${item.productName} (${item.quantity} ${item.unit})`
        )
        .join(", ");

    if (!creditEntry) {

        await CreditBook.create(
            [
                {
                    customerId: order.customer.customerId || null,

                    customerName: order.customer.name,

                    customerPhone: order.customer.phone,

                    orderId: order._id,

                    productSummary,

                    totalAmount: order.totalAmount,

                    remainingAmount: order.remainingAmount,

                    orderDate: order.orderDate,

                    status:
                        order.remainingAmount > 0
                            ? "Pending"
                            : "Cleared",

                    clearedAt:
                        order.remainingAmount === 0
                            ? new Date()
                            : null,

                    paymentHistory: [...order.paymentHistory]
                }
            ],
            { session }
        );

        return;
    }

    creditEntry.customerId = order.customer.customerId;

    creditEntry.customerName = order.customer.name;

    creditEntry.customerPhone = order.customer.phone;

    creditEntry.productSummary = productSummary;

    creditEntry.totalAmount = order.totalAmount;

    creditEntry.remainingAmount = order.remainingAmount;

    creditEntry.orderDate = order.orderDate;

    creditEntry.paymentHistory = [...order.paymentHistory];

    if (order.remainingAmount > 0) {

        creditEntry.status = "Pending";

        creditEntry.clearedAt = null;

    } else {

        creditEntry.status = "Cleared";

        creditEntry.clearedAt = new Date();

    }

    await creditEntry.save({ session });

};

module.exports = syncCreditBook;



