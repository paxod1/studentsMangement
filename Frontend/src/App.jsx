import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Home from './pages/Home';
import ClassVideo from './pages/ClassVideo';

function App() {
  const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
  console.log("from app.js logininfom", logininfom);

  const token = logininfom?.token;

  // Setting up routing paths
  const app = createBrowserRouter([
    {
      path: "/login", // Login page path
      element: token ? <Home /> : <Login /> // Redirect to Home if already logged in
    },
    {
      path: "/", // Home page path
      element: token ? <Home /> : <Login /> // Redirect to Login if not logged in
    },
    {
      path: "/ClassVideo",
      element: token ? <ClassVideo /> : <Login /> // Conditional rendering based on login
    },
  ]);

  return (
    <div>
      <RouterProvider router={app} />
    </div>
  );
}

export default App;
