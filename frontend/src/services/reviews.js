import api from './api';

export const getReviews = () => {
    return api.get('/reviews/my-reviews/');
};

export const createReview = (bookingId, reviewData) => {
    return api.post(`/reviews/submit/${bookingId}/`, reviewData);
};