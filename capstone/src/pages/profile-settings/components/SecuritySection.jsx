import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecuritySection = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: "2 minutes ago",
      current: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, NY",
      lastActive: "1 hour ago",
      current: false
    },
    {
      id: 3,
      device: "Chrome on MacBook",
      location: "New York, NY",
      lastActive: "2 days ago",
      current: false
    }
  ];

  const getPasswordStrength = (password) => {
    if (password?.length === 0) return { strength: 0, label: '', color: '' };
    if (password?.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password?.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (password?.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(passwordData?.newPassword);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const handlePasswordUpdate = async () => {
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData?.newPassword?.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(!twoFactorEnabled);
      setSuccess(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      setError('Failed to update two-factor authentication settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSuccess('Session logged out successfully');
    } catch (err) {
      setError('Failed to logout session');
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-green-600" />
          <span className="text-sm text-green-700">{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <Icon name="AlertCircle" size={16} className="text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}
      {/* Password Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Password</h3>
            <p className="text-sm text-text-secondary">Manage your account password</p>
          </div>
          {!showPasswordForm && (
            <Button
              variant="outline"
              size="sm"
              iconName="Key"
              iconPosition="left"
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          )}
        </div>

        {showPasswordForm && (
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData?.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData?.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
              required
            />

            {passwordData?.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Password Strength</span>
                  <span className={`font-medium ${
                    passwordStrength?.strength < 50 ? 'text-red-600' :
                    passwordStrength?.strength < 75 ? 'text-yellow-600' :
                    passwordStrength?.strength < 100 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {passwordStrength?.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength?.color}`}
                    style={{ width: `${passwordStrength?.strength}%` }}
                  />
                </div>
              </div>
            )}

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData?.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
              required
            />

            <div className="flex items-center space-x-3 pt-2">
              <Button
                variant="default"
                loading={loading}
                onClick={handlePasswordUpdate}
                iconName="Save"
                iconPosition="left"
              >
                Update Password
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setError('');
                  setSuccess('');
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
            <p className="text-sm text-text-secondary">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-text-secondary'}`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Button
              variant={twoFactorEnabled ? "destructive" : "default"}
              size="sm"
              loading={loading}
              onClick={handleToggle2FA}
              iconName={twoFactorEnabled ? "ShieldOff" : "Shield"}
              iconPosition="left"
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Sessions</h3>
        <div className="space-y-4">
          {activeSessions?.map((session) => (
            <div key={session?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="Monitor" size={20} color="white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{session?.device}</span>
                    {session?.current && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">{session?.location}</p>
                  <p className="text-xs text-text-secondary">Last active: {session?.lastActive}</p>
                </div>
              </div>
              {!session?.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogoutSession(session?.id)}
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Logout
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;