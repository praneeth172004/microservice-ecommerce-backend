import api from './axios';

export const cartApi = {
  get: (userId) => api.get(`/cart/item/${userId}`),
  add: (userId, data) => api.post(`/cart/addCart/${userId}`, data),
  update: (userId, data) => api.put(`/cart/itemupdate/${userId}`, data),
  removeItem: (userId, productId) => api.delete(`/cart/${userId}/item/${productId}`),
  clear: (userId) => api.delete(`/cart/${userId}`),
};
