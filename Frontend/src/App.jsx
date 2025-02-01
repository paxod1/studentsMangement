import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Home from './pages/Home';
import ClassVideo from './pages/ClassVideo';

function App() {
  const loginInfo = useSelector((state) => state.userlogin?.LoginInfo[0]);
  const token = loginInfo?.token;

  // Custom Route component to handle token-based routing
  const ProtectedRoute = ({ element }) => {
    return token ? element : <Navigate to="/login" />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute element={<Home />} />
    },
    {
      path: "/ClassVideo",
      element: <ProtectedRoute element={<ClassVideo />} />
    },
    {
      path: "*",  // Catch-all route for invalid paths
      element: <Navigate to="/" />
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
