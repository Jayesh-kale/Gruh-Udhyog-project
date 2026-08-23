import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Modal, PageHeader, Pagination, SearchBar, Select } from '../../../components/common';
import OrderTracker from '../../../components/customer/OrderTracker/OrderTracker';

import { getAllOrders, updateOrderStatus, updatePaymentAmount } from '../../../services/orderService';
import toast from 'react-hot-toast';
import PaymentForm from '../../../components/admin/PaymentForm/PaymentForm';



const STATUS_FLOW = {
    Pending: "Confirmed",
    Confirmed: "Preparing",
    Preparing: "Ready",
    Ready: "Delivered"
};

const STATUS_ACTION_LABELS = {
    Pending: "Accept Order",
    Confirmed: "Send to Production",
    Preparing: "Mark Ready",
    Ready: "Mark Delivered"
};

function Orders() {

    const [filter, setFilter] = useState({
        search: "",
        orderStatus: "",
        orderType: "",
        paymentStatus: "",
        fromDate: "",
        toDate: "",
        page: 1,
        limit: 10
    });

    const [dialogs, setDialogs] = useState({
        paymentDialog: false,
        openDetails: false
    })

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [orderOperations, setOrderOperations] = useState({
        accepting: false,
        rejecting: false,
        rejectOrder: null,
        acceptOrder: null
    });

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({});

    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [filter, orderOperations.acceptOrder, orderOperations.rejectOrder, orderOperations.paymentUpdate, page]);

    async function loadOrders() {

        try {

            setLoading(true);

            // const res = await getAllOrders({
            //     page,
            //     limit: 10,
            //     search: search || undefined,
            //     orderStatus: status || undefined,
            //     orderType: orderType || undefined,
            //     paymentStatus: paymentStatus || undefined
            // });
            const res = await getAllOrders(filter);
            setOrders(res?.data?.orders || []);

            console.log("in Admin Orders.jsx", res?.data?.orders)

            setPagination(res?.data?.pagination || {});

        }

        catch (error) {

            console.error("Failed to load orders:", error);

            setOrders([]);

            setPagination({});

        }

        finally {

            setLoading(false);

        }

    }

    //for updating the Payment Status
    const handlePayment = async (id, order) => {
        setDialogs(prev => ({ ...prev, openDetails: false }));
        setSelectedOrder(order);
        setDialogs(prev => ({ ...prev, paymentDialog: true }));
    }

    const confirmAccept = async () => {

        if (!orderOperations.acceptOrder) return;
        try {

            setOrderOperations(prev => ({ ...prev, accepting: true }));

            const res = await updateOrderStatus(
                orderOperations.acceptOrder._id,
                "Confirmed"
            );

            const updatedOrder = res?.data?.order || res?.order;

            toast.success(
                "Order accepted successfully!"
            );

            if (updatedOrder) {

                setOrders(prev =>
                    prev.map(order =>
                        order._id === updatedOrder._id
                            ? updatedOrder
                            : order
                    )
                );

                setSelectedOrder(prev =>
                    prev?._id === updatedOrder._id
                        ? updatedOrder
                        : prev
                );

            } else {

                await loadOrders();

            }

            setOrderOperations(prev => ({ ...prev, acceptOrder: null }));

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to accept order."
            );

        } finally {

            setOrderOperations(prev => ({ ...prev, accepting: false }));

        }

    };

    const confirmReject = async () => {

        if (!orderOperations.rejectOrder) return;

        try {

            setOrderOperations(prev => ({ ...prev, rejecting: true }));

            const res = await updateOrderStatus(
                orderOperations.rejectOrder._id,
                "Cancelled"
            );

            const updatedOrder = res?.data?.order || res?.order;
            toast.success("Order rejected successfully!");
            if (updatedOrder) {

                setOrders(prev =>
                    prev.map(item =>
                        item._id === updatedOrder._id
                            ? updatedOrder
                            : item
                    )
                );

                setSelectedOrder(prev =>
                    prev?._id === updatedOrder._id
                        ? updatedOrder
                        : prev
                );

            } else {

                await loadOrders();

            }

            setOrderOperations(prev => ({ ...prev, rejectOrder: null }));

        } catch (error) {

            console.error(
                "Failed to reject order:",
                error?.response?.data?.message ||
                error.message
            );

        } finally {

            setOrderOperations(prev => ({ ...prev, rejecting: false }));

        }
    };

    //for opening the dialog box for order details before accepting
    const handleAccept = (order) => {
        setOrderOperations(prev => ({ ...prev, acceptOrder: order }));
    };


    //for opening the dialog box for order details brfore rejecting
    const handleReject = (order) => {
        setOrderOperations(prev => ({ ...prev, rejectOrder: order }));
    };

    const handleStatus = async (order) => {

        const nextStatus = STATUS_FLOW[order.orderStatus];

        if (!nextStatus) {
            console.warn(`No next status available for order ${order.orderNumber} (${order.orderStatus}).`);
            return;
        }

        try {
            const res = await updateOrderStatus(order._id, nextStatus);
            const updatedOrder = res?.data?.order || res?.order;
            console.log(`Order ${order.orderNumber} status updated to ${nextStatus}.`, updatedOrder);
            toast.success(`Order marked as ${nextStatus}.`);

            if (updatedOrder) {
                setOrders(prev => prev.map(item => item._id === updatedOrder._id ? updatedOrder : item));
                setSelectedOrder(prev => prev?._id === updatedOrder._id ? updatedOrder : prev);
            } else {
                await loadOrders();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update order status.");
            console.error("Failed to update order status:", error?.response?.data?.message || error.message);
        }
    }



    return (
        <div>
            {/* Payment Update Form */}
            <PaymentForm
                dialogs={dialogs}
                setDialogs={setDialogs}
                selectedOrder={selectedOrder}
                setSelectedOrder={(e) => setSelectedOrder(e)}
            />

            <PageHeader title="Orders Management" subtitle="Manage online and offline orders" />
            <div className="order-filters">

                <SearchBar

                    value={filter.search}

                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}

                />

                <Select value={filter.orderStatus} onChange={(e) => setFilter({ ...filter, orderStatus: e.target.value })}
                    options={[

                        { label: "Pending", value: "Pending" },

                        { label: "Confirmed", value: "Confirmed" },

                        { label: "Preparing", value: "Preparing" },

                        { label: "Ready", value: "Ready" },

                        { label: "Delivered", value: "Delivered" }

                    ]} />

                <Select value={filter.orderType} onChange={(e) => setFilter({ ...filter, orderType: e.target.value })}
                    options={[

                        { label: "Online", value: "Online" },

                        { label: "Offline", value: "Offline" }
                    ]} />

                <Select value={filter.paymentStatus} onChange={(e) => setFilter({ ...filter, paymentStatus: e.target.value })}
                    options={[

                        { label: "Pending", value: "Pending" },

                        { label: "Partially Paid", value: "Partially Paid" },

                        { label: "Paid", value: "Paid" }
                    ]} />

                {/* <input type="date" value={filter.fromDate} onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })} />
                <input type="date" value={filter.toDate} onChange={(e) => setFilter({ ...filter, toDate: e.target.value })} /> */}
                <div className="row g-3 align-items-center m-1  mb-3">
                    <div className="col-md-6 col-sm-12">
                        <div className="form-floating">
                            <input
                                type="date"
                                className="form-control"
                                id="fromDate"
                                placeholder="From Date"
                                value={filter.fromDate}
                                onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })}
                            />
                            <label htmlFor="fromDate">From Date</label>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-12">
                        <div className="form-floating">
                            <input
                                type="date"
                                className="form-control"
                                id="toDate"
                                placeholder="To Date"
                                value={filter.toDate}
                                onChange={(e) => setFilter({ ...filter, toDate: e.target.value })}
                            />
                            <label htmlFor="toDate">To Date</label>
                        </div>
                    </div>
                </div>

                {

                    loading && <p>Loading orders...</p>

                }

                {

                    !loading && orders.length === 0 && <p>No orders found.</p>

                }

                {

                    !loading && orders.map((order) => (

                        <Card key={order._id} className="order-card" data-aos="fade-up">

                            <div className="order-header">

                                <h5>

                                    {order.orderNumber}

                                </h5>

                                <Badge>

                                    {order.orderStatus}

                                </Badge>

                            </div>

                            <p>

                                {order.customer?.name || "N/A"}

                            </p>

                            <p>

                                {order.customer?.phone || "N/A"}

                            </p>

                            <p>

                                {order.items?.length || 0} Products

                            </p>

                            <h4>

                                ₹{order.totalAmount}

                            </h4>

                            <div className="order-actions">

                                <Button
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setDialogs(prev => ({ ...prev, openDetails: true }));
                                    }}

                                >
                                    {order.orderStatus === "Cancelled" ? "Order Cancelled" : "View Order"}
                                </Button>


                                {order.orderStatus === "Pending" && (

                                    <>
                                        <Button
                                            variant="success"
                                            onClick={() => handleAccept(order)}
                                        >
                                            Accept
                                        </Button>

                                        <Button
                                            variant="danger"
                                            onClick={() => handleReject(order)}
                                        >
                                            Reject
                                        </Button>
                                    </>

                                )}


                                {order.orderStatus === "Confirmed" && (

                                    <Button
                                        variant="warning"
                                        onClick={() => handleStatus(order)}
                                    >
                                        Send to Production
                                    </Button>

                                )}


                                {order.orderStatus === "Preparing" && (

                                    <Button
                                        variant="warning"
                                        disabled
                                    >
                                        In Production
                                    </Button>

                                )}


                                {order.orderStatus === "Ready" && (

                                    <Button
                                        variant="success"
                                        onClick={() => handleStatus(order)}
                                    >
                                        Mark Delivered
                                    </Button>

                                )}

                            </div>

                        </Card>

                    ))

                }

                <Pagination

                    currentPage={page}

                    totalPages={pagination.totalPages || 1}

                    onPageChange={setPage}

                />

                <Modal

                    open={dialogs.openDetails}

                    title={selectedOrder?.orderNumber}

                    onClose={() => {
                        setDialogs(prev => ({ ...prev, openDetails: false }))
                        setSelectedOrder(null);
                    }}>


                    {

                        selectedOrder && (

                            <div>

                                <OrderTracker

                                    status={selectedOrder.orderStatus}

                                />

                                {/* Customer */}
                                <Card>

                                    <h5>

                                        Customer Information

                                    </h5>

                                    <p>

                                        Name : {selectedOrder.customer.name}

                                    </p>

                                    <p>

                                        Phone : {selectedOrder.customer.phone}

                                    </p>

                                    <p>

                                        Village : {selectedOrder.customer.village}

                                    </p>

                                    <p>

                                        Order Type : {selectedOrder.orderType}

                                    </p>
                                    <p>

                                        Order Created At : {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "N/A"}

                                    </p>

                                </Card>

                                {/* Products */}
                                {

                                    selectedOrder.items?.map(item => (

                                        <Card

                                            key={item.productId}

                                            className="product-card"

                                        >

                                            <img

                                                src={item.image.url}

                                                alt={item.productName}

                                            />

                                            <div>

                                                <h6>

                                                    {item.productName}

                                                </h6>

                                                <small>

                                                    {item.quantity}

                                                    {item.unit}

                                                </small>

                                            </div>

                                            <strong>

                                                ₹{item.itemTotal}

                                            </strong>

                                        </Card>

                                    ))

                                }

                                {/* Payment */}
                                <Card>

                                    <h5>

                                        Payment

                                    </h5>

                                    <p>

                                        Total : ₹{selectedOrder.totalAmount}

                                    </p>

                                    <p>

                                        Paid : ₹{selectedOrder.paidAmount}

                                    </p>

                                    <p>

                                        Remaining : ₹{selectedOrder.remainingAmount}

                                    </p>

                                    <Badge>

                                        {selectedOrder.paymentStatus}

                                    </Badge>

                                </Card>

                                {/* Payment History */}
                                <Card>

                                    <h5>

                                        Payment History

                                    </h5>

                                    {

                                        selectedOrder.paymentHistory?.map((payment, index) => (

                                            <li key={index}>

                                                ₹{payment.amount}

                                                {" " + payment.paymentMethod}
                                                <br />
                                                <small>
                                                    Date: {new Date(payment.paidAt).toLocaleDateString()}
                                                </small>

                                            </li>


                                        ))

                                    }

                                </Card>

                                {/* Raw Materials */}
                                {

                                    selectedOrder.orderType === "Offline" &&

                                    (

                                        <Card>

                                            <h5>

                                                Raw Materials

                                            </h5>

                                            {

                                                selectedOrder.rawMaterials?.map((raw, index) => (

                                                    <p key={index}>

                                                        {raw.name}

                                                        -

                                                        {raw.quantity}

                                                        {raw.unit}

                                                    </p>

                                                ))

                                            }

                                        </Card>

                                    )
                                }

                                {/* Notes */}
                                {

                                    selectedOrder.notes &&

                                    <Card>

                                        <h5>

                                            Notes

                                        </h5>

                                        <p>

                                            {selectedOrder.notes}

                                        </p>

                                    </Card>

                                }

                                {/* Edit History */}
                                <Card>

                                    <h5>

                                        Edit History

                                    </h5>

                                    {

                                        selectedOrder.editHistory?.map((history, index) => (

                                            <div key={index}>
                                                <small>

                                                    {index + 1}.   {history.reason}

                                                </small>

                                            </div>

                                        ))

                                    }

                                </Card>
                                <div className="modal-actions">

                                    <Button onClick={() => handlePayment(selectedOrder.id, selectedOrder)} disabled={selectedOrder.orderStatus === "Cancelled"}>

                                        Update Payment

                                    </Button>

                                    <Button variant="warning" onClick={() => { handleStatus(selectedOrder) }} disabled={selectedOrder.orderStatus === "Cancelled"}>

                                        {STATUS_ACTION_LABELS[selectedOrder.orderStatus] || "Update Status"}

                                    </Button>

                                    <Button
                                        variant="secondary"
                                        onClick={() => setDialogs(prev => ({ ...prev, openDetails: false }))}
                                    >

                                        Close

                                    </Button>

                                </div>
                            </div>


                        )

                    }

                </Modal>
                {/* for displaying the reject order dialog box */}
                <Modal
                    open={!!orderOperations.rejectOrder}
                    title="Reject Order"
                    onClose={() => {
                        if (!orderOperations.rejecting) {
                            setOrderOperations(prev => ({ ...prev, rejectOrder: null }));
                        }
                    }}
                >
                    <div className="reject-dialog">

                        <div className="reject-icon">
                            !
                        </div>

                        <h4>
                            Reject this order?
                        </h4>

                        <p>
                            Are you sure you want to reject order
                            <strong> #{orderOperations.rejectOrder?.orderNumber}</strong>?
                        </p>

                        <p className="reject-warning">
                            This order will be marked as Cancelled.
                        </p>

                        <div className="modal-actions">

                            <Button
                                variant="secondary"
                                disabled={orderOperations.rejecting}
                                onClick={() => setOrderOperations(prev => ({ ...prev, rejectOrder: null }))}
                            >
                                Keep Order
                            </Button>

                            <Button
                                variant="danger"
                                disabled={orderOperations.rejecting}
                                onClick={confirmReject}
                            >
                                {orderOperations.rejecting
                                    ? "Rejecting..."
                                    : "Reject Order"
                                }
                            </Button>

                        </div>

                    </div>
                </Modal>

                {/* for displaying the accept order dialog box */}
                <Modal
                    open={!!orderOperations.acceptOrder}
                    title="Accept Order"
                    onClose={() => {
                        if (!orderOperations.accepting) {
                            setOrderOperations(prev => ({ ...prev, acceptOrder: null }));
                        }
                    }}
                >
                    <div className="accept-dialog">

                        <div className="accept-icon">
                            ✓
                        </div>

                        <h4>
                            Accept this order?
                        </h4>

                        <p>
                            Are you sure you want to accept
                            <strong> #{orderOperations.acceptOrder?.orderNumber}</strong>?
                        </p>

                        <p className="accept-info">
                            The order will move to Confirmed and
                            become available for production.
                        </p>

                        <div className="modal-actions">

                            <Button
                                variant="secondary"
                                disabled={orderOperations.accepting}
                                onClick={() => setOrderOperations(prev => ({ ...prev, acceptOrder: null }))}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="success"
                                disabled={orderOperations.accepting}
                                onClick={confirmAccept}
                            >
                                {orderOperations.accepting
                                    ? "Accepting..."
                                    : "Accept Order"
                                }
                            </Button>

                        </div>

                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Orders