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

export const getDepartments = async () => {
  const response = await axiosInstance.get('/departments');
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await axiosInstance.post('/departments', data);
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await axiosInstance.put(`/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await axiosInstance.delete(`/departments/${id}`);
  return response.data;
};