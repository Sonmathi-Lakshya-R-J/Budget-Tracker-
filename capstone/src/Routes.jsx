import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import TransactionsPage from './pages/transactions';
import Login from './pages/login';
import BudgetsPage from './pages/budgets';
import Dashboard from './pages/dashboard';
import ProfileSettings from './pages/profile-settings';
import Register from './pages/register';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BudgetsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
