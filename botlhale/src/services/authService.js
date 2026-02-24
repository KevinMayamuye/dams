import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const registerUser = (data) =>
  axios.post(`${BASE_URL}/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${BASE_URL}/auth/login`, data);

export const getProfile = (token) =>
  axios.get(`${BASE_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
