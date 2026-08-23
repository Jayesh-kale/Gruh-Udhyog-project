import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common';
import PaymentForm from '../../../components/admin/PaymentForm/PaymentForm';

const CreditDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    const [customer, setCustomer] = useState(state);
    const [loading, setLoading] = useState(false);
    
    const [dialogs, setDialogs] = useState({
        paymentDialog: false,
        openDetails: false,
    });
    
  
    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
                <div className="spinner-grow text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <h5 className="text-secondary fw-medium tracking-wide">Syncing Ledgers...</h5>
            </div>
        );
    }
    
    if (!customer || !customer.record) {
        return (
            <div className="container mt-5 text-center max-w-sm">
                <div className="alert alert-danger shadow-sm border-0 rounded-4 p-4" role="alert">
                    <h4 className="alert-heading fw-bold">Data Missing</h4>
                    <p className="mb-3 text-muted">No client or ledger information was passed to this route handler.</p>
                    <button onClick={() => navigate(-1)} className="btn btn-danger btn-sm px-4 rounded-pill">Go Back</button>
                </div>
            </div>
        );
    }

    const rec = customer.record;
    console.log("Customer record in CreditDetails:", rec);

    // Calculate structural metrics safely
    const hasHistory = rec.paymentHistory && rec.paymentHistory.length > 0;
    const progressPercent = Math.min(100, Math.max(0, ((rec.totalAmount - rec.remainingAmount) / rec.totalAmount) * 100));

    return (
        <div className="container py-5 max-w-xl entry-animation">
            {/* Embedded Micro-Interactions and Spatial Styles */}
            <style>{`
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.97) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .entry-animation {
                    animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .dashboard-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    border-radius: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .dashboard-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06) !important;
                }
                .glass-header {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border-radius: 24px;
                    position: relative;
                    overflow: hidden;
                }
                .glass-header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -20%;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
                    pointer-events: none;
                }
            `}</style>

            {/* ACTION NAV HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-link link-secondary text-decoration-none d-flex align-items-center gap-2 fw-medium p-0"
                >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Back to Book
                </button>
                <span className="text-muted small fw-semibold">ID: #{rec.orderId}</span>
            </div>

            {/* HERO IDENTITY CANVAS */}
            <div className="glass-header p-4 p-md-5 text-white shadow-sm mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge bg-primary bg-opacity-25 text-primary-heading border border-primary border-opacity-10 px-2.5 py-1 rounded-pill small fw-bold text-uppercase">
                                Account Active
                            </span>
                        </div>
                        <h1 className="display-5 fw-black tracking-tight mb-2 text-white">{rec.customerName}</h1>
                        <p className="mb-0 text-white-50 d-flex align-items-center gap-2 font-monospace">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" /></svg>
                            {rec.customerPhone}
                        </p>
                    </div>

                    <div className="text-md-end">
                        <div className={`badge px-4 py-2.5 fs-6 rounded-pill border shadow-sm ${rec.status === 'Cleared'
                                ? 'bg-success bg-opacity-10 text-success border-success border-opacity-25'
                                : 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-25'
                            }`}>
                            ● {rec.status}
                        </div>
                    </div>
                </div>

                {/* PROGRESS METER */}
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-20">
                    <div className="d-flex justify-content-between text-white-50 small mb-1.5 fw-medium">
                        <span>Collection Repayment Progress</span>
                        <span>{progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="progress bg-secondary bg-opacity-20" style={{ height: '6px' }}>
                        <div
                            className={`progress-bar rounded-pill transition-all ${rec.status === 'Cleared' ? 'bg-success' : 'bg-primary'}`}
                            role="progressbar"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="row ">
                {/* FINANCIAL MONITOR */}
                <div className="col-12 col-md-7">
                    <div className="dashboard-card card h-100 w-auto shadow-sm">
                        <div className="card-body w-60 p-3">
                            <h6 className="text-uppercase text-muted tracking-wider small fw-bold mb-4 d-flex align-items-center gap-2">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.214-.016c1.572-.118 2.786-1.42 2.786-3.033 0-1.66-1.32-3.033-2.91-3.033-1.58 0-2.91 1.373-2.91 3.033 0 1.58 1.182 2.875 2.71 3.018zM12 6H9m3 12h3" /></svg>
                                Accounting Ledger Balance
                            </h6>

                            <div className="d-flex flex-column mb-4">
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-light">
                                    <span className="text-secondary small fw-medium">Statement Value</span>
                                    <span className="fs-4 fw-bold text-dark">₹{rec.totalAmount}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-10">
                                    <span className="text-danger small fw-semibold">Net Outstanding</span>
                                    <span className="fs-4 fw-black text-danger">₹{rec.remainingAmount}</span>
                                </div>
                            </div>

                            <h6 className="text-uppercase text-muted tracking-wider small fw-bold mb-2.5">Purchased Summary</h6>
                            <div className="p-3 bg-light rounded-4 text-secondary border border-light-subtle fs-6 lh-relaxed">
                                {rec.productSummary || "No inventory logs provided for this ledger settlement entry."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIMELINE METRICS */}
                <div className="col-12 col-md-5">
                    <div className="dashboard-card w-auto card h-100 shadow-sm">
                        <div className="card-body p-4">
                            <h6 className="text-uppercase text-muted tracking-wider small fw-bold mb-4 d-flex align-items-center gap-2">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Operations Timeline
                            </h6>

                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-light">
                                    <span className="text-secondary small fw-medium">Order Date</span>
                                    <span className="fs-6 fw-semibold text-dark">{new Date(rec.orderDate).toLocaleDateString()}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-light">
                                    <span className="text-secondary small fw-medium">Created At</span>
                                    <span className="fs-6 fw-semibold text-dark">{new Date(rec.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-light">
                                    <span className="text-secondary small fw-medium">Cleared At</span>
                                    <span className="fs-6 fw-semibold text-dark">{rec.clearedAt ? new Date(rec.clearedAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 d-flex justify-content-end">
                <PaymentForm
                    dialogs={dialogs}
                    setDialogs={setDialogs}
                    selectedOrder={rec}
                />
            </div>


            <div>
                <Button variant="outline" className="mt-3" onClick={() => {setDialogs(prev => ({ ...prev, paymentDialog: true }))}}>
                    Pay Now
                </Button>
            </div>

            {/* PAYMENT HISTORY */}
            {hasHistory && (
                <div className="mt-5">
                    <h6 className="text-uppercase text-muted tracking-wider small fw-bold mb-3 d-flex align-items-center gap-2">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Payment History
                    </h6>
                    <div className="list-group shadow-sm rounded-4 overflow-hidden">
                        {rec.paymentHistory.map((payment, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center p-3 bg-light border-0">
                                <div>
                                    <span className="">Payment {index + 1}</span>
                                    <div className="small fw-semibold text-secondary text-dark">
                                        {payment.paidAt ? `₹${payment.amount} on ${new Date(payment.paidAt).toLocaleDateString()}`
                                            : `₹${payment.amount} via ${payment.paymentMethod}`}
                                    </div>
                                </div>
                                <span className={`badge rounded-pill px-3 py-2 fs-6 fw-medium ${payment.paidAt ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'
                                    }`}>
                                    {payment.paidAt ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}

export default CreditDetails;