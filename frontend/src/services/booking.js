import api from './api';

export const getBookings = () => api.get('/bookings/');
export const createBooking = (data) => api.post('/bookings/', data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}/`);
export const getMyBookings = () => api.get('/bookings/my-bookings/');