import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
API.interceptors.request.use(req => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const addProperty = (data) => API.post('/properties', data);
export const getProperties = () => API.get('/properties');
export const addTenant = (data) => API.post('/tenants', data);
export const getTenants = (propertyId) => API.get(`/tenants/${propertyId}`);
export const fetchSchedules = (tenantId) => API.get(tenantId?`/schedules/${tenantId}`:'/schedules');
export const updateScheduleStatus = (id, status) => API.patch(`/schedules/${id}`, { status });
