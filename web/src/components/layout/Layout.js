// 🏗️ Main Layout Component
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Build as TuningIcon,
  Speed as DynoIcon,
  DirectionsCar as VehicleIcon,
  Analytics as AnalyticsIcon,
  Store as ShopIcon,
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const menuItems = [
  { text: '🏁 Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: '🔧 Tuning Workspace', icon: <TuningIcon />, path: '/tuning' },
  { text: '📊 Dyno Session', icon: <DynoIcon />, path: '/dyno' },
  { text: '🚗 Vehicles', icon: <VehicleIcon />, path: '/vehicles' },
  { text: '📈 Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: '🏪 Shop Management', icon: <ShopIcon />, path: '/shop' },
  { text: '⚙️ Settings', icon: <SettingsIcon />, path: '/settings' }
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      {/* 🏎️ Logo & Brand */}
      <Toolbar sx={{ backgroundColor: '#ff6b35', color: 'white' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          🏎️ CarTech Platform
        </Typography>
      </Toolbar>
      
      <Divider />
      
      {/* 📊 Quick Stats */}
      <Box sx={{ p: 2, backgroundColor: '#1a1a1a' }}>
        <Typography variant="body2" color="text.secondary">
          🔌 ECU Status: <span style={{ color: '#00e676' }}>Connected</span>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          🏁 Active Sessions: <span style={{ color: '#ff6b35' }}>3</span>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          🚨 Safety Alerts: <span style={{ color: '#f44336' }}>0</span>
        </Typography>
      </Box>
      
      <Divider />
      
      {/* 🧭 Navigation Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#ff6b35',
                  '&:hover': {
                    backgroundColor: '#e64a19'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      {/* 🚨 Safety Status */}
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          🛡️ Safety Systems
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00e676' }} />
          <Typography variant="caption">All Systems Normal</Typography>
        </Box>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 📱 App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #333'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Professional Automotive Tuning Platform
          </Typography>
          
          {/* 🔔 Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={2} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>
          
          {/* 🚨 Safety Alert */}
          <IconButton color="inherit">
            <WarningIcon sx={{ color: '#00e676' }} />
          </IconButton>
          
          {/* 👤 User Profile */}
          <Avatar sx={{ ml: 2, backgroundColor: '#ff6b35' }}>
            CT
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* 🗂️ Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 📄 Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
