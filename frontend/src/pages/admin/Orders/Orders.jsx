import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Modal, PageHeader, Pagination, SearchBar, Select } from '../../../components/common';
import OrderTracker from '../../../components/customer/OrderTracker/OrderTracker';

import { getAllOrders, updateOrderStatus } from '../../../services/orderService';
import toast, { ToastBar } from 'react-hot-toast';

const STATUS_FLOW = {
    Confirmed: "Preparing",
    Ready: "Delivered"
};

function Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [orderType, setOrderType] = useState("");

    const [rejectOrder, setRejectOrder] = useState(null);
    const [rejecting, setRejecting] = useState(false);

    const [acceptOrder, setAcceptOrder] = useState(null);

    const [accepting, setAccepting] = useState(false);

    const [paymentStatus, setPaymentStatus] = useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({});

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [openDetails, setOpenDetails] = useState(false);

    useEffect(() => {

        loadOrders();

    }, [page, search, status, orderType, paymentStatus]);

    async function loadOrders() {

        try {

            setLoading(true);

            const res = await getAllOrders({
                page,
                limit: 10,
                search: search || undefined,
                orderStatus: status || undefined,
                orderType: orderType || undefined,
                paymentStatus: paymentStatus || undefined
            });

            setOrders(res.data.orders);

            setPagination(res.data.pagination);

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

    const confirmAccept = async () => {

    if (!acceptOrder) return;

    try {

        setAccepting(true);

        const res = await updateOrderStatus(
            acceptOrder._id,
            "Confirmed"
        );

        const updatedOrder = res?.data?.order;

        ToastBar.success(
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

        setAcceptOrder(null);

    } catch (error) {

        ToastBar.error(
            error?.response?.data?.message ||
            "Failed to accept order."
        );

    } finally {

        setAccepting(false);

    }

};

    const confirmReject = async () => {

        if (!rejectOrder) return;

        try {

            setRejecting(true);

            const res = await updateOrderStatus(
                rejectOrder._id,
                "Cancelled"
            );

            const updatedOrder = res?.data?.order;
             ToastBar.success("Order rejected successfully!");
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

            setRejectOrder(null);

        } catch (error) {

            console.error(
                "Failed to reject order:",
                error?.response?.data?.message ||
                error.message
            );

        } finally {

            setRejecting(false);

        }
    };

    //for opening the dialog box for order details before accepting
    const handleAccept = (order) => {
        setAcceptOrder(order);
    };


    //for opening the dialog box for order details brfore rejecting
    const handleReject = (order) => {
        setRejectOrder(order);
    };

    const handleStatus = async (order) => {

        const nextStatus = STATUS_FLOW[order.orderStatus];

        if (!nextStatus) {
            console.warn(`No next status available for order ${order.orderNumber} (${order.orderStatus}).`);
            return;
        }

        try {
            const res = await updateOrderStatus(order._id, nextStatus);
            const updatedOrder = res?.data?.order;

            if (updatedOrder) {
                setOrders(prev => prev.map(item => item._id === updatedOrder._id ? updatedOrder : item));
                setSelectedOrder(prev => prev?._id === updatedOrder._id ? updatedOrder : prev);
            } else {
                await loadOrders();
            }
        } catch (error) {
            console.error("Failed to update order status:", error?.response?.data?.message || error.message);
        }
    }



    return (
        <div>
            <PageHeader title="Orders Management" subtitle="Manage online and offline orders" />
            <div className="order-filters">

                <SearchBar

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                />

                <Select value={status} onChange={(e) => setStatus(e.target.value)}
                    options={[

                        { label: "Pending", value: "Pending" },

                        { label: "Confirmed", value: "Confirmed" },

                        { label: "Preparing", value: "Preparing" },

                        { label: "Ready", value: "Ready" },

                        { label: "Delivered", value: "Delivered" }

                    ]} />

                <Select value={orderType} onChange={(e) => setOrderType(e.target.value)}
                    options={[

                        { label: "Online", value: "Online" },

                        { label: "Offline", value: "Offline" }
                    ]} />

                <Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}
                    options={[

                        { label: "Pending", value: "Pending" },

                        { label: "Partially Paid", value: "Partially Paid" },

                        { label: "Paid", value: "Paid" }
                    ]} />

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
                                        setOpenDetails(true);
                                    }}
                                >
                                    View
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

                    open={openDetails}

                    title={selectedOrder?.orderNumber}

                    onClose={() => setOpenDetails(false)}>


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

                                            <div key={index}>

                                                ₹{payment.amount}

                                                {payment.paymentMethod}

                                            </div>

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

                                                <p>

                                                    {history.action}

                                                </p>

                                                <small>

                                                    {history.reason}

                                                </small>

                                            </div>

                                        ))

                                    }

                                </Card>
                                <div className="modal-actions">

                                    <Button >

                                        Update Payment

                                    </Button>

                                    <Button variant="warning" onClick={() => { handleStatus(selectedOrder) }}>

                                        Update Status

                                    </Button>

                                    <Button
                                        variant="secondary"
                                        onClick={() => setOpenDetails(false)}
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
                    open={!!rejectOrder}
                    title="Reject Order"
                    onClose={() => {
                        if (!rejecting) {
                            setRejectOrder(null);
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
                            <strong> #{rejectOrder?.orderNumber}</strong>?
                        </p>

                        <p className="reject-warning">
                            This order will be marked as Cancelled.
                        </p>

                        <div className="modal-actions">

                            <Button
                                variant="secondary"
                                disabled={rejecting}
                                onClick={() => setRejectOrder(null)}
                            >
                                Keep Order
                            </Button>

                            <Button
                                variant="danger"
                                disabled={rejecting}
                                onClick={confirmReject}
                            >
                                {rejecting
                                    ? "Rejecting..."
                                    : "Reject Order"
                                }
                            </Button>

                        </div>

                    </div>
                </Modal>

                {/* for displaying the accept order dialog box */}
                <Modal
                    open={!!acceptOrder}
                    title="Accept Order"
                    onClose={() => {
                        if (!accepting) {
                            setAcceptOrder(null);
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
                            <strong> #{acceptOrder?.orderNumber}</strong>?
                        </p>

                        <p className="accept-info">
                            The order will move to Confirmed and
                            become available for production.
                        </p>

                        <div className="modal-actions">

                            <Button
                                variant="secondary"
                                disabled={accepting}
                                onClick={() => setAcceptOrder(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="success"
                                disabled={accepting}
                                onClick={confirmAccept}
                            >
                                {accepting
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