import React from 'react';
import { ToastProvider } from '../../components/ui/feedback/Toast';
import { OnboardingFlowManager } from './onboarding/OnboardingFlowManager';
import '../../design-system/tokens.css';
import './SellerPortalApp.css';

export function SellerPortalApp() {
  return (
    <ToastProvider>
      <div className="wjl-seller-standalone-root">
        <div className="wjl-mobile-frame-container">
          <OnboardingFlowManager />
        </div>
      </div>
    </ToastProvider>
  );
}

export default SellerPortalApp;
