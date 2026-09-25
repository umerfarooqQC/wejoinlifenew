import React, { useState } from 'react';
import { Step1ShopName } from './Step1ShopName';
import { Step2StoreLocation } from './Step2StoreLocation';
import { Step3StoreHours } from './Step3StoreHours';
import { ReviewMenuPage } from '../pages/ReviewMenuPage';
import { Step5StoreCreated } from './Step5StoreCreated';
import { Step6DeliveryMethods } from './Step6DeliveryMethods';
import { Step7PaymentMethods } from './Step7PaymentMethods';
import { Step8CreateCombos } from './Step8CreateCombos';
import { Step9StoreReady } from './Step9StoreReady';
import { Step10LiveStoreDashboard } from './Step10LiveStoreDashboard';
import './OnboardingSteps.css';

export const OnboardingFlowManager: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Stored data across step transitions
  const [formData, setFormData] = useState({
    shopName: 'Bella Italia Bistro',
    description:
      'Serving authentic Neapolitan pizza baked in our traditional stone oven, fresh handmade pasta, crisp garden salads, and Italian desserts crafted with passion.',
    location: {},
    hours: [],
    deliveryMethods: [],
    paymentMethods: [],
    combos: [],
  });

  return (
    <div className="wjl-ob-flow-wrapper">
      {currentStep === 1 && (
        <Step1ShopName
          initialData={{ shopName: formData.shopName, description: formData.description }}
          onNext={(data) => {
            setFormData((prev) => ({ ...prev, ...data }));
            setCurrentStep(2);
          }}
        />
      )}

      {currentStep === 2 && (
        <Step2StoreLocation
          initialData={formData.location}
          onBack={() => setCurrentStep(1)}
          onNext={(data) => {
            setFormData((prev) => ({ ...prev, location: data }));
            setCurrentStep(3);
          }}
        />
      )}

      {currentStep === 3 && (
        <Step3StoreHours
          onBack={() => setCurrentStep(2)}
          onNext={(hours) => {
            setFormData((prev) => ({ ...prev, hours }));
            setCurrentStep(4);
          }}
        />
      )}

      {currentStep === 4 && (
        <ReviewMenuPage
          onNext={() => setCurrentStep(5)}
        />
      )}

      {currentStep === 5 && (
        <Step5StoreCreated onComplete={() => setCurrentStep(6)} />
      )}

      {currentStep === 6 && (
        <Step6DeliveryMethods
          onBack={() => setCurrentStep(4)}
          onNext={(deliveryData) => {
            setFormData((prev) => ({ ...prev, deliveryMethods: deliveryData }));
            setCurrentStep(7);
          }}
        />
      )}

      {currentStep === 7 && (
        <Step7PaymentMethods
          onBack={() => setCurrentStep(6)}
          onNext={(paymentData) => {
            setFormData((prev) => ({ ...prev, paymentMethods: paymentData }));
            setCurrentStep(8);
          }}
        />
      )}

      {currentStep === 8 && (
        <Step8CreateCombos
          onBack={() => setCurrentStep(7)}
          onNext={(combos) => {
            setFormData((prev) => ({ ...prev, combos }));
            setCurrentStep(9);
          }}
        />
      )}

      {currentStep === 9 && (
        <Step9StoreReady onGoToLiveStore={() => setCurrentStep(10)} />
      )}

      {currentStep === 10 && (
        <Step10LiveStoreDashboard onBackToOnboarding={() => setCurrentStep(1)} />
      )}
    </div>
  );
};
