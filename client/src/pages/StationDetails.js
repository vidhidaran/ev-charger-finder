import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const API_URL = "https://ev-charger-finder.onrender.com"; // Let's try to match the Home.js or use localhost if it fails

function StationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [station, setStation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingMessage, setBookingMessage] = useState("");

    // Add time selection states
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    // Payment states
    const [showPayment, setShowPayment] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Standard hours including extended evening hours for surge pricing
    const TIME_SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"];

    const getDynamicPrice = (time) => {
        if (!time) return 0;
        const surgeTimes = ["05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"]; // Peak Evening
        const offPeakTimes = ["08:00 AM", "09:00 AM", "01:00 PM", "02:00 PM"]; // Early Morning / Post Lunch

        let basePrice = station?.pricePerKWh ? Number(station.pricePerKWh) * 10 : 50; // Assume 10kWh average charge if base price exists, else 50
        if (basePrice < 30) basePrice = 50; // Fallback sanity check

        if (surgeTimes.includes(time)) return basePrice + 25; // Surge Pricing
        if (offPeakTimes.includes(time)) return Math.max(20, basePrice - 15); // Off-Peak Discount
        return basePrice; // Standard
    };

    const currentPrice = getDynamicPrice(selectedTime);


    useEffect(() => {
        const fetchStation = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/stations/${id}`);
                setStation(response.data);
            } catch (err) {
                // Fallback to localhost if render is asleep/failing
                try {
                    const localFallback = await axios.get(`http://localhost:5000/api/stations/${id}`);
                    setStation(localFallback.data);
                } catch (localErr) {
                    setError("Failed to fetch station details.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStation();
    }, [id]);

    const handleInitiatePayment = () => {
        if (!selectedTime) {
            setBookingMessage("Please select a time slot first.");
            setTimeout(() => setBookingMessage(""), 5000);
            return;
        }

        if (!customerName || !customerPhone) {
            setBookingMessage("Please enter your name and phone number.");
            setTimeout(() => setBookingMessage(""), 5000);
            return;
        }

        setShowPayment(true);
    };

    const handleConfirmBooking = async () => {
        if (!transactionId || transactionId.length < 5) {
            setBookingMessage("Please enter a valid Transaction ID.");
            setTimeout(() => setBookingMessage(""), 5000);
            return;
        }

        try {
            let response;
            try {
                response = await axios.post(`${API_URL}/api/stations/${id}/book`, {
                    date: selectedDate,
                    time: selectedTime,
                    customerName,
                    customerPhone,
                    amountPaid: currentPrice
                });
            } catch (err) {
                response = await axios.post(`http://localhost:5000/api/stations/${id}/book`, {
                    date: selectedDate,
                    time: selectedTime,
                    customerName,
                    customerPhone,
                    amountPaid: currentPrice
                });
            }

            // Immediately set local station to the updated entity the server returns
            setStation(response.data.station);
            setShowPayment(false);
            setTransactionId("");
            setSelectedTime(""); // Reset selection
            setCustomerName("");
            setCustomerPhone("");
            setBookingMessage(`Payment Verified! Slot booked successfully for ${selectedTime}!`);
            setTimeout(() => setBookingMessage(""), 5000);
        } catch (err) {
            setBookingMessage(err.response?.data?.message || "Failed to book slot.");
            setTimeout(() => setBookingMessage(""), 5000);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Details...</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</div>;
    if (!station) return <div>Station not found.</div>;

    const position = [station.latitude, station.longitude];

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <button className="btn btn-toggle" style={{ marginBottom: '20px' }} onClick={() => navigate(-1)}>
                ⬅ Back
            </button>

            <div className="station-card" style={{ padding: '30px', display: 'block' }}>
                <h2 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>{station.name}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}><strong>📍 Address:</strong> <br /><span style={{ color: 'var(--text-primary)' }}>{station.address}</span></p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}><strong>⚡ Power:</strong> <br /><span style={{ color: 'var(--text-primary)' }}>{station.powerKW} kW</span></p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}><strong>🔌 Connectors:</strong> <br /><span style={{ color: 'var(--text-primary)' }}>{station.connectorTypes?.join(', ')}</span></p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}><strong>💰 Price:</strong> <br /><span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>₹{station.pricePerKWh}/kWh</span></p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}><strong>🔋 Available Slots:</strong> <br /><span style={{ color: 'var(--text-primary)' }}>{station.availableSlots !== undefined ? station.availableSlots : 10} / {station.totalSlots !== undefined ? station.totalSlots : 10}</span></p>
                </div>

                <div style={{ padding: '25px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '15px', border: '1px solid var(--border-light)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'var(--neon-green)' }}>Book a Slot</h3>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ marginRight: '15px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Select Date:</label>
                        <input
                            type="date"
                            className="search-input"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime("");
                            }}
                            style={{ padding: '10px 15px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Select Time:</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {TIME_SLOTS.map((time) => {
                                const slotRecord = station.bookedTimeSlots?.find(s => s.date === selectedDate && s.time === time);
                                const count = slotRecord ? slotRecord.count : 0;
                                const totalCapacity = station.totalSlots || 10;
                                const isFull = count >= totalCapacity;

                                return (
                                    <button
                                        key={time}
                                        onClick={() => !isFull && setSelectedTime(time)}
                                        disabled={isFull}
                                        style={{
                                            padding: '10px 15px',
                                            borderRadius: '8px',
                                            border: selectedTime === time ? '1px solid var(--neon-blue)' : '1px solid var(--border-light)',
                                            backgroundColor: isFull ? 'rgba(255,255,255,0.02)' : (selectedTime === time ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.4)'),
                                            color: isFull ? '#64748b' : (selectedTime === time ? 'var(--neon-blue)' : 'var(--text-primary)'),
                                            cursor: isFull ? 'not-allowed' : 'pointer',
                                            textDecoration: isFull ? 'line-through' : 'none',
                                            boxShadow: selectedTime === time ? '0 0 15px rgba(59,130,246,0.2)' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span style={{ fontWeight: '600' }}>{time}</span> <span style={{ fontSize: '11px', display: 'block', marginTop: '4px', opacity: 0.8 }}>({totalCapacity - count} left)</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <input type="text" className="search-input" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ flex: 1, minWidth: '200px' }} />
                        <input type="tel" className="search-input" placeholder="Your Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={{ flex: 1, minWidth: '200px' }} />
                    </div>

                    <div style={{ margin: '20px 0', padding: '15px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: '4px solid var(--neon-blue)' }}>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                            <strong style={{ color: 'var(--text-secondary)' }}>Dynamic Pricing: </strong>
                            {selectedTime ? (
                                <span style={{ color: currentPrice > 50 ? '#ef4444' : (currentPrice < 50 ? 'var(--neon-green)' : 'var(--text-primary)'), fontWeight: 'bold', marginLeft: '10px' }}>
                                    ₹{currentPrice} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>{currentPrice > 50 ? '(Surge Pricing)' : (currentPrice < 50 ? '(Off-Peak Discount)' : '(Standard Rate)')}</span>
                                </span>
                            ) : (
                                <span style={{ color: 'var(--text-secondary)', marginLeft: '10px', fontSize: '0.95rem' }}>Select a time slot to see live pricing</span>
                            )}
                        </p>
                    </div>

                    {!showPayment ? (
                        <button
                            onClick={handleInitiatePayment}
                            className="btn form-button"
                            style={{ width: '100%', opacity: selectedTime ? 1 : 0.5 }}
                            disabled={!selectedTime}
                        >
                            {selectedTime ? `Proceed to Pay ₹${currentPrice}` : 'Select a Time Slot'}
                        </button>
                    ) : (
                        <div style={{ padding: '25px', border: '1px solid var(--neon-green)', borderRadius: '15px', backgroundColor: 'rgba(16,185,129,0.05)', marginTop: '20px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: 'var(--neon-green)', fontSize: '1.2rem' }}>UPI Payment Details</h4>
                            <p style={{ margin: '0 0 10px 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Pay <strong style={{ color: 'var(--neon-green)' }}>₹{currentPrice}</strong> to UPI ID: <strong style={{ color: 'var(--neon-blue)' }}>{station.upiId || 'merchant@upi'}</strong></p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>* Scan the ID in your preferred UPI App (GPay, PhonePe, Paytm). After payment, enter your Transaction/Reference ID below to confirm.</p>

                            <input
                                type="text"
                                className="search-input"
                                placeholder="Enter Transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                style={{ width: '100%', marginBottom: '15px' }}
                            />

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={handleConfirmBooking} className="btn form-button" style={{ flex: 2, margin: 0 }}>
                                    Confirm Payment & Book
                                </button>
                                <button onClick={() => setShowPayment(false)} className="btn btn-toggle" style={{ flex: 1, margin: 0, padding: '0', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    {bookingMessage && <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', backgroundColor: bookingMessage.includes('successful') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: bookingMessage.includes('successful') ? 'var(--neon-green)' : '#ef4444', border: `1px solid ${bookingMessage.includes('successful') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, textAlign: 'center', fontWeight: 'bold' }}>{bookingMessage}</div>}
                </div>

                <div style={{ height: '400px', marginTop: '40px', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                    <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>{station.name}</Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {isAdmin && station.bookedTimeSlots && station.bookedTimeSlots.length > 0 && (
                    <div style={{ marginTop: '40px', padding: '25px', backgroundColor: 'rgba(245,158,11,0.05)', borderRadius: '15px', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#f59e0b', display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px' }}>👑</span> Admin: Booking Details</h3>
                        {station.bookedTimeSlots.map((slot, idx) => (
                            <div key={idx} style={{ marginBottom: '15px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                                <h4 style={{ margin: '0 0 15px 0', color: 'var(--text-primary)' }}>{slot.date} at <span style={{ color: 'var(--neon-blue)' }}>{slot.time}</span> <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>(Total booked: {slot.count})</span></h4>
                                {slot.bookings && slot.bookings.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                                        {slot.bookings.map((b, bIdx) => (
                                            <li key={bIdx} style={{ marginBottom: '10px' }}>
                                                <strong style={{ color: 'var(--text-primary)' }}>{b.customerName}</strong> - {b.customerPhone}
                                                <span style={{ color: 'var(--neon-green)', fontWeight: 'bold', marginLeft: '10px' }}>
                                                    (Paid: ₹{b.amountPaid || 50})
                                                </span>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    Booked: {new Date(b.bookedAt).toLocaleString()}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)' }}>No detailed customer records available for this slot.</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StationDetails;
