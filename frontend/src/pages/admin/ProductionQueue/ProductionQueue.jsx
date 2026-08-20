import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductionQueue.css";
import {
    getAllProductionQueue,
    getAllProductionSummary
} from "../../../services/productionQueueService";

const ProductionQueue = () => {

    const [dashboard, setDashboard] = useState(null);
    const [queues, setQueues] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDialog, setShowOrderDialog] = useState(false);

    const fetchProductionDashboard = async () => {

        try {

          const data = await getAllProductionSummary();
          console.log("I Am In ProductionQueue.jksx: ",data?.data);
          setDashboard(data?.data);
         

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

        }

    };


    const fetchProductionQueues = async () => {

        try {

           const data = await getAllProductionQueue();
           setQueues(data?.data?.queues || []);

        } catch (error) {

            console.error(
                "Production queue error:",
                error
            );

        }

    };


    const fetchOrders = async () => {

        try {

            const response = await axios.get(
                "/api/orders/my-orders",
                {
                    params: {
                        page: 1,
                        limit: 20
                    },
                    withCredentials: true
                }
            );

            if (response.data.success) {

                const orderData =
                    response.data.data;

                setOrders(
                    orderData.orders || []
                );

            }

        } catch (error) {

            console.error(
                "Orders error:",
                error
            );

        }

    };


    const fetchAllData = async () => {

        setLoading(true);
        setError("");

        try {

            await Promise.all([
                fetchProductionDashboard(),
                fetchProductionQueues(),
                fetchOrders()
            ]);

        } catch (error) {

            setError(
                "Unable to load production data."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchAllData();

    }, []);


    const openOrder = (order) => {

        setSelectedOrder(order);

        setShowOrderDialog(true);

    };


    const closeOrder = () => {

        setSelectedOrder(null);

        setShowOrderDialog(false);

    };


    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    if (loading) {

        return (
            <div className="production-loading">
                Loading Production Center...
            </div>
        );

    }


    return (

        <div className="production-page">

            {/*PAGE HEADER*/}

            <div className="production-heading">

                <div>

                    <span>
                        ADMIN PANEL
                    </span>

                    <h1>
                        Production Center
                    </h1>

                    <p>
                        Manage incoming orders and
                        monitor production workload.
                    </p>

                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchAllData}
                >
                    ↻ Refresh
                </button>

            </div>


         
         {/* DASHBOARD */}
            

            {dashboard && (

                <section className="production-dashboard">

                    <DashboardCard className="dashboard-card"
                        title="Pending"
                        value={dashboard.totalPending}
                        online={dashboard.pendingOnline} 
                        offline={dashboard.pendingOffline}
                    />

                    <DashboardCard className="dashboard-card"
                        title="Preparing"
                        value={dashboard.totalPreparing}
                        online={dashboard.preparingOnline}
                        offline={dashboard.preparingOffline}
                    />

                    <DashboardCard className="dashboard-card"
                        title="Ready"
                        value={dashboard.totalReady}
                        online={dashboard.readyOnline} 
                        offline={dashboard.readyOffline}
                    />

                    <div className="dashboard-card products-card">

                        <span className="dashboard-label">
                            PRODUCTS
                        </span>

                        <strong>
                            {dashboard.totalProducts}
                        </strong>

                        <small>
                            Products in production queue
                        </small>

                    </div>

                </section>

            )}


            {/* INCOMING ORDERS */}

            <section className="section-block">

                <div className="section-header">

                    <div>

                        <span>
                            ORDER MANAGEMENT
                        </span>

                        <h2>
                            Incoming Orders
                        </h2>

                    </div>

                    <span className="order-count">
                        {orders.length} Orders
                    </span>

                </div>


                {orders.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No orders available
                        </h3>

                        <p>
                            New customer orders will
                            appear here.
                        </p>

                    </div>

                ) : (

                    <div className="orders-grid">

                        {orders.map(order => (

                            <OrderCard
                                key={order._id}
                                order={order}
                                formatDate={formatDate}
                                onView={openOrder}
                            />

                        ))}

                    </div>

                )}

            </section>


            {/* PRODUCTION QUEUE*/}

            <section className="section-block">

                <div className="section-header">

                    <div>

                        <span>
                            PRODUCTION
                        </span>

                        <h2>
                            Production Queue
                        </h2>

                    </div>

                    <span className="queue-count">
                        {queues.length} Products
                    </span>

                </div>


                {queues.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            Production queue is empty
                        </h3>

                        <p>
                            There are currently no products
                            waiting for production.
                        </p>

                    </div>

                ) : (

                    <div className="queue-grid">

                        {queues.map(queue => (

                            <QueueCard
                                key={queue._id}
                                queue={queue}
                            />

                        ))}

                    </div>

                )}

            </section>


            {/* ORDER DIALOG */}

            {showOrderDialog &&
                selectedOrder && (

                    <OrderDialog
                        order={selectedOrder}
                        formatDate={formatDate}
                        onClose={closeOrder}
                    />

                )}

        </div>

    );

};


/* DASHBOARD CARD*/

const DashboardCard = ({
    title,
    value,
    online,
    offline
}) => {

    return (

        <div className="dashboard-card">

            <span className="dashboard-label">
                {title.toUpperCase()}
            </span>

            <strong>
                {value}
            </strong>

            <div className="dashboard-split">

                <span>
                    Online {online}
                </span>
                {" | "}
                <span>
                    Offline {offline}
                </span>

            </div>

        </div>

    );

};


/* ORDER CARD*/

