// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import UserProtect from './components/UserProtect';
import Home from './pages/Home';
import ClassVideo from './pages/ClassVideo';
import ChangePass from './pages/ChangePass';
import Aptitude from './pages/Aptitude';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path='/' element={<Login />} />

          {/* Protected Routes Wrapper */}
          <Route element={<UserProtect />}>
            <Route path='/home' element={<Home />} />
            <Route path='/ClassVideo' element={<ClassVideo />} />
            <Route path='/ChangePass' element={<ChangePass />} />
            <Route path='/Aptitude' element={<Aptitude />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer />
    </div>
  );
}

export default App;
