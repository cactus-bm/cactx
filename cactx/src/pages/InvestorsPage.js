import React, { useState, useEffect, useRef } from 'react';
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
      
      <Box sx={{ position: 'relative', minHeight: '70vh' }}>
        {companies.map((company) => (
          <Box 
            key={company.id}
            sx={{
              position: 'absolute',
              width: '100%',
              opacity: activeCompany === company.id ? 1 : 0,
              visibility: activeCompany === company.id ? 'visible' : 'hidden',
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <InvestorManagement companyId={company.id} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InvestorsPage;
