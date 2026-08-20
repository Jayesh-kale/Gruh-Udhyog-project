const Counter = require("../models/counter");

const generateOrderNumber = async () => {

    const counter = await Counter.findByIdAndUpdate(
        "order",
        {
            $inc: {
                sequenceValue: 1
            }
        },
        {
            new: true,
            upsert: true
        }
    );

    const sequence = String(counter.sequenceValue).padStart(6, "0");

    const today = new Date();

    const year = String(today.getFullYear()).slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `ORD${year}${month}${day}${sequence}`;
};

module.exports = generateOrderNumber;