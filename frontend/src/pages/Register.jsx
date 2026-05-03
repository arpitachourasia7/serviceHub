
import { useState } from 'react';
import api from '../services/api';
import './Register.css';

function Register({ onSuccess, onSwitchToLogin, onClose }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        role: 'customer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordPolicy = '';

    const isStrongPassword = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.username.trim()) {
            setError('Username is required');
            setLoading(false);
            return;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            setLoading(false);
            return;
        }
        if (!formData.password) {
            setError('Password is required');
            setLoading(false);
            return;
        }
        if (!isStrongPassword(formData.password)) {
            setError(passwordPolicy);
            setLoading(false);
            return;
        }
        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const registrationData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password2: formData.password2,
                role: formData.role
            };

            console.log('Sending registration data:', registrationData);
            const response = await api.post('/users/register/', registrationData);
            console.log('Registration success:', response.data);

            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('user_role', response.data.user?.role || formData.role);
                localStorage.setItem('user_id', response.data.user?.id);
                localStorage.setItem('username', response.data.user?.username || formData.username);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                window.location.href = '/';
            }
        } catch (err) {
            console.error('Registration error:', err.response?.data);

            // Show detailed error message
            if (err.response?.data) {
                const errorData = err.response.data;
                if (typeof errorData === 'object') {
                    const messages = [];
                    for (const [key, value] of Object.entries(errorData)) {
                        if (Array.isArray(value)) {
                            messages.push(`${key}: ${value.join(', ')}`);
                        } else {
                            messages.push(`${key}: ${value}`);
                        }
                    }
                    setError(messages.join(', '));
                } else {
                    setError(errorData.detail || errorData.error || 'Registration failed');
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-modal-container">
            {onClose && (
                <button className="register-modal-close-btn" onClick={onClose}>×</button>
            )}
            <h2>Create Account</h2>
            <p className="register-subtitle">Join ServiceHub as a Customer or Provider</p>
            {error && <div className="register-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <div className="register-password-policy">{passwordPolicy}</div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.password2}
                    onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                    required
                />
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                    <option value="customer">Customer - Book Services</option>
                    <option value="provider">Service Provider - Offer Services</option>
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
            <p className="register-footer">
                Already have an account? <button type="button" onClick={onSwitchToLogin} className="register-link-btn">Login here</button>
            </p>
        </div>
    );
}

export default Register;