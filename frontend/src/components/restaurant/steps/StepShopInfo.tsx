import React from 'react';
import { ShopInfo } from '../types';
import { StoreIcon, SparklesIcon } from '../common/Icons';

interface StepShopInfoProps {
  shopInfo: ShopInfo;
  onChange: (updated: Partial<ShopInfo>) => void;
  onNext: () => void;
}

export const StepShopInfo: React.FC<StepShopInfoProps> = ({ shopInfo, onChange, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopInfo.name.trim()) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="wjl-step-card">
      <div className="wjl-step-title">
        <StoreIcon size={24} className="text-cyan-400" />
        <span>Step 1 of 8: Shop Name & Description</span>
      </div>
      <p className="wjl-step-desc">
        We imported these details from your mobile app scan. You can customize them anytime to match your branding.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="wjl-form-group">
            <label className="wjl-label" htmlFor="shopName">
              <span>Restaurant / Shop Name <span style={{ color: '#ef4444' }}>*</span></span>
              <span className="wjl-label-hint">Shown to your customers</span>
            </label>
            <input
              id="shopName"
              type="text"
              className="wjl-input"
              value={shopInfo.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Bella Italia Bistro"
              required
            />
          </div>

          <div className="wjl-form-group">
            <label className="wjl-label" htmlFor="cuisineType">
              <span>Cuisine / Restaurant Category</span>
              <span className="wjl-label-hint">e.g. Italian, Burgers, Cafe</span>
            </label>
            <input
              id="cuisineType"
              type="text"
              className="wjl-input"
              value={shopInfo.cuisineType}
              onChange={(e) => onChange({ cuisineType: e.target.value })}
              placeholder="e.g. Italian & Mediterranean"
            />
          </div>

          <div className="wjl-form-group">
            <label className="wjl-label" htmlFor="tagline">
              <span>Catchy Tagline</span>
              <span className="wjl-label-hint">One-liner on store banner</span>
            </label>
            <input
              id="tagline"
              type="text"
              className="wjl-input"
              value={shopInfo.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="e.g. Artisanal Wood-Fired Pizza & Homemade Pasta"
            />
          </div>

          <div className="wjl-form-group">
            <label className="wjl-label" htmlFor="shopDesc">
              <span>Shop Description</span>
              <span className="wjl-label-hint">{shopInfo.description.length} characters</span>
            </label>
            <textarea
              id="shopDesc"
              className="wjl-textarea"
              rows={4}
              value={shopInfo.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Tell your customers about your specialties, ingredients, and story..."
            />
          </div>

          <div className="wjl-form-grid">
            <div className="wjl-form-group">
              <label className="wjl-label" htmlFor="shopPhone">
                <span>Contact Phone</span>
              </label>
              <input
                id="shopPhone"
                type="tel"
                className="wjl-input"
                value={shopInfo.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="wjl-form-group">
              <label className="wjl-label" htmlFor="shopEmail">
                <span>Orders Notification Email</span>
              </label>
              <input
                id="shopEmail"
                type="email"
                className="wjl-input"
                value={shopInfo.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="orders@restaurant.com"
              />
            </div>
          </div>
        </div>

        {/* Live Customer Preview Card */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SparklesIcon size={14} className="text-amber-400" />
            <span>Customer Mobile Preview</span>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '18px',
            padding: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              height: '80px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '28px',
              marginBottom: '16px'
            }}>
              🍕
            </div>

            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              {shopInfo.name || 'Your Restaurant Name'}
            </div>

            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600, marginBottom: '8px' }}>
              {shopInfo.cuisineType || 'Cuisine Type'}
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
              {shopInfo.tagline || shopInfo.description || 'Welcome to our digital menu! Order fresh, fast, and direct.'}
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '11px',
              color: '#cbd5e1'
            }}>
              <div>📞 {shopInfo.phone || 'Phone not set'}</div>
              <div>✉️ {shopInfo.email || 'Email not set'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="wjl-step-actions">
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          * Required fields
        </div>
        <button type="submit" className="wjl-btn wjl-btn-primary">
          <span>Confirm & Next: Location</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
