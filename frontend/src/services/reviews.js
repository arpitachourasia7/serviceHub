// import api from './api';

// export const getReviews = (serviceId) => api.get(`/reviews/?service=${serviceId}`);
// export const createReview = (data) => api.post('/reviews/', data);
// export const updateReview = (id, data) => api.put(`/reviews/${id}/`, data);
// export const deleteReview = (id) => api.delete(`/reviews/${id}/`);









// src/services/reviews.js
import api from './api';

export const getReviews = (serviceId = null) => {
    if (serviceId) {
        return api.get(`/reviews/?service=${serviceId}`);
    }
    return api.get('/reviews/');
};

export const createReview = (data) => api.post('/reviews/', data);
export const updateReview = (id, data) => api.put(`/reviews/${id}/`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}/`);