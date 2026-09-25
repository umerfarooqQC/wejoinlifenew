import React, { useState } from 'react';
import { LocationInfo } from '../types';
import { MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from '../common/Icons';

interface StepLocationProps {
  location: LocationInfo;
  onChange: (updated: Partial<LocationInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepLocation: React.FC<StepLocationProps> = ({ location, onChange, onNext, onBack }) => {
  const [pinOffset, setPinOffset] = useState({ x: 50, y: 50 });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinOffset({ x, y });

    // Slight shift in simulated lat/long
    const newLat = +(location.latitude + (50 - y) * 0.001).toFixed(4);
    const newLng = +(location.longitude + (x - 50) * 0.001).toFixed(4);
    onChange({ latitude: newLat, longitude: newLng });
  };

  const handlePresetLocation = (city: string, state: string, lat: number, lng: number) => {
    onChange({
      city,
      state,
      latitude: lat,
      longitude: lng
    });
    setPinOffset({ x: 50, y: 50 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.addressLine1.trim() || !location.city.trim()) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="wjl-step-card">
      <div className="wjl-step-title">
        <MapPinIcon size={24} className="text-rose-500" />
        <span>Step 2 of 8: Shop Location & Address</span>
      </div>
      <p className="wjl-step-desc">
        Click on the interactive map to fine-tune your exact storefront pinpoint, and ensure your street address is accurate for drivers & customers.
      </p>

      {/* Interactive Map Visual */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
            Interactive GPS Pinpoint (Click anywhere on map to reposition)
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handlePresetLocation('Springfield', 'OR', 44.0462, -123.0220)}
              className="wjl-btn wjl-btn-secondary wjl-btn-sm"
            >
              📍 Center Town
            </button>
            <button
              type="button"
              onClick={() => handlePresetLocation('Downtown', 'OR', 44.0510, -123.0180)}
              className="wjl-btn wjl-btn-secondary wjl-btn-sm"
            >
              🏙️ Commercial Plaza
            </button>
          </div>
        </div>

        <div className="wjl-map-container" onClick={handleMapClick}>
          {/* Animated Map Pin */}
          <div
            className="wjl-map-pin"
            style={{
              left: `${pinOffset.x}%`,
              top: `${pinOffset.y}%`
            }}
          >
            <div className="wjl-map-pin-bubble">
              {location.addressLine1 || 'Storefront Entrance'}
            </div>
            <div className="wjl-map-pin-icon">
              <MapPinIcon size={34} />
            </div>
          </div>

          <div className="wjl-map-info-badge">
            <span>Lat: <strong>{location.latitude.toFixed(4)}</strong></span>
            <span>•</span>
            <span>Lng: <strong>{location.longitude.toFixed(4)}</strong></span>
            <span>•</span>
            <span>Accurate GPS Lock ✓</span>
          </div>
        </div>
      </div>

      {/* Address Form Fields */}
      <div className="wjl-form-grid">
        <div className="wjl-form-group" style={{ gridColumn: 'span 2' }}>
          <label className="wjl-label" htmlFor="address1">
            <span>Street Address Line 1 <span style={{ color: '#ef4444' }}>*</span></span>
            <span className="wjl-label-hint">Door number & street name</span>
          </label>
          <input
            id="address1"
            type="text"
            className="wjl-input"
            value={location.addressLine1}
            onChange={(e) => onChange({ addressLine1: e.target.value })}
            placeholder="e.g. 742 Evergreen Terrace"
            required
          />
        </div>

        <div className="wjl-form-group">
          <label className="wjl-label" htmlFor="address2">
            <span>Address Line 2 (Optional)</span>
            <span className="wjl-label-hint">Suite, Floor, Unit</span>
          </label>
          <input
            id="address2"
            type="text"
            className="wjl-input"
            value={location.addressLine2 || ''}
            onChange={(e) => onChange({ addressLine2: e.target.value })}
            placeholder="e.g. Suite 104"
          />
        </div>

        <div className="wjl-form-group">
          <label className="wjl-label" htmlFor="city">
            <span>City <span style={{ color: '#ef4444' }}>*</span></span>
          </label>
          <input
            id="city"
            type="text"
            className="wjl-input"
            value={location.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="e.g. Springfield"
            required
          />
        </div>

        <div className="wjl-form-group">
          <label className="wjl-label" htmlFor="state">
            <span>State / Province</span>
          </label>
          <input
            id="state"
            type="text"
            className="wjl-input"
            value={location.state}
            onChange={(e) => onChange({ state: e.target.value })}
            placeholder="e.g. OR"
          />
        </div>

        <div className="wjl-form-group">
          <label className="wjl-label" htmlFor="postalCode">
            <span>Postal / ZIP Code <span style={{ color: '#ef4444' }}>*</span></span>
          </label>
          <input
            id="postalCode"
            type="text"
            className="wjl-input"
            value={location.postalCode}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            placeholder="e.g. 97477"
            required
          />
        </div>

        <div className="wjl-form-group">
          <label className="wjl-label" htmlFor="country">
            <span>Country</span>
          </label>
          <input
            id="country"
            type="text"
            className="wjl-input"
            value={location.country}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder="United States"
          />
        </div>

        <div className="wjl-form-group" style={{ gridColumn: 'span 2' }}>
          <label className="wjl-label" htmlFor="deliveryNotes">
            <span>Delivery & Parking Instructions (Optional)</span>
            <span className="wjl-label-hint">Helps courier riders find the entrance</span>
          </label>
          <input
            id="deliveryNotes"
            type="text"
            className="wjl-input"
            value={location.deliveryNotes || ''}
            onChange={(e) => onChange({ deliveryNotes: e.target.value })}
            placeholder="e.g. Ring the side gate doorbell, customer parking in rear"
          />
        </div>
      </div>

      <div className="wjl-step-actions">
        <button type="button" onClick={onBack} className="wjl-btn wjl-btn-secondary">
          <ChevronLeftIcon size={16} />
          <span>Back</span>
        </button>
        <button type="submit" className="wjl-btn wjl-btn-primary">
          <span>Confirm & Next: Timings</span>
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </form>
  );
};
