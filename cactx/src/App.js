import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from './store';
import theme from './theme';

// Layout components
import AppHeader from './components/AppHeader';
import AppNavigation from './components/AppNavigation';

// Page components
import Dashboard from './components/dashboard/Dashboard';
import ScenarioBuilder from './components/scenarios/ScenarioBuilder';
import ComparisonView from './components/comparison/ComparisonView';
import ReportGenerator from './components/reports/ReportGenerator';
import InvestorsPage from './pages/InvestorsPage';

// Main CSS
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router basename={process.env.PUBLIC_URL}>
          <div className="App">
            <AppHeader />
            <div className="app-container">
              <AppNavigation />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/scenarios" element={<ScenarioBuilder />} />
                  <Route path="/scenarios/:id" element={<ScenarioBuilder />} />
                  <Route path="/comparison" element={<ComparisonView />} />
                  <Route path="/reports" element={<ReportGenerator />} />
                  <Route path="/investors" element={<InvestorsPage />} />
                  <Route path="/investors/:companyId" element={<InvestorsPage />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
