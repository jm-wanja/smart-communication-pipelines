import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { io } from 'socket.io-client';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Deals from './pages/Deals';
import ClientReport from './pages/ClientReport';
import InternalFeedback from './pages/InternalFeedback';
import AddDeal from './pages/AddDeal';
import EditDeal from './pages/EditDeal';
import Clients from './pages/Clients';

// Initialize socket connection
const socket = io('http://localhost:5001', {
  withCredentials: true,
});

function App() {
  const [open, setOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    // Socket event listeners for real-time updates
    socket.on('deal_created', (data) => {
      addNotification(`New deal created: ${data.title}`);
    });

    socket.on('deal_updated', (data) => {
      addNotification(`Deal updated: ${data.title}`);
    });

    socket.on('feedback_created', (data) => {
      addNotification(`New feedback from ${data.from_team} to ${data.to_team}`);
    });

    socket.on('report_generated', (data) => {
      addNotification(`Report generated for ${data.client_name}`);
    });

    return () => {
      socket.off('deal_created');
      socket.off('deal_updated');
      socket.off('feedback_created');
      socket.off('report_generated');
    };
  }, []);

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) => prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar
        open={open}
        toggleDrawer={toggleDrawer}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        clearAllNotifications={clearAllNotifications}
      />
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: 8,
          px: 3,
          pb: 3,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard socket={socket} />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/add" element={<AddDeal socket={socket} />} />
          <Route path="/deals/edit/:id" element={<EditDeal socket={socket} />} />
          <Route path="/reports/:clientId" element={<ClientReport socket={socket} />} />
          <Route path="/feedback" element={<InternalFeedback socket={socket} />} />
          <Route path="/clients" element={<Clients socket={socket} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
