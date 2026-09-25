import React from 'react';
import { PaymentConfig } from '../types';
import { CreditCardIcon, ChevronLeftIcon, ChevronRightIcon } from '../common/Icons';

interface StepPaymentProps {
  payment: PaymentConfig;
  onChange: (updated: PaymentConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepPayment: React.FC<StepPaymentProps> = ({
  payment,
  onChange,
  onNext,
  onBack
}) => {
  const updatePayment = (patch: Partial<PaymentConfig>) => {
    onChange({ ...payment, ...patch });
  };

  const updateStripe = (patch: Partial<typeof payment.stripe>) => {
    onChange({
      ...payment,
      stripe: { ...payment.stripe, ...patch }
    });
  };

  const updatePayPal = (patch: Partial<typeof payment.paypal>) => {
    onChange({
      ...payment,
      paypal: { ...payment.paypal, ...patch }
    });
  };

  return (
    <div className="wjl-step-card">
      <div className="wjl-step-title">
        <CreditCardIcon size={24} className="text-emerald-400" />
        <span>Step 6 of 8: Payment Methods & Gateway Configuration</span>
      </div>
      <p className="wjl-step-desc">
        Choose the checkout payment channels available to your customers and configure your merchant API keys.
      </p>

      {/* 1. Cash on Delivery */}
      <div className={`wjl-delivery-card ${payment.cashOnDelivery ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>💵</span>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Cash on Delivery / Pickup</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Collect physical cash when the customer receives their order or picks up at the counter.
              </p>
            </div>
          </div>

          <label className="wjl-switch-label">
            <div
              className={`wjl-switch-toggle ${payment.cashOnDelivery ? 'checked' : ''}`}
              onClick={() => updatePayment({ cashOnDelivery: !payment.cashOnDelivery })}
            />
            <span style={{ fontSize: '13px', color: payment.cashOnDelivery ? '#34d399' : '#94a3b8' }}>
              {payment.cashOnDelivery ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
      </div>

      {/* 2. Credit / Debit Card (Stripe) */}
      <div className={`wjl-delivery-card ${payment.stripe.enabled ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>💳</span>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Credit / Debit Card (Stripe Powered)</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Accept Visa, Mastercard, American Express, Apple Pay, and Google Pay with instant payout.
              </p>
            </div>
          </div>

          <label className="wjl-switch-label">
            <div
              className={`wjl-switch-toggle ${payment.stripe.enabled ? 'checked' : ''}`}
              onClick={() => updateStripe({ enabled: !payment.stripe.enabled })}
            />
            <span style={{ fontSize: '13px', color: payment.stripe.enabled ? '#34d399' : '#94a3b8' }}>
              {payment.stripe.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {payment.stripe.enabled && (
          <div className="wjl-sub-options-box">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'flex-end' }}>
              <div className="wjl-form-group">
                <label className="wjl-label" htmlFor="stripePk">
                  <span>Stripe Publishable Key <span style={{ color: '#ef4444' }}>*</span></span>
                  <span className="wjl-label-hint">Found in Stripe Dashboard ➔ API Keys</span>
                </label>
                <input
                  id="stripePk"
                  type="text"
                  className="wjl-input"
                  style={{ fontFamily: 'monospace', fontSize: '13px' }}
                  value={payment.stripe.publishableKey}
                  onChange={(e) => updateStripe({ publishableKey: e.target.value })}
                  placeholder="pk_live_... or pk_test_..."
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}>
                <label className="wjl-switch-label" style={{ fontSize: '12px' }}>
                  <div
                    className={`wjl-switch-toggle ${payment.stripe.testMode ? 'checked' : ''}`}
                    onClick={() => updateStripe({ testMode: !payment.stripe.testMode })}
                  />
                  <span style={{ color: payment.stripe.testMode ? '#38bdf8' : '#cbd5e1' }}>
                    {payment.stripe.testMode ? 'Test Mode (Sandbox)' : 'Live Production'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. PayPal */}
      <div className={`wjl-delivery-card ${payment.paypal.enabled ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>🅿️</span>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>PayPal Online Checkout</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Accept PayPal balance, Pay in 4 installment plans, and international PayPal accounts.
              </p>
            </div>
          </div>

          <label className="wjl-switch-label">
            <div
              className={`wjl-switch-toggle ${payment.paypal.enabled ? 'checked' : ''}`}
              onClick={() => updatePayPal({ enabled: !payment.paypal.enabled })}
            />
            <span style={{ fontSize: '13px', color: payment.paypal.enabled ? '#34d399' : '#94a3b8' }}>
              {payment.paypal.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {payment.paypal.enabled && (
          <div className="wjl-sub-options-box">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'flex-end' }}>
              <div className="wjl-form-group">
                <label className="wjl-label" htmlFor="paypalClientId">
                  <span>PayPal REST App Client ID <span style={{ color: '#ef4444' }}>*</span></span>
                  <span className="wjl-label-hint">From developer.paypal.com</span>
                </label>
                <input
                  id="paypalClientId"
                  type="text"
                  className="wjl-input"
                  style={{ fontFamily: 'monospace', fontSize: '13px' }}
                  value={payment.paypal.clientId}
                  onChange={(e) => updatePayPal({ clientId: e.target.value })}
                  placeholder="e.g. sb-client-id-..."
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}>
                <label className="wjl-switch-label" style={{ fontSize: '12px' }}>
                  <div
                    className={`wjl-switch-toggle ${payment.paypal.sandbox ? 'checked' : ''}`}
                    onClick={() => updatePayPal({ sandbox: !payment.paypal.sandbox })}
                  />
                  <span style={{ color: payment.paypal.sandbox ? '#38bdf8' : '#cbd5e1' }}>
                    {payment.paypal.sandbox ? 'Sandbox (Test)' : 'Live Production'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="wjl-step-actions">
        <button type="button" onClick={onBack} className="wjl-btn wjl-btn-secondary">
          <ChevronLeftIcon size={16} />
          <span>Back</span>
        </button>
        <button type="button" onClick={onNext} className="wjl-btn wjl-btn-primary">
          <span>Confirm & Next: Combos</span>
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
