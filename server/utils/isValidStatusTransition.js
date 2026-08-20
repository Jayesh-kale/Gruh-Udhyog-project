const validTransitions = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Preparing", "Cancelled"],
    Preparing: ["Ready", "Cancelled"],
    Ready: ["Delivered"],
    Delivered: [],
    Cancelled: []
};

const isValidStatusTransition = (currentStatus, newStatus) => {
    
    return validTransitions[currentStatus].includes(newStatus);
};

module.exports = isValidStatusTransition;