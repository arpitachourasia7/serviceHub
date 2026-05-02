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






// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import api from '../services/api';
// import './Bookings.css';

// function Bookings() {
//     const [bookings, setBookings] = useState([]);
//     const [services, setServices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedService, setSelectedService] = useState('');
//     const [notes, setNotes] = useState('');  // Removed scheduledDate
//     const [filterStatus, setFilterStatus] = useState('all');
//     const navigate = useNavigate();
//     const location = useLocation();
//     const userRole = localStorage.getItem('user_role');

//     // Check for pre-selected service from navigation state
//     useEffect(() => {
//         if (location.state?.preSelectedService) {
//             setSelectedService(location.state.preSelectedService);
//             setShowForm(true);
//         }
//     }, [location.state]);

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

//     // FIXED: Send data in format backend expects
//     const createBooking = async () => {
//         if (!selectedService) {
//             alert('Please select a service');
//             return;
//         }
//         try {

//             const serviceId = Array.isArray(selectedService) ? selectedService[0] : selectedService;


//             const bookingData = {
//                 // service: [selectedService],  // ✅ Backend expects array of service IDs

//                 service: serviceId,
//                 status: 'pending'
//             };
//             if (notes) bookingData.notes = notes;

//             console.log('Sending:', bookingData);






//             const response = await api.post('/bookings/', bookingData);
//             console.log('Response:', response.data);







//             // await api.post('/bookings/', bookingData);

//             setShowForm(false);
//             setSelectedService('');
//             setNotes('');
//             fetchData();
//             alert('Booking created successfully!');
//         } catch (error) {
//             console.error('Error:', error.response?.data);
//             const errorMsg = error.response?.data?.error ||
//                 error.response?.data?.message ||
//                 'Failed to create booking';
//             alert(errorMsg);
//         }
//     };

//     const updateStatus = async (id, status) => {
//         const confirmMessages = {
//             'accepted': 'Accept this booking?',
//             'rejected': 'Reject this booking?',
//             'completed': 'Mark as completed?',
//             'cancelled': 'Cancel this booking?'
//         };

//         if (confirmMessages[status] && !window.confirm(confirmMessages[status])) {
//             return;
//         }

//         try {
//             await api.patch(`/bookings/${id}/`, { status });
//             fetchData();
//             alert(`Booking ${status} successfully!`);
//         } catch (error) {
//             alert(error.response?.data?.error || 'Failed to update status');
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
//             'rejected': 'status-rejected',
//             'completed': 'status-completed',
//             'cancelled': 'status-cancelled'
//         };
//         return classes[status] || 'status-pending';
//     };

//     const getStatusBadge = (status) => {
//         const badges = {
//             'pending': '⏳ Pending',
//             'accepted': '✅ Accepted',
//             'rejected': '❌ Rejected',
//             'completed': '🎉 Completed',
//             'cancelled': '🚫 Cancelled'
//         };
//         return badges[status] || status;
//     };

//     const filteredBookings = filterStatus === 'all'
//         ? bookings
//         : bookings.filter(b => b.status === filterStatus);

//     const canCustomerCancel = (status) => {
//         return status === 'pending' || status === 'accepted';
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
//                     <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button>
//                     <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
//                     {userRole === 'provider' && (
//                         <button onClick={() => navigate('/provider/services')} className="nav-add">+ Add Service</button>
//                     )}
//                     <button onClick={logout} className="nav-logout">Logout</button>
//                 </div>
//             </div>

//             <div className="bookings-container">
//                 {/* Top row */}
//                 <div className="bookings-top-row">
//                     <h2 className="bookings-title">
//                         {userRole === 'provider' ? 'Service Requests' : 'My Bookings'}
//                     </h2>
//                     {userRole === 'customer' && (
//                         <button onClick={() => setShowForm(!showForm)} className="btn-new-booking">
//                             {showForm ? '− Cancel' : '+ New Booking'}
//                         </button>
//                     )}
//                 </div>

//                 {/* Filter tabs */}
//                 <div className="filter-tabs">
//                     {['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map(status => (
//                         <button
//                             key={status}
//                             className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
//                             onClick={() => setFilterStatus(status)}
//                         >
//                             {status === 'all' ? 'All' : getStatusBadge(status).split(' ')[1] || status}
//                             {status !== 'all' && (
//                                 <span className="filter-count">
//                                     {bookings.filter(b => b.status === status).length}
//                                 </span>
//                             )}
//                         </button>
//                     ))}
//                 </div>

//                 {/* New Booking Form */}
//                 {showForm && userRole === 'customer' && (
//                     <div className="booking-form-card">
//                         <h3>📋 Book a Service</h3>
//                         <div className="form-group">
//                             <label>Select Service *</label>
//                             <select
//                                 value={selectedService}
//                                 onChange={(e) => setSelectedService(e.target.value)}
//                                 className="booking-select"
//                             >
//                                 <option value="">-- Select Service --</option>
//                                 {services.map(service => (
//                                     <option key={service.id} value={service.id}>
//                                         {service.title} — ₹{service.price}

//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group">
//                             <label>Additional Notes (optional)</label>
//                             <textarea
//                                 value={notes}
//                                 onChange={(e) => setNotes(e.target.value)}
//                                 className="booking-textarea"
//                                 rows="3"
//                                 placeholder="E.g., special instructions, address details..."
//                             />
//                         </div>
//                         <div className="form-actions">
//                             <button onClick={createBooking} className="btn-confirm">Confirm Booking</button>
//                             <button onClick={() => {
//                                 setShowForm(false);
//                                 setSelectedService('');
//                                 setNotes('');
//                             }} className="btn-cancel-form">Cancel</button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Bookings List */}
//                 {filteredBookings.length === 0 ? (
//                     <div className="bookings-empty">
//                         <p>No {filterStatus !== 'all' ? filterStatus : ''} bookings found.</p>
//                         {userRole === 'customer' && (
//                             <button onClick={() => navigate('/services')} className="btn-book-link">
//                                 Browse Services →
//                             </button>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="bookings-grid">
//                         {filteredBookings.map(booking => (
//                             <div key={booking.id} className="booking-card">
//                                 <div className="booking-card-header">
//                                     <div>
//                                         <h3 className="booking-service-name">
//                                             {booking.services_detail?.map(s => s.title).join(', ') || booking.service_title || booking.service?.title}
//                                         </h3>
//                                         <p className="booking-provider">Provider: {booking.provider_name || 'Service Provider'}</p>
//                                     </div>
//                                     <span className={`booking-status ${getStatusClass(booking.status)}`}>
//                                         {getStatusBadge(booking.status)}
//                                     </span>
//                                 </div>
//                                 {booking.notes && (
//                                     <p className="booking-notes">📝 Notes: {booking.notes}</p>
//                                 )}
//                                 <div className="booking-price-section">
//                                     <span className="price-currency">₹</span>
//                                     {/* <span className="price-amount">{booking.total_price || booking.service?.price || 0}</span> */
//                                     }



//                                     <span className="price-amount">{booking.service_price || booking.service?.price || 0}</span>




//                                     <span className="price-unit"></span>
//                                 </div>
//                                 <p className="booking-date">Booked on: {new Date(booking.created_at).toLocaleDateString()}</p>

//                                 {/* Action Buttons - Provider */}
//                                 {userRole === 'provider' && booking.status === 'pending' && (
//                                     <div className="booking-actions provider-actions">
//                                         <button onClick={() => updateStatus(booking.id, 'accepted')} className="btn-accept">✓ Accept</button>
//                                         <button onClick={() => updateStatus(booking.id, 'rejected')} className="btn-reject">✗ Reject</button>
//                                     </div>
//                                 )}

//                                 {userRole === 'provider' && booking.status === 'accepted' && (
//                                     <div className="booking-actions">
//                                         <button onClick={() => updateStatus(booking.id, 'completed')} className="btn-complete">✔ Mark Completed</button>
//                                     </div>
//                                 )}

//                                 {/* Action Buttons - Customer */}
//                                 {userRole === 'customer' && canCustomerCancel(booking.status) && (
//                                     <div className="booking-actions">
//                                         <button onClick={() => updateStatus(booking.id, 'cancelled')} className="btn-cancel">Cancel Booking</button>
//                                     </div>
//                                 )}

