import axios from "../api/axios";

const API_URL = "http://localhost:5000/api/auth/"; 

// Register
export const register = async (userData) => {
  const res = await axios.post(API_URL + "register", userData);
  return res.data;
};

// Login
export const login = async (userData) => {
  const res = await axios.post(API_URL + "login", userData);

  if (res.data.token) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }

  return res.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
