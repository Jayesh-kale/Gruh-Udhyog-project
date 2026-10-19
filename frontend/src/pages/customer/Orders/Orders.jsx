import "./Orders.css";

import { useEffect, useState } from "react";
import AOS from "aos";

import OrderTracker from "../../../components/customer/OrderTracker/OrderTracker";

import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import Button from "../../../components/common/Button";
import EmptyState from "../../../components/common/EmptyState";

import { getMyOrders } from "../../../services/orderService";
import { Modal } from "../../../components/common";
import PaymentForm from "../../../components/admin/PaymentForm/PaymentForm"
import ProductImage from "../../../components/customer/ProductImage/ProductImage";

function Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    //To View Order Details
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPaymentModel, setShowPaymentModel] = useState(false);


    useEffect(() => {

        loadOrders();
        AOS.refresh();

    }, []);

    async function loadOrders() {

        try {

            const response = await getMyOrders();

            setOrders(response.data.orders);

        }

        finally {

            setLoading(false);

        }

    }

    const handlePayment = async(order) =>{

        setSelectedOrder(order);

        setShowPaymentModel(true);
    }

    function handleViewOrder(order) {

        setSelectedOrder(order);

        setShowModal(true);

    }

    if (loading) {

        return <Loader text="Loading Orders..." />;

    }

    if (orders.length === 0) {

        return (
            <div className="text-center py-5"
                data-aos="fade-up"
            >
                <EmptyState

                    title="No Orders Yet"

                    subtitle="Start shopping to place your first order."

                />
                <Button className="btn-primary" to="/products">
                    Browse Products
                </Button>
            </div>
        );

    }

    return (

        <section className="container">

            <PageHeader

                title="My Orders"

                subtitle="Track your recent orders"

            />

            {/* To Track Order Status */}
            <OrderTracker status={selectedOrder?.orderStatus} />

            <div className="orders-grid">

                {

                    orders.map((order) => (

                        <Card

                            key={order._id}

                            className="order-card"

                            data-aos="fade-up"

                        >

                            <div className="order-top">

                                <div>

                                    <h5>

                                        {order.orderNumber}

                                    </h5>

                                    <small>

                                        {

                                            new Date(

                                                order.createdAt

                                            ).toLocaleDateString()

                                        }

                                    </small>

                                </div>

                                <Badge

                                    variant={

                                        order.orderStatus === "Pending"

                                            ? "warning"

                                            : order.orderStatus === "Ready"

                                                ? "success"

                                                : order.orderStatus === "Cancelled"

                                                    ? "danger"

                                                    : "primary"

                                    }

                                >

                                    {order.orderStatus}

                                </Badge>

                            </div>

                            <div className="order-middle">

                                <p>

                                    {order.items.length} Products

                                </p>

                                <h4>

                                    ₹{order.totalAmount}

                                </h4>

                            </div>

                            <div className="order-bottom">

                                <p>

                                    Payment :

                                    {order.paymentMethod}

                                </p>
                                <div>
                                   {order.paymentStatus !== "Paid" && (
                                        <button type="button" class="btn btn-outline-success">

                                         Pay Now

                                        </button>
                                    )}
                                    <button type="button" class="btn btn-outline-secondary m-1" onClick={() => handleViewOrder(order)}>

                                        View Details

                                    </button>
                                </div>

                            </div>

                        </Card>

                    ))

                }

            </div>

            {/* //pop-up to display orders */}
            <Modal

                open={showModal}
                title={selectedOrder?.orderNumber || "Order Details"}
                onClose={() => setShowModal(false)}>
                {

                    selectedOrder && (

                        <div className="order-details">

                            <div className="detail-row">

                                <span>Status</span>

                                <Badge
                                    variant={
                                        selectedOrder?.orderStatus === "Pending"
                                            ? "warning"
                                            : selectedOrder?.orderStatus === "Ready"
                                                ? "success"
                                                : selectedOrder?.orderStatus === "Cancelled"
                                                    ? "danger"
                                                    : "primary"
                                    }>

                                    {selectedOrder?.orderStatus}

                                </Badge>

                            </div>

                            <div className="detail-row">

                                <span>Payment</span>

                                <strong>

                                    {selectedOrder?.paymentMethod}

                                </strong>

                            </div>

                            <div className="detail-row">

                                <span>Payment Status</span>

                                <Badge variant="info">

                                    {selectedOrder?.paymentStatus}

                                </Badge>

                            </div>

                            <div className="detail-row">

                                <span>Village</span>

                                <strong>

                                    {selectedOrder?.customer?.village}

                                </strong>

                            </div>

                            <hr />

                            <h5>

                                Products

                            </h5>

                            {

                                selectedOrder.items?.map(item => (

                                    <div

                                        key={item.productId}

                                        className="detail-product"

                                    >

                                        <ProductImage
                                            image={item.image}
                                            alt={item.productName}
                                        />

                                        <div>

                                            <h6>

                                                {item.productName}

                                            </h6>

                                            <small>

                                                {item.quantity} {item.unit}

                                            </small>

                                        </div>

                                        <strong>

                                            ₹{item.itemTotal}

                                        </strong>

                                    </div>

                                ))

                            }

                            <hr />

                            <div className="detail-row total">

                                <span>Total Amount</span>

                                <strong>

                                    ₹{selectedOrder?.totalAmount}

                                </strong>

                            </div>

                        </div>

                    )

                }

            </Modal>
        </section>

    );

}

export default Orders;