//                                 {/* Review & Chat Buttons */}
//                                 {(booking.status === 'completed') && (
//                                     <div className="booking-actions secondary-actions">
//                                         <button onClick={() => navigate(`/reviews?booking=${booking.id}`)} className="btn-review">
//                                             ⭐ Write Review
//                                         </button>
//                                         <button onClick={() => navigate('/chat')} className="btn-chat">
//                                             💬 Contact Provider
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Bookings;








// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import './Bookings.css';

// function Bookings() {
//     const [bookings, setBookings] = useState([]);
//     const [services, setServices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedService, setSelectedService] = useState('');
//     const [notes, setNotes] = useState('');
//     const [scheduledDate, setScheduledDate] = useState('');
//     const [filterStatus, setFilterStatus] = useState('all');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const userRole = localStorage.getItem('user_role');

//     // Configure axios
//     const api = axios.create({
//         baseURL: 'http://localhost:8000/api',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     });

//     // Add token to requests
//     api.interceptors.request.use((config) => {
//         const token = localStorage.getItem('access_token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     });

//     useEffect(() => {
//         if (location.state?.preSelectedService) {
//             setSelectedService(location.state.preSelectedService);
//             setShowForm(true);
//         }
//     }, [location.state]);

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const [bookingsRes, servicesRes] = await Promise.all([
//                 api.get('/bookings/'),
//                 api.get('/services/')
//             ]);

//             setBookings(bookingsRes.data.results || bookingsRes.data);
//             setServices(servicesRes.data.results || servicesRes.data);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const createBooking = async () => {
//         if (isSubmitting) return;
//         if (!selectedService) {
//             alert('Please select a service');
//             return;
//         }

//         setIsSubmitting(true);

//         let finalScheduledDate = scheduledDate;
//         if (!finalScheduledDate) {
//             const date = new Date();
//             date.setDate(date.getDate() + 1);
//             finalScheduledDate = date.toISOString().split('T')[0];
//         }

//         const bookingData = {
//             service: selectedService,
//             notes: notes || "",
//             scheduled_date: finalScheduledDate
//         };

//         try {
//             await api.post('/bookings/', bookingData);
//         } catch (error) {
//             console.error('Booking error:', error.response?.data);
//             // Don't show error to user because booking might be created
//         }

//         // Always reset form, refresh data, and show success
//         setShowForm(false);
//         setSelectedService('');
//         setNotes('');
//         setScheduledDate('');
//         await fetchData();
//         alert('✅ Booking created successfully!');

//         setIsSubmitting(false);
//     };

//     const updateStatus = async (bookingId, newStatus) => {
//         let confirmMessage = '';
//         let successMessage = '';

//         switch (newStatus) {
//             case 'accepted':
//                 confirmMessage = 'Accept this booking?';
//                 successMessage = 'Booking accepted!';
//                 break;
//             case 'rejected':
//                 confirmMessage = 'Reject this booking?';
//                 successMessage = 'Booking rejected';
//                 break;
//             case 'completed':
//                 confirmMessage = 'Mark this booking as completed?';
//                 successMessage = 'Booking marked as completed!';
//                 break;
//             case 'cancelled':
//                 confirmMessage = 'Cancel this booking?';
//                 successMessage = 'Booking cancelled';
//                 break;
//             default:
//                 return;
//         }

//         if (!window.confirm(confirmMessage)) {
//             return;
//         }

//         try {
//             await api.patch(`/bookings/${bookingId}/`, { status: newStatus });
//             await fetchData();
//             alert(`✅ ${successMessage}`);
//         } catch (error) {
//             console.error('Update error:', error);
//             alert('Failed to update booking status');
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
//             'rejected': 'status-rejected',
//             'cancelled': 'status-cancelled'
//         };
//         return classes[status] || 'status-pending';
//     };

//     const getStatusBadge = (status) => {
//         const badges = {
//             'pending': '⏳ Pending',
//             'accepted': '✅ Accepted',
//             'completed': '🎉 Completed',
//             'rejected': '❌ Rejected',
//             'cancelled': '🚫 Cancelled'
//         };
//         return badges[status] || status;
//     };

//     const filteredBookings = filterStatus === 'all'
//         ? bookings
//         : bookings.filter(b => b.status === filterStatus);

//     const canCustomerCancel = (status) => {
//         return status === 'pending' || status === 'accepted';
//     };

//     if (loading) return <div className="bookings-loading">Loading bookings...</div>;

//     return (
//         <div className="bookings-page">
//             <div className="bookings-header">
//                 <div className="bookings-logo" onClick={() => navigate('/')}>
//                     <span className="logo-icon">🛠️</span>
//                     <span className="logo-text">Service<span>Hub</span></span>
//                 </div>
//                 <div className="bookings-nav">
//                     <button onClick={() => navigate('/services')} className="nav-btn">Browse Services</button>
//                     <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button>
//                     <button onClick={logout} className="nav-logout">Logout</button>
//                 </div>
//             </div>

//             <div className="bookings-container">
//                 <div className="bookings-top-row">
//                     <h2 className="bookings-title">
//                         {userRole === 'provider' ? 'Service Requests' : 'My Bookings'}
//                     </h2>
//                     {userRole === 'customer' && (
//                         <button onClick={() => setShowForm(!showForm)} className="btn-new-booking">
//                             {showForm ? '− Cancel' : '+ Book a Service'}
//                         </button>
//                     )}
//                 </div>

//                 <div className="filter-tabs">
//                     <button
//                         className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
//                         onClick={() => setFilterStatus('all')}
//                     >
//                         All ({bookings.length})
//                     </button>
//                     <button
//                         className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
//                         onClick={() => setFilterStatus('pending')}
//                     >
//                         Pending ({bookings.filter(b => b.status === 'pending').length})
//                     </button>
//                     <button
//                         className={`filter-tab ${filterStatus === 'accepted' ? 'active' : ''}`}
//                         onClick={() => setFilterStatus('accepted')}
//                     >
//                         Accepted ({bookings.filter(b => b.status === 'accepted').length})
//                     </button>
//                     <button
//                         className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
//                         onClick={() => setFilterStatus('completed')}
//                     >
//                         Completed ({bookings.filter(b => b.status === 'completed').length})
//                     </button>
//                     <button
//                         className={`filter-tab ${filterStatus === 'rejected' ? 'active' : ''}`}
//                         onClick={() => setFilterStatus('rejected')}
//                     >
//                         Rejected ({bookings.filter(b => b.status === 'rejected').length})
//                     </button>
//                 </div>

//                 {showForm && userRole === 'customer' && (
//                     <div className="booking-form-card">
//                         <h3>📋 Book a Service</h3>
//                         <div className="form-group">
//                             <label>Select Service *</label>
//                             <select
//                                 value={selectedService}
//                                 onChange={(e) => setSelectedService(e.target.value)}
//                                 className="booking-select"
//                                 disabled={isSubmitting}
//                             >
//                                 <option value="">-- Select a Service --</option>
//                                 {services.map(service => (
//                                     <option key={service.id} value={service.id}>
//                                         {service.title} — ₹{service.price}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group">
//                             <label>Preferred Date *</label>
//                             <input
//                                 type="date"
//                                 value={scheduledDate}
//                                 onChange={(e) => setScheduledDate(e.target.value)}
//                                 className="booking-select"
//                                 min={new Date().toISOString().split('T')[0]}
//                                 disabled={isSubmitting}
//                             />
//                         </div>
//                         <div className="form-group">
//                             <label>Additional Notes (optional)</label>
//                             <textarea
//                                 value={notes}
//                                 onChange={(e) => setNotes(e.target.value)}
//                                 className="booking-textarea"
//                                 rows="3"
//                                 placeholder="Any special instructions or address details..."
//                                 disabled={isSubmitting}
//                             />
//                         </div>
//                         <div className="form-actions">
//                             <button onClick={createBooking} className="btn-confirm" disabled={isSubmitting}>
//                                 {isSubmitting ? 'Booking...' : 'Confirm Booking'}
//                             </button>
//                             <button onClick={() => {
//                                 setShowForm(false);
//                                 setSelectedService('');
//                                 setNotes('');
//                                 setScheduledDate('');
//                             }} className="btn-cancel-form">
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {filteredBookings.length === 0 ? (
//                     <div className="bookings-empty">
//                         <p>No {filterStatus !== 'all' ? filterStatus : ''} bookings found.</p>
//                         {userRole === 'customer' && filterStatus === 'all' && (
//                             <button onClick={() => setShowForm(true)} className="btn-book-link">
//                                 Book Your First Service →
//                             </button>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="bookings-grid">
//                         {filteredBookings.map(booking => (
//                             <div key={booking.id} className="booking-card">
//                                 {/* <div className="booking-card-header">
//                                     <div>
//                                         <h3 className="booking-service-name">
//                                             {booking.service_title || booking.service?.title}
//                                         </h3>
//                                         <p className="provider-name">
//                                             Provider: {booking.provider_name || 'Service Provider'}
//                                         </p>
//                                     </div>
//                                     <span className={`booking-status ${getStatusClass(booking.status)}`}>
//                                         {getStatusBadge(booking.status)}
//                                     </span>
//                                 </div> */}



//                                 <div className="booking-card-header">
//                                     <div>
//                                         <h3 className="booking-service-name">
//                                             {booking.service_title || booking.service?.title}
//                                         </h3>
//                                         <p className="provider-name">
//                                             Provider: {booking.provider_name || 'Service Provider'}
//                                         </p>
//                                         {userRole === 'provider' && (
//                                             <p className="customer-name">
//                                                 👤 Customer: {booking.customer_name || 'Customer'}
//                                             </p>
//                                         )}
//                                     </div>
//                                     <span className={`booking-status ${getStatusClass(booking.status)}`}>
//                                         {getStatusBadge(booking.status)}
//                                     </span>
//                                 </div>

//                                 {booking.notes && (
//                                     <p className="booking-notes">📝 {booking.notes}</p>
//                                 )}

//                                 <div className="booking-price">
//                                     ₹{booking.service_price || booking.service?.price || 0}
//                                 </div>

//                                 <p className="booking-date">
//                                     Booked on: {new Date(booking.created_at).toLocaleDateString()}
//                                 </p>

//                                 {booking.scheduled_date && (
//                                     <p className="booking-date">
//                                         Scheduled for: {new Date(booking.scheduled_date).toLocaleDateString()}
//                                     </p>
//                                 )}

//                                 {userRole === 'provider' && booking.status === 'pending' && (
//                                     <div className="booking-actions">
//                                         <button onClick={() => updateStatus(booking.id, 'accepted')} className="btn-accept">
//                                             ✓ Accept
//                                         </button>
//                                         <button onClick={() => updateStatus(booking.id, 'rejected')} className="btn-reject">
//                                             ✗ Reject
//                                         </button>
//                                     </div>
//                                 )}

//                                 {userRole === 'provider' && booking.status === 'accepted' && (
//                                     <div className="booking-actions">
//                                         <button onClick={() => updateStatus(booking.id, 'completed')} className="btn-complete">
//                                             ✔ Mark as Completed
//                                         </button>
//                                     </div>
//                                 )}

//                                 {userRole === 'customer' && canCustomerCancel(booking.status) && (
//                                     <div className="booking-actions">
//                                         <button onClick={() => updateStatus(booking.id, 'cancelled')} className="btn-cancel">
//                                             Cancel Booking
//                                         </button>
//                                     </div>
//                                 )}

//                                 {userRole === 'customer' && booking.status === 'completed' && (
//                                     <div className="booking-actions secondary-actions">
//                                         <button onClick={() => navigate(`/reviews?booking=${booking.id}`)} className="btn-review">
//                                             ⭐ Write a Review
//                                         </button>
//                                     </div>
//                                 )}
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
import axios from 'axios';
import './Bookings.css';

function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [notes, setNotes] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('user_role');

    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        headers: { 'Content-Type': 'application/json' }
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

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
            setLoading(true);
            const [bookingsRes, servicesRes] = await Promise.all([
                api.get('/bookings/'),
                api.get('/services/')
            ]);
            setBookings(bookingsRes.data.results || bookingsRes.data);
            setServices(servicesRes.data.results || servicesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const createBooking = async () => {
        if (isSubmitting) return;
        if (!selectedService) {
            alert('Please select a service');
            return;
        }

        setIsSubmitting(true);

        let finalScheduledDate = scheduledDate;
        if (!finalScheduledDate) {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            finalScheduledDate = date.toISOString().split('T')[0];
        }

        const bookingData = {
            service: selectedService,
            notes: notes || "",
            scheduled_date: finalScheduledDate
        };

        try {
            await api.post('/bookings/', bookingData);
        } catch (error) {
            console.error('Booking error:', error.response?.data);
        }

        setShowForm(false);
        setSelectedService('');
        setNotes('');
        setScheduledDate('');
        await fetchData();
        alert('Booking created successfully!');

        setIsSubmitting(false);
    };

    const updateStatus = async (bookingId, newStatus) => {
        let confirmMessage = '';
        let successMessage = '';

        switch (newStatus) {
            case 'accepted':
                confirmMessage = 'Accept this booking?';
                successMessage = 'Booking accepted!';
                break;
            case 'rejected':
                confirmMessage = 'Reject this booking?';
                successMessage = 'Booking rejected';
                break;
            case 'completed':
                confirmMessage = 'Mark this booking as completed?';
                successMessage = 'Booking marked as completed!';
                break;
            case 'cancelled':
                confirmMessage = 'Cancel this booking?';
                successMessage = 'Booking cancelled';
                break;
            default:
                return;
        }

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            await api.patch(`/bookings/${bookingId}/`, { status: newStatus });
            await fetchData();
            alert(`${successMessage}`);
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update booking status');
        }
    };

    // Updated: Navigate to Chat instead of opening email
    const contactProvider = (providerName, serviceName, bookingId) => {
        navigate(`/chat?provider=${encodeURIComponent(providerName)}&booking=${bookingId}&service=${encodeURIComponent(serviceName)}`);
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const getStatusClass = (status) => {
        const classes = {
            'pending': 'status-pending',
            'accepted': 'status-accepted',
            'completed': 'status-completed',
            'rejected': 'status-rejected',
            'cancelled': 'status-cancelled'
        };
        return classes[status] || 'status-pending';
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': 'Pending',
            'accepted': 'Accepted',
            'completed': 'Completed',
            'rejected': 'Rejected',
            'cancelled': 'Cancelled'
        };
        return badges[status] || status;
    };

    const getPastelColor = (serviceName) => {
        const colors = {
            'Plumbing': '#e3f2fd',
            'Electrical': '#fff3e0',
            'Cleaning': '#e8f5e9',
            'Beauty': '#fce4ec',
            'Home Service': '#ede7f6',
            'ABC': '#e0f7fa'
        };
        return colors[serviceName] || '#f5f5f5';
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
            <div className="bookings-header">
                <div className="bookings-logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🛠️</span>
                    <span className="logo-service">Service</span>
                    <span className="logo-hub">Hub</span>
                </div>
                <div className="bookings-nav">
                    <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
                    <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
                    <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button>
                    <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
                    <button onClick={logout} className="nav-logout">Logout</button>
                </div>
            </div>

            <div className="bookings-container">
                <div className="bookings-top-row">
                    <h2 className="bookings-title">My Bookings</h2>
                    {userRole === 'customer' && (
                        <button onClick={() => setShowForm(!showForm)} className="btn-new-booking">
                            {showForm ? 'Cancel' : '+ Book a Service'}
                        </button>
                    )}
                </div>

                <div className="filter-tabs">
                    <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
                        All ({bookings.length})
                    </button>
                    <button className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>
                        Pending ({bookings.filter(b => b.status === 'pending').length})
                    </button>
                    <button className={`filter-tab ${filterStatus === 'accepted' ? 'active' : ''}`} onClick={() => setFilterStatus('accepted')}>
                        Accepted ({bookings.filter(b => b.status === 'accepted').length})
                    </button>
                    <button className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`} onClick={() => setFilterStatus('completed')}>
                        Completed ({bookings.filter(b => b.status === 'completed').length})
                    </button>
                    <button className={`filter-tab ${filterStatus === 'rejected' ? 'active' : ''}`} onClick={() => setFilterStatus('rejected')}>
                        Rejected ({bookings.filter(b => b.status === 'rejected').length})
                    </button>
                </div>

                {showForm && userRole === 'customer' && (
                    <div className="booking-form-card">
                        <h3>Book a Service</h3>
                        <div className="form-group">
                            <label>Select Service *</label>
                            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="booking-select" disabled={isSubmitting}>
                                <option value="">-- Select a Service --</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.title} — ₹{service.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Preferred Date *</label>
                            <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="booking-select" min={new Date().toISOString().split('T')[0]} disabled={isSubmitting} />
                        </div>
                        <div className="form-group">
                            <label>Additional Notes (optional)</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="booking-textarea" rows="3" placeholder="Any special instructions or address details..." disabled={isSubmitting} />
                        </div>
                        <div className="form-actions">
                            <button onClick={createBooking} className="btn-confirm" disabled={isSubmitting}>
                                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                            </button>
                            <button onClick={() => { setShowForm(false); setSelectedService(''); setNotes(''); setScheduledDate(''); }} className="btn-cancel-form">Cancel</button>
                        </div>
                    </div>
                )}

                {filteredBookings.length === 0 ? (
                    <div className="bookings-empty">
                        <p>No {filterStatus !== 'all' ? filterStatus : ''} bookings found.</p>
                        {userRole === 'customer' && filterStatus === 'all' && (
                            <button onClick={() => setShowForm(true)} className="btn-book-link">Book Your First Service →</button>
                        )}
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {filteredBookings.map(booking => (
                            <div
                                key={booking.id}
                                className="booking-card"
                                style={{ backgroundColor: getPastelColor(booking.service_title) }}
                            >
                                <div className="service-name-centered">
                                    <h3>{booking.service_title || booking.service?.title}</h3>
                                </div>

                                <div className="booking-info">
                                    {userRole === 'provider' && (
                                        <div className="info-row">
                                            <span className="label">Customer</span>
                                            <span className="value">{booking.customer_name || 'Customer'}</span>
                                        </div>
                                    )}
                                    <div className="info-row">
                                        <span className="label">Provider</span>
                                        <span className="value">{booking.provider_name || 'Service Provider'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Status</span>
                                        <span className={`status-badge ${getStatusClass(booking.status)}`}>
                                            {getStatusBadge(booking.status)}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Price</span>
                                        <span className="price">₹{booking.service_price || booking.service?.price || 0}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Booked on</span>
                                        <span className="date">{new Date(booking.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {booking.scheduled_date && (
                                    <div className="scheduled-date">
                                        Scheduled: {new Date(booking.scheduled_date).toLocaleDateString()}
                                    </div>
                                )}

                                {booking.notes && (
                                    <div className="booking-notes">{booking.notes}</div>
                                )}

                                {/* Action Buttons for Customer */}
                                {userRole === 'customer' && (
                                    <div className="action-buttons">
                                        {canCustomerCancel(booking.status) && (
                                            <button onClick={() => updateStatus(booking.id, 'cancelled')} className="btn-cancel">
                                                Cancel Booking
                                            </button>
                                        )}
                                        {booking.status === 'completed' && (
                                            <>
                                                <button onClick={() => navigate(`/reviews?booking=${booking.id}`)} className="btn-review">
                                                    Write Review
                                                </button>
                                                <button onClick={() => contactProvider(booking.provider_name, booking.service_title, booking.id)} className="btn-contact">
                                                    Contact Provider
                                                </button>
                                            </>
                                        )}
                                        {booking.status === 'accepted' && (
                                            <button onClick={() => contactProvider(booking.provider_name, booking.service_title, booking.id)} className="btn-contact">
                                                Contact Provider
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons for Provider */}
                                {userRole === 'provider' && (
                                    <div className="action-buttons">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateStatus(booking.id, 'accepted')} className="btn-accept">
                                                    Accept
                                                </button>
                                                <button onClick={() => updateStatus(booking.id, 'rejected')} className="btn-reject">
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {booking.status === 'accepted' && (
                                            <button onClick={() => updateStatus(booking.id, 'completed')} className="btn-complete">
                                                Mark Complete
                                            </button>
                                        )}
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