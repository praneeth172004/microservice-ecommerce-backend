import api from './axios';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),

  // Admin
  adminCreateUser: (data) => api.post('/auth/admin/create', data),
  getAllUsers: () => api.get('/auth/users'),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  changeRole: (id, role) => api.put(`/auth/users/${id}/role`, { role }),
  toggleStatus: (id) => api.put(`/auth/users/${id}/status`),
};
