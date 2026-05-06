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

export const submitLeaveRequest = async (data) => {
  const response = await axiosInstance.post('/employee/leave-requests', data);
  return response.data;
};

export const getMyLeaveRequests = async () => {
  const response = await axiosInstance.get('/employee/leave-requests');
  return response.data;
};