import api from './api';

const login = async (username, password) => {
  const response = await api.post('/auth/signin', {
    username,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const register = async (username, email, password, roles, categoryId) => {
  return api.post('/auth/signup', {
    username,
    email,
    password,
    roles,
    categoryId: categoryId ? parseInt(categoryId, 10) : null,
  });
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

const authService = {
  login,
  logout,
  register,
  getCurrentUser,
  getCategories,
};

export default authService;
