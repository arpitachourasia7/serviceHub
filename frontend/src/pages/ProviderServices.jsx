// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import './Services.css';

// function ProviderServices() {
//     const [services, setServices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [editingService, setEditingService] = useState(null);
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         price: '',
//         category: ''
//     });
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchServices();
//     }, []);

//     const fetchServices = async () => {
//         setLoading(true);
//         try {
//             const response = await api.get('/services/');
//             setServices(response.data.results || response.data);
//         } catch (err) {
//             console.error('Error fetching services:', err);
//             setError('Unable to load services.');
//             setTimeout(() => setError(''), 3000);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getIcon = (title) => {
//         const icons = {
//             Electrical: '⚡',
//             Plumbing: '🔧',
//             'House Cleaning': '🧹',
//             'AC Cleaning': '❄️'
//         };
//         return icons[title] || '🛠️';
//     };

//     const getBgColor = (title) => {
//         const colors = {
//             Electrical: '#fff3e0',
//             Plumbing: '#e3f2fd',
//             'House Cleaning': '#e8f5e9',
//             'AC Cleaning': '#fce4ec'
//         };
//         return colors[title] || '#f8f9fa';
//     };

//     const resetForm = () => {
//         setFormData({
//             title: '',
//             description: '',
//             price: '',
//             category: ''
//         });
//         setEditingService(null);
//         setError('');
//         setSuccess('');
//     };

//     const openAddModal = () => {
//         resetForm();
//         setShowModal(true);
//     };

//     const openEditModal = (service) => {
//         setEditingService(service);
//         setFormData({
//             title: service.title || '',
//             description: service.description || '',
//             price: service.price || '',
//             category: service.category || '',
//         });
//         setError('');
//         setSuccess('');
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         resetForm();
//         setShowModal(false);
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         // Validation
//         if (!formData.title.trim()) {
//             setError('Service title is required');
//             return;
//         }
//         if (!formData.description.trim()) {
//             setError('Service description is required');
//             return;
//         }
//         if (!formData.price || formData.price <= 0) {
//             setError('Valid price is required');
//             return;
//         }

//         try {
//             if (editingService) {
//                 // Update existing service
//                 await api.put(`/services/${editingService.id}/`, formData);
//                 setSuccess('Service updated successfully!');
//             } else {
//                 // Create new service
//                 await api.post('/services/', formData);
//                 setSuccess('Service created successfully!');
//             }

//             // Refresh the services list
//             await fetchServices();

//             // Close modal after 1 second
//             setTimeout(() => {
//                 closeModal();
//                 setSuccess('');
//             }, 1000);

//         } catch (err) {
//             console.error('Error saving service:', err);
//             setError(err.response?.data?.message || 'Failed to save service. Please try again.');
//         }
//     };

//     const handleDelete = async (serviceId) => {
//         if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
//             try {
//                 await api.delete(`/services/${serviceId}/`);
//                 setSuccess('Service deleted successfully!');
//                 await fetchServices();
//                 setTimeout(() => setSuccess(''), 3000);
//             } catch (err) {
//                 console.error('Error deleting service:', err);
//                 setError('Failed to delete service. Please try again.');
//                 setTimeout(() => setError(''), 3000);
//             }
//         }
//     };

//     const logout = () => {
//         localStorage.clear();
//         window.location.href = '/';
//     };

//     if (loading) return <div className="services-loading">Loading services...</div>;

//     return (
//         <div className="services-page">
//             {/* Header - Same as Bookings */}
//             <div className="services-header">
//                 <div className="services-logo" onClick={() => navigate('/')}>
//                     <span className="logo-icon">🛠️</span>
//                     <span className="logo-text">Service<span>Hub</span></span>
//                 </div>
//                 <div className="services-nav">
//                     <button onClick={() => navigate('/services')} className="nav-btn">Services</button>
//                     <button onClick={() => navigate('/bookings')} className="nav-btn">Bookings</button>
//                     <button onClick={() => navigate('/reviews')} className="nav-btn">Reviews</button>
//                     <button onClick={() => navigate('/chat')} className="nav-btn">Chat</button>
//                     <button onClick={openAddModal} className="nav-add">+ Add Service</button>
//                     <button onClick={logout} className="nav-logout">Logout</button>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="services-container">
//                 {/* Top row - Removed the "Add New Service" button */}
//                 <div className="services-top-row">
//                     <h2 className="services-title">My Services</h2>
//                     {/* The "Add New Service" button has been removed from here */}
//                 </div>

//                 {/* Success/Error Messages */}
//                 {error && <div className="service-error">{error}</div>}
//                 {success && <div className="service-success">{success}</div>}

