import api from './api';

// Providers
const getProviders = () => api.get('/providers');
const getProvidersByCategory = (categoryId) => api.get(`/providers/category/${categoryId}`);

// Categories
const getCategories = () => api.get('/categories');

// Bookings
const getCustomerBookings = (customerId) => api.get(`/bookings/customer/${customerId}`);
const getProviderBookings = (providerId) => api.get(`/bookings/provider/${providerId}`);
const createBooking = (data) => api.post('/bookings', data);
const updateBookingStatus = (bookingId, status) => api.put(`/bookings/${bookingId}/status?status=${status}`);
const payBooking = (bookingId, data) => api.put(`/bookings/${bookingId}/pay`, data);

// Reviews
const getProviderReviews = (providerId) => api.get(`/reviews/provider/${providerId}`);
const createReview = (data) => api.post('/reviews', data);

const deleteAccount = (id, password) => {
  return api.delete(`/users/${id}`, { data: { password } });
};

const dataService = {
  getProviders,
  getProvidersByCategory,
  getCategories,
  getCustomerBookings,
  getProviderBookings,
  createBooking,
  updateBookingStatus,
  payBooking,
  getProviderReviews,
  createReview,
};

export default dataService;
