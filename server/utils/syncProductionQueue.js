// const ProductionQueue = require("../models/productionQueue");

// /**
//  * Get or create Production Queue for a product
//  */
// const getQueue = async (item, session) => {

//     let queue = await ProductionQueue.findOne({
//         productId: item.productId
//     }).session(session);

//     if (!queue) {

//         queue = new ProductionQueue({

//             productId: item.productId,

//             productName: item.productName || item.name || "Unknown Product",

//             unit: item.unit

//         });

//     }

//     return queue;

// };

// /**
//  * Save Production History
//  */
// const saveHistory = (
//     queue,
//     order,
//     qty,
//     action,
//     previousStage,
//     currentStage
// ) => {

//     queue.history.push({

//         action,

//         orderId: order._id,

//         orderType: order.orderType,

//         quantity: qty,

//         previousStage,

//         currentStage,

//         updatedBy: order.editHistory.at(-1)?.editedBy

//     });

// };

// /**
//  * Pending++
//  */
// const addPending = (queue, orderType, qty) => {

//     if (orderType === "Online") {

//         queue.pendingOnline += qty;

//     } else {

//         queue.pendingOffline += qty;

//     }

// };

// /**
//  * Pending--
//  */
// const removePending = (queue, orderType, qty) => {

//     if (orderType === "Online") {

//         queue.pendingOnline -= qty;

//     } else {

//         queue.pendingOffline -= qty;

//     }

// };

// /**
//  * Preparing++
//  */
// const addPreparing = (queue, orderType, qty) => {

//     if (orderType === "Online") {

//         queue.preparingOnline += qty;

//     } else {

//         queue.preparingOffline += qty;

//     }

// };

// /**
//  * Preparing--
//  */
// const removePreparing = (queue, orderType, qty) => {

//     if (orderType === "Online") {

//         queue.preparingOnline -= qty;

//     } else {

//         queue.preparingOffline -= qty;

//     }

// };

// /**
//  * Ready++
//  */
// const addReady = (queue, orderType, qty) => {

//     if (orderType === "Online") {

//         queue.readyOnline += qty;

//     } else {

//         queue.readyOffline += qty;

//     }

// };

// /**
//  * Ready--
//  */
// const removeReady = (queue, orderType, qty) => {

//     if (orderType === "Online") {

//         queue.readyOnline -= qty;

//     } else {

//         queue.readyOffline -= qty;

//     }

// };

// /**
//  * Adjust Production Queue
//  * when order quantity changes
//  */
// const adjustQuantity = (
//     queue,
//     orderType,
//     status,
//     difference
// ) => {

//     if (difference === 0)
//         return;

//     switch (status) {

//         case "Pending":

//         case "Confirmed":

//             if (orderType === "Online") {

//                 queue.pendingOnline += difference;

//             } else {

//                 queue.pendingOffline += difference;

//             }

//             break;

//         case "Preparing":

//             if (orderType === "Online") {

//                 queue.preparingOnline += difference;

//             } else {

//                 queue.preparingOffline += difference;

//             }

//             break;

//         case "Ready":

//             if (orderType === "Online") {

//                 queue.readyOnline += difference;

//             } else {

//                 queue.readyOffline += difference;

//             }

//             break;

//         default:

//             break;

//     }

// };



// const syncUpdatedOrder = async ( oldOrder, updatedOrder, session) => {

//     // Process Existing Products
//     for (const oldItem of oldOrder.items) {

//         const queue = await getQueue(
//             oldItem,
//             session
//         );

//         const newItem = updatedOrder.items.find(
//             item =>
//                 item.productId.toString() ===
//                 oldItem.productId.toString()
//         );


//         // Product Removed

//         if (!newItem) {

//             adjustQuantity(

//                 queue,

//                 oldOrder.orderType,

//                 updatedOrder.orderStatus,

//                 -oldItem.quantity

//             );

//             saveHistory(

//                 queue,

//                 updatedOrder,

//                 oldItem.quantity,

//                 "Product Removed",

