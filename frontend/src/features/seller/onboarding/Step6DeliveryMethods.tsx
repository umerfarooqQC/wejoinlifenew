import React, { useState } from 'react';
import { ArrowRight, MoreVertical, Eye, Save, X, Minus, Plus, QrCode, Truck, Package, Globe, Utensils } from 'lucide-react';
import { Button } from '../../../components/ui/actions/Button';

export interface Step6DeliveryMethodsProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const Step6DeliveryMethods: React.FC<Step6DeliveryMethodsProps> = ({ onNext }) => {
  const [selectedMethods, setSelectedMethods] = useState<string[]>(['dine-in']);
  const [menuOpen, setMenuOpen] = useState(false);

  // Dine In Interactive State
  const [tableCount, setTableCount] = useState<number>(2);
  const [generateQr, setGenerateQr] = useState<boolean | null>(true);

  const options: DeliveryOption[] = [
    {
      id: 'my-delivery',
      title: 'My Own Delivery',
      description: 'You deliver to customers yourself',
      emoji: '🛵',
    },
    {
      id: 'third-party',
      title: 'Third Party Delivery',
      description: 'Use an external delivery partner',
      emoji: '📦',
    },
    {
      id: 'uber-eats',
      title: 'Uber Eats',
      description: 'List on Uber Eats platform',
      emoji: '🟢',
    },
    {
      id: 'dine-in',
      title: 'Dine In',
      description: 'Customers eat at your restaurant',
      emoji: '🍽️',
    },
  ];

  const toggleOption = (id: string) => {
    if (selectedMethods.includes(id)) {
      setSelectedMethods(selectedMethods.filter((item) => item !== id));
    } else {
      setSelectedMethods([...selectedMethods, id]);
    }
  };

  const isDineInSelected = selectedMethods.includes('dine-in');

  const handleNextClick = () => {
    onNext({
      selectedMethods,
      dineInDetails: isDineInSelected
        ? {
            tableCount,
            generateQr,
          }
        : null,
    });
  };

  return (
    <div className="wjl-ob-step">
      {/* Top Bar with Step Text & Overflow Menu */}
      <div className="wjl-ob-step__topbar">
        <div className="wjl-ob-step-indicator-text">
          <span className="wjl-ob-step-tag">STEP 1 OF 4</span>
          <h2 className="wjl-ob-step-subtitle-heading">Delivery</h2>
        </div>

        <div className="wjl-ob-menu-relative">
          <button
            type="button"
            className="wjl-ob-three-dots-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Options"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="wjl-ob-popup-menu">
              <button type="button" onClick={() => setMenuOpen(false)}>
                <Save size={16} />
                <span>Save Draft</span>
              </button>
              <button type="button" onClick={() => setMenuOpen(false)}>
                <Eye size={16} />
                <span>Preview</span>
              </button>
              <button type="button" onClick={() => setMenuOpen(false)}>
                <X size={16} />
                <span>Close</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connected Step Progress Track (1, 2, 3, 4) */}
      <div className="wjl-ob-progress-track-wrapper">
        <div className="wjl-ob-track-line-bg">
          <div className="wjl-ob-track-line-fill" style={{ width: '25%' }} />
        </div>
        <div className="wjl-ob-step-pills-row">
          <span className="wjl-ob-step-circle wjl-ob-step-circle--active">1</span>
          <span className="wjl-ob-step-circle">2</span>
          <span className="wjl-ob-step-circle">3</span>
          <span className="wjl-ob-step-circle">4</span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="wjl-ob-step__header">
        <h1 className="wjl-ob-serif-title">Delivery Methods</h1>
        <p className="wjl-ob-subtitle-text">
          How will customers receive their orders? Select all that apply.
        </p>
      </div>

