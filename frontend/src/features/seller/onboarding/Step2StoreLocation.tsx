import React, { useState } from 'react';
import { ChevronLeft, Search, ArrowRight, Crosshair, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/actions/Button';
import { FormField } from '../../../components/ui/form/FormField';
import { Input } from '../../../components/ui/form/Input';

export interface Step2StoreLocationProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export const Step2StoreLocation: React.FC<Step2StoreLocationProps> = ({
  onNext,
  onBack,
  initialData,
}) => {
  const [street, setStreet] = useState(initialData?.street || 'Sheikh Zayed Road');
  const [building, setBuilding] = useState(initialData?.building || 'Marina Plaza, Tower B');
  const [floor, setFloor] = useState(initialData?.floor || '3rd');
  const [postalCode, setPostalCode] = useState(initialData?.postalCode || '00000');
  const [city, setCity] = useState(initialData?.city || 'Dubai');
  const [country, setCountry] = useState(initialData?.country || 'UAE');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ street, building, floor, postalCode, city, country });
  };

  return (
    <form className="wjl-ob-step" onSubmit={handleSubmit}>
      {/* Top Header */}
      <div className="wjl-ob-step__topbar">
        <button type="button" className="wjl-ob-back-circle-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <h1 className="wjl-ob-header-title">Store Location</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Address Search Bar */}
      <div className="wjl-ob-search-wrapper">
        <Search size={18} className="wjl-ob-search-icon" />
        <input
          type="text"
          placeholder="Search for your restaurant address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="wjl-ob-search-input"
        />
      </div>

      {/* Map Preview Box */}
      <div className="wjl-ob-map-container">
        {/* Realistic Stylized Map Vector Grid */}
        <svg className="wjl-ob-map-svg" viewBox="0 0 400 220" preserveAspectRatio="none">
          {/* Base Street Background */}
          <rect width="400" height="220" fill="#F7F5F0" />

          {/* Main Horizontal Roads */}
          <rect x="0" y="55" width="400" height="16" fill="#FFFFFF" />
          <rect x="0" y="132" width="400" height="16" fill="#FFFFFF" />
          <rect x="235" y="94" width="75" height="10" fill="#FFFFFF" />

          {/* Main Vertical Roads */}
          <rect x="100" y="0" width="16" height="220" fill="#FFFFFF" />
          <rect x="220" y="0" width="15" height="220" fill="#FFFFFF" />
          <rect x="310" y="0" width="15" height="220" fill="#FFFFFF" />

          {/* Map Blocks - Soft Mint/Sage Greens */}
          {/* Top Row */}
          <rect x="8" y="8" width="84" height="39" rx="6" fill="#DDECE2" />
          <rect x="124" y="8" width="88" height="39" rx="6" fill="#E8F2EC" />
          <rect x="243" y="8" width="59" height="39" rx="6" fill="#DDECE2" />
          <rect x="333" y="8" width="59" height="39" rx="6" fill="#E8F2EC" />

          {/* Middle Row */}
          <rect x="8" y="79" width="84" height="45" rx="6" fill="#CFE6D7" />
          <rect x="124" y="79" width="88" height="45" rx="6" fill="#DDECE2" />
          <rect x="243" y="79" width="59" height="18" rx="4" fill="#CFE6D7" />
          <rect x="243" y="106" width="59" height="18" rx="4" fill="#DDECE2" />
          <rect x="333" y="79" width="59" height="45" rx="6" fill="#E8F2EC" />

          {/* Bottom Row */}
          <rect x="8" y="156" width="84" height="56" rx="6" fill="#E8F2EC" />
          <rect x="124" y="156" width="42" height="56" rx="6" fill="#DDECE2" />
          <rect x="174" y="156" width="38" height="56" rx="6" fill="#CFE6D7" />
          <rect x="243" y="156" width="59" height="56" rx="6" fill="#E8F2EC" />
          <rect x="333" y="156" width="59" height="56" rx="6" fill="#CFE6D7" />
        </svg>

        {/* Top Right Coordinates Tag */}
        <span className="wjl-ob-coords-pill">25.2048, 55.2708</span>

        {/* Center Map Pin */}
        <div className="wjl-ob-map-pin">
          <div className="wjl-ob-pin-bubble">
            <MapPin size={18} className="wjl-ob-pin-icon" />
          </div>
          <div className="wjl-ob-pin-stem" />
          <div className="wjl-ob-pin-shadow" />
        </div>

        {/* Bottom Tap Badge */}
        <span className="wjl-ob-map-badge">Tap map to move pin</span>
      </div>

      {/* Use Current Location Button */}
      <button type="button" className="wjl-ob-location-btn">
        <Crosshair size={18} className="wjl-location-btn-icon" />
        <span>Use my current location</span>
      </button>

      {/* Divider */}
      <div className="wjl-ob-divider">
        <span>Enter address manually</span>
      </div>

      {/* Manual Address Form */}
      <div className="wjl-ob-step__form">
        <FormField label="STREET ADDRESS">
          <Input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="e.g. Sheikh Zayed Road"
          />
        </FormField>

        <FormField label="BUILDING / APARTMENT">
          <Input
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            placeholder="e.g. Marina Plaza, Tower B"
          />
        </FormField>

        <div className="wjl-ob-form-row">
          <FormField label="FLOOR">
            <Input
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="e.g. 3rd"
            />
          </FormField>
          <FormField label="POSTAL CODE">
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="e.g. 00000"
            />
          </FormField>
        </div>

        <FormField label="CITY">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Dubai"
          />
        </FormField>

        <FormField label="COUNTRY">
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. UAE"
          />
        </FormField>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="wjl-ob-step__footer">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          pill
          rightIcon={<ArrowRight size={18} />}
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

