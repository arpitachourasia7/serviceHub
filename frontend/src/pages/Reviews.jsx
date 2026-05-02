// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Reviews.css';

// function Reviews() {
//     const [reviews, setReviews] = useState([
//         { id: 1, rating: 5, comment: "Excellent service! Very professional.", username: "JohnDoe", date: "2024-01-15" },
//         { id: 2, rating: 4, comment: "Good work, will recommend.", username: "JaneSmith", date: "2024-01-10" },
//         { id: 3, rating: 5, comment: "Fast and reliable service.", username: "MikeJohnson", date: "2024-01-05" }
//     ]);
//     const [showForm, setShowForm] = useState(false);
//     const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
//     const navigate = useNavigate();

//     const handleSubmit = () => {
//         if (!newReview.comment) return;
//         const review = {
//             id: reviews.length + 1,
//             rating: parseInt(newReview.rating),
//             comment: newReview.comment,
//             username: localStorage.getItem('username') || 'Current User',
//             date: new Date().toISOString().split('T')[0]
//         };
//         setReviews([review, ...reviews]);
//         setShowForm(false);
//         setNewReview({ rating: 5, comment: '' });
//     };

//     const logout = () => {
//         localStorage.clear();
//         window.location.href = '/';
//     };

//     const renderStars = (rating) => '⭐'.repeat(rating);

//     return (
//         <div className="reviews-page">
//             {/* Header */}
//             <div className="reviews-header">
//                 <div className="reviews-logo" onClick={() => navigate('/')}>
//                     <span className="logo-icon">🛠️</span>
//                     <span className="logo-text">Service<span>Hub</span></span>
//                 </div>
//                 <div className="reviews-nav">
//                     <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
//                     <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
//                     {/* <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button> */}
//                     <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
//                     <button onClick={logout} className="nav-logout">Logout</button>
//                 </div>
//             </div>

//             <div className="reviews-container">
//                 {/* Top Row */}
//                 <div className="reviews-top-row">
//                     <h2 className="reviews-title">Customer Reviews</h2>
//                     <button onClick={() => setShowForm(!showForm)} className="btn-new-review">
//                         + Write Review
//                     </button>
//                 </div>

//                 {/* Review Form */}
//                 {showForm && (
//                     <div className="review-form-card">
//                         <h3>Share Your Experience</h3>
//                         <select
//                             value={newReview.rating}
//                             onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
//                             className="review-select"
//                         >
//                             <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
//                             <option value="4">⭐⭐⭐⭐ — Good</option>
//                             <option value="3">⭐⭐⭐ — Average</option>
//                             <option value="2">⭐⭐ — Poor</option>
//                             <option value="1">⭐ — Terrible</option>
//                         </select>
//                         <textarea
//                             className="review-textarea"
//                             placeholder="Write your review..."
//                             value={newReview.comment}
//                             onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                             rows="4"
//                         />
//                         <button onClick={handleSubmit} className="btn-submit-review">
//                             Submit Review
//                         </button>
//                     </div>
//                 )}

//                 {/* Reviews Grid */}
//                 <div className="reviews-grid">
//                     {reviews.map(review => (
//                         <div key={review.id} className="review-card">
//                             <div className="review-stars">{renderStars(review.rating)}</div>
//                             <p className="review-comment">"{review.comment}"</p>
//                             <div className="review-footer">
//                                 <span className="review-username">— {review.username}</span>
//                                 <span className="review-date">{review.date}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Reviews;













// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import { getReviews, createReview } from '../services/reviews';
// import './Reviews.css';

// function Reviews() {
//     const [reviews, setReviews] = useState([]);
//     const [completedBookings, setCompletedBookings] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedBooking, setSelectedBooking] = useState('');
//     const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchReviews();
//         fetchCompletedBookings();
//     }, []);

//     const fetchReviews = async () => {
//         try {
//             setLoading(true);
//             const response = await getReviews();
//             let reviewsData = [];
//             if (Array.isArray(response.data)) {
//                 reviewsData = response.data;
//             } else if (response.data?.results) {
//                 reviewsData = response.data.results;
//             }
//             setReviews(reviewsData);
//         } catch (error) {
//             console.error('Error fetching reviews:', error);
//             setReviews([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchCompletedBookings = async () => {
//         try {
//             const response = await api.get('/bookings/');
//             const bookings = response.data.results || response.data || [];
//             const completed = bookings.filter(b => b.status === 'completed');
//             setCompletedBookings(completed);
//         } catch (error) {
//             console.error('Error fetching completed bookings:', error);
//         }
//     };

//     const handleSubmit = async () => {
//         if (!selectedBooking) {
//             alert('Please select a completed booking to review');
//             return;
//         }
//         if (!newReview.comment.trim()) {
//             alert('Please write a review comment');
//             return;
//         }

//         try {
//             setLoading(true);

//             const reviewData = {
//                 rating: parseInt(newReview.rating),
//                 comment: newReview.comment
//             };

//             console.log('Submitting review for booking:', selectedBooking);
//             const response = await createReview(selectedBooking, reviewData);
//             console.log('Review saved:', response.data);

//             await fetchReviews();
//             await fetchCompletedBookings();

//             setShowForm(false);
//             setSelectedBooking('');
//             setNewReview({ rating: 5, comment: '' });
//             alert('✅ Review submitted successfully!');

//         } catch (error) {
//             console.error('Error details:', error);
//             console.error('Error response:', error.response?.data);

//             if (error.response?.status === 401) {
//                 alert('Please login to submit a review');
//                 navigate('/login');
//             } else if (error.response?.status === 400) {
//                 alert(error.response.data?.error || 'Cannot review this booking');
//             } else if (error.response?.status === 404) {
//                 alert('Booking not found');
//             } else {
//                 alert(error.response?.data?.error || 'Failed to submit review');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const logout = () => {
//         localStorage.clear();
//         navigate('/');
//     };

//     const renderStars = (rating) => {
//         return '⭐'.repeat(rating);
//     };

//     if (loading && reviews.length === 0) {
//         return (
//             <div className="reviews-page">
//                 <div className="reviews-header">
//                     <div className="reviews-logo" onClick={() => navigate('/')}>
//                         <span className="logo-icon">🛠️</span>
//                         <span className="logo-text">Service<span>Hub</span></span>
//                     </div>
//                     <div className="reviews-nav">
//                         <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
//                         <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
//                         <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
//                         <button onClick={logout} className="nav-logout">Logout</button>
//                     </div>
//                 </div>
//                 <div className="reviews-container">
//                     <div className="loading-message">Loading reviews...</div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="reviews-page">
//             <div className="reviews-header">
//                 <div className="reviews-logo" onClick={() => navigate('/')}>
//                     <span className="logo-icon">🛠️</span>
//                     <span className="logo-text">Service<span>Hub</span></span>
//                 </div>
//                 <div className="reviews-nav">
//                     <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
//                     <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
//                     <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
//                     <button onClick={logout} className="nav-logout">Logout</button>
//                 </div>
//             </div>

//             <div className="reviews-container">
//                 <div className="reviews-top-row">
//                     <h2 className="reviews-title">Customer Reviews</h2>
//                     <button onClick={() => setShowForm(!showForm)} className="btn-new-review">
//                         + Write Review
//                     </button>
//                 </div>

//                 {showForm && (
//                     <div className="review-form-card">
//                         <h3>Share Your Experience</h3>
//                         <p className="hint-text">✨ Your feedback helps us improve!</p>

//                         <label>Select Completed Booking:</label>
//                         <select
//                             value={selectedBooking}
//                             onChange={(e) => setSelectedBooking(e.target.value)}
//                             className="review-select"
//                             required
//                         >
//                             <option value="">-- Select a completed booking --</option>
//                             {completedBookings.map(booking => (
//                                 <option key={booking.id} value={booking.id}>
//                                     {booking.service_title || booking.service?.title} - ₹{booking.service?.price}/hour
//                                 </option>
//                             ))}
//                         </select>

//                         <label>Rating:</label>
//                         <select
//                             value={newReview.rating}
//                             onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
//                             className="review-select"
//                         >
//                             <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
//                             <option value="4">⭐⭐⭐⭐ — Good</option>
//                             <option value="3">⭐⭐⭐ — Average</option>
//                             <option value="2">⭐⭐ — Poor</option>
//                             <option value="1">⭐ — Terrible</option>
//                         </select>

//                         <label>Your Review:</label>
//                         <textarea
//                             className="review-textarea"
//                             placeholder="Write your review here..."
//                             value={newReview.comment}
//                             onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                             rows="4"
//                         />

//                         <div className="form-buttons">
//                             <button
//                                 onClick={handleSubmit}
//                                 className="btn-submit-review"
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Submitting...' : 'Submit Review'}
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowForm(false);
//                                     setSelectedBooking('');
//                                     setNewReview({ rating: 5, comment: '' });
//                                 }}
//                                 className="btn-cancel"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 <div className="reviews-grid">
//                     {reviews.length > 0 ? (
//                         reviews.map(review => (
//                             <div key={review.id} className="review-card">
//                                 <div className="review-stars">{renderStars(review.rating)}</div>
//                                 <p className="review-comment">"{review.comment}"</p>
//                                 <div className="review-footer">
//                                     <span className="review-username">
//                                         — {review.customer?.username || review.username || 'Anonymous'}
//                                     </span>
//                                     <span className="review-date">
//                                         {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="no-reviews">
//                             <p>📝 No reviews yet</p>
//                             <p>Be the first to share your experience!</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Reviews;





import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getReviews, createReview } from '../services/reviews';
import './Reviews.css';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [completedBookings, setCompletedBookings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState('');
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userRole = localStorage.getItem('user_role');
    const isCustomer = userRole === 'customer';

    useEffect(() => {
        fetchReviews();
        if (isCustomer) {
            fetchCompletedBookings();
        }
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await getReviews();
            let reviewsData = [];
            if (Array.isArray(response.data)) {
                reviewsData = response.data;
            } else if (response.data?.results) {
                reviewsData = response.data.results;
            }
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompletedBookings = async () => {
        try {
            const response = await api.get('/bookings/');
            const bookings = response.data.results || response.data || [];
            const completed = bookings.filter(b => b.status === 'completed');
            setCompletedBookings(completed);
        } catch (error) {
            console.error('Error fetching completed bookings:', error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedBooking) {
            alert('Please select a completed booking to review');
            return;
        }
        if (!newReview.comment.trim()) {
            alert('Please write a review comment');
            return;
        }

        try {
            setLoading(true);

            const reviewData = {
                rating: parseInt(newReview.rating),
                comment: newReview.comment
            };

            console.log('Submitting review for booking:', selectedBooking);
            const response = await createReview(selectedBooking, reviewData);
            console.log('Review saved:', response.data);

            await fetchReviews();
            await fetchCompletedBookings();

            setShowForm(false);
            setSelectedBooking('');
            setNewReview({ rating: 5, comment: '' });
            alert('✅ Review submitted successfully!');

        } catch (error) {
            console.error('Error:', error);
            console.error('Error response:', error.response?.data);

            if (error.response?.data?.error === 'Review already submitted' ||
                error.response?.data?.error === 'You have already reviewed this booking') {
                alert('✅ You have already submitted a review for this booking!');
                setShowForm(false);
            } else if (error.response?.status === 401) {
                alert('Please login to submit a review');
                navigate('/login');
            } else {
                alert(error.response?.data?.error || 'Failed to submit review');
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(rating);
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="reviews-page">
                <div className="reviews-header">
                    <div className="reviews-logo" onClick={() => navigate('/')}>
                        <span className="logo-icon">🛠️</span>
                        <span className="logo-text">Service<span>Hub</span></span>
                    </div>
                    <div className="reviews-nav">
                        <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
                        <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
                        <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
                        {userRole === 'provider' && (
                            <button onClick={() => navigate('/provider/services')} className="nav-add">+ Add Service</button>
                        )}
                        <button onClick={logout} className="nav-logout">Logout</button>
                    </div>
                </div>
                <div className="reviews-container">
                    <div className="loading-message">Loading reviews...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-page">
            <div className="reviews-header">
                <div className="reviews-logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🛠️</span>
                    <span className="logo-text">Service<span>Hub</span></span>
                </div>
                <div className="reviews-nav">
                    <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
                    <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
                    <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
                    {/* {userRole === 'provider' && (
                        <button onClick={() => navigate('/provider/services')} className="nav-add">+ Add Service</button> */}
                    {/* )} */}
                    <button onClick={logout} className="nav-logout">Logout</button>
                </div>
            </div>

            <div className="reviews-container">
                <div className="reviews-top-row">
                    <h2 className="reviews-title">
                        {userRole === 'provider' ? 'Customer Reviews' : 'My Reviews'}
                    </h2>
                    {isCustomer && (
                        <button onClick={() => setShowForm(!showForm)} className="btn-new-review">
                            + Write Review
                        </button>
                    )}
                </div>

                {isCustomer && showForm && (
                    <div className="review-form-card">
                        <h3>Share Your Experience</h3>
                        <p className="hint-text">✨ Your feedback helps us improve!</p>

                        <label>Select Completed Booking:</label>
                        <select
                            value={selectedBooking}
                            onChange={(e) => setSelectedBooking(e.target.value)}
                            className="review-select"
                            required
                        >
                            <option value="">-- Select a completed booking --</option>
                            {completedBookings.map(booking => (
                                <option key={booking.id} value={booking.id}>
                                    {booking.service_title || booking.service?.title} - ₹{booking.service?.price}/hour
                                </option>
                            ))}
                        </select>

                        <label>Rating:</label>
                        <select
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                            className="review-select"
                        >
                            <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
                            <option value="4">⭐⭐⭐⭐ — Good</option>
                            <option value="3">⭐⭐⭐ — Average</option>
                            <option value="2">⭐⭐ — Poor</option>
                            <option value="1">⭐ — Terrible</option>
                        </select>

                        <label>Your Review:</label>
                        <textarea
                            className="review-textarea"
                            placeholder="Write your review here..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            rows="4"
                        />

                        <div className="form-buttons">
                            <button onClick={handleSubmit} className="btn-submit-review" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button onClick={() => {
                                setShowForm(false);
                                setSelectedBooking('');
                                setNewReview({ rating: 5, comment: '' });
                            }} className="btn-cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="reviews-grid">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div className="review-stars">{renderStars(review.rating)}</div>
                                <p className="review-comment">"{review.comment}"</p>
                                <div className="review-footer">
                                    <span className="review-username">
                                        — {review.username || review.customer?.username || 'Anonymous'}
                                    </span>
                                    <span className="review-date">
                                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-reviews">
                            <p>📝 No reviews yet</p>
                            {isCustomer && <p>Complete a booking and share your experience!</p>}
                            {userRole === 'provider' && <p>Reviews from customers will appear here</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reviews;