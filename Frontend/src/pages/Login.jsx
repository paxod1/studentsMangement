import React, { useState, useEffect } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../API/ApiCalling';
import { useDispatch, useSelector } from 'react-redux';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginInfo = useSelector((state) => state.userlogin?.LoginInfo);

  useEffect(() => {
    if (loginInfo?.token) {
      navigate('/');
    }
  }, [loginInfo, navigate]);

  async function handleLogin() {
    setLoading(true); // Show spinner
    await loginUser({ username, password }, dispatch, navigate);
    setLoading(false); // Hide spinner after API call
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src="https://techwingsys.com/tws-logo.png" width="250px" height="60px" alt="logo" style={{marginBottom:'10px'}}  />
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
        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <div className="loading-spinner_login">
              <div className="spinner_login"></div>
            </div>
          ) : (
            'Log In'
          )}
        </button>
      </div>
      <div className="login-version">Version 1.0.0.0</div>
    </div>
  );
}

export default Login;
