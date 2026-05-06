import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Services.css';
import { createConversation } from '../services/chat';


function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        icon: '🔧'
    });

    const navigate = useNavigate();
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
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/services/');
            setServices(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.price) {
            alert('Please fill all fields');
            return;
        }

        try {
            const serviceData = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                icon: formData.icon
            };

            if (editingService) {
                await api.patch(`/services/${editingService.id}/`, serviceData);
                alert('Service updated successfully!');
            } else {
                await api.post('/services/', serviceData);
                alert('Service added successfully!');
            }

            await fetchServices();
            setShowModal(false);
            setEditingService(null);
            setFormData({ title: '', description: '', price: '', icon: '🔧' });

        } catch (error) {
            console.error('Error saving service:', error);
            alert('Failed to save service');
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            price: service.price,
            icon: service.icon || getIconForService(service.title)
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            await api.delete(`/services/${id}/`);
            alert('Service deleted successfully!');
            await fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service');
        }
    };

    const getIconForService = (serviceName) => {
        const icons = {
            'Plumbing': '🔧',
            'Electrical': '⚡',
            'Cleaning': '🧹',
            'Beauty': '💅',
            'Home Service': '🏠',
            'ABC': '📦',
            'Painting': '🎨',
            'Carpentry': '🪚',
            'AC Service': '❄️',
            'Carpet Cleaning': '🧼'
        };
        return icons[serviceName] || '🛠️';
    };

    const handleBookNow = (serviceId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Please login to book a service');
            navigate('/login');
            return;
        }
        navigate('/bookings', { state: { preSelectedService: serviceId } });
    };

    const handleChatWithProvider = async (service) => {
        try {
            const response = await createConversation(
                service.provider_id,
                service.id,
                null
            );
            navigate('/chat', {
                state: { conversationId: response.data.id }
            });
        } catch (error) {
            alert('Could not start chat');
        }
    };


    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return <div className="services-loading">Loading services...</div>;
    }

    return (
        <div className="services-container">
            <div className="services-header-main">
                <div className="logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🛠️</span>
                    <span className="logo-service">Service</span>
                    <span className="logo-hub">Hub</span>
                </div>
                <div className="nav">
                    <button onClick={() => navigate('/services')}>Services</button>
                    <button onClick={() => navigate('/bookings')}>Bookings</button>
                    <button onClick={() => navigate('/reviews')}>Reviews</button>
                    <button onClick={() => navigate('/chat')}>Chat</button>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="services-content">
                <div className="services-header-section">
                    <h1>Available Services</h1>
                    {userRole === 'provider' && (
                        <button className="manage-services-btn" onClick={() => {
                            setEditingService(null);
                            setFormData({ title: '', description: '', price: '', icon: '🔧' });
                            setShowModal(true);
                        }}>
                            + Add New Service
                        </button>
                    )}
                </div>

                <div className="services-grid">
                    {services.length === 0 ? (
                        <div className="no-services">
                            <p>No services available yet.</p>
                            {userRole === 'provider' && (
                                <button onClick={() => setShowModal(true)}>Add Your First Service</button>
                            )}
                        </div>
                    ) : (
                        services.map((service) => (
                            <div key={service.id} className="service-card">
                                <div className="service-icon-large">
                                    {service.icon || getIconForService(service.title)}
                                </div>
                                <h2>{service.title}</h2>
                                <p className="service-description">{service.description}</p>
                                <div className="service-price">₹{service.price}</div>

                                {/* {userRole === 'customer' ? (
                                    <button className="book-now-btn" onClick={() => handleBookNow(service.id)}>
                                        BOOK NOW →
                                    </button> */}







                                {userRole === 'customer' ? (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        <button className="book-now-btn"
                                            onClick={() => handleBookNow(service.id)}>
                                            BOOK NOW →
                                        </button>
                                        <button className="chat-btn"
                                            onClick={() => handleChatWithProvider(service)}>
                                            Chat
                                        </button>
                                    </div>







                                ) : userRole === 'provider' ? (
                                    <div className="service-actions">
                                        <button className="edit-btn" onClick={() => handleEdit(service)}>
                                            ✏️ Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(service.id)}>
                                            🗑️ Delete
                                        </button>
                                    </div>
                                ) : (
                                    <button className="book-now-btn" onClick={() => handleBookNow(service.id)}>
                                        BOOK NOW →
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {userRole === 'provider' && showModal && (
                <div className="modal-overlay" onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Service Name"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows="3"
                            />
                            <input
                                type="number"
                                placeholder="Price (₹)"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <select
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            >
                                <option value="🔧">🔧 Plumbing</option>
                                <option value="⚡">⚡ Electrical</option>
                                <option value="🏠">🏠 Home Service</option>
                                <option value="🧹">🧹 Cleaning</option>
                                <option value="💅">💅 Beauty</option>
                                <option value="🎨">🎨 Painting</option>
                                <option value="🪚">🪚 Carpentry</option>
                                <option value="❄️">❄️ AC Service</option>
                                <option value="🧼">🧼 Carpet Cleaning</option>
                                <option value="📦">📦 Other</option>
                            </select>
                            <div className="modal-buttons">
                                <button type="submit" className="save-btn">
                                    {editingService ? 'Update' : 'Create'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => {
                                    setShowModal(false);
                                    setEditingService(null);
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Services;