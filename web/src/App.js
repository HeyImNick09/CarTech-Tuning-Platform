// 🏎️ CarTech Platform - Main Web Application
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

import store from './store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TuningWorkspace from './pages/TuningWorkspace';
import DynoSession from './pages/DynoSession';
import VehicleManagement from './pages/VehicleManagement';
import PerformanceAnalytics from './pages/PerformanceAnalytics';
import ShopManagement from './pages/ShopManagement';
import CustomerPortal from './pages/CustomerPortal';
import Settings from './pages/Settings';
import Login from './pages/Login';

// 🎨 CarTech Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b35', // Racing Orange
      light: '#ff8a65',
      dark: '#e64a19'
    },
    secondary: {
      main: '#00e676', // Performance Green
      light: '#66ffa6',
      dark: '#00c853'
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0'
    },
    error: {
      main: '#f44336'
    },
    warning: {
      main: '#ff9800'
    },
    info: {
      main: '#2196f3'
    },
    success: {
      main: '#4caf50'
    }
  },
  typography: {
    fontFamily: '"Roboto Mono", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #333'
        }
      }
    }
  }
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Routes>
              {/* 🔐 Authentication */}
              <Route path="/login" element={<Login />} />
              
              {/* 🏎️ Main Application */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                
                {/* 🔧 Tuning Operations */}
                <Route path="tuning" element={<TuningWorkspace />} />
                <Route path="dyno" element={<DynoSession />} />
                
                {/* 🚗 Vehicle Management */}
                <Route path="vehicles" element={<VehicleManagement />} />
                <Route path="vehicles/:id" element={<VehicleManagement />} />
                
                {/* 📊 Analytics & Reports */}
                <Route path="analytics" element={<PerformanceAnalytics />} />
                
                {/* 🏪 Shop Management */}
                <Route path="shop" element={<ShopManagement />} />
                <Route path="shop/customers" element={<CustomerPortal />} />
                
                {/* ⚙️ Settings */}
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            
            {/* 🍞 Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid #333'
                }
              }}
            />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
