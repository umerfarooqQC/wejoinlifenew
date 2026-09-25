import React, { useState } from 'react';
import { OnboardingState } from '../types';
import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  StoreIcon,
  MapPinIcon,
  ClockIcon,
  UtensilsIcon,
  TruckIcon,
  CreditCardIcon,
  LayersIcon,
  QrCodeIcon,
  ChevronLeftIcon,
  ExternalLinkIcon
} from '../common/Icons';
import { LiveStoreModal } from './LiveStoreModal';

interface StepSummaryProps {
  state: OnboardingState;
  onGoToStep: (step: number) => void;
  onToggleItemAvailability: (id: string) => void;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  state,
  onGoToStep,
  onToggleItemAvailability
}) => {
  const [copied, setCopied] = useState(false);
  const [showLiveStore, setShowLiveStore] = useState(false);
  const [activePdfPreview, setActivePdfPreview] = useState<'menu' | 'timings' | 'qr' | null>(null);

  const { shopInfo, location, weekdayTimings, holidayTimings, menuItems, delivery, payment, combos } = state;

  const storeSlug = shopInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'my-restaurant';
  const shopUrl = `https://wejoinlife.com/store/${storeSlug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="wjl-step-card">
      {/* Ready Celebration Hero */}
      <div className="wjl-ready-hero">
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', marginBottom: '12px' }}>
          <CheckCircleIcon size={44} className="text-emerald-400" />
        </div>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          🎉 Your Restaurant is Ready!
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '600px', margin: '0 auto 16px' }}>
          All onboarding settings have been configured. Your digital storefront is live and ready to accept customer orders across pickup, delivery, and table QR.
        </p>

        {/* Shop URL Box */}
        <div className="wjl-url-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🔗</span>
            <span className="wjl-url-text">{shopUrl}</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="wjl-btn wjl-btn-secondary wjl-btn-sm"
              title="Copy Shop URL"
            >
              <CopyIcon size={14} />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLiveStore(true)}
              className="wjl-btn wjl-btn-primary wjl-btn-sm"
            >
              <span>Visit Store</span>
              <ExternalLinkIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Export Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          📄 Ready-to-Print Marketing & Operational PDFs
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
          Download pre-formatted printable PDFs for in-store displays, table tents, and operating schedules.
        </p>

        <div className="wjl-pdf-grid">
          {/* 1. PDF of the Menu */}
          <div className="wjl-pdf-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '26px' }}>📜</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>PDF of the Menu</h4>
                  <span style={{ fontSize: '11px', color: '#38bdf8' }}>{menuItems.length} items & categories</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Full customer-facing menu sheet formatted for clean A4 printing with item descriptions and prices.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActivePdfPreview('menu')}
                className="wjl-btn wjl-btn-secondary wjl-btn-sm"
                style={{ flex: 1 }}
              >
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => { setActivePdfPreview('menu'); setTimeout(handlePrintPdf, 300); }}
                className="wjl-btn wjl-btn-primary wjl-btn-sm"
                style={{ flex: 1 }}
              >
                <DownloadIcon size={14} />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {/* 2. PDF of the Timings */}
          <div className="wjl-pdf-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '26px' }}>🕒</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>PDF of the Timings</h4>
                  <span style={{ fontSize: '11px', color: '#10b981' }}>Weekly & Holiday Hours</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Storefront door window sign displaying business hours and special holiday schedule.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActivePdfPreview('timings')}
                className="wjl-btn wjl-btn-secondary wjl-btn-sm"
                style={{ flex: 1 }}
              >
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => { setActivePdfPreview('timings'); setTimeout(handlePrintPdf, 300); }}
                className="wjl-btn wjl-btn-primary wjl-btn-sm"
                style={{ flex: 1 }}
              >
                <DownloadIcon size={14} />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {/* 3. PDF for QR Code */}
          <div className="wjl-pdf-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '26px' }}>📱</span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>PDF for Menu QR Code</h4>
                  <span style={{ fontSize: '11px', color: '#c084fc' }}>
                    {delivery.dineIn.enableTableQr ? `${delivery.dineIn.tableCount} Tables + Master QR` : 'Master Store QR'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Tabletop tent cards with scannable QR code and restaurant branding for contactless ordering.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActivePdfPreview('qr')}
                className="wjl-btn wjl-btn-secondary wjl-btn-sm"
                style={{ flex: 1 }}
              >
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => { setActivePdfPreview('qr'); setTimeout(handlePrintPdf, 300); }}
                className="wjl-btn wjl-btn-primary wjl-btn-sm"
                style={{ flex: 1 }}
              >
                <DownloadIcon size={14} />
                <span>Print PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary of all 7 Steps */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          📋 Summary of Configured Steps
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {/* Step 1 Summary */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '13px' }}>
                <StoreIcon size={16} />
                <span>1. Shop Name & Details</span>
              </div>
              <button type="button" onClick={() => onGoToStep(1)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                Edit ✏️
              </button>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{shopInfo.name}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{shopInfo.cuisineType}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>📞 {shopInfo.phone} | ✉️ {shopInfo.email}</div>
          </div>

          {/* Step 2 Summary */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f43f5e', fontWeight: 700, fontSize: '13px' }}>
                <MapPinIcon size={16} />
                <span>2. Store Location</span>
              </div>
              <button type="button" onClick={() => onGoToStep(2)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                Edit ✏️
              </button>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{location.addressLine1}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{location.city}, {location.state} {location.postalCode}, {location.country}</div>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontFamily: 'monospace', marginTop: '4px' }}>GPS: {location.latitude}, {location.longitude}</div>
          </div>

          {/* Step 3 Summary */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '13px' }}>
                <ClockIcon size={16} />
                <span>3. Operating Timings</span>
              </div>
              <button type="button" onClick={() => onGoToStep(3)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                Edit ✏️
              </button>
            </div>
            <div style={{ fontSize: '13px', color: '#fff' }}>
              Open {weekdayTimings.filter(w => w.isOpen).length} days / week
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Mon-Fri: {weekdayTimings[0].openTime} - {weekdayTimings[0].closeTime}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {holidayTimings.length} upcoming holiday exceptions configured
            </div>
          </div>

          {/* Step 4 Summary */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700, fontSize: '13px' }}>
                <UtensilsIcon size={16} />
                <span>4. Menu Items</span>
              </div>
              <button type="button" onClick={() => onGoToStep(4)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                Edit ✏️
              </button>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{menuItems.length} Dishes Scanned & Approved</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Categories: {Array.from(new Set(menuItems.map(i => i.category))).join(', ')}
            </div>
            <div style={{ fontSize: '11px', color: '#34d399', marginTop: '2px' }}>
              ✓ All {menuItems.filter(i => i.available).length} items currently available
            </div>
          </div>

          {/* Step 5 Summary */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '13px' }}>
                <TruckIcon size={16} />
                <span>5. Delivery & Dine-In</span>
              </div>
              <button type="button" onClick={() => onGoToStep(5)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                Edit ✏️
              </button>
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>{delivery.selfPickup ? '✓ Self Pickup active' : '✕ Pickup disabled'}</div>
              <div>
                {delivery.deliveryToClient ? (
                  <span>
                    ✓ Home Delivery: {delivery.ownDelivery.enabled ? 'Own fleet' : ''}{delivery.thirdParty.enabled ? ' + 3rd Party' : ''}{delivery.uberEats.enabled ? ' + Uber Eats' : ''}
                  </span>
                ) : '✕ Delivery disabled'}
              </div>
              <div>
                {delivery.dineIn.enabled ? `✓ Dine In active (${delivery.dineIn.tableCount} tables with QR)` : '✕ Dine-in disabled'}
              </div>
            </div>
          </div>

          {/* Step 6 & 7 Summary */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontWeight: 700, fontSize: '13px' }}>
                <CreditCardIcon size={16} />
                <span>6 & 7. Payments & Combos</span>
              </div>
              <button type="button" onClick={() => onGoToStep(6)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                Edit ✏️
              </button>
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Payments: {payment.cashOnDelivery ? 'Cash' : ''}{payment.stripe.enabled ? ' • Stripe Card' : ''}{payment.paypal.enabled ? ' • PayPal' : ''}</div>
              <div>Combos: {combos.length > 0 ? `${combos.length} active value bundles` : 'No combos created'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Modal / Printable Sheet Preview */}
      {activePdfPreview && (
        <div className="wjl-modal-overlay">
          <div className="wjl-modal-content" style={{ maxWidth: '680px', background: '#ffffff', color: '#0f172a', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {shopInfo.name}
                </h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {location.addressLine1}, {location.city} • {shopInfo.phone}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setActivePdfPreview(null)}
                  style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Menu PDF Content */}
            {activePdfPreview === 'menu' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Official Restaurant Menu
                </h3>
                {Array.from(new Set(menuItems.map(i => i.category))).map(cat => (
                  <div key={cat} style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', borderBottom: '1px dashed #cbd5e1', paddingBottom: '4px', marginBottom: '10px' }}>
                      {cat}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {menuItems.filter(i => i.category === cat).map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>{item.name}</span>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{item.description}</div>
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '14px', marginLeft: '16px' }}>
                            {shopInfo.currency}{item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Timings PDF Content */}
            {activePdfPreview === 'timings' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginBottom: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Store Operating Hours
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <tbody>
                    {weekdayTimings.map(t => (
                      <tr key={t.day} style={{ borderBottom: '1px solid #e2e8f0', padding: '8px 0' }}>
                        <td style={{ padding: '8px 0', fontWeight: 700 }}>{t.day}</td>
                        <td style={{ padding: '8px 0', textAlign: 'right', color: t.isOpen ? '#0f172a' : '#ef4444' }}>
                          {t.isOpen ? `${t.openTime} – ${t.closeTime}` : 'Closed'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {holidayTimings.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0284c7', marginBottom: '8px' }}>
                      Upcoming Holiday Dates
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                      {holidayTimings.map(h => (
                        <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{h.name} ({h.date})</span>
                          <span>{h.isOpen ? `${h.openTime} - ${h.closeTime}` : 'Closed'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* QR Code PDF Content */}
            {activePdfPreview === 'qr' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Scan & Order Direct
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                  Point your phone camera to view full digital menu
                </p>

                <div style={{ display: 'inline-block', border: '4px solid #0f172a', padding: '24px', borderRadius: '16px', background: '#fff', marginBottom: '16px' }}>
                  <QrCodeIcon size={180} color="#0f172a" />
                  <div style={{ fontWeight: 800, fontSize: '16px', marginTop: '12px' }}>
                    {shopInfo.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {shopUrl}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Store View Modal */}
      {showLiveStore && (
        <LiveStoreModal
          state={state}
          onClose={() => setShowLiveStore(false)}
          onToggleItemAvailability={onToggleItemAvailability}
        />
      )}

      <div className="wjl-step-actions">
        <button type="button" onClick={() => onGoToStep(7)} className="wjl-btn wjl-btn-secondary">
          <ChevronLeftIcon size={16} />
          <span>Back to Combos</span>
        </button>

        <button
          type="button"
          onClick={() => setShowLiveStore(true)}
          className="wjl-btn wjl-btn-success"
        >
          <StoreIcon size={18} />
          <span>Open Live Store View (PDF Screen 12)</span>
        </button>
      </div>
    </div>
  );
};
