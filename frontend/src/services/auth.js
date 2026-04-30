import api from './api';

export const login = (credentials) => api.post('/users/login/', credentials);
export const register = (userData) => api.post('/users/register/', userData);
export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};
export const getProfile = () => api.get('/users/profile/');