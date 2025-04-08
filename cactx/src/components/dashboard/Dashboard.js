import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Divider,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { selectScenarios } from '../../store/scenariosSlice';
import { selectCompanies, updateCompanyData } from '../../store/companiesSlice';

import DashboardSummary from './DashboardSummary';
import CompanyCard from './CompanyCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scenarios = useSelector(selectScenarios);
  const companies = useSelector(selectCompanies);
  
  const handleUpdateCompany = (id, data) => {
    dispatch(updateCompanyData({ id, data }));
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Merger Modeling Dashboard
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/scenarios')}
            sx={{ mr: 2 }}
          >
            New Scenario
          </Button>
          {scenarios.length > 1 && (
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<CompareArrowsIcon />}
              onClick={() => navigate('/comparison')}
            >
              Compare Scenarios
            </Button>
          )}
        </Box>
      </Box>
      
      <DashboardSummary scenarios={scenarios} />
      
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Company Profiles
      </Typography>
      
      <Grid container spacing={3}>
        {companies.map(company => (
          <Grid item xs={12} md={6} key={company.id}>
            <CompanyCard company={company} onUpdateCompany={handleUpdateCompany} />
          </Grid>
        ))}
      </Grid>
      
      {scenarios.length > 0 ? (
        <>
          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            Recent Scenarios
          </Typography>
          
          <Grid container spacing={3}>
            {scenarios.slice(0, 3).map(scenario => (
              <Grid item xs={12} md={4} key={scenario.id}>
                <Card className="card">
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {scenario.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Created: {new Date(scenario.createdAt).toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Ownership: CatX ({scenario.ownership?.catx || 0}%) - 
                      Cactus ({scenario.ownership?.cactus || 0}%)
                    </Typography>
                    <Typography variant="body2">
                      Cost Synergies: {scenario.costSynergies || 0}%
                    </Typography>
                    <Typography variant="body2">
                      Revenue Growth: {scenario.revenueGrowth || 0}%
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/scenarios/${scenario.id}`)}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            No Scenarios Created Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get started by creating your first merger scenario
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/scenarios')}
          >
            Create First Scenario
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
