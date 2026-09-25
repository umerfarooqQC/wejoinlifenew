import React, { useState } from 'react';
import { ArrowRight, MoreVertical, Banknote, CreditCard, Wallet, Save, Eye, X } from 'lucide-react';
import { Button } from '../../../components/ui/actions/Button';

export interface Step7PaymentMethodsProps {
  onNext: (methods: string[]) => void;
  onBack: () => void;
}

export interface PaymentOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const Step7PaymentMethods: React.FC<Step7PaymentMethodsProps> = ({ onNext, onBack }) => {
  const [selectedMethods, setSelectedMethods] = useState<string[]>(['cod', 'paypal']);
  const [menuOpen, setMenuOpen] = useState(false);

  const options: PaymentOption[] = [
    {
      id: 'cod',
      title: 'Cash on Delivery',
      description: 'Collect payment in cash on order arrival',
      icon: <Banknote size={20} className="wjl-payment-icon" />,
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Accept instant payments online',
      icon: <Wallet size={20} className="wjl-payment-icon" />,
    },
    {
      id: 'card',
      title: 'Credit / Debit Card',
      description: 'Accept Visa, Mastercard & Amex payments',
      icon: <CreditCard size={20} className="wjl-payment-icon" />,
    },
  ];

  const toggleOption = (id: string) => {
    if (selectedMethods.includes(id)) {
      setSelectedMethods(selectedMethods.filter((item) => item !== id));
    } else {
      setSelectedMethods([...selectedMethods, id]);
    }
  };

  return (
    <div className="wjl-ob-step">
      {/* Top Bar with Step Tag & Overflow Menu */}
      <div className="wjl-ob-step__topbar">
        <div className="wjl-ob-step-indicator-text">
          <span className="wjl-ob-step-tag">STEP 2 OF 4</span>
          <h2 className="wjl-ob-step-subtitle-heading">Payment</h2>
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

      {/* Connected Step Progress Track (1 done, 2 active, 3, 4) */}
      <div className="wjl-ob-progress-track-wrapper">
        <div className="wjl-ob-track-line-bg">
          <div className="wjl-ob-track-line-fill" style={{ width: '50%' }} />
        </div>
        <div className="wjl-ob-step-pills-row">
          <span className="wjl-ob-step-circle wjl-ob-step-circle--active">1</span>
          <span className="wjl-ob-step-circle wjl-ob-step-circle--active">2</span>
          <span className="wjl-ob-step-circle">3</span>
          <span className="wjl-ob-step-circle">4</span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="wjl-ob-step__header">
        <h1 className="wjl-ob-serif-title">Payment Methods</h1>
        <p className="wjl-ob-subtitle-text">
          Which payment options will you accept? Select all that apply.
        </p>
      </div>

      {/* Payment Options List */}
      <div className="wjl-ob-delivery-list">
        {options.map((opt) => {
          const isChecked = selectedMethods.includes(opt.id);
          return (
            <div
              key={opt.id}
              className={`wjl-ob-delivery-card ${isChecked ? 'wjl-ob-delivery-card--active' : ''}`}
              onClick={() => toggleOption(opt.id)}
            >
              <div className="wjl-ob-delivery-card__emoji" style={{ color: isChecked ? 'var(--wjl-color-primary)' : 'var(--wjl-color-text-primary)' }}>
                {opt.icon}
              </div>
              <div className="wjl-ob-delivery-card__text">
                <h3 className={`wjl-ob-delivery-card__title ${isChecked ? 'wjl-ob-delivery-card__title--active' : ''}`}>
                  {opt.title}
                </h3>
                <p className="wjl-ob-delivery-card__desc">{opt.description}</p>
              </div>
              <div className={`wjl-ob-checkbox ${isChecked ? 'wjl-ob-checkbox--checked' : ''}`}>
                {isChecked && <span>✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="wjl-ob-step__footer">
        <Button
          onClick={() => onNext(selectedMethods)}
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
