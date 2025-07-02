import React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 240,
    width: `calc(100% - 240px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Navbar({ open, toggleDrawer, notifications, markNotificationAsRead, clearAllNotifications }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const notificationMenuOpen = Boolean(anchorEl);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationRead = (id) => {
    markNotificationAsRead(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="toggle drawer" onClick={toggleDrawer} sx={{ marginRight: '36px' }}>
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Smart Communication Pipelines
        </Typography>

        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          id="notification-menu"
          anchorEl={anchorEl}
          open={notificationMenuOpen}
          onClose={handleNotificationClose}
          MenuListProps={{
            'aria-labelledby': 'notification-button',
          }}
          PaperProps={{
            sx: { width: 350, maxHeight: 400 },
          }}
        >
          {notifications.length > 0 ? (
            <>
              <MenuItem onClick={clearAllNotifications}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Clear All Notifications</ListItemText>
              </MenuItem>
              <Divider />
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={() => handleNotificationRead(notification.id)}
                  sx={{
                    backgroundColor: notification.read ? 'inherit' : 'rgba(63, 81, 181, 0.08)',
                    '&:hover': {
                      backgroundColor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(63, 81, 181, 0.12)',
                    },
                  }}
                >
                  <ListItemText primary={notification.message} secondary={new Date(notification.timestamp).toLocaleString()} />
                  {notification.read && (
                    <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                    </ListItemIcon>
                  )}
                </MenuItem>
              ))}
            </>
          ) : (
            <MenuItem disabled>
              <ListItemText>No notifications</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;
