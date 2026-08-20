const generateEditHistory = (
    oldOrder,
    updatedOrder,
    editedBy,
    reason = ""
) => {

    const history = [];

    // Payment Updated
    if (oldOrder.paidAmount !== updatedOrder.paidAmount) {

        history.push({
            action: "Payment Updated",
            editedBy,
            reason:
                reason ||
                `Paid amount changed from ₹${oldOrder.paidAmount} to ₹${updatedOrder.paidAmount}.`
        });

    }

    // Status Updated
    if (oldOrder.orderStatus !== updatedOrder.orderStatus) {

        history.push({
            action: "Status Updated",
            editedBy,
            reason:
                reason ||
                `Order status changed from ${oldOrder.orderStatus} to ${updatedOrder.orderStatus}.`
        });

    }

    // Notes Updated
    if (oldOrder.notes !== updatedOrder.notes) {

        history.push({
            action: "Notes Updated",
            editedBy,
            reason:
                reason ||
                "Order notes updated."
        });

    }

    // Customer Updated
    if (
        oldOrder.customer.customerId.toString() !==
        updatedOrder.customer.customerId.toString()
    ) {

        history.push({
            action: "Customer Updated",
            editedBy,
            reason:
                reason ||
                "Customer changed."
        });

    }

    const oldItemsMap = new Map(
        oldOrder.items.map(item => [
            item.productId.toString(),
            item
        ])
    );

    const newItemsMap = new Map(
        updatedOrder.items.map(item => [
            item.productId.toString(),
            item
        ])
    );

    // Item Added
    for (const [productId, newItem] of newItemsMap) {

        if (!oldItemsMap.has(productId)) {

            history.push({
                action: "Item Added",
                editedBy,
                reason:
                    reason ||
                    `${newItem.productName} (${newItem.quantity} ${newItem.unit}) added to the order.`
            });

        }

    }

    // Item Removed
    for (const [productId, oldItem] of oldItemsMap) {

        if (!newItemsMap.has(productId)) {

            history.push({
                action: "Item Removed",
                editedBy,
                reason:
                    reason ||
                    `${oldItem.productName} removed from the order.`
            });

        }

    }

    // Quantity & Price Updated
    for (const [productId, newItem] of newItemsMap) {

        const oldItem = oldItemsMap.get(productId);

        if (!oldItem) continue;

        if (oldItem.quantity !== newItem.quantity) {

            history.push({
                action: "Quantity Updated",
                editedBy,
                reason:
                    reason ||
                    `${newItem.productName} quantity changed from ${oldItem.quantity} ${oldItem.unit} to ${newItem.quantity} ${newItem.unit}.`
            });

        }

        if (oldItem.pricePerUnit !== newItem.pricePerUnit) {

            history.push({
                action: "Price Updated",
                editedBy,
                reason:
                    reason ||
                    `${newItem.productName} price changed from ₹${oldItem.pricePerUnit} to ₹${newItem.pricePerUnit}.`
            });

        }

    }

    return history;

};

module.exports = generateEditHistory;