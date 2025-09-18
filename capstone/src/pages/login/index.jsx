import React from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/Appicon';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';
import AuthActions from './components/AuthActions';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Sign In - BudgetTracker Pro</title>
        <meta name="description" content="Sign in to your BudgetTracker Pro account to manage your personal finances and track expenses." />
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-soft">
                  <Icon name="DollarSign" size={24} color="white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-semibold text-foreground">
                    BudgetTracker Pro
                  </h1>
                  <p className="text-sm text-text-secondary">
                    Personal Finance Management
                  </p>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-text-secondary">
                Sign in to access your financial dashboard and track your expenses
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-xl shadow-elevated p-6">
            {/* Login Form */}
            <LoginForm />

            {/* Auth Actions */}
            <AuthActions />

            {/* Security Badges */}
            <SecurityBadges />
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Demo Credentials</p>
                <p className="text-blue-700">
                  <strong>Email:</strong> john.doe@example.com<br />
                  <strong>Password:</strong> password123
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-text-secondary">
            <p>
              © {new Date()?.getFullYear()} BudgetTracker Pro. All rights reserved.
            </p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-foreground transition-smooth">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-smooth">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;