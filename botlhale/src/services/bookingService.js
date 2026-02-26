import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getDoctors = (token) =>
  axios.get(`${BASE_URL}/doctors`, authHeaders(token));

export const getAvailableSlots = (doctorId, date) =>
  axios.get(`${BASE_URL}/bookings/available-slots`, {
    params: { doctorId, date },
  });

export const createBooking = (data, token) =>
  axios.post(`${BASE_URL}/bookings`, data, authHeaders(token));

export const getMyBookings = (token) =>
  axios.get(`${BASE_URL}/bookings`, authHeaders(token));
