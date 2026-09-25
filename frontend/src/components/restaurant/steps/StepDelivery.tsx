import React, { useState } from 'react';
import { DeliveryConfig } from '../types';
import { TruckIcon, QrCodeIcon, ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from '../common/Icons';

interface StepDeliveryProps {
  delivery: DeliveryConfig;
  currency: string;
  shopName: string;
  onChange: (updated: DeliveryConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepDelivery: React.FC<StepDeliveryProps> = ({
  delivery,
  currency,
  shopName,
  onChange,
  onNext,
  onBack
}) => {
  const [selectedTableForQr, setSelectedTableForQr] = useState<number | null>(null);

  const updateDelivery = (patch: Partial<DeliveryConfig>) => {
    onChange({ ...delivery, ...patch });
  };

  const updateOwnDelivery = (patch: Partial<typeof delivery.ownDelivery>) => {
    onChange({
      ...delivery,
      ownDelivery: { ...delivery.ownDelivery, ...patch }
    });
  };

  const updateThirdParty = (patch: Partial<typeof delivery.thirdParty>) => {
    onChange({
      ...delivery,
      thirdParty: { ...delivery.thirdParty, ...patch }
    });
  };

  const updateUberEats = (patch: Partial<typeof delivery.uberEats>) => {
    onChange({
      ...delivery,
      uberEats: { ...delivery.uberEats, ...patch }
    });
  };

  const updateDineIn = (patch: Partial<typeof delivery.dineIn>) => {
    onChange({
      ...delivery,
      dineIn: { ...delivery.dineIn, ...patch }
    });
  };

  return (
    <div className="wjl-step-card">
      <div className="wjl-step-title">
        <TruckIcon size={24} className="text-cyan-400" />
        <span>Step 5 of 8: Delivery & Dine-In Methods</span>
      </div>
      <p className="wjl-step-desc">
        Select how customers can receive their meals. Configure customized sub-options for direct delivery, third-party fleets, and table QR ordering.
      </p>

      {/* 1. Self Pickup */}
      <div className={`wjl-delivery-card ${delivery.selfPickup ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>🏃</span>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Self Pickup</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Customers collect their prepared orders directly at your checkout counter.
              </p>
            </div>
          </div>

          <label className="wjl-switch-label">
            <div
              className={`wjl-switch-toggle ${delivery.selfPickup ? 'checked' : ''}`}
              onClick={() => updateDelivery({ selfPickup: !delivery.selfPickup })}
            />
            <span style={{ fontSize: '13px', color: delivery.selfPickup ? '#34d399' : '#94a3b8' }}>
              {delivery.selfPickup ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
      </div>

      {/* 2. Delivery to Client (with sub-options) */}
      <div className={`wjl-delivery-card ${delivery.deliveryToClient ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>🛵</span>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Delivery to Client</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Dispatch food directly to the customer's address (in-house driver, 3rd party, or Uber Eats).
              </p>
            </div>
          </div>

          <label className="wjl-switch-label">
            <div
              className={`wjl-switch-toggle ${delivery.deliveryToClient ? 'checked' : ''}`}
              onClick={() => updateDelivery({ deliveryToClient: !delivery.deliveryToClient })}
            />
            <span style={{ fontSize: '13px', color: delivery.deliveryToClient ? '#34d399' : '#94a3b8' }}>
              {delivery.deliveryToClient ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {/* Sub-options for Delivery to Client */}
        {delivery.deliveryToClient && (
          <div className="wjl-sub-options-box">
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Delivery Channels & Configurations:
            </div>

            {/* Sub-option A: Own Delivery */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: delivery.ownDelivery.enabled ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: delivery.ownDelivery.enabled ? '14px' : 0 }}>
                <label className="wjl-switch-label">
                  <div
                    className={`wjl-switch-toggle ${delivery.ownDelivery.enabled ? 'checked' : ''}`}
                    onClick={() => updateOwnDelivery({ enabled: !delivery.ownDelivery.enabled })}
                  />
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>I Have My Own Delivery</span>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>Your restaurant staff or dedicated drivers deliver the food.</p>
                  </div>
                </label>
              </div>

              {delivery.ownDelivery.enabled && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="wjl-form-group">
                    <label className="wjl-label" style={{ fontSize: '11px' }}>Radius (km)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="wjl-input"
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      value={delivery.ownDelivery.radiusKm}
                      onChange={(e) => updateOwnDelivery({ radiusKm: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="wjl-form-group">
                    <label className="wjl-label" style={{ fontSize: '11px' }}>Delivery Fee ({currency})</label>
                    <input
                      type="number"
                      step="0.50"
                      className="wjl-input"
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      value={delivery.ownDelivery.deliveryFee}
                      onChange={(e) => updateOwnDelivery({ deliveryFee: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="wjl-form-group">
                    <label className="wjl-label" style={{ fontSize: '11px' }}>Min Order ({currency})</label>
                    <input
                      type="number"
                      step="1"
                      className="wjl-input"
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      value={delivery.ownDelivery.minOrderAmount}
                      onChange={(e) => updateOwnDelivery({ minOrderAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="wjl-form-group">
                    <label className="wjl-label" style={{ fontSize: '11px' }}>Est. Time (Mins)</label>
                    <input
                      type="number"
                      className="wjl-input"
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      value={delivery.ownDelivery.estimatedMinutes}
                      onChange={(e) => updateOwnDelivery({ estimatedMinutes: parseInt(e.target.value) || 30 })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sub-option B: Third Party Delivery */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: delivery.thirdParty.enabled ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: delivery.thirdParty.enabled ? '14px' : 0 }}>
                <label className="wjl-switch-label">
                  <div
                    className={`wjl-switch-toggle ${delivery.thirdParty.enabled ? 'checked' : ''}`}
                    onClick={() => updateThirdParty({ enabled: !delivery.thirdParty.enabled })}
                  />
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>Third Party Delivery Integration</span>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>Automatically hail on-demand couriers via DoorDash Drive, Stuart, or Shipday.</p>
                  </div>
                </label>
              </div>

              {delivery.thirdParty.enabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="wjl-form-group">
                      <label className="wjl-label" style={{ fontSize: '11px' }}>Courier Partner Platform</label>
                      <select
                        className="wjl-select"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        value={delivery.thirdParty.provider}
                        onChange={(e: any) => updateThirdParty({ provider: e.target.value })}
                      >
                        <option value="doordash_drive">DoorDash Drive Fleet</option>
                        <option value="stuart">Stuart Delivery API</option>
                        <option value="shipday">Shipday Auto-Dispatch</option>
                        <option value="other">Custom Courier Webhook</option>
                      </select>
                    </div>

                    <div className="wjl-form-group">
                      <label className="wjl-label" style={{ fontSize: '11px' }}>Partner API / Secret Key</label>
                      <input
                        type="password"
                        className="wjl-input"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        value={delivery.thirdParty.apiKey}
                        onChange={(e) => updateThirdParty({ apiKey: e.target.value })}
                        placeholder="e.g. ddd_live_sec_991823901"
                      />
                    </div>
                  </div>

                  <div className="wjl-form-group">
                    <label className="wjl-label" style={{ fontSize: '11px' }}>Webhook Dispatch Endpoint</label>
                    <input
                      type="text"
                      className="wjl-input"
                      style={{ padding: '8px 12px', fontSize: '13px', fontFamily: 'monospace' }}
                      value={delivery.thirdParty.webhookUrl}
                      onChange={(e) => updateThirdParty({ webhookUrl: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sub-option C: Uber Eats */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: delivery.uberEats.enabled ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: delivery.uberEats.enabled ? '14px' : 0 }}>
                <label className="wjl-switch-label">
                  <div
                    className={`wjl-switch-toggle ${delivery.uberEats.enabled ? 'checked' : ''}`}
                    onClick={() => updateUberEats({ enabled: !delivery.uberEats.enabled })}
                  />
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>Uber Eats Integration</span>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>Sync orders and menu directly with your Uber Eats Restaurant Merchant account.</p>
                  </div>
                </label>
              </div>

              {delivery.uberEats.enabled && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="wjl-form-group">
                    <label className="wjl-label" style={{ fontSize: '11px' }}>Uber Eats Store UUID</label>
                    <input
                      type="text"
                      className="wjl-input"
                      style={{ padding: '8px 12px', fontSize: '13px', fontFamily: 'monospace' }}
                      value={delivery.uberEats.storeUuid}
                      onChange={(e) => updateUberEats({ storeUuid: e.target.value })}
                      placeholder="e.g. 5a1b3c4d-9988-7766-5544-332211000000"
                    />
                  </div>

                  <div className="wjl-form-group">
                    <label className="wjl-label" style={{ fontSize: '11px' }}>Merchant ID</label>
                    <input
                      type="text"
                      className="wjl-input"
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                      value={delivery.uberEats.merchantId}
                      onChange={(e) => updateUberEats({ merchantId: e.target.value })}
                      placeholder="e.g. merchant_bella_99"
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px' }}>
                    <label className="wjl-switch-label" style={{ fontSize: '12px' }}>
                      <div
                        className={`wjl-switch-toggle ${delivery.uberEats.autoAcceptOrders ? 'checked' : ''}`}
                        onClick={() => updateUberEats({ autoAcceptOrders: !delivery.uberEats.autoAcceptOrders })}
                      />
                      <span style={{ color: '#cbd5e1' }}>Auto-accept incoming Uber orders</span>
                    </label>

                    <label className="wjl-switch-label" style={{ fontSize: '12px' }}>
                      <div
                        className={`wjl-switch-toggle ${delivery.uberEats.menuSync ? 'checked' : ''}`}
                        onClick={() => updateUberEats({ menuSync: !delivery.uberEats.menuSync })}
                      />
                      <span style={{ color: '#cbd5e1' }}>Continuous Menu & Stock sync</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Dine In (Tables & QR Code generation) */}
      <div className={`wjl-delivery-card ${delivery.dineIn.enabled ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>🍽️</span>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Dine In</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Customers sit at your tables and can order directly via digital per-table QR codes.
              </p>
            </div>
          </div>

          <label className="wjl-switch-label">
            <div
              className={`wjl-switch-toggle ${delivery.dineIn.enabled ? 'checked' : ''}`}
              onClick={() => updateDineIn({ enabled: !delivery.dineIn.enabled })}
            />
            <span style={{ fontSize: '13px', color: delivery.dineIn.enabled ? '#34d399' : '#94a3b8' }}>
              {delivery.dineIn.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {delivery.dineIn.enabled && (
          <div className="wjl-sub-options-box">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
              <div className="wjl-form-group">
                <label className="wjl-label" htmlFor="tableCount">
                  <span>How many tables do you have? <span style={{ color: '#ef4444' }}>*</span></span>
                  <span className="wjl-label-hint">Generates unique table numbers</span>
                </label>
                <input
                  id="tableCount"
                  type="number"
                  min="1"
                  max="100"
                  className="wjl-input"
                  value={delivery.dineIn.tableCount}
                  onChange={(e) => updateDineIn({ tableCount: Math.max(1, parseInt(e.target.value) || 1) })}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="wjl-label">Put a QR code on each table?</span>
                <label className="wjl-switch-label">
                  <div
                    className={`wjl-switch-toggle ${delivery.dineIn.enableTableQr ? 'checked' : ''}`}
                    onClick={() => updateDineIn({ enableTableQr: !delivery.dineIn.enableTableQr })}
                  />
                  <span style={{ fontSize: '13px', color: delivery.dineIn.enableTableQr ? '#34d399' : '#94a3b8', fontWeight: 600 }}>
                    {delivery.dineIn.enableTableQr ? 'Yes, generate table QR codes' : 'No, skip table QR'}
                  </span>
                </label>
              </div>
            </div>

            {delivery.dineIn.enableTableQr && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                    Generated Table QR Codes ({delivery.dineIn.tableCount} tables ready to print):
                  </span>
                  <span style={{ fontSize: '11px', color: '#38bdf8' }}>Click any card to preview full tent card</span>
                </div>

                <div className="wjl-qr-grid">
                  {Array.from({ length: Math.min(delivery.dineIn.tableCount, 12) }, (_, i) => i + 1).map((tableNum) => (
                    <div
                      key={tableNum}
                      className="wjl-qr-card"
                      onClick={() => setSelectedTableForQr(tableNum)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="wjl-qr-code-box">
                        <QrCodeIcon size={38} color="#0f172a" />
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Table #{tableNum}</div>
                      <span className="wjl-badge wjl-badge-green" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        Ready
                      </span>
                    </div>
                  ))}
                  {delivery.dineIn.tableCount > 12 && (
                    <div className="wjl-qr-card" style={{ justifyContent: 'center' }}>
                      <span style={{ fontSize: '18px' }}>➕</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        +{delivery.dineIn.tableCount - 12} more tables
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Code Inspection Modal */}
      {selectedTableForQr !== null && (
        <div className="wjl-modal-overlay">
          <div className="wjl-modal-content" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              Table #{selectedTableForQr} QR Code
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              {shopName} • Scan to open menu with table #{selectedTableForQr} pre-selected
            </p>

            <div style={{
              background: '#ffffff',
              padding: '28px',
              borderRadius: '16px',
              display: 'inline-block',
              margin: '0 auto 16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
            }}>
              <QrCodeIcon size={160} color="#0f172a" />
              <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '16px', marginTop: '10px' }}>
                TABLE #{selectedTableForQr}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setSelectedTableForQr(null)}
                className="wjl-btn wjl-btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="wjl-step-actions">
        <button type="button" onClick={onBack} className="wjl-btn wjl-btn-secondary">
          <ChevronLeftIcon size={16} />
          <span>Back</span>
        </button>
        <button type="button" onClick={onNext} className="wjl-btn wjl-btn-primary">
          <span>Confirm & Next: Payment Options</span>
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
