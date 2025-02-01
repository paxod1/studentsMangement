import React, { useState, useEffect } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../API/ApiCalling';
import { useDispatch, useSelector } from 'react-redux';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginInfo = useSelector((state) => state.userlogin?.LoginInfo); // Access login state from Redux

  useEffect(() => {
    if (loginInfo?.token) {
      navigate('/');  
    }
  }, [loginInfo, navigate]); 

  async function handleLogin() {
    const success = await loginUser({ username, password }, dispatch,navigate);
    if (success) {
      navigate('/');  
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src="../../public/logo (1).png" width="250px" height="150px" alt="" />
        </div>

        <input
          className="login-input"
          type="text"
          placeholder="Email"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
}

export default Login;
