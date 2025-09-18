import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'We never share your personal information with third parties'
    },
    {
      icon: 'Eye',
      title: 'Transparent',
      description: 'Full control over your data with export options anytime'
    }
  ];

  return (
    <div className="mt-8 space-y-6">
      {/* Trust Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">{feature?.title}</h4>
              <p className="text-xs text-text-secondary mt-1">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Legal Links */}
      <div className="text-center space-y-2">
        <p className="text-xs text-text-secondary">
          By creating an account, you agree to our{' '}
          <button className="text-primary hover:underline">Terms of Service</button>
          {' '}and{' '}
          <button className="text-primary hover:underline">Privacy Policy</button>
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Database" size={12} />
            <span>Data Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={12} />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;