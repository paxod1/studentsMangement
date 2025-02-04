import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import ClassVideo from './pages/ClassVideo';
import { ToastContainer } from 'react-toastify';
import ChangePass from './pages/ChangePass';

function App() {

  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
  console.log("from app.js logininfom", logininfom);




  const token = logininfom?.token;
  

  const app = createBrowserRouter([
    {
      path: "/",
      element: token ? <Home /> : <Login />
    },
    {
      path: "/ClassVideo",
      element: token ? <ClassVideo /> : <Login />

    },
    {
      path: "/ChangePass",
      element: token ? <ChangePass /> : <Login />

    }
  ])
  return (
    <div>
      <RouterProvider router={app} />
      <ToastContainer />
    </div>
  )
}

export default App