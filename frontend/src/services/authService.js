import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password, role) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password, role });
  return response.data;
};

export const register = async (name, email, password, position, role) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
    position,
    role
  });
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axiosInstance.put('/employer/change-password', data);
  return response.data;
};