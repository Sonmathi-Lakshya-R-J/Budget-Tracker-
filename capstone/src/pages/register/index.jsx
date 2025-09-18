import React from 'react';
import WelcomeHeader from './components/WelcomHeader';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';

const Register = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Welcome Content (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 to-accent/5 p-12 items-center justify-center">
          <div className="max-w-lg">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  Start Your Financial Journey Today
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed">
                  Take control of your money with powerful budgeting tools, expense tracking, and group expense management all in one place.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Track Every Dollar</h3>
                    <p className="text-text-secondary">Monitor your income and expenses with detailed categorization and insights.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-accent font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Smart Budgeting</h3>
                    <p className="text-text-secondary">Set monthly budgets and get alerts when you're approaching your limits.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-success font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Split Expenses</h3>
                    <p className="text-text-secondary">Easily manage shared expenses with friends, family, or roommates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Header */}
            <div className="lg:hidden">
              <WelcomeHeader />
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
              <p className="text-text-secondary">Get started with your free account</p>
            </div>

            {/* Registration Form */}
            <RegistrationForm />

            {/* Trust Signals */}
            <TrustSignals />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;