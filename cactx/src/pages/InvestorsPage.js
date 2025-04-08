import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { selectCompanies } from '../store/companiesSlice';
import InvestorManagement from '../components/investors/InvestorManagement';

const InvestorsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const companies = useSelector(selectCompanies);
  const [activeCompany, setActiveCompany] = useState(companyId || companies[0]?.id || 'catx');
  
  // Update active company when URL parameter changes
  useEffect(() => {
    if (companyId && companyId !== activeCompany) {
      setActiveCompany(companyId);
    }
  }, [companyId, activeCompany]);
  
  const handleCompanyChange = (event, newValue) => {
    setActiveCompany(newValue);
    // Update the URL when tab changes
    navigate(`/investors/${newValue}`);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Investor Management
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={activeCompany}
          onChange={handleCompanyChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {companies.map((company) => (
            <Tab 
              key={company.id} 
              label={company.name} 
              value={company.id} 
            />
          ))}
        </Tabs>
      </Box>
      
      {activeCompany && (
        <InvestorManagement companyId={activeCompany} />
      )}
    </Box>
  );
};

export default InvestorsPage;
