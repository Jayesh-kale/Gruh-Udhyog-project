import React, { useEffect, useState } from 'react';
import { getCreditBookData } from '../../../services/creditBookService';
import { useNavigate } from 'react-router-dom';

const CreditBook = () => {
    const navigate = useNavigate();
    // 1. Initialize state with the full data object
    const [creditBookData, setCreditBookData] = useState([]);

    // 2. Function to fetch credit book data
    const fetchCreditBookData = async () => {
        try {
            const response = await getCreditBookData();
            setCreditBookData(response.data.data);
            console.log("Fetched Credit Book Data:", response.data.data);
        } catch (error) {
            console.error("Error fetching credit book data:", error);
        }
    };

    // 2. Use useEffect to fetch data on component mount
    useEffect(() => {
        fetchCreditBookData();
    }, []);

    const handleViewDetails = (entry) => {
        navigate(`/admin/personDetails`, { state: { record: entry } });
    }

    return (
        <div className="credit-book-container items-center justify-center">
            <h1>Credit Book</h1>

            <p>{creditBookData.totalRecords} credit entries found.</p>
            <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', backgroundColor: '#ffffff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', textAlign: 'left', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                            {/* <th>Order ID</th> */}
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Customer Name</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Phone</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Product Summary</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Total Amount</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Remaining Amount</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Order Date</th>
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Status</th>
                            {/* <th>Cleared At</th>
            <th>Payments History</th>
            <th>Created At</th> */}
                            <th style={{ padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '14px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditBookData.creditEntries && creditBookData.creditEntries.map((entry, index) => (
                            <tr key={entry._id || index} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                                {/* <td>{entry.orderId}</td> */}
                                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#111827' }}>{entry.customerName}</td>
                                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#4b5563' }}>{entry.customerPhone}</td>
                                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#4b5563' }}>{entry.productSummary}</td>
                                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#111827', fontWeight: '500' }}>₹{entry.totalAmount}</td>
                                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#dc2626', fontWeight: '500' }}>₹{entry.remainingAmount}</td>
                                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#4b5563' }}>{new Date(entry.orderDate).toLocaleDateString()}</td>
                                <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        backgroundColor: entry.status === 'Pending' ? '#fef3c7' : '#d1fae5',
                                        color: entry.status === 'Pending' ? '#d97706' : '#059669'
                                    }}>
                                        {entry.status}
                                    </span>
                                </td>
                                {/* <td>{entry.clearedAt ? new Date(entry.clearedAt).toLocaleDateString() : 'N/A'}</td> */}
                                {/* <td>{entry.paymentHistory?.length || 0} payments</td>
                <td>{new Date(entry.createdAt).toLocaleDateString()}</td> */}
                                <td style={{ padding: '14px 16px', fontSize: '14px' }}>
                                    <button style={{
                                        backgroundColor: '#2563eb',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }} onClick={() => handleViewDetails(entry)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default CreditBook;
