import { useState } from 'react';
import { updatePaymentAmount } from '../../../services/orderService';
import { Button, Modal } from '../../common';
import toast from 'react-hot-toast';


const PaymentForm = ({
    dialogs, selectedOrder, setDialogs, setSelectedOrder, onPaymentUpdated
}) => {

    const [obj, setObj] = useState({
        paidAmount: "",
        paymentMethod: "Cash"
    })

    const [paymentOperation, setPaymentOperation] = useState(
        {
            exceedingAmount: false,
            paymentDialog: false,
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        const temp = { ...obj, [name]: value };

        if (temp.paidAmount > selectedOrder.remainingAmount) {
            setPaymentOperation(prev => ({ ...prev, exceedingAmount: true }));
            return;
        } else {
            setPaymentOperation(prev => ({ ...prev, exceedingAmount: false }));
        }
        setObj(temp);
    }

    const handlePaymentUpdate = async (e) => {
        e.preventDefault();
        try {
            await updatePaymentAmount(selectedOrder.orderId || selectedOrder._id, obj);
            toast.success("Payment updated successfully!");
            setDialogs(prev => ({ ...prev, openDetails: true, paymentDialog: false }));
            setSelectedOrder?.(null);
            setObj({ paidAmount: "", paymentMethod: "Cash" });
            await onPaymentUpdated?.();
        } catch (error) {
            console.error("Error updating payment:", error);
            toast.error(error.response?.data?.message || "Unable to update payment.");
        }
    }


    return (
        <Modal
            open={dialogs.paymentDialog}

            title={"Payment Module"}

            onClose={() => setDialogs(prev => ({ ...prev, paymentDialog: false }))}>

            <div>
                <form onSubmit={handlePaymentUpdate}>
                    <div>
                        <label htmlFor="totalAmount">Total Amount:</label>
                        <input type="number" id='totalAmount' value={selectedOrder?.totalAmount || ""} disabled />
                    </div>
                    <small>Your Remaining Balance: ₹{selectedOrder?.remainingAmount || "0.00"}</small>
                    <div>
                        <label htmlFor="payableAmount">Payable Amount:</label>
                        <input type="number" id='payableAmount' name="paidAmount" placeholder='Enter Amount' onChange={handleChange} />
                        <small>{paymentOperation.exceedingAmount ? "Amount exceeds remaining balance" : "Amount is within limit"}</small>
                    </div>
                    <div>
                        <label htmlFor="paymentMethod">Payment Method:</label>
                        <select id='paymentMethod' name="paymentMethod" value={obj.paymentMethod} onChange={handleChange} required>
                            <option value="">Select Payment Method</option>
                            <option value="Cash">💵 Cash</option>
                            <option value="UPI">📱 UPI</option>
                        </select>
                    </div>
                    <Button type="submit" disabled={paymentOperation.exceedingAmount}>Update Payment</Button>
                </form>
            </div>

        </Modal>
    )
}

export default PaymentForm