//                 updatedOrder.orderStatus,

//                 updatedOrder.orderStatus

//             );

//             await queue.save({ session });

//             continue;

//         }

//         // Quantity Changed

//         const difference =
//             newItem.quantity - oldItem.quantity;

//         if (difference !== 0) {

//             adjustQuantity(

//                 queue,

//                 updatedOrder.orderType,

//                 updatedOrder.orderStatus,

//                 difference

//             );

//             saveHistory(

//                 queue,

//                 updatedOrder,

//                 Math.abs(difference),

//                 "Quantity Updated",

//                 updatedOrder.orderStatus,

//                 updatedOrder.orderStatus

//             );

//             await queue.save({ session });

//         }

//     }


//     // Process Newly Added Products

//     for (const newItem of updatedOrder.items) {

//         const oldItem = oldOrder.items.find(
//             item =>
//                 item.productId.toString() ===
//                 newItem.productId.toString()
//         );

//         if (oldItem)
//             continue;

//         const queue = await getQueue(
//             newItem,
//             session
//         );

//         adjustQuantity(

//             queue,

//             updatedOrder.orderType,

//             updatedOrder.orderStatus,

//             newItem.quantity

//         );

//         saveHistory(

//             queue,

//             updatedOrder,

//             newItem.quantity,

//             "Product Added",

//             updatedOrder.orderStatus,

//             updatedOrder.orderStatus

//         );

//         await queue.save({ session });

//     }

// };

// const syncProductionQueue = async (
//     order,
//     previousStatus,
//     currentStatus,
//     session
// ) => {

//     for (const item of order.items) {

//         const queue = await getQueue(
//             item,
//             session
//         );

//         const qty = item.quantity;

//         const orderType = order.orderType;

//         // Order Created
//         // null -> Pending

//         if (previousStatus === null && currentStatus === "Pending") {

//             addPending(queue, orderType, qty);

//             saveHistory(
//                 queue,
//                 order,
//                 qty,
//                 "Order Created",
//                 null,
//                 "Pending"
//             );
//         }
//         // Pending -> Confirmed
//         // No Production Change


//         else if (
//             previousStatus === "Pending" &&
//             currentStatus === "Confirmed"
//         ) {

//             // Nothing to update

//         }
//         // Confirmed -> Preparing
//         // Pending --> Preparing

//         else if (
//             previousStatus === "Confirmed" &&
//             currentStatus === "Preparing"
//         ) {

//             removePending(queue, orderType, qty);

//             addPreparing(queue, orderType, qty);

//             saveHistory(
//                 queue,
//                 order,
//                 qty,
//                 "Moved To Preparing",
//                 "Pending",
//                 "Preparing"
//             );

//         }

//         // Preparing -> Ready
//         // Preparing --> Ready

//         else if (
//             previousStatus === "Preparing" &&
//             currentStatus === "Ready"
//         ) {

//             removePreparing(queue, orderType, qty);

//             addReady(queue, orderType, qty);

//             saveHistory(
//                 queue,
//                 order,
//                 qty,
//                 "Moved To Ready",
//                 "Preparing",
//                 "Ready"
//             );

//         }
//         // Ready -> Delivered
//         // Ready Removed

//         else if (
//             previousStatus === "Ready" &&
//             currentStatus === "Delivered"
//         ) {

//             removeReady(queue, orderType, qty);

//             saveHistory(
//                 queue,
//                 order,
//                 qty,
//                 "Delivered",
//                 "Ready",
//                 "Delivered"
//             );

//         }
//         // Pending -> Cancelled

//         else if (
//             previousStatus === "Pending" &&
//             currentStatus === "Cancelled"
//         ) {

//             removePending(queue, orderType, qty);

//             saveHistory(
//                 queue,
//                 order,
//                 qty,
//                 "Cancelled",
//                 "Pending",
//                 "Cancelled"
//             );

//         }

//         // Confirmed -> Cancelled
//         // Remove Pending


