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
        navigate('/');
    };

    return (
        <div className="provider-services-container">
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