import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Transactions', path: '/transactions', icon: 'Receipt' },
  { label: 'Budgets', path: '/budgets', icon: 'PieChart' },
  { label: 'Profile', path: '/profile-settings', icon: 'User' }];


  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-soft">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
          onClick={() => handleNavigation('/dashboard')}>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">Budget Buddy

            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) =>
          <button
            key={item?.path}
            onClick={() => handleNavigation(item?.path)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
            isActivePath(item?.path) ?
            'bg-primary text-primary-foreground' :
            'text-text-secondary hover:text-foreground hover:bg-muted'}`
            }>

              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </button>
          )}
        </nav>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-smooth">

            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <Icon name="ChevronDown" size={16} className="text-text-secondary" />
          </button>

          {/* User Dropdown */}
          {isUserMenuOpen &&
          <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated z-50">
              <div className="py-1">
                <button
                onClick={() => {
                  handleNavigation('/profile-settings');
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth">

                  <Icon name="Settings" size={16} />
                  <span>Settings</span>
                </button>
                <hr className="my-1 border-border" />
                <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-smooth">

                  <Icon name="LogOut" size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          }
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth">

          <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen &&
      <div className="md:hidden bg-surface border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) =>
          <button
            key={item?.path}
            onClick={() => handleNavigation(item?.path)}
            className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-smooth ${
            isActivePath(item?.path) ?
            'bg-primary text-primary-foreground' :
            'text-text-secondary hover:text-foreground hover:bg-muted'}`
            }>

                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
          )}
          </nav>
        </div>
      }
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }
      {/* Overlay for user menu */}
      {isUserMenuOpen &&
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsUserMenuOpen(false)} />

      }
    </header>);

};

export default Header;