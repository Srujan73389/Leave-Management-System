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

export const getEmployees = async () => {
  const response = await axiosInstance.get('/employees');
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await axiosInstance.post('/employees', data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await axiosInstance.put(`/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axiosInstance.delete(`/employees/${id}`);
  return response.data;
};

export const viewEmployeePassword = async (id, adminPassword) => {
  const response = await axiosInstance.post(`/employees/${id}/view-password`, { adminPassword });
  return response.data;
};