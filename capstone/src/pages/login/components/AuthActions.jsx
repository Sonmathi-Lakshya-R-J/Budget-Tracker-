import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const AuthActions = () => {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    // In a real app, this would navigate to forgot password page
    alert('Forgot password functionality would be implemented here');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Forgot Password Link */}
      <div className="text-center">
        <Button
          variant="link"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80"
        >
          Forgot your password?
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-text-secondary">Or</span>
        </div>
      </div>

      {/* Create Account Button */}
      <div className="text-center">
        <p className="text-sm text-text-secondary mb-3">
          Don't have an account?
        </p>
        <Button
          variant="outline"
          onClick={handleCreateAccount}
          fullWidth
          iconName="UserPlus"
          iconPosition="left"
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default AuthActions;