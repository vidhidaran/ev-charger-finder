import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://ev-charger-finder.onrender.com";

function AdminDashboard() {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [filterStation, setFilterStation] = useState("All");
    const [filterDate, setFilterDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("Newest First");

    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        const fetchStations = async () => {
            try {
                let response;
                try {
                    response = await axios.get(`${API_URL}/api/stations`);
                } catch (err) {
                    response = await axios.get(`http://localhost:5000/api/stations`);
                }
                setStations(response.data);
            } catch (err) {
                setError("Failed to fetch stations for dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchStations();
    }, []);

    if (!isAdmin) {
        return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>⛔ Access Denied. Admin privileges required.</div>;
    }

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</div>;

    // Flatten all bookings into a single array for easier displaying and filtering
    let allBookings = [];
    stations.forEach(station => {
        if (station.bookedTimeSlots && station.bookedTimeSlots.length > 0) {
            station.bookedTimeSlots.forEach(slot => {
                if (slot.bookings && slot.bookings.length > 0) {
                    slot.bookings.forEach(booking => {
                        allBookings.push({
                            stationName: station.name,
                            stationId: station._id,
                            date: slot.date,
                            time: slot.time,
                            customerName: booking.customerName,
                            customerPhone: booking.customerPhone,
                            amountPaid: booking.amountPaid || 50,
                            bookedAt: new Date(booking.bookedAt).toLocaleString()
                        });
                    });
                }
            });
        }
    });

    // Apply Filters & Search
    let filteredBookings = allBookings.filter(b => {
        const matchStation = filterStation === "All" || b.stationId === filterStation;
        const matchDate = !filterDate || b.date === filterDate;
        const matchSearch = !searchQuery ||
            b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.customerPhone.includes(searchQuery);
        return matchStation && matchDate && matchSearch;
    });

    // Apply Sorting
    filteredBookings.sort((a, b) => {
        if (sortOrder === "Newest First") return new Date(b.bookedAt) - new Date(a.bookedAt);
        if (sortOrder === "Oldest First") return new Date(a.bookedAt) - new Date(b.bookedAt);
        if (sortOrder === "Date (Ascending)") return new Date(a.date) - new Date(b.date);
        if (sortOrder === "Date (Descending)") return new Date(b.date) - new Date(a.date);
        return 0;
    });

    const handleExportCSV = () => {
        if (filteredBookings.length === 0) {
            alert("No bookings to export!");
            return;
        }

        const headers = ["Station", "Customer Name", "Phone", "Slot Date", "Slot Time", "Amount Paid (INR)", "Timestamp"];
        const csvRows = [headers.join(",")];

        filteredBookings.forEach(b => {
            const row = [
                `"${b.stationName}"`,
                `"${b.customerName}"`,
                `"${b.customerPhone}"`,
                `"${b.date}"`,
                `"${b.time}"`,
                `"${b.amountPaid}"`,
                `"${b.bookedAt}"`
            ];
            csvRows.push(row.join(","));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ev_bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-container">
            <h2 style={{ textAlign: "center", marginBottom: "30px", paddingBottom: "10px", color: 'var(--text-primary)' }}>🛡️ Admin Dashboard: Bookings Overview</h2>

            {/* Summary KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="station-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid #3b82f6' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase' }}>Total Bookings</h4>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{filteredBookings.length}</p>
                </div>
                <div className="station-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid #10b981' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase' }}>Gross Revenue</h4>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>₹{filteredBookings.reduce((sum, b) => sum + b.amountPaid, 0)}</p>
                </div>
                <div className="station-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid #f59e0b' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase' }}>Active Stations</h4>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{new Set(filteredBookings.map(b => b.stationId)).size}</p>
                </div>
                <div className="station-card" style={{ padding: '20px', textAlign: 'center', borderLeft: '5px solid #0ea5e9' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase' }}>Total Stations</h4>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stations.length}</p>
                </div>
            </div>

            {/* Controls / Filters */}
            <div className="search-bar-container" style={{ margin: '0 auto 30px auto', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: '1 1 100%' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'var(--text-secondary)' }}>Search Customers:</label>
                    <input
                        type="text"
                        placeholder="Search by name or phone number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'var(--text-secondary)' }}>Filter by Station:</label>
                    <select
                        value={filterStation}
                        onChange={(e) => setFilterStation(e.target.value)}
                        className="filter-select"
                        style={{ width: '100%' }}
                    >
                        <option value="All">All Stations</option>
                        {stations.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'var(--text-secondary)' }}>Filter by Date:</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="search-input"
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'var(--text-secondary)' }}>Sort By:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="filter-select"
                        style={{ width: '100%' }}
                    >
                        <option value="Newest First">Newest First (Booking Time)</option>
                        <option value="Oldest First">Oldest First (Booking Time)</option>
                        <option value="Date (Ascending)">Upcoming Slots First</option>
                        <option value="Date (Descending)">Past Slots First</option>
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                        onClick={() => { setFilterStation("All"); setFilterDate(""); setSearchQuery(""); setSortOrder("Newest First"); }}
                        className="btn btn-toggle"
                    >
                        Reset All
                    </button>
                </div>
            </div>

            {/* Bookings Table */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Booking Records ({filteredBookings.length})</h3>
                    <button onClick={handleExportCSV} className="btn form-button" style={{ margin: 0 }}>
                        📥 Export to CSV
                    </button>
                </div>
                {filteredBookings.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Station</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Slot Date</th>
                                <th>Slot Time</th>
                                <th>Amount</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking, index) => (
                                <tr key={index}>
                                    <td><strong>{booking.stationName}</strong></td>
                                    <td>{booking.customerName}</td>
                                    <td>{booking.customerPhone}</td>
                                    <td>{booking.date}</td>
                                    <td style={{ color: 'var(--neon-blue)' }}><strong>{booking.time}</strong></td>
                                    <td style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>₹{booking.amountPaid}</td>
                                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{booking.bookedAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '20px 0' }}>No bookings found matching selected filters.</p>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