      {/* Delivery Options List */}
      <div className="wjl-ob-delivery-list">
        {options.map((opt) => {
          const isChecked = selectedMethods.includes(opt.id);
          const isDineIn = opt.id === 'dine-in';

          return (
            <div
              key={opt.id}
              className={`wjl-ob-delivery-card-wrapper ${
                isChecked ? 'wjl-ob-delivery-card-wrapper--active' : ''
              }`}
            >
              <div
                className={`wjl-ob-delivery-card ${isChecked ? 'wjl-ob-delivery-card--active' : ''}`}
                onClick={() => toggleOption(opt.id)}
              >
                <div className="wjl-ob-delivery-card__emoji">{opt.emoji}</div>
                <div className="wjl-ob-delivery-card__text">
                  <h3
                    className={`wjl-ob-delivery-card__title ${
                      isChecked ? 'wjl-ob-delivery-card__title--active' : ''
                    }`}
                  >
                    {opt.title}
                  </h3>
                  <p className="wjl-ob-delivery-card__desc">{opt.description}</p>
                </div>
                <div
                  className={`wjl-ob-checkbox ${isChecked ? 'wjl-ob-checkbox--checked' : ''}`}
                >
                  {isChecked && <span>✓</span>}
                </div>
              </div>

              {/* Expanded Inline Section for Dine In */}
              {isDineIn && isChecked && (
                <div className="wjl-dine-in-expanded">
                  {/* 1. How many tables do you have? */}
                  <div className="wjl-dine-in-question">
                    <label className="wjl-dine-in-label">How many tables do you have?</label>
                    <div className="wjl-dine-in-counter-row">
                      <div className="wjl-dine-in-counter">
                        <button
                          type="button"
                          className="wjl-counter-btn"
                          onClick={() => setTableCount(Math.max(0, tableCount - 1))}
                          disabled={tableCount <= 0}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="wjl-counter-value">{tableCount}</span>
                        <button
                          type="button"
                          className="wjl-counter-btn wjl-counter-btn--plus"
                          onClick={() => setTableCount(tableCount + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="wjl-dine-in-unit">Tables</span>
                    </div>
                  </div>

                  {/* 2. Add a QR code to each table? (Shows when tableCount > 0) */}
                  {tableCount > 0 && (
                    <div className="wjl-dine-in-question" style={{ marginTop: '16px' }}>
                      <label className="wjl-dine-in-label">Add a QR code to each table?</label>
                      <div className="wjl-qr-btn-group">
                        <button
                          type="button"
                          className={`wjl-qr-choice-btn ${
                            generateQr === true ? 'wjl-qr-choice-btn--active' : ''
                          }`}
                          onClick={() => setGenerateQr(true)}
                        >
                          Yes, generate QR
                        </button>
                        <button
                          type="button"
                          className={`wjl-qr-choice-btn ${
                            generateQr === false ? 'wjl-qr-choice-btn--active-no' : ''
                          }`}
                          onClick={() => setGenerateQr(false)}
                        >
                          No thanks
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. Generated QR Codes Preview (Shows when generateQr is true) */}
                  {tableCount > 0 && generateQr === true && (
                    <div className="wjl-qr-preview-container">
                      <div className="wjl-qr-preview-header">
                        <QrCode size={16} className="wjl-qr-header-icon" />
                        <span>
                          <strong>{tableCount} QR {tableCount === 1 ? 'code' : 'codes'}</strong> will be generated
                        </span>
                      </div>

                      <div className="wjl-qr-grid">
                        {Array.from({ length: tableCount }).map((_, index) => (
                          <div key={index} className="wjl-qr-card">
                            <div className="wjl-qr-box">
                              {/* SVG Matrix placeholder matching QR Code pattern */}
                              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <rect width="40" height="40" rx="4" fill="#F7F4F0" />
                                <rect x="4" y="4" width="12" height="12" fill="#2B1D14" />
                                <rect x="6" y="6" width="8" height="8" fill="#FFF" />
                                <rect x="8" y="8" width="4" height="4" fill="#2B1D14" />
                                
                                <rect x="24" y="4" width="12" height="12" fill="#2B1D14" />
                                <rect x="26" y="6" width="8" height="8" fill="#FFF" />
                                <rect x="28" y="8" width="4" height="4" fill="#2B1D14" />

                                <rect x="4" y="24" width="12" height="12" fill="#2B1D14" />
                                <rect x="6" y="26" width="8" height="8" fill="#FFF" />
                                <rect x="8" y="28" width="4" height="4" fill="#2B1D14" />

                                <rect x="20" y="20" width="4" height="4" fill="#1BC2D5" />
                                <rect x="28" y="24" width="6" height="6" fill="#2B1D14" />
                                <rect x="20" y="28" width="6" height="6" fill="#1BC2D5" />
                              </svg>
                            </div>
                            <span className="wjl-qr-table-name">T{index + 1}</span>
                          </div>
                        ))}
                      </div>

                      <p className="wjl-qr-subtext">
                        Customers scan to view your menu and order from their table.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="wjl-ob-step__footer">
        <Button
          onClick={handleNextClick}
          variant="primary"
          size="lg"
          fullWidth
          pill
          rightIcon={<ArrowRight size={18} />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
