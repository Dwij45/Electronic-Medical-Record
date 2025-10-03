import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  AccountCircle,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Sync as SyncIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import { useSidebar } from '../../context/SidebarContext';
import terminologyService from '../../services/terminology.service';

const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useThemeMode();
  const { sidebarOpen, sidebarMini, toggleSidebar, toggleMiniSidebar, isMobile } = useSidebar();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount] = useState(3);
  const [syncing, setSyncing] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleClose();
    navigate('/settings');
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await terminologyService.syncCodeSystems();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Fixed: Use appropriate toggle based on device type
  const handleSidebarToggle = () => {
    if (isMobile) {
      toggleSidebar(); // For mobile: open/close sidebar
    } else {
      toggleMiniSidebar(); // For desktop: toggle mini/full sidebar
    }
  };

  // Fixed: Show correct icon based on device and state
  const getSidebarIcon = () => {
    if (isMobile) {
      return sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />;
    } else {
      return sidebarMini ? <MenuIcon /> : <MenuOpenIcon />;
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Fixed Menu Button */}
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={handleSidebarToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          {getSidebarIcon()}
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          DualMed : The Healthcare EMR
          <Typography
            component="span"
            variant="caption"
            sx={{
              ml: 1,
              display: { xs: 'none', md: 'inline' }
            }}
          >
            - Terminology Integration
          </Typography>
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Sync Button - Hidden on mobile */}
          <Tooltip title="Sync Code Systems">
            <IconButton
              color="inherit"
              onClick={handleSync}
              disabled={syncing}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <SyncIcon sx={{
                animation: syncing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings - Hidden on mobile */}
          <Tooltip title="Settings">
            <IconButton
              color="inherit"
              onClick={handleSettings}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {user?.name?.split(' ')[0] || 'User'}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <SettingsIcon sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={toggleDarkMode} size="small" />}
                label="Dark Mode"
              />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;