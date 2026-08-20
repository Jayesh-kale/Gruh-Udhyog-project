import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const CreditDetails = () => {
    const { state } = useLocation();

    const [customer, setCustomer] = useState(state);
    const [loading, setLoading] = useState(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Credit Details</h1>
            <hr />
            <p>Order ID: {customer.record.orderId}</p>
            <p>Customer Name: {customer.record.customerName}</p>
            <p>Customer Phone: {customer.record.customerPhone}</p>
            <p>Product Summary: {customer.record.productSummary}</p>
            <p>Total Amount: ₹{customer.record.totalAmount}</p>
            <p style={{color: "red"}}>Remaining Amount: ₹{customer.record.remainingAmount}</p>
            <p>Order Date: {new Date(customer.record.orderDate).toLocaleDateString()}</p>
            <p>Status: {customer.record.status}</p>
            <p>Cleared At: {customer.record.clearedAt ? new Date(customer.record.clearedAt).toLocaleDateString() : 'N/A'}</p>
            {
                customer.record.paymentHistory && customer.record.paymentHistory.length > 0 ? (
                    <div>
                        <h2>Payment History</h2>
                        {customer.record.paymentHistory.map((payment, index) => (
                            <p key={index}>
                                {payment.paymentDate ? `Payment ${index + 1}: ₹${payment.amount} ${new Date(payment.paymentDate).toLocaleDateString()}` 
                                                     : `Payment ${index + 1} : ₹${payment.amount} , Method: ${payment.paymentMethod}`}
                            </p>
                            
                            ))}
                    </div>
                ) : null
            }
            <p>Cleared At: {new Date(customer.record.createdAt).toLocaleDateString()}</p>
            <p></p>
        </div>
    )
}

export default CreditDetails