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

export const getLeaveTypes = async () => {
  const response = await axiosInstance.get('/leave-types');
  return response.data;
};

export const createLeaveType = async (data) => {
  const response = await axiosInstance.post('/leave-types', data);
  return response.data;
};

export const updateLeaveType = async (id, data) => {
  const response = await axiosInstance.put(`/leave-types/${id}`, data);
  return response.data;
};

export const deleteLeaveType = async (id) => {
  const response = await axiosInstance.delete(`/leave-types/${id}`);
  return response.data;
};