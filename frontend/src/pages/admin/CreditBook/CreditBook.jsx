import { useEffect, useState } from 'react';
import { getCreditBookData } from '../../../services/creditBookService';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/common/SearchBar/SearchBar.jsx';


const CreditBook = () => {
    const navigate = useNavigate();
    // 1. Initialize state with the full data object
    const [creditBookData, setCreditBookData] = useState({
        creditEntries: [],
        totalRecords: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // 2. Function to fetch credit book data
    const fetchCreditBookData = async () => {
        try {
            const response = await getCreditBookData();
            setCreditBookData(response.data.data || { creditEntries: [], totalRecords: 0 });
        } catch (error) {
            console.error("Error fetching credit book data:", error);
        }
    };

    // 2. Use useEffect to fetch data on component mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCreditBookData();
    }, []);

    //For search functionality
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleChange = (e) => {
        setSelectedStatus(e.target.value);
    }

    const handleViewDetails = (entry) => {
        navigate(`/admin/personDetails/${entry._id}`, { state: { record: entry } });
    }

    const visibleEntries = creditBookData.creditEntries.filter((entry) => {
        const search = searchTerm.toLowerCase();
        return (!selectedStatus || entry.status === selectedStatus) &&
            (!search ||
                entry.customerName?.toLowerCase().includes(search) ||
                entry.customerPhone?.includes(search) ||
                entry.productSummary?.toLowerCase().includes(search));
    });

    const calculateTotalAmount = () => {
        const totalAmount = visibleEntries.reduce((total, entry) => total + Number(entry.totalAmount || 0), 0);
        return totalAmount;
    }

    const calculateTotalRemaining = () => {
        const totalRemaining = visibleEntries.reduce((total, entry) => total + Number(entry.remainingAmount || 0), 0);
        return totalRemaining;
    }

    return (
        <div className="credit-book-container items-center justify-center">
                    <h1 className="h3 mb-1 text-dark fw-bold tracking-tight">Credit Book</h1>

            <div className="d-flex flex-row align-items-center justify-content-between mb-4 p-3 bg-light rounded shadow-sm">

                {/* LEFT SECTION: Title & Filter */}
                <div className="d-flex flex-column gap-1">
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="selectBox" className="form-label mb-0 text-muted small fw-medium">Records:</label>
                        <select
                            id='selectBox'
                            name='status'
                            className="form-select form-select-sm border-secondary-subtle"
                            style={{ width: '140px' }}
                            onChange={handleChange}
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Cleared">Cleared</option>
                        </select>
                    </div>
                </div>

                {/* MIDDLE SECTION: Search Bar */}
                <div className="mx-3 flex-grow-1" style={{ maxWidth: '400px' }}>
                    <SearchBar
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search credit entries..."
                    // Note: If SearchBar is a custom component, ensure it applies Bootstrap's 'form-control' internally
                    />
                </div>

                {/* RIGHT SECTION: Styled Amount Cards */}
                <div className="d-flex flex-row gap-3 align-items-center">
                    {/* Total Amount Badge */}
                    <div className="card border-0 shadow-sm bg-dark text-white overflow-hidden" style={{ minWidth: "180px" }}>
                        <div className="card-body p-2 text-center">
                            <div className="text-uppercase text-white-50 small fw-bold" style={{ fontSize: '0.75rem' }}>Total Amount</div>
                            <div className="fs-5 fw-semibold text-warning">{calculateTotalAmount()} /-</div>
                        </div>
                    </div>

                    {/* Remaining Amount Badge */}
                    <div className="card border-0 shadow-sm bg-danger text-white overflow-hidden" style={{ minWidth: "190px" }}>
                        <div className="card-body p-2 text-center">
                            <div className="text-uppercase text-white-50 small fw-bold" style={{ fontSize: '0.75rem' }}>Remaining Amount</div>
                            <div className="fs-5 fw-semibold">{calculateTotalRemaining()} /-</div>
                        </div>
                    </div>
                </div>

            </div>
            <p>{visibleEntries.length} credit entries found.</p>
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
                        {visibleEntries.map((entry, index) => (
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

        </div >
    );
};

export default CreditBook;
