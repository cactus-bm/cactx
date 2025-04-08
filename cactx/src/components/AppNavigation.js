import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import CompareIcon from '@mui/icons-material/Compare';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TuneIcon from '@mui/icons-material/Tune';
import { useSelector } from 'react-redux';
import { selectScenarios } from '../store/scenariosSlice';

const drawerWidth = 240;

const AppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenarios = useSelector(selectScenarios);
  
  const mainNavItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/'
    },
    {
      text: 'Scenario Builder',
      icon: <TuneIcon />,
      path: '/scenarios'
    },
    {
      text: 'Compare Scenarios',
      icon: <CompareIcon />,
      path: '/comparison'
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      path: '/reports'
    }
  ];
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)'
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {mainNavItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <Box sx={{ p: 2, pt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Saved Scenarios
          </Typography>
        </Box>
        
        <List>
          {scenarios.length > 0 ? (
            scenarios.map((scenario) => (
              <ListItem key={scenario.id} disablePadding>
                <ListItemButton 
                  selected={location.pathname === `/scenarios/${scenario.id}`}
                  onClick={() => navigate(`/scenarios/${scenario.id}`)}
                >
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={scenario.name} 
                    secondary={`Created: ${new Date(scenario.createdAt).toLocaleDateString()}`} 
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText 
                secondary="No saved scenarios" 
                sx={{ textAlign: 'center', fontStyle: 'italic' }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default AppNavigation;
