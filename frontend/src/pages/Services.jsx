// // import { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import api from '../services/api';
// // import './Services.css';
// // import axios from 'axios';

// // function Services() {
// //     const [services, setServices] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const navigate = useNavigate();
// //     const userRole = localStorage.getItem('user_role');

// //     useEffect(() => {
// //         fetchServices();
// //     }, []);

// //     const fetchServices = async () => {
// //         try {
// //             const response = await api.get('/services/');
// //             setServices(response.data.results || response.data);
// //         } catch (error) {
// //             console.error('Error:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const logout = () => {
// //         localStorage.clear();
// //         window.location.href = '/';
// //     };

// //     const getIcon = (title) => {
// //         const icons = {
// //             'Electrical': '⚡',
// //             'Plumbing': '🔧',
// //             'House Cleaning': '🧹',
// //             'AC Cleaning': '❄️'
// //         };
// //         return icons[title] || '🛠️';
// //     };

// //     const getBgColor = (title) => {
// //         const colors = {
// //             'Electrical': '#fff3e0',
// //             'Plumbing': '#e3f2fd',
// //             'House Cleaning': '#e8f5e9',
// //             'AC Cleaning': '#fce4ec'
// //         };
// //         return colors[title] || '#f8f9fa';
// //     };

// //     if (loading) return <div className="services-loading">Loading services...</div>;

// //     return (
// //         <div className="services-page">
// //             {/* Header */}
// //             <div className="services-header">
// //                 {/* <div className="services-logo" onClick={() => navigate('/dashboard')}>
// //                     <span className="logo-icon">🛠️</span>
// //                     <span className="logo-text">Service<span>Hub</span></span>
// //                 </div>} */}
// //                 <div className="services-nav">
// //                     {/* <button onClick={() => navigate('/dashboard')} className="nav-btn">Dashboard</button> */}
// //                     <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
// //                     <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button>
// //                     <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
// //                     {userRole === 'provider' && (
// //                         <button onClick={() => navigate('/provider/services')} className="nav-add">+ Add Service</button>
// //                     )}
// //                     <button onClick={logout} className="nav-logout">Logout</button>
// //                 </div>
// //             </div>

// //             {/* Services Grid */}
// //             <div className="services-container">
// //                 <div className="services-grid">
// //                     {services.map(service => (
// //                         <div key={service.id} className="service-card" style={{ background: getBgColor(service.title) }}>
// //                             <div className="service-icon-large">{getIcon(service.title)}</div>
// //                             <h3 className="service-name">{service.title}</h3>
// //                             <p className="service-description">{service.description}</p>
// //                             <div className="service-price-section">
// //                                 <span className="price-currency">₹</span>
// //                                 <span className="price-amount">{service.price}</span>
// //                             </div>
// //                             <div className="service-buttons">
// //                                 <button onClick={() => navigate('/bookings')} className="btn-book">
// //                                     Book Now →
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default Services;









import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Services.css';

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('user_role');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/services/');
            setServices(response.data.results || response.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const getIcon = (title) => {
        const icons = {
            'Electrical': '⚡',
            'Plumbing': '🔧',
            'House Cleaning': '🧹',
            'AC Cleaning': '❄️',
            'Cleaning': '🧼',
            'Home Service': '🏠',
            'Painting': '🎨',
            'Furniture Assembly': '🪑'
        };
        return icons[title] || '🛠️';
    };

    const getBgColor = (title) => {
        const colors = {
            'Electrical': '#fff3e0',
            'Plumbing': '#e3f2fd',
            'House Cleaning': '#e8f5e9',
            'AC Cleaning': '#fce4ec',
            'Cleaning': '#e8f5e9',
            'Home Service': '#fff8e1',
            'Painting': '#f3e5f5',
            'Furniture Assembly': '#e0f2f1'
        };
        return colors[title] || '#f8f9fa';
    };

    if (loading) return <div className="services-loading">Loading services...</div>;

    return (
        <div className="services-page">
            {/* Header - EXACT SAME as Bookings component */}
            <div className="services-header">
                <div className="services-logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🛠️</span>
                    <span className="logo-text">Service<span>Hub</span></span>
                </div>
                <div className="services-nav">
                    <button onClick={() => navigate('/services')} className="nav-btn nav-active">Services</button>
                    <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
                    <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button>
                    <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
                    {userRole === 'provider' && (
                        <button onClick={() => navigate('/provider/services')} className="nav-add">+ Add Service</button>
                    )}
                    <button onClick={logout} className="nav-logout">Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="services-container">
                {/* Top row - Similar to Bookings */}
                <div className="services-top-row">
                    <h2 className="services-title">Available Services</h2>
                    {userRole === 'provider' && (
                        <button onClick={() => navigate('/provider/services')} className="btn-new-service">
                            + Manage Services
                        </button>
                    )}
                </div>

                {/* Services Grid */}
                <div className="services-grid">
                    {services.length === 0 ? (
                        <div className="services-empty">
                            <p>No services available at the moment.</p>
                            <button onClick={() => navigate('/')} className="btn-service-link">
                                Back to Home →
                            </button>
                        </div>
                    ) : (
                        services.map(service => (
                            <div key={service.id} className="service-card" style={{ background: getBgColor(service.title) }}>
                                <div className="service-icon-large">{getIcon(service.title)}</div>
                                <h3 className="service-name">{service.title}</h3>
                                <p className="service-description">{service.description}</p>
                                <div className="service-price-section">
                                    <span className="price-currency">₹</span>
                                    <span className="price-amount">{service.price}</span>
                                    <span className="price-unit">/hour</span>
                                </div>
                                <div className="service-buttons">
                                    <button
                                        onClick={() => {
                                            // Store selected service and navigate to bookings with state
                                            navigate('/bookings', {
                                                state: {
                                                    preSelectedService: service.id,
                                                    serviceName: service.title
                                                }
                                            });
                                        }}
                                        className="btn-book"
                                    >
                                        Book Now →
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Services;