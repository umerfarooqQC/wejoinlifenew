import React, { useState } from 'react';
import { ChevronLeft, MoreVertical, ArrowRight, Check, X } from 'lucide-react';
import { Button } from '../../../components/ui/actions/Button';

export interface Step8CreateCombosProps {
  onNext: (combos: any[]) => void;
  onBack: () => void;
}

export interface ComboItem {
  id: string;
  name: string;
  price: number;
}

const MENU_PRODUCTS: ComboItem[] = [
  { id: '1', name: 'Margherita Pizza', price: 14.99 },
  { id: '2', name: 'Crispy Chicken Burger', price: 12.50 },
  { id: '3', name: 'Caesar Salad', price: 9.99 },
  { id: '4', name: 'Pasta Carbonara', price: 16.99 },
  { id: '5', name: 'Tiramisu', price: 7.50 },
  { id: '6', name: 'Classic Soft Drink', price: 3.50 },
];

export const Step8CreateCombos: React.FC<Step8CreateCombosProps> = ({ onNext, onBack }) => {
  const [comboName, setComboName] = useState('');
  const [comboPrice, setComboPrice] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [combosList, setCombosList] = useState<any[]>([]);

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((item) => item !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const canAdd = comboName.trim() !== '' && selectedProductIds.length >= 2;

  const handleAddCombo = () => {
    if (!canAdd) return;
    const newCombo = {
      id: Math.random().toString(),
      name: comboName,
      price: parseFloat(comboPrice) || 10.00,
      itemCount: selectedProductIds.length,
    };
    setCombosList([...combosList, newCombo]);
    setComboName('');
    setComboPrice('');
    setSelectedProductIds([]);
  };

  const removeCombo = (id: string) => {
    setCombosList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="wjl-ob-step">
      {/* Top Header with Step Tag & Overflow Button */}
      <div className="wjl-ob-step__topbar">
        <button type="button" className="wjl-ob-back-circle-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <div className="wjl-ob-topbar-center">
          <span className="wjl-ob-step-tag">STEP 3 OF 4</span>
          <h1 className="wjl-ob-header-title">Combos</h1>
        </div>
        <button type="button" className="wjl-ob-back-circle-btn" aria-label="Options">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* 4-Step Progress Bar */}
      <div className="wjl-ob-progress-track-wrapper">
        <div className="wjl-ob-track-line-bg">
          <div className="wjl-ob-track-line-fill" style={{ width: '75%' }} />
        </div>
        <div className="wjl-ob-step-pills-row">
          <span className="wjl-ob-step-circle wjl-ob-step-circle--done">
            <Check size={12} strokeWidth={3} />
          </span>
          <span className="wjl-ob-step-circle wjl-ob-step-circle--done">
            <Check size={12} strokeWidth={3} />
          </span>
          <span className="wjl-ob-step-circle wjl-ob-step-circle--active">3</span>
          <span className="wjl-ob-step-circle">4</span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <h2 className="wjl-ob-serif-title" style={{ fontSize: '20px', marginTop: '16px' }}>
        Create Combos
      </h2>
      <p className="wjl-ob-subtitle" style={{ marginBottom: '16px' }}>
        Bundle items together at a special price. Great for value meals.
      </p>

      {/* Combo Inputs Row */}
      <div className="wjl-combo-form-row">
        <input
          type="text"
          placeholder="Combo name..."
          value={comboName}
          onChange={(e) => setComboName(e.target.value)}
          className="wjl-combo-input"
        />
        <input
          type="text"
          placeholder="$0.00"
          value={comboPrice}
          onChange={(e) => setComboPrice(e.target.value)}
          className="wjl-combo-price-input"
        />
      </div>

      {/* Select Items List */}
      <div className="wjl-ob-section">
        <h3 className="wjl-ob-section-label">SELECT ITEMS (MIN 2)</h3>
        <div className="wjl-combo-items-list">
          {MENU_PRODUCTS.map((prod) => {
            const isChecked = selectedProductIds.includes(prod.id);
            return (
              <div
                key={prod.id}
                className={`wjl-combo-item-card ${isChecked ? 'wjl-combo-item-card--selected' : ''}`}
                onClick={() => toggleProduct(prod.id)}
              >
                <div className="wjl-combo-item-info">
                  <span className="wjl-combo-item-name">{prod.name}</span>
                  <span className="wjl-combo-item-price">${prod.price.toFixed(2)}</span>
                </div>
                <div className={`wjl-combo-checkbox ${isChecked ? 'wjl-combo-checkbox--checked' : ''}`}>
                  {isChecked && <Check size={12} strokeWidth={3} color="#FFFFFF" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Combo Button */}
      <button
        type="button"
        className={`wjl-add-combo-btn ${canAdd ? 'wjl-add-combo-btn--active' : ''}`}
        onClick={handleAddCombo}
        disabled={!canAdd}
      >
        + Add Combo
      </button>

      {/* Saved Combos Section */}
      {combosList.length > 0 && (
        <div className="wjl-ob-section" style={{ marginTop: '20px' }}>
          <h3 className="wjl-ob-section-label">SAVED COMBOS</h3>
          <div className="wjl-saved-combos-list">
            {combosList.map((c) => (
              <div key={c.id} className="wjl-saved-combo-card">
                <div className="wjl-saved-combo-info">
                  <span className="wjl-saved-combo-name">{c.name}</span>
                  <span className="wjl-saved-combo-sub">
                    {c.itemCount} items · ${c.price.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  className="wjl-saved-combo-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCombo(c.id);
                  }}
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Action Buttons */}
      <div className="wjl-ob-step__footer" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button
          onClick={() => onNext(combosList)}
          variant="primary"
          size="lg"
          fullWidth
          pill
          rightIcon={<ArrowRight size={18} />}
        >
          Next
        </Button>
        <button type="button" className="wjl-ob-skip-btn" onClick={() => onNext([])}>
          Skip
        </button>
      </div>
    </div>
  );
};

