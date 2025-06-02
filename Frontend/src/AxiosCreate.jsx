import axios from "axios";

// Function to get the token from localStorage dynamically
const getTokenFromLocalStorage = () => {
  const persistedLoginData = localStorage.getItem("persist:logindata");
  const loginData = persistedLoginData ? JSON.parse(persistedLoginData) : {};

  // Accessing the token directly from LoginInfo
  const loginInfo = loginData.userlogin ? JSON.parse(loginData.userlogin).LoginInfo[0] : null;


  // Return the token or empty string if not available
  return loginInfo ? loginInfo.token : '';
};




const SampleUrl = 'https://studentsmangement.onrender.com';
// https://studentsmangement.onrender.com
// http://localhost:5000 
// Create the basic axios request instance
export const basicRequest = axios.create({
  baseURL: SampleUrl
});

// Create the axios request instance for authenticated requests
export const TokenRequest = axios.create({
  baseURL: SampleUrl,
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` } // Dynamically get the token
});

