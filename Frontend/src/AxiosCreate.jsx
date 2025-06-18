import axios from "axios";

// Function to get the token from localStorage dynamically
const getTokenFromLocalStorage = () => {
  const persistedLoginData = localStorage.getItem("persist:logindata");
  const loginData = persistedLoginData ? JSON.parse(persistedLoginData) : {};
  const loginInfo = loginData.userlogin ? JSON.parse(loginData.userlogin).LoginInfo[0] : null;

  return loginInfo ? loginInfo.token : '';
};

// Base URL for both instances
const SampleUrl = 'https://studentsmangement.onrender.com';
// https://studentsmangement.onrender.com
// http://localhost:5000

// Basic request (no token needed)
export const basicRequest = axios.create({
  baseURL: SampleUrl
});

// Token request instance
export const 
TokenRequest = axios.create({
  baseURL: SampleUrl
});

// ✅ Add request interceptor to TokenRequest
TokenRequest.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
