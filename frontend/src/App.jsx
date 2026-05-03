import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Services from './pages/Services';
import Bookings from './pages/Bookings';
import Reviews from './pages/Reviews';
import Chat from './pages/Chat';
import ProviderServices from './pages/ProviderServices';


function PrivateRoute({ children, providerOnly = false }) {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');

  if (!token) return <Navigate to="/" replace />;
  if (providerOnly && role !== 'provider') return <Navigate to="/services" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
        <Route path="/provider/services" element={<PrivateRoute><ProviderServices /></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
        <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;