//         else if (
//             previousStatus === "Confirmed" &&
//             currentStatus === "Cancelled"
//         ) {

//             removePending(queue, orderType, qty);

//             saveHistory(
//                 queue,
//                 order,
//                 qty,
//                 "Cancelled",
//                 "Pending",
//                 "Cancelled"
//             );

//         }

//         // ====================================================
//         // Preparing -> Cancelled
//         // ====================================================

//         else if (
//             previousStatus === "Preparing" &&
//             currentStatus === "Cancelled"
//         ) {

//             removePreparing(queue, orderType, qty);

//             saveHistory(
//                 queue,
//                 order,
//                 qty,
//                 "Cancelled",
//                 "Preparing",
//                 "Cancelled"
//             );

//         }

//         // ====================================================
//         // Ready -> Cancelled
//         // ====================================================

//         else if (
//             previousStatus === "Ready" &&
//             currentStatus === "Cancelled"
//         ) {

//             removeReady(queue, orderType, qty);

//             saveHistory(
//                 queue,
//                 order,
//                 qty,
//                 "Cancelled",
//                 "Ready",
//                 "Cancelled"
//             );

//         }

//         await queue.save({
//             session
//         });

//     }

// };

// module.exports = {

//     syncProductionQueue,

//     syncUpdatedOrder

// };

const ProductionQueue = require("../models/productionQueue");

/**
 * ============================================
 * GET OR CREATE PRODUCTION QUEUE
 * ============================================
 */
const getQueue = async (item, session) => {

    let queue = await ProductionQueue.findOne({
        productId: item.productId
    }).session(session);

    if (!queue) {

        queue = new ProductionQueue({

            productId: item.productId,

            productName:
                item.productName ||
                item.name ||
                "Unknown Product",

            unit: item.unit,

            pendingOnline: 0,
            pendingOffline: 0,

            preparingOnline: 0,
            preparingOffline: 0,

            readyOnline: 0,
            readyOffline: 0,

            history: []

        });

    }

    return queue;

};


/**
 * ============================================
 * SAVE PRODUCTION HISTORY
 * ============================================
 */
const saveHistory = (
    queue,
    order,
    qty,
    action,
    previousStage,
    currentStage
) => {

    const updatedBy =
        order.editHistory?.at(-1)?.editedBy ||
        order.customer?.customerId ||
        null;

    // Keep queue updates working even if history actor is unavailable.
    if (!updatedBy) {
        return;
    }

    queue.history.push({

        action,

        orderId: order._id,

        orderType: order.orderType,

        quantity: qty,

        previousStage,

        currentStage,

        updatedBy

    });

};

const toQty = (value) => {
    const qty = Number(value);
    return Number.isFinite(qty) ? qty : 0;
};


/**
 * ============================================
 * PENDING +
 * ============================================
 */
const addPending = (
    queue,
    orderType,
    qty
) => {

    const amount = toQty(qty);

    if (orderType === "Online") {

        queue.pendingOnline += amount;

    } else {

        queue.pendingOffline += amount;

    }

};


/**
 * ============================================
 * PENDING -
 * ============================================
 *
 * Prevent negative quantity.
 * ============================================
 */
const removePending = (
    queue,
    orderType,
    qty
) => {

    const amount = toQty(qty);

    if (orderType === "Online") {

        queue.pendingOnline =
            Math.max(
                0,
                queue.pendingOnline - amount
            );

    } else {

        queue.pendingOffline =
            Math.max(
                0,
                queue.pendingOffline - amount
            );

    }

};


/**
 * ============================================
 * PREPARING +
 * ============================================
 */
const addPreparing = (
    queue,
    orderType,
    qty
) => {

    const amount = toQty(qty);

    if (orderType === "Online") {

        queue.preparingOnline += amount;

    } else {

        queue.preparingOffline += amount;

    }

};


/**
 * ============================================
 * PREPARING -
 * ============================================
 */
const removePreparing = (
    queue,
    orderType,
    qty
) => {

    const amount = toQty(qty);

    if (orderType === "Online") {

        queue.preparingOnline =
            Math.max(
                0,
                queue.preparingOnline - amount
            );

    } else {

        queue.preparingOffline =
            Math.max(
                0,
                queue.preparingOffline - amount
            );

    }

};


/**
 * ============================================
 * READY +
 * ============================================
 */
const addReady = (
    queue,
    orderType,
    qty
) => {

    const amount = toQty(qty);

    if (orderType === "Online") {

        queue.readyOnline += amount;

    } else {

        queue.readyOffline += amount;

    }

};


/**
 * ============================================
 * READY -
 * ============================================
 */
const removeReady = (
    queue,
    orderType,
    qty
) => {

    const amount = toQty(qty);

    if (orderType === "Online") {

        queue.readyOnline =
            Math.max(
                0,
                queue.readyOnline - amount
            );

    } else {

        queue.readyOffline =
            Math.max(
                0,
                queue.readyOffline - amount
            );

    }

};


/**
 * ============================================
 * ADJUST QUANTITY
 * ============================================
 *
 * Used when an existing order is edited.
 *
 * Pending / Confirmed → Pending
 * Preparing → Preparing
 * Ready → Ready
 * ============================================
 */
const adjustQuantity = (
    queue,
    orderType,
    status,
    difference
) => {

    const delta = toQty(difference);

    if (delta === 0) {
        return;
    }

    switch (status) {

        case "Pending":

        case "Confirmed":

            if (orderType === "Online") {

                queue.pendingOnline += delta;

            } else {

                queue.pendingOffline += delta;

            }

            break;


        case "Preparing":

            if (orderType === "Online") {

                queue.preparingOnline += delta;

            } else {

                queue.preparingOffline += delta;

            }

            break;


        case "Ready":

            if (orderType === "Online") {

                queue.readyOnline += delta;

            } else {

                queue.readyOffline += delta;

            }

            break;


        default:

            break;

    }

};


/**
 * ============================================
 * SYNC UPDATED ORDER
 * ============================================
 *
 * Handles:
 *
 * 1. Product removed
 * 2. Quantity changed
 * 3. Product added
 * ============================================
 */
const syncUpdatedOrder = async (
    oldOrder,
    updatedOrder,
    session
) => {

    /**
     * ========================================
     * EXISTING PRODUCTS
     * ========================================
     */
    for (const oldItem of oldOrder.items) {

        const queue = await getQueue(
            oldItem,
            session
        );

        const newItem =
            updatedOrder.items.find(
                item =>
                    item.productId.toString() ===
                    oldItem.productId.toString()
            );

        /**
         * ====================================
         * PRODUCT REMOVED
         * ====================================
         */
        if (!newItem) {

            adjustQuantity(
                queue,
                oldOrder.orderType,
                updatedOrder.orderStatus,
                -oldItem.quantity
            );

            saveHistory(
                queue,
                updatedOrder,
                oldItem.quantity,
                "Product Removed",
                updatedOrder.orderStatus,
                updatedOrder.orderStatus
            );

            await queue.save({
                session
            });

            continue;

        }


        /**
         * ====================================
         * QUANTITY CHANGED
         * ====================================
         */
        const difference =
            newItem.quantity -
            oldItem.quantity;

        if (difference !== 0) {

            adjustQuantity(
                queue,
                updatedOrder.orderType,
                updatedOrder.orderStatus,
                difference
            );

            saveHistory(
                queue,
                updatedOrder,
                Math.abs(difference),
                "Quantity Updated",
                updatedOrder.orderStatus,
                updatedOrder.orderStatus
            );

            await queue.save({
                session
            });

        }

    }


    /**
     * ========================================
     * NEW PRODUCTS
     * ========================================
     */
    for (const newItem of updatedOrder.items) {

        const oldItem =
            oldOrder.items.find(
                item =>
                    item.productId.toString() ===
                    newItem.productId.toString()
            );

        if (oldItem) {
            continue;
        }

        const queue = await getQueue(
            newItem,
            session
        );

        adjustQuantity(
            queue,
            updatedOrder.orderType,
            updatedOrder.orderStatus,
            newItem.quantity
        );

        saveHistory(
            queue,
            updatedOrder,
            newItem.quantity,
            "Product Added",
            updatedOrder.orderStatus,
            updatedOrder.orderStatus
        );

        await queue.save({
            session
        });

    }

};


/**
 * ============================================
 * SYNC PRODUCTION QUEUE
 * ============================================
 *
 * Production flow:
 *
 * CREATE
 *   ↓
 * PENDING
 *   ↓
 * CONFIRMED
 *   ↓
 * PREPARING
 *   ↓
 * READY
 *   ↓
 * DELIVERED
 *
 * Cancellation can happen from:
 *
 * PENDING
 * CONFIRMED
 * PREPARING
 * READY
 * ============================================
 */
const syncProductionQueue = async (
    order,
    previousStatus,
    currentStatus,
    session
) => {

    for (const item of order.items) {

        const queue = await getQueue(
            item,
            session
        );

        const qty = toQty(item.quantity);

        const orderType = order.orderType;


        /**
         * ========================================
         * ORDER CREATED
         * null → Pending
         * ========================================
         */
        if (
            previousStatus === null &&
            currentStatus === "Pending"
        ) {

            addPending(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Order Created",
                null,
                "Pending"
            );

        }


        /**
         * ========================================
         * Pending → Confirmed
         *
         * NO PRODUCTION CHANGE
         * ========================================
         */
        else if (
            previousStatus === "Pending" &&
            currentStatus === "Confirmed"
        ) {

            addPending(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Order Created",
                "Pending",
                "Confirmed"
            );

        }


        /**
         * ========================================
         * Confirmed → Preparing
         *
         * Pending → Preparing
         * ========================================
         */
        else if (
            previousStatus === "Confirmed" &&
            currentStatus === "Preparing"
        ) {

            removePending(
                queue,
                orderType,
                qty
            );

            addPreparing(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Moved To Preparing",
                "Pending",
                "Preparing"
            );

        }


        /**
         * ========================================
         * Preparing → Ready
         * ========================================
         */
        else if (
            previousStatus === "Preparing" &&
            currentStatus === "Ready"
        ) {

            removePreparing(
                queue,
                orderType,
                qty
            );

            addReady(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Moved To Ready",
                "Preparing",
                "Ready"
            );

        }


        /**
         * ========================================
         * Ready → Delivered
         * ========================================
         */
        else if (
            previousStatus === "Ready" &&
            currentStatus === "Delivered"
        ) {

            removeReady(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Delivered",
                "Ready",
                "Delivered"
            );

        }


        /**
         * ========================================
         * Pending → Cancelled
         * ========================================
         */
        else if (
            previousStatus === "Pending" &&
            currentStatus === "Cancelled"
        ) {

            removePending(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Cancelled",
                "Pending",
                "Cancelled"
            );

        }


        /**
         * ========================================
         * Confirmed → Cancelled
         *
         * Confirmed has not started production,
         * so quantity is still in Pending.
         * ========================================
         */
        else if (
            previousStatus === "Confirmed" &&
            currentStatus === "Cancelled"
        ) {

            removePending(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Cancelled",
                "Pending",
                "Cancelled"
            );

        }


        /**
         * ========================================
         * Preparing → Cancelled
         * ========================================
         */
        else if (
            previousStatus === "Preparing" &&
            currentStatus === "Cancelled"
        ) {

            removePreparing(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Cancelled",
                "Preparing",
                "Cancelled"
            );

        }

        else if (
            previousStatus === "Ready" &&
            currentStatus === "Cancelled"
        ) {

            removeReady(
                queue,
                orderType,
                qty
            );

            saveHistory(
                queue,
                order,
                qty,
                "Cancelled",
                "Ready",
                "Cancelled"
            );

        }
        await queue.save({
            session
        });

    }

};

module.exports = {

    syncProductionQueue,

    syncUpdatedOrder

};