// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import './Bookings.css';

// function Bookings() {
//     const [bookings, setBookings] = useState([]);
//     const [services, setServices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedService, setSelectedService] = useState('');
//     const navigate = useNavigate();
//     const userRole = localStorage.getItem('user_role');

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         try {
//             const [bookingsRes, servicesRes] = await Promise.all([
//                 api.get('/bookings/'),
//                 api.get('/services/')
//             ]);
//             setBookings(bookingsRes.data.results || bookingsRes.data);
//             setServices(servicesRes.data.results || servicesRes.data);
//         } catch (error) {
//             console.error('Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const createBooking = async () => {
//         if (!selectedService) return;
//         try {
//             await api.post('/bookings/', { service: selectedService, status: 'pending' });
//             setShowForm(false);
//             setSelectedService('');
//             fetchData();
//             alert('Booking created!');
//         } catch (error) {
//             alert('Failed to create booking');
//         }
//     };

//     const updateStatus = async (id, status) => {
//         try {
//             await api.patch(`/bookings/${id}/`, { status });
//             fetchData();
//         } catch (error) {
//             alert('Failed to update status');
//         }
//     };

//     const logout = () => {
//         localStorage.clear();
//         window.location.href = '/';
//     };

//     const getStatusClass = (status) => {
//         const classes = {
//             'pending': 'status-pending',
//             'accepted': 'status-accepted',
//             'completed': 'status-completed',
//         };
//         return classes[status] || 'status-pending';
//     };

//     if (loading) return <div className="bookings-loading">Loading bookings...</div>;

//     return (
//         <div className="bookings-page">
//             {/* Header */}
//             <div className="bookings-header">
//                 <div className="bookings-logo" onClick={() => navigate('/')}>
//                     <span className="logo-icon">🛠️</span>
//                     <span className="logo-text">Service<span>Hub</span></span>
//                 </div>
//                 <div className="bookings-nav">
//                     <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
//                     {/* <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button> */}
//                     <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button>
//                     <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
//                     <button onClick={logout} className="nav-logout">Logout</button>
//                 </div>
//             </div>

//             <div className="bookings-container">
//                 {/* Top row */}
//                 <div className="bookings-top-row">
//                     <h2 className="bookings-title">My Bookings</h2>
//                     <button onClick={() => setShowForm(!showForm)} className="btn-new-booking">
//                         + New Booking
//                     </button>
//                 </div>

//                 {/* New Booking Form */}
//                 {showForm && (
//                     <div className="booking-form-card">
//                         <h3>Select a Service</h3>
//                         <select
//                             value={selectedService}
//                             onChange={(e) => setSelectedService(e.target.value)}
//                             className="booking-select"
//                         >
//                             <option value="">-- Select Service --</option>
//                             {services.map(service => (
//                                 <option key={service.id} value={service.id}>
//                                     {service.title} — ₹{service.price}/hr
//                                 </option>
//                             ))}
//                         </select>
//                         <button onClick={createBooking} className="btn-confirm">Confirm Booking</button>
//                     </div>
//                 )}

//                 {/* Bookings List */}
//                 {bookings.length === 0 ? (
//                     <div className="bookings-empty">
//                         <p>No bookings yet.</p>
//                         <button onClick={() => navigate('/services')} className="btn-book-link">
//                             Browse Services →
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="bookings-grid">
//                         {bookings.map(booking => (
//                             <div key={booking.id} className="booking-card">
//                                 <div className="booking-card-header">
//                                     <h3 className="booking-service-name">{booking.service?.title}</h3>
//                                     <span className={`booking-status ${getStatusClass(booking.status)}`}>
//                                         {booking.status}
//                                     </span>
//                                 </div>
//                                 <p className="booking-description">{booking.service?.description}</p>
//                                 <div className="booking-price-section">
//                                     <span className="price-currency">₹</span>
//                                     <span className="price-amount">{booking.service?.price}</span>
//                                     <span className="price-unit">/hour</span>
//                                 </div>
//                                 <div className="booking-actions">
//                                     {userRole === 'provider' && (
//                                         <>
//                                             <button onClick={() => updateStatus(booking.id, 'accepted')} className="btn-accept">Accept</button>
//                                             <button onClick={() => updateStatus(booking.id, 'completed')} className="btn-complete">Complete</button>
//                                         </>
//                                     )}
//                                     <button onClick={() => navigate(`/reviews?booking=${booking.id}`)} className="btn-review">
//                                         Write Review
//                                     </button>
//                                     <button onClick={() => navigate('/chat')} className="btn-chat">
//                                         Chat →
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Bookings;






import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './Bookings.css';

function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [notes, setNotes] = useState('');  // Removed scheduledDate
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('user_role');

    // Check for pre-selected service from navigation state
    useEffect(() => {
        if (location.state?.preSelectedService) {
            setSelectedService(location.state.preSelectedService);
            setShowForm(true);
        }
    }, [location.state]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsRes, servicesRes] = await Promise.all([
                api.get('/bookings/'),
                api.get('/services/')
            ]);
            setBookings(bookingsRes.data.results || bookingsRes.data);
            setServices(servicesRes.data.results || servicesRes.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Send data in format backend expects
    const createBooking = async () => {
        if (!selectedService) {
            alert('Please select a service');
            return;
        }
        try {

            const serviceId = Array.isArray(selectedService) ? selectedService[0] : selectedService;


            const bookingData = {
                // service: [selectedService],  // ✅ Backend expects array of service IDs

                service: serviceId,
                status: 'pending'
            };
            if (notes) bookingData.notes = notes;

            console.log('Sending:', bookingData);






            const response = await api.post('/bookings/', bookingData);
            console.log('Response:', response.data);







            // await api.post('/bookings/', bookingData);

            setShowForm(false);
            setSelectedService('');
            setNotes('');
            fetchData();
            alert('Booking created successfully!');
        } catch (error) {
            console.error('Error:', error.response?.data);
            const errorMsg = error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to create booking';
            alert(errorMsg);
        }
    };

    const updateStatus = async (id, status) => {
        const confirmMessages = {
            'accepted': 'Accept this booking?',
            'rejected': 'Reject this booking?',
            'completed': 'Mark as completed?',
            'cancelled': 'Cancel this booking?'
        };

        if (confirmMessages[status] && !window.confirm(confirmMessages[status])) {
            return;
        }

        try {
            await api.patch(`/bookings/${id}/`, { status });
            fetchData();
            alert(`Booking ${status} successfully!`);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update status');
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const getStatusClass = (status) => {
        const classes = {
            'pending': 'status-pending',
            'accepted': 'status-accepted',
            'rejected': 'status-rejected',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        };
        return classes[status] || 'status-pending';
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': '⏳ Pending',
            'accepted': '✅ Accepted',
            'rejected': '❌ Rejected',
            'completed': '🎉 Completed',
            'cancelled': '🚫 Cancelled'
        };
        return badges[status] || status;
    };

    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    const canCustomerCancel = (status) => {
        return status === 'pending' || status === 'accepted';
    };

    if (loading) return <div className="bookings-loading">Loading bookings...</div>;

    return (
        <div className="bookings-page">
            {/* Header */}
            <div className="bookings-header">
                <div className="bookings-logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🛠️</span>
                    <span className="logo-text">Service<span>Hub</span></span>
                </div>
                <div className="bookings-nav">
                    <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
                    <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button>
                    <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
                    {userRole === 'provider' && (
                        <button onClick={() => navigate('/provider/services')} className="nav-add">+ Add Service</button>
                    )}
                    <button onClick={logout} className="nav-logout">Logout</button>
                </div>
            </div>

            <div className="bookings-container">
                {/* Top row */}
                <div className="bookings-top-row">
                    <h2 className="bookings-title">
                        {userRole === 'provider' ? 'Service Requests' : 'My Bookings'}
                    </h2>
                    {userRole === 'customer' && (
                        <button onClick={() => setShowForm(!showForm)} className="btn-new-booking">
                            {showForm ? '− Cancel' : '+ New Booking'}
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="filter-tabs">
                    {['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map(status => (
                        <button
                            key={status}
                            className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === 'all' ? 'All' : getStatusBadge(status).split(' ')[1] || status}
                            {status !== 'all' && (
                                <span className="filter-count">
                                    {bookings.filter(b => b.status === status).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* New Booking Form */}
                {showForm && userRole === 'customer' && (
                    <div className="booking-form-card">
                        <h3>📋 Book a Service</h3>
                        <div className="form-group">
                            <label>Select Service *</label>
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="booking-select"
                            >
                                <option value="">-- Select Service --</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.title} — ₹{service.price}

                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Additional Notes (optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="booking-textarea"
                                rows="3"
                                placeholder="E.g., special instructions, address details..."
                            />
                        </div>
                        <div className="form-actions">
                            <button onClick={createBooking} className="btn-confirm">Confirm Booking</button>
                            <button onClick={() => {
                                setShowForm(false);
                                setSelectedService('');
                                setNotes('');
                            }} className="btn-cancel-form">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bookings-empty">
                        <p>No {filterStatus !== 'all' ? filterStatus : ''} bookings found.</p>
                        {userRole === 'customer' && (
                            <button onClick={() => navigate('/services')} className="btn-book-link">
                                Browse Services →
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {filteredBookings.map(booking => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-card-header">
                                    <div>
                                        <h3 className="booking-service-name">
                                            {booking.services_detail?.map(s => s.title).join(', ') || booking.service_title || booking.service?.title}
                                        </h3>
                                        <p className="booking-provider">Provider: {booking.provider_name || 'Service Provider'}</p>
                                    </div>
                                    <span className={`booking-status ${getStatusClass(booking.status)}`}>
                                        {getStatusBadge(booking.status)}
                                    </span>
                                </div>
                                {booking.notes && (
                                    <p className="booking-notes">📝 Notes: {booking.notes}</p>
                                )}
                                <div className="booking-price-section">
                                    <span className="price-currency">₹</span>
                                    {/* <span className="price-amount">{booking.total_price || booking.service?.price || 0}</span> */
                                    }



                                    <span className="price-amount">{booking.service_price || booking.service?.price || 0}</span>




                                    <span className="price-unit"></span>
                                </div>
                                <p className="booking-date">Booked on: {new Date(booking.created_at).toLocaleDateString()}</p>

                                {/* Action Buttons - Provider */}
                                {userRole === 'provider' && booking.status === 'pending' && (
                                    <div className="booking-actions provider-actions">
                                        <button onClick={() => updateStatus(booking.id, 'accepted')} className="btn-accept">✓ Accept</button>
                                        <button onClick={() => updateStatus(booking.id, 'rejected')} className="btn-reject">✗ Reject</button>
                                    </div>
                                )}

                                {userRole === 'provider' && booking.status === 'accepted' && (
                                    <div className="booking-actions">
                                        <button onClick={() => updateStatus(booking.id, 'completed')} className="btn-complete">✔ Mark Completed</button>
                                    </div>
                                )}

                                {/* Action Buttons - Customer */}
                                {userRole === 'customer' && canCustomerCancel(booking.status) && (
                                    <div className="booking-actions">
                                        <button onClick={() => updateStatus(booking.id, 'cancelled')} className="btn-cancel">Cancel Booking</button>
                                    </div>
                                )}

                                {/* Review & Chat Buttons */}
                                {(booking.status === 'completed') && (
                                    <div className="booking-actions secondary-actions">
                                        <button onClick={() => navigate(`/reviews?booking=${booking.id}`)} className="btn-review">
                                            ⭐ Write Review
                                        </button>
                                        <button onClick={() => navigate('/chat')} className="btn-chat">
                                            💬 Contact Provider
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bookings;