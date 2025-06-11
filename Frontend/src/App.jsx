import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserProtect from './components/UserProtect';
import Home from './pages/Home';
import ClassVideo from './pages/ClassVideo';
import ChangePass from './pages/ChangePass';
import Aptitude from './pages/Aptitude';
import Login from './pages/Login';
import TaskReply from './components/TaskReply';

import { useSelector } from 'react-redux'; // Add this to get user ID
import NotificationHandler from './components/NotificationListener';

function App() {

  const loginInfo = useSelector((state) => state.userlogin?.LoginInfo[0]);

  return (
    <div>
      {/* Add NotificationHandler with user ID */}
      <NotificationHandler userId={loginInfo.student_id} />

      <Router>
        <Routes>
          {/* Public Route */}
          <Route path='/login' element={<Login />} />

          {/* Protected Routes Wrapper */}
          <Route element={<UserProtect />}>
            <Route path='/' element={<Home />} />
            <Route path='/ClassVideo' element={<ClassVideo />} />
            <Route path='/ChangePass' element={<ChangePass />} />
            <Route path='/Aptitude' element={<Aptitude />} />
            <Route path='/TaskReply' element={<TaskReply />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer />
    </div>
  );
}

export default App;