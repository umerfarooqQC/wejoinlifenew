import React, { useState, useEffect } from 'react';
import './restaurant.css';
import { OnboardingState, ShopInfo, LocationInfo, WeekdayTiming, HolidayTiming, MenuItem, DeliveryConfig, PaymentConfig, ComboItem } from './types';
import { INITIAL_ONBOARDING_STATE } from './mockData';
import { StepProgress } from './common/StepProgress';
import { StepShopInfo } from './steps/StepShopInfo';
import { StepLocation } from './steps/StepLocation';
import { StepTimings } from './steps/StepTimings';
import { StepMenu } from './steps/StepMenu';
import { StepDelivery } from './steps/StepDelivery';
import { StepPayment } from './steps/StepPayment';
import { StepCombos } from './steps/StepCombos';
import { StepSummary } from './steps/StepSummary';
import { StoreIcon } from './common/Icons';

const STEP_LABELS = [
  'Shop Info',
  'Location',
  'Timings',
  'Menu Items',
  'Delivery',
  'Payments',
  'Combos',
  'Ready & PDFs'
];

export const RestaurantOnboarding: React.FC = () => {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const saved = localStorage.getItem('wjl_restaurant_onboarding');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback to initial
    }
    return INITIAL_ONBOARDING_STATE;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastSaved, setLastSaved] = useState<string>('Just now');

  // Auto-save state changes
  useEffect(() => {
    try {
      localStorage.setItem('wjl_restaurant_onboarding', JSON.stringify(state));
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      // localStorage error handle
    }
  }, [state]);

  const updateShopInfo = (patch: Partial<ShopInfo>) => {
    setState(prev => ({ ...prev, shopInfo: { ...prev.shopInfo, ...patch } }));
  };

  const updateLocation = (patch: Partial<LocationInfo>) => {
    setState(prev => ({ ...prev, location: { ...prev.location, ...patch } }));
  };

  const updateWeekdayTimings = (timings: WeekdayTiming[]) => {
    setState(prev => ({ ...prev, weekdayTimings: timings }));
  };

  const updateHolidayTimings = (holidays: HolidayTiming[]) => {
    setState(prev => ({ ...prev, holidayTimings: holidays }));
  };

  const updateMenuItems = (items: MenuItem[]) => {
    setState(prev => ({ ...prev, menuItems: items }));
  };

  const toggleItemAvailability = (id: string) => {
    setState(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    }));
  };

  const updateDelivery = (updated: DeliveryConfig) => {
    setState(prev => ({ ...prev, delivery: updated }));
  };

  const updatePayment = (updated: PaymentConfig) => {
    setState(prev => ({ ...prev, payment: updated }));
  };

  const toggleCombosEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, combosEnabled: enabled }));
  };

  const updateCombos = (combos: ComboItem[]) => {
    setState(prev => ({ ...prev, combos }));
  };

  return (
    <div className="wjl-wizard-container">
      {/* Top Header */}
      <header className="wjl-wizard-header">
        <div className="wjl-wizard-topbar">
          <div>
            <h1 className="wjl-wizard-title">
              <StoreIcon size={28} className="text-cyan-400" />
              <span>Restaurant Setup & Digital Storefront</span>
            </h1>
            <p className="wjl-wizard-subtitle">
              Configuring <strong>{state.shopInfo.name || 'Your Restaurant'}</strong> • Pre-populated from mobile app scan
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="wjl-draft-badge">
              <span>●</span>
              <span>Draft auto-saved {lastSaved}</span>
            </span>
          </div>
        </div>

        {/* Step Navigation Progress */}
        <StepProgress
          currentStep={currentStep}
          totalSteps={STEP_LABELS.length}
          stepLabels={STEP_LABELS}
          onSelectStep={(step) => setCurrentStep(step)}
        />
      </header>

      {/* Main Step Render */}
      <main>
        {currentStep === 1 && (
          <StepShopInfo
            shopInfo={state.shopInfo}
            onChange={updateShopInfo}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <StepLocation
            location={state.location}
            onChange={updateLocation}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <StepTimings
            weekdayTimings={state.weekdayTimings}
            holidayTimings={state.holidayTimings}
            onWeekdayChange={updateWeekdayTimings}
            onHolidayChange={updateHolidayTimings}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <StepMenu
            menuItems={state.menuItems}
            currency={state.shopInfo.currency}
            onChange={updateMenuItems}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <StepDelivery
            delivery={state.delivery}
            currency={state.shopInfo.currency}
            shopName={state.shopInfo.name}
            onChange={updateDelivery}
            onNext={() => setCurrentStep(6)}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && (
          <StepPayment
            payment={state.payment}
            onChange={updatePayment}
            onNext={() => setCurrentStep(7)}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 7 && (
          <StepCombos
            combosEnabled={state.combosEnabled}
            combos={state.combos}
            menuItems={state.menuItems}
            currency={state.shopInfo.currency}
            onToggleEnabled={toggleCombosEnabled}
            onCombosChange={updateCombos}
            onNext={() => setCurrentStep(8)}
            onBack={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 8 && (
          <StepSummary
            state={state}
            onGoToStep={(step) => setCurrentStep(step)}
            onToggleItemAvailability={toggleItemAvailability}
          />
        )}
      </main>
    </div>
  );
};

export default RestaurantOnboarding;
