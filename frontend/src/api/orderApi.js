import api from './axios';

export const orderApi = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};
