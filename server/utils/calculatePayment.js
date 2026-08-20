const calculatePayment = (totalAmount, paidAmount) => {

    const remainingAmount = Math.max(0, totalAmount - paidAmount);

    let paymentStatus = "Pending";

    if (remainingAmount === 0) {
        paymentStatus = "Paid";
    }
    else if (paidAmount > 0) {
        paymentStatus = "Partially Paid";
    }

    return {
        remainingAmount,
        paymentStatus
    };

};

module.exports = calculatePayment;