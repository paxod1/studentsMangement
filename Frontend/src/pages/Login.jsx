import React, { useState } from 'react'
import './login.css';
import { Link } from 'react-router-dom';
import { loginUser } from '../API/ApiCalling';
import { useDispatch } from 'react-redux'


function Login() {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const dispatch = useDispatch()


  async function APIcallLogin() {

    await loginUser({ username, password }, dispatch)
  }

  return (
    <div>
      <div className="login-container">
        <div className="login-box">
          <div className="login-logo">
            <img src="../../public/logo (1).png" width={'250px'} height={'150px'} alt="" />
          </div>

          <input
            className="login-input"
            type="text"
            placeholder="email"
            onChange={((e) => setUsername(e.target.value))}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            onChange={((e) => setPassword(e.target.value))}
          />
          <button className="login-button" onClick={APIcallLogin}>Log In</button>

        </div>
      </div>
    </div>
  )
}

export default Login