const OrderCard = ({
    order,
    formatDate,
    onView
}) => {

    const isOffline =
        order.orderType === "Offline";

    return (

        <article className="order-card">

            <div className="order-top">

                <div>

                    <span className="order-number">
                        #{order.orderNumber}
                    </span>

                    <span
                        className={`order-type ${
                            isOffline
                                ? "offline"
                                : "online"
                        }`}
                    >
                        {order.orderType}
                    </span>

                </div>

                <span
                    className={`status-badge ${order.orderStatus?.toLowerCase()}`}
                >
                    {order.orderStatus}
                </span>

            </div>


            <div className="customer-info">

                <h3>
                    {order.customer?.name}
                </h3>

                <p>
                    📍 {order.customer?.village}
                </p>

                <p>
                    📞 {order.customer?.phone}
                </p>

                <p>
                    🕒 {formatDate(order.createdAt)}
                </p>

            </div>


            <div className="order-products">

                {order.items?.map(
                    (item, index) => (

                        <div
                            className="order-product"
                            key={index}
                        >

                            <span>
                                {item.productName}
                            </span>

                            <strong>
                                × {item.quantity}
                            </strong>

                        </div>

                    )
                )}

            </div>


            {/* OFFLINE RAW MATERIALS */}

            {isOffline &&
                order.rawMaterials?.length > 0 && (

                    <div className="raw-materials">

                        <h4>
                            Raw Materials
                        </h4>

                        {order.rawMaterials.map(
                            (material, index) => (

                                <div
                                    key={index}
                                    className="raw-material"
                                >

                                    <span>
                                        {material.name}
                                    </span>

                                    <strong>
                                        {material.quantity}{" "}
                                        {material.unit}
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                )}


            <div className="order-footer">

                <div>

                    <small>
                        Total Amount
                    </small>

                    <strong>
                        ₹{order.totalAmount}
                    </strong>

                </div>

                <button
                    className="view-order-btn"
                    onClick={() => onView(order)}
                >
                    View Order
                </button>

            </div>

        </article>

    );

};


/*  PRODUCTION QUEUE CARD*/

const QueueCard = ({ queue }) => {

    const product =
        queue.productId || {};

    return (

        <article className="queue-card">

            <div className="queue-product-header">

                {product.image?.url && (

                    <img
                        src={product.image.url}
                        alt={product.name}
                    />

                )}

                <div>

                    <h3>
                        {product.name ||
                            queue.productName}
                    </h3>

                    <span>
                        {product.category}
                        {product.unit &&
                            ` • ${product.unit}`}
                    </span>

                </div>

            </div>


            <div className="queue-stages">

                <QueueStage
                    title="Pending"
                   online={queue.pendingOnline}
                    offline={queue.pendingOffline}
                    total={queue.totalPending}
                    
                />
                <hr />
                <QueueStage
                    title="Preparing"
                    online={queue.preparingOnline}
                    offline={queue.preparingOffline}
                    total={queue.totalPreparing}
                />
                <hr />
                <QueueStage
                    title="Ready"
                    online={queue.readyOnline}
                    offline={queue.readyOffline}
                    total={queue.totalReady}
                />

            </div>

        </article>

    );

};


/* QUEUE STAGE*/

const QueueStage = ({
    title,
    online,
    offline,
    total
}) => {

    return (

        <div className="queue-stage">

            <div className="queue-stage-header">

                <span>
                    {title}
                </span>

                <strong>
                    {total}
                </strong>

            </div>

            <div className="queue-source">

                <span>
                    Online
                </span>

                <strong>
                    {online}
                </strong>

            </div>

            <div className="queue-source">

                <span>
                    Offline
                </span>

                <strong>
                    {offline}
                </strong>

            </div>

        </div>

    );

};


/* ORDER DIALOG*/

const OrderDialog = ({order,formatDate, onClose}) => {
    
    const isOffline =
        order.orderType === "Offline";

    return (

        <div
            className="dialog-overlay"
            onClick={onClose}
        >

            <div
                className="order-dialog"
                onClick={e =>
                    e.stopPropagation()
                }
            >

                <div className="dialog-header">

                    <div>

                        <span>
                            ORDER DETAILS
                        </span>

                        <h2>
                            #{order.orderNumber}
                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="dialog-close"
                    >
                        ×
                    </button>

                </div>


                <div className="dialog-customer">

                    <h3>
                        {order.customer?.name}
                    </h3>

                    <p>
                        📍 {order.customer?.village}
                    </p>

                    <p>
                        📞 {order.customer?.phone}
                    </p>

                    <p>
                        Created:{" "}
                        {formatDate(order.createdAt)}
                    </p>

                </div>


                <div className="dialog-section">

                    <h4>
                        Products
                    </h4>

                    {order.items?.map(
                        (item, index) => (

                            <div
                                className="dialog-item"
                                key={index}
                            >

                                <span>
                                    {item.productName}
                                </span>

                                <span>
                                    {item.quantity} × ₹
                                    {item.pricePerUnit}
                                </span>

                            </div>

                        )
                    )}

                </div>


                {isOffline &&
                    order.rawMaterials?.length > 0 && (

                        <div className="dialog-section">

                            <h4>
                                Raw Materials
                            </h4>

                            {order.rawMaterials.map(
                                (material, index) => (

                                    <div
                                        className="dialog-item"
                                        key={index}
                                    >

                                        <span>
                                            {material.name}
                                        </span>

                                        <span>
                                            {material.quantity}{" "}
                                            {material.unit}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                <div className="dialog-total">

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ₹{order.totalAmount}
                    </strong>

                </div>


                <div className="dialog-actions">

                    <button
                        className="reject-btn"
                    >
                        Reject
                    </button>

                    <button
                        className="accept-btn"
                    >
                        Accept
                    </button>

                </div>

            </div>

        </div>

    );

};


export default ProductionQueue;