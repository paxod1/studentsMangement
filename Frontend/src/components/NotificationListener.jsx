import { useEffect } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const NotificationHandler = ({ userId }) => {
  useEffect(() => {
    // Request notification permission
    const requestNotificationPermission = async () => {
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          console.log('Notification permission:', permission);
        } catch (error) {
          console.error('Error requesting notification permission:', error);
        }
      }
    };

    requestNotificationPermission();

    // Connect to Socket.io server
    const socket = io('https://studentsmangement.onrender.com', {
      withCredentials: true,
      transports: ['websocket']
    });

    // Register user with their ID
    if (userId) {
      socket.emit('register-user', userId);
    }

    // Listen for notifications
    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      
      // Show toast notification
      toast[data.type || 'info'](data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(data.title || 'New Notification', {
          body: data.message,
          icon: '/logo192.png' // Your app icon
        });
      }
    });

    // Handle connection errors
    socket.on('connect_error', (err) => {
      console.log('Socket connection error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return null; // This component doesn't render anything
};

export default NotificationHandler;