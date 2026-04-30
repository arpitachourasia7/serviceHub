// import api from './api';

// export const getReviews = (serviceId) => api.get(`/reviews/?service=${serviceId}`);
// export const createReview = (data) => api.post('/reviews/', data);
// export const updateReview = (id, data) => api.put(`/reviews/${id}/`, data);
// export const deleteReview = (id) => api.delete(`/reviews/${id}/`);









// import api from './api';

// export const getReviews = () => {
//     return api.get('/reviews/my-reviews/');
// };

// export const createReview = (bookingId, reviewData) => {
//     return api.post(`/reviews/submit/${bookingId}/`, reviewData);
// };

// export const updateReview = (id, data) => api.put(`/reviews/${id}/`, data);
// export const deleteReview = (id) => api.delete(`/reviews/${id}/`);






import api from './api';

export const getReviews = () => {
    return api.get('/reviews/my-reviews/');
};

export const createReview = (bookingId, reviewData) => {
    return api.post(`/reviews/submit/${bookingId}/`, reviewData);
};