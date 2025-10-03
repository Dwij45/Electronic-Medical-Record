import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  Backdrop,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Code as Code,
  Book as Book,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useThemeMode } from '../../context/ThemeContext';
import { AccountCircle } from '@mui/icons-material';

const DRAWER_WIDTH = 280;
const MINI_DRAWER_WIDTH = 64;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'New Diagnosis', icon: <AssignmentIcon />, path: '/diagnosis/new' },
  {
    text: 'Medical Coding Mapping',
    icon: <Code />, // Make sure to import Code from @mui/icons-material
    path: '/medical-coding-mapping'
  },
  { text: 'Diagnosis History', icon: <HistoryIcon />, path: '/diagnosis/history' },
  { text: 'Terminology', icon: <Book />, path: '/terminology' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' }
];

const bottomMenuItems = [
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    sidebarOpen,
    sidebarMini,
    isMobile,
    toggleSidebar,
    toggleMiniSidebar,
    closeSidebar
  } = useSidebar();
  const { darkMode } = useThemeMode();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      closeSidebar();
    }
  };

  // Fixed: Proper width calculation
  const getDrawerWidth = () => {
    if (isMobile) return DRAWER_WIDTH;
    return sidebarMini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;
  };

  const drawerWidth = getDrawerWidth();

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        {(!sidebarMini || isMobile) && (
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center">
              <HospitalIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" noWrap>
                EMR
              </Typography>
            </Box>
            {!isMobile && (
              <IconButton onClick={toggleMiniSidebar} size="small">
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Box>
        )}
        {sidebarMini && !isMobile && (
          <Box display="flex" justifyContent="center" width="100%">
            <IconButton onClick={toggleMiniSidebar} size="small">
              <ChevronRightIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>

      <Divider />

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={sidebarMini && !isMobile ? item.text : ''} placement="right">
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: sidebarMini && !isMobile ? 'center' : 'initial',
                  px: sidebarMini && !isMobile ? 0 : 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarMini && !isMobile ? 0 : 3,
                    justifyContent: 'center',
                    color: isActive(item.path) ? 'primary.contrastText' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(!sidebarMini || isMobile) && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {(!sidebarMini || isMobile) && (
        <>
          <Divider sx={{ mx: 2 }} />

          {/* System Status */}
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              System Status
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'success.main'
              }} />
              <Typography variant="caption" color="text.secondary">
                Online
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mx: 2 }} />
        </>
      )}

      {/* Bottom Navigation */}
      <List sx={{ px: 1 }}>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={sidebarMini && !isMobile ? item.text : ''} placement="right">
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: sidebarMini && !isMobile ? 'center' : 'initial',
                  px: sidebarMini && !isMobile ? 0 : 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { backgroundColor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarMini && !isMobile ? 0 : 3,
                    justifyContent: 'center',
                    color: isActive(item.path) ? 'primary.contrastText' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(!sidebarMini || isMobile) && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      {(!sidebarMini || isMobile) && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            DualMed : The Healthcare EMR v1.0
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Ministry of Ayush Compliant
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile ? (
        <>
          <Drawer
            variant="temporary"
            open={sidebarOpen}
            onClose={closeSidebar}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                background: darkMode
                  ? 'linear-gradient(180deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
              },
            }}
          >
            {drawer}
          </Drawer>
          {sidebarOpen && (
            <Backdrop
              open={sidebarOpen}
              onClick={closeSidebar}
              sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
            />
          )}
        </>
      ) : (
        /* Desktop Drawer */
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              transition: 'width 0.225s cubic-bezier(0.0, 0, 0.2, 1)',
              overflowX: 'hidden',
              background: darkMode
                ? 'linear-gradient(180deg, #1e1e1e 0%, #2d2d2d 100%)'
                : 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;