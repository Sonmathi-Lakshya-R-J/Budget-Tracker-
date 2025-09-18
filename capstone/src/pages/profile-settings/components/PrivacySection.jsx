import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacySection = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    analytics: true,
    marketing: false,
    thirdPartyIntegrations: false
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePrivacyChange = (field, checked) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSavePrivacySettings = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Privacy settings updated successfully!');
    } catch (err) {
      setError('Failed to update privacy settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Account deletion request submitted. You will receive a confirmation email.');
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    } catch (err) {
      setError('Failed to process account deletion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = async () => {
    setLoading(true);
    try {
      // Simulate data preparation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock personal data
      const personalData = {
        profile: {
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+1 (555) 123-4567",
          createdAt: "2024-01-15T10:30:00Z"
        },
        preferences: privacySettings,
        dataProcessing: {
          lastLogin: "2025-09-15T17:05:30Z",
          totalTransactions: 1247,
          accountAge: "8 months"
        }
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(personalData, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL?.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `personal-data-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      window.URL?.revokeObjectURL(url);

      setSuccess('Personal data downloaded successfully!');
    } catch (err) {
      setError('Failed to download personal data. Please try again.');
    } finally {
      setLoading(false);
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
      {/* Data Sharing Preferences */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Sharing Preferences</h3>
        <div className="space-y-4">
          <Checkbox
            label="Data Sharing with Partners"
            description="Allow sharing anonymized financial insights with trusted partners for service improvement"
            checked={privacySettings?.dataSharing}
            onChange={(e) => handlePrivacyChange('dataSharing', e?.target?.checked)}
          />

          <Checkbox
            label="Analytics & Performance"
            description="Help us improve the app by sharing usage analytics and performance data"
            checked={privacySettings?.analytics}
            onChange={(e) => handlePrivacyChange('analytics', e?.target?.checked)}
          />

          <Checkbox
            label="Marketing Communications"
            description="Receive personalized offers and financial tips based on your spending patterns"
            checked={privacySettings?.marketing}
            onChange={(e) => handlePrivacyChange('marketing', e?.target?.checked)}
          />

          <Checkbox
            label="Third-party Integrations"
            description="Allow third-party services to access your financial data with your explicit consent"
            checked={privacySettings?.thirdPartyIntegrations}
            onChange={(e) => handlePrivacyChange('thirdPartyIntegrations', e?.target?.checked)}
          />
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button
            variant="default"
            loading={loading}
            onClick={handleSavePrivacySettings}
            iconName="Save"
            iconPosition="left"
          >
            Save Privacy Settings
          </Button>
        </div>
      </div>
      {/* Data Rights */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Data Rights</h3>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Download" size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Download Your Data</h4>
                <p className="text-sm text-text-secondary mb-3">
                  Get a copy of all personal data we have about you in a portable format.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  loading={loading}
                  onClick={handleDownloadData}
                  iconName="Download"
                  iconPosition="left"
                >
                  Download Personal Data
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="Edit" size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Data Correction</h4>
                <p className="text-sm text-text-secondary mb-3">
                  Request corrections to any inaccurate personal information we hold about you.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mail"
                  iconPosition="left"
                >
                  Request Correction
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">Data Portability</h4>
                <p className="text-sm text-text-secondary mb-3">
                  Transfer your data to another service provider in a structured format.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ArrowRight"
                  iconPosition="left"
                >
                  Request Transfer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Account Deletion */}
      <div className="bg-card rounded-lg border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        
        {!showDeleteConfirm ? (
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-600 mb-1">Delete Account</h4>
                <p className="text-sm text-red-700 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-600 mb-3">Confirm Account Deletion</h4>
            <p className="text-sm text-red-700 mb-4">
              This will permanently delete your account, all financial data, transaction history, 
              budgets, and settings. This action cannot be undone.
            </p>
            <p className="text-sm text-red-700 mb-3">
              Type <strong>"DELETE MY ACCOUNT"</strong> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e?.target?.value)}
              placeholder="DELETE MY ACCOUNT"
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex items-center space-x-3">
              <Button
                variant="destructive"
                loading={loading}
                onClick={handleDeleteAccount}
                iconName="Trash2"
                iconPosition="left"
              >
                Confirm Deletion
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                  setError('');
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySection;