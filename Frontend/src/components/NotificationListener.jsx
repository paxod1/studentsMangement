import React, { useEffect, useState } from 'react';

function NotificationListener() {
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    // Step 1: Ask for permission once
    if ("Notification" in window && Notification.permission === "default" && !permissionRequested) {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
        setPermissionRequested(true);
      });
    }

    // Step 2: Simulated fetch logic (replace this with your API call)
    const interval = setInterval(async () => {
      // --- Mock fetch for demo (replace with real API call) ---
      const latestMessage = {
        id: "announcement-001",
        message: "🎉 New class is uploaded!",
      };

      // Step 3: Prevent duplicate notifications using localStorage
      const lastSeenId = localStorage.getItem("lastSeenAnnouncementId");

      if (latestMessage.id !== lastSeenId && Notification.permission === "granted") {
        new Notification("📢 New Announcement", {
          body: latestMessage.message,
          icon: "/logo192.png", // Optional icon
        });

        localStorage.setItem("lastSeenAnnouncementId", latestMessage.id);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [permissionRequested]);

  return null; // This component is invisible
}

export default NotificationListener;
