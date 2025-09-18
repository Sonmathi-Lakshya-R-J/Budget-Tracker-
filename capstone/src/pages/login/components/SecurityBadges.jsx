import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      text: 'SSL Encrypted',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      text: 'Secure Login',
      description: 'JWT Authentication'
    },
    {
      icon: 'Eye',
      text: 'Privacy Protected',
      description: 'Your data is safe'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
            <div className="flex items-center justify-center w-6 h-6 bg-success/10 rounded-full">
              <Icon name={feature?.icon} size={12} className="text-success" />
            </div>
            <div className="text-center sm:text-left">
              <span className="font-medium text-foreground">{feature?.text}</span>
              <div className="text-xs opacity-75">{feature?.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;