//                 {/* Services Grid */}
//                 <div className="services-grid">
//                     {services.length === 0 ? (
//                         <div className="services-empty">
//                             <div className="empty-icon">📦</div>
//                             <h3>No services yet</h3>
//                             <p>Click the "+ Add Service" button to create your first service.</p>
//                             <button onClick={openAddModal} className="btn-service-link">
//                                 + Add Your First Service
//                             </button>
//                         </div>
//                     ) : (
//                         services.map(service => (
//                             <div key={service.id} className="service-card" style={{ background: getBgColor(service.title) }}>
//                                 <div className="service-icon-large">{getIcon(service.title)}</div>
//                                 <h3 className="service-name">{service.title}</h3>
//                                 <p className="service-description">{service.description}</p>
//                                 <div className="service-price-section">
//                                     <span className="price-currency">₹</span>
//                                     <span className="price-amount">{service.price}</span>
//                                     <span className="price-unit">/hour</span>
//                                 </div>
//                                 <div className="service-card-meta">
//                                     <span className="category-badge">{service.category || 'General'}</span>
//                                 </div>
//                                 <div className="service-buttons">
//                                     <button onClick={() => openEditModal(service)} className="btn-edit">
//                                         ✏️ Edit
//                                     </button>
//                                     <button onClick={() => handleDelete(service.id)} className="btn-delete">
//                                         🗑️ Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* Modal Popup for Add/Edit Service */}
//             {showModal && (
//                 <div className="modal-overlay" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
//                             <button className="modal-close" onClick={closeModal}>×</button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="modal-form">
//                             <div className="form-group">
//                                 <label>Service Title *</label>
//                                 <input
//                                     type="text"
//                                     name="title"
//                                     value={formData.title}
//                                     onChange={handleChange}
//                                     placeholder="e.g., Plumbing, Electrical, House Cleaning"
//                                     required
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label>Description *</label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleChange}
//                                     placeholder="Describe your service in detail..."
//                                     rows="4"
//                                     required
//                                 />
//                             </div>

//                             <div className="form-row">
//                                 <div className="form-group">
//                                     <label>Price (₹) *</label>
//                                     <input
//                                         type="number"
//                                         name="price"
//                                         value={formData.price}
//                                         onChange={handleChange}
//                                         placeholder="0.00"
//                                         step="0.01"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="form-group">
//                                     <label>Category</label>
//                                     <select
//                                         name="category"
//                                         value={formData.category}
//                                         onChange={handleChange}
//                                     >
//                                         <option value="">Select Category</option>
//                                         <option value="Home">Home Services</option>
//                                         <option value="Electrical">Electrical</option>
//                                         <option value="Plumbing">Plumbing</option>
//                                         <option value="Cleaning">Cleaning</option>
//                                         <option value="Automotive">Automotive</option>
//                                         <option value="Beauty">Beauty & Wellness</option>
//                                         <option value="Other">Other</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             {error && <div className="form-error">{error}</div>}

//                             <div className="modal-actions">
//                                 <button type="submit" className="btn-submit">
//                                     {editingService ? 'Update Service' : 'Create Service'}
//                                 </button>
//                                 <button type="button" className="btn-cancel-modal" onClick={closeModal}>
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ProviderServices;


























import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderServices.css';

function ProviderServices() {
    const [services, setServices] = useState([
        {
            id: 1,
            name: 'Plumbing',
            description: 'Licensed plumbers for all repair needs. Fix leaks, unclog drains, install pipes. 1-hour service guarantee.',
            price: 450,
            icon: '🔧'
        },
        {
            id: 2,
            name: 'Electrical',
            description: 'Certified electricians for safety checks, wiring, switch repair. Fan and light installation. ISI parts. 1-year warranty.',
            price: 300,
            icon: '⚡'
        },
        {
            id: 3,
            name: 'Home Service',
            description: 'Expert handyman for all household repairs. Furniture assembly, AC installation, painting.',
            price: 600,
            icon: '🏠'
        },
        {
            id: 4,
            name: 'Cleaning',
            description: 'Deep cleaning for homes and offices. Bathroom, kitchen, sofa, carpet cleaning.',
            price: 600,
            icon: '🧹'
        },
        {
            id: 5,
            name: 'Beauty',
            description: 'Professional beauty services including makeup, hair styling, threading, and more.',
            price: 500,
            icon: '💅'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        icon: '🔧'
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingService) {
            setServices(services.map(service =>
                service.id === editingService.id
                    ? { ...service, ...formData, price: parseFloat(formData.price) }
                    : service
            ));
        } else {
            const newService = {
                id: Date.now(),
                ...formData,
                price: parseFloat(formData.price)
            };
            setServices([...services, newService]);
        }

        setShowModal(false);
        setEditingService(null);
        setFormData({ name: '', description: '', price: '', icon: '🔧' });
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            icon: service.icon
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setServices(services.filter(service => service.id !== id));
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="provider-services-container">
            {/* Header */}
            <div className="provider-header">
                <div className="logo" onClick={() => navigate('/')}>
                    🛠️ Service<span>Hub</span>
                </div>
                <div className="nav">
                    <button onClick={() => navigate('/services')}>Services</button>
                    <button onClick={() => navigate('/bookings')}>Bookings</button>
                    <button onClick={() => navigate('/reviews')}>Reviews</button>
                    <button onClick={() => navigate('/chat')}>Chat</button>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="provider-services-content">
                <div className="services-header-section">
                    <h1>Available Services</h1>
                    <button className="manage-services-btn" onClick={() => setShowModal(true)}>
                        + Manage Services
                    </button>
                </div>

                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-icon">{service.icon}</div>
                            <h2>{service.name}</h2>
                            <p className="service-description">{service.description}</p>
                            <div className="service-price">₹{service.price}/hour</div>
                            {/* EDIT AND DELETE BUTTONS - NO BOOK NOW BUTTON */}
                            <div className="service-actions">
                                <button className="edit-btn" onClick={() => handleEdit(service)}>
                                    ✏️ Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(service.id)}>
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Service Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price per hour (₹)"
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
                            </select>
                            <div className="modal-buttons">
                                <button type="submit" className="save-btn">
                                    {editingService ? 'Update' : 'Create'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
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

export default ProviderServices;