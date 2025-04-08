import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography,
  Divider,
  Box,
  Avatar
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const CompanyCard = ({ company }) => {
  const { id, name, financials, metrics } = company;
  
  // Calculate derived metrics
  const profit = financials.revenue - financials.expenses;
  const profitMargin = (profit / financials.revenue) * 100;
  const netWorth = financials.assets - financials.liabilities;
  
  // Determine styling based on company
  const isGreen = id === 'cactus';
  const primaryColor = isGreen ? '#2e7d32' : '#1976d2';
  const avatarBgColor = isGreen ? 'primary.main' : 'secondary.main';
  
  return (
    <Card className="card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ bgcolor: avatarBgColor, mr: 2 }}
          >
            <BusinessIcon />
          </Avatar>
          <Typography variant="h5" component="div" sx={{ color: primaryColor, fontWeight: 'bold' }}>
            {name}
          </Typography>
        </Box>
        
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          Financial Overview
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <div>
            <Typography variant="body2" color="text.secondary">
              Revenue
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formatCurrency(financials.revenue)}
            </Typography>
          </div>
          
          <div>
            <Typography variant="body2" color="text.secondary">
              Expenses
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formatCurrency(financials.expenses)}
            </Typography>
          </div>
          
          <div>
            <Typography variant="body2" color="text.secondary">
              Profit
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'medium',
                color: profit >= 0 ? 'success.main' : 'error.main'
              }}
            >
              {formatCurrency(profit)}
            </Typography>
          </div>
          
          <div>
            <Typography variant="body2" color="text.secondary">
              Profit Margin
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'medium',
                color: profitMargin >= 0 ? 'success.main' : 'error.main'
              }}
            >
              {profitMargin.toFixed(1)}%
            </Typography>
          </div>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          Company Metrics
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <div>
            <Typography variant="body2" color="text.secondary">
              Employees
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {metrics.employees.toLocaleString()}
            </Typography>
          </div>
          
          <div>
            <Typography variant="body2" color="text.secondary">
              Offices
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {metrics.offices}
            </Typography>
          </div>
          
          <div>
            <Typography variant="body2" color="text.secondary">
              Market Share
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {metrics.marketShare}%
            </Typography>
          </div>
          
          <div>
            <Typography variant="body2" color="text.secondary">
              Net Worth
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formatCurrency(netWorth)}
            </Typography>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
