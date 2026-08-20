
//it is used to filter the orders based on the query parameters passed in the request
const buildOrderFilter = (query) => {

    const {
        search,
        orderStatus,
        paymentStatus,
        orderType,
        fromDate,
        toDate
    } = query;

    const filter = {};

    // Search
    if (search) {

        filter.$or = [

            {
                orderNumber: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                "customer.name": {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                "customer.phone": {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }

    // Order Status
    if (orderStatus) {
        filter.orderStatus = orderStatus;
    }

    // Payment Status
    if (paymentStatus) {
        filter.paymentStatus = paymentStatus;
    }

    // Order Type
    if (orderType) {
        filter.orderType = orderType;
    }

    // Date Range
    if (fromDate || toDate) {

        filter.orderDate = {};

        if (fromDate) {
            filter.orderDate.$gte = new Date(fromDate);
        }

        if (toDate) {

            const endDate = new Date(toDate);

            endDate.setHours(23, 59, 59, 999);

            filter.orderDate.$lte = endDate;
        }

    }

    return filter;

};

module.exports = buildOrderFilter;