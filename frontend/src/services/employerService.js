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

export const getAllLeaveRequests = async (status = '') => {
  const response = await axiosInstance.get('/employer/leave-requests', { params: { status } });
  return response.data;
};

export const getLeaveRequestById = async (id) => {
  const response = await axiosInstance.get(`/employer/leave-requests/${id}`);
  return response.data;
};

export const reviewRequest = async (id, status) => {
  const response = await axiosInstance.put(`/employer/leave-requests/${id}`, { status });
  return response.data;
};

export const deleteLeaveRequest = async (id) => {
  const response = await axiosInstance.delete(`/employer/leave-requests/${id}`);
  return response.data;
};