import api from './axios';

export const productApi = {
  getAll: (page = 0, size = 12) => api.get(`/product/all?page=${page}&size=${size}`),
  getById: (id) => api.get(`/product/getProductId/${id}`),
  create: (data) => api.post('/product/addProduct', data),
  update: (id, data) => api.put(`/product/update/${id}`, data),
  delete: (id) => api.delete(`/product/delete/${id}`),
};
