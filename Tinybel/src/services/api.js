import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);

export const getProfile = () =>
  axios.get(`${BASE_URL}/users/profile`, { headers: getAuthHeaders() });

export const getDoctors = () =>
  axios.get(`${BASE_URL}/doctors`, { headers: getAuthHeaders() });

export const createDoctor = (data) =>
  axios.post(`${BASE_URL}/doctors`, data, { headers: getAuthHeaders() });

export const getAvailableSlots = (doctorId, date) =>
  axios.get(`${BASE_URL}/bookings/available-slots`, {
    params: { doctorId, date },
  });

export const getBookings = (status) =>
  axios.get(`${BASE_URL}/bookings`, {
    params: status ? { status } : {},
    headers: getAuthHeaders(),
  });

export const createBooking = (data) =>
  axios.post(`${BASE_URL}/bookings`, data, { headers: getAuthHeaders() });

export const updateBooking = (id, status) =>
  axios.patch(`${BASE_URL}/bookings/${id}`, { status }, { headers: getAuthHeaders() });
