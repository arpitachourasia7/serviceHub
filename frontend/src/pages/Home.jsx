import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Register from './Register';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showLogin || showRegister) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showLogin, showRegister]);

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const openLogin = () => {
        setError('');
        setShowLogin(true);
        setShowRegister(false);
    };

    const closeLogin = () => {
        setShowLogin(false);
        setUsername('');
        setPassword('');
        setError('');
        setLoading(false);
    };

    const openRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const closeRegister = () => {
        setShowRegister(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/users/login/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user_role', response.data.user?.role || 'customer');
            localStorage.setItem('user_id', response.data.user?.id);
            localStorage.setItem('username', response.data.user?.username || username);
            closeLogin();

            const userRole = response.data.user?.role || 'customer';
            if (userRole === 'provider') {
                navigate('/services');
            } else {
                navigate('/services');
            }

        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSuccess = () => {
        closeRegister();
        window.location.href = '/';
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <div className="home-logo">
                    <span className="logo-icon">🛠️</span>
                    <span className="logo-text">Service<span>Hub</span></span>
                </div>
                <div className="home-nav">
                    <button
                        onClick={() => {
                            if (token) {
                                const role = localStorage.getItem('user_role');
                                if (role === 'provider') {
                                    navigate('/services');
                                } else {
                                    navigate('/services');
                                }
                            } else {
                                openLogin();
                            }
                        }}
                        className="nav-link"
                    >
                        Services
                    </button>


                    {token ? (
                        <button onClick={logout} className="nav-link nav-logout">Logout</button>
                    ) : (
                        <>
                            <button onClick={openLogin} className="nav-link">Login</button>
                            <button onClick={openRegister} className="nav-link nav-register">Register</button>
                        </>
                    )}
                </div>
            </div>

            <div className="home-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Home services at your doorstep</h1>
                    <p className="hero-subtitle">Book trusted professionals for cleaning, repair, beauty and more.</p>
                    <div className="hero-buttons">
                        <button
                            onClick={() => {
                                if (token) {
                                    const role = localStorage.getItem('user_role');
                                    if (role === 'provider') {
                                        navigate('/services');
                                    } else {
                                        navigate('/services');
                                    }
                                } else {
                                    openLogin();
                                }
                            }}
                            className="hero-book-btn"
                        >
                            Book a Service →
                        </button>

                        <button onClick={openRegister} className="hero-partner-btn">
                            Become a Partner →
                        </button>
                    </div>
                </div>
            </div>

            <div className="home-services">
                <h2 className="services-title">Popular Services</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">🔧</div>
                        <h3>Plumbing</h3>
                        <p>Expert plumbing services for leaks, clogs & installations</p>
                        <button
                            onClick={() => {
                                if (token) {
                                    const role = localStorage.getItem('user_role');
                                    if (role === 'provider') {
                                        navigate('/services');
                                    } else {
                                        navigate('/services');
                                    }
                                } else {
                                    openLogin();
                                }
                            }}
                            className="service-btn"
                        >
                            Book Now →
                        </button>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">⚡</div>
                        <h3>Electrical</h3>
                        <p>Professional electrical repairs & installations</p>
                        <button
                            onClick={() => {
                                if (token) {
                                    const role = localStorage.getItem('user_role');
                                    if (role === 'provider') {
                                        navigate('/provider/services');
                                    } else {
                                        navigate('/services');
                                    }
                                } else {
                                    openLogin();
                                }
                            }}
                            className="service-btn"
                        >
                            Book Now →
                        </button>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">🧹</div>
                        <h3>House Cleaning</h3>
                        <p>Complete home cleaning services</p>
                        <button
                            onClick={() => {
                                if (token) {
                                    const role = localStorage.getItem('user_role');
                                    if (role === 'provider') {
                                        navigate('/services');
                                    } else {
                                        navigate('/services');
                                    }
                                } else {
                                    openLogin();
                                }
                            }}
                            className="service-btn"
                        >
                            Book Now →
                        </button>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">❄️</div>
                        <h3>AC Cleaning</h3>
                        <p>Professional AC cleaning & maintenance</p>
                        <button
                            onClick={() => {
                                if (token) {
                                    const role = localStorage.getItem('user_role');
                                    if (role === 'provider') {
                                        navigate('/services');
                                    } else {
                                        navigate('/services');
                                    }
                                } else {
                                    openLogin();
                                }
                            }}
                            className="service-btn"
                        >
                            Book Now →
                        </button>
                    </div>
                </div>
            </div>

            {showLogin && (
                <div className="login-modal-overlay" onClick={closeLogin}>
                    <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="login-modal-header">
                            <div className="login-modal-title">Login to ServiceHub</div>
                            <button className="login-close" onClick={closeLogin}>×</button>
                        </div>
                        <p className="login-modal-subtitle">Enter your username and password to continue.</p>
                        {error && <div className="login-error">{error}</div>}
                        <form className="login-form" onSubmit={handleLogin}>
                            <label>
                                Username
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    required
                                />
                            </label>
                            <label>
                                Password
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                            </label>
                            <button type="submit" className="hero-book-btn login-submit" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>
                        <div className="login-footer">
                            Don't have an account? <button type="button" onClick={openRegister} className="login-link-btn">Register here</button>
                        </div>
                    </div>
                </div>
            )}

            {showRegister && (
                <div className="register-modal-overlay" onClick={closeRegister}>
                    <div className="register-modal-content" onClick={(e) => e.stopPropagation()}>
                        <Register
                            onSuccess={handleRegisterSuccess}
                            onSwitchToLogin={openLogin}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;