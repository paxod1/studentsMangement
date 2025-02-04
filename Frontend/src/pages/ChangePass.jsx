import React, { useState } from 'react';
import './login.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';

function ChangePass() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.userlogin?.LoginInfo[0]?.id); // Get user ID from Redux store

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setLoading(true); // Show spinner
    try {
      const response = await TokenRequest.post('/student/change-password', {
        userId,
        currentPassword,
        newPassword
      });

      toast.success(response.data.message); // Show success message
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong.");
      } else {
        toast.error("Network error. Please try again.");
      }
    }
    setLoading(false); // Hide spinner after API call
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src="https://techwingsys.com/tws-logo.png" width="250px" height="60px" alt="logo" style={{marginBottom:'10px'}} />
        </div>

        <input
          className="login-input"
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleChangePassword} disabled={loading}>
          {loading ? (
            <div className="loading-spinner_login">
              <div className="spinner_login"></div>
            </div>
          ) : (
            'Change Password'
          )}
        </button>
      </div>
      <div className="login-version">Version 1.0.0.0</div>
    </div>
  );
}

export default ChangePass;
