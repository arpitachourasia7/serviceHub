import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({ services: 0, bookings: 0, completed: 0, messages: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [servicesRes, bookingsRes] = await Promise.all([
                api.get('/services/'),
                api.get('/bookings/').catch(() => ({ data: [] }))
            ]);
            const bookings = bookingsRes.data.results || bookingsRes.data;
            const completedCount = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').length;

            setStats({
                services: (servicesRes.data.results || servicesRes.data).length,
                bookings: bookings.length,
                completed: completedCount,
                messages: 0
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

    return (
        <div className="dashboard-frame">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <div className="sb-logo">
                    <div className="sb-logo-icon">🛠️</div>
                    <div className="sb-logo-name">Service<span>Hub</span></div>
                </div>

                <div className="sb-nav">
                    <div className="nav-section">MAIN MENU</div>
                    <div className="nav-item active" onClick={() => navigate('/dashboard')}>
                        <span className="nav-icon">◈</span>
                        <span>Dashboard</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/services')}>
                        <span className="nav-icon">🔍</span>
                        <span>Browse Services</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/bookings')}>
                        <span className="nav-icon">📋</span>
                        <span>My Bookings</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/reviews')}>
                        <span className="nav-icon">⭐</span>
                        <span>Reviews</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/chat')}>
                        <span className="nav-icon">💬</span>
                        <span>Messages</span>
                    </div>
                </div>

                <div className="sb-footer">
                    <div className="nav-item logout" onClick={logout}>
                        <span className="nav-icon">🚪</span>
                        <span>Sign Out</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
                <div className="dashboard-topbar">
                    <div className="tb-title">Dashboard</div>
                    <div className="tb-right">
                        <button className="topbar-register" onClick={() => navigate('/register')}>✨ Register</button>
                        <button className="topbar-login" onClick={() => navigate('/login')}>🔐 Login</button>
                    </div>
                </div>

                <div className="dashboard-content">
                    {/* Welcome Card */}
                    <div className="welcome-card">
                        <div className="deco-circle1"></div>
                        <div className="deco-circle2"></div>
                        <div className="deco-circle3"></div>
                        <div className="wc-top">
                            <div>
                                <div className="wc-title">🌟 Welcome to <span>ServiceHub</span></div>
                                <div className="wc-sub">Your trusted marketplace for professional services</div>
                            </div>
                        </div>
                        <div className="wc-actions">
                            <button className="btn-gold" onClick={() => navigate('/services')}>🔍 Browse Services</button>
                            <button className="btn-blue" onClick={() => navigate('/bookings')}>📋 My Bookings</button>
                            <button className="btn-green" onClick={() => navigate('/chat')}>💬 Messages</button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="stats-row">
                        <div className="stat-card stat-card-1">
                            <div className="stat-accent">
                                <span>📦</span>
                            </div>
                            <div className="stat-val">{stats.services}</div>
                            <div className="stat-lbl">Total Services</div>
                            <div className="stat-trend">+12% this week</div>
                        </div>
                        <div className="stat-card stat-card-2">
                            <div className="stat-accent">
                                <span>📅</span>
                            </div>
                            <div className="stat-val">{stats.bookings}</div>
                            <div className="stat-lbl">My Bookings</div>
                            <div className="stat-trend">+3 new</div>
                        </div>
                        <div className="stat-card stat-card-3">
                            <div className="stat-accent">
                                <span>✓</span>
                            </div>
                            <div className="stat-val">{stats.completed}</div>
                            <div className="stat-lbl">Completed</div>
                            <div className="stat-trend">Great job!</div>
                        </div>
                        <div className="stat-card stat-card-4">
                            <div className="stat-accent">
                                <span>💬</span>
                            </div>
                            <div className="stat-val">{stats.messages}</div>
                            <div className="stat-lbl">Messages</div>
                            <div className="stat-trend">Check inbox</div>
                        </div>
                    </div>

                    {/* Decorative Banner */}
                    <div className="decorative-banner">
                        <div className="banner-content">
                            <span className="banner-icon">🎉</span>
                            <div className="banner-text">
                                <strong>Special Offer!</strong> Get 20% off on your first booking
                            </div>
                            <button className="banner-btn">Claim Now →</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;