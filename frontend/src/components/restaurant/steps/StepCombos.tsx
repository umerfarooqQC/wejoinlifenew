import React, { useState } from 'react';
import { ComboItem, MenuItem } from '../types';
import { LayersIcon, PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '../common/Icons';

interface StepCombosProps {
  combosEnabled: boolean;
  combos: ComboItem[];
  menuItems: MenuItem[];
  currency: string;
  onToggleEnabled: (enabled: boolean) => void;
  onCombosChange: (combos: ComboItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepCombos: React.FC<StepCombosProps> = ({
  combosEnabled,
  combos,
  menuItems,
  currency,
  onToggleEnabled,
  onCombosChange,
  onNext,
  onBack
}) => {
  const [comboName, setComboName] = useState('');
  const [comboPrice, setComboPrice] = useState<number>(15.00);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [comboDesc, setComboDesc] = useState('');

  const toggleItemSelection = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(i => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  // Calculate sum of individual items
  const regularTotal = selectedItemIds.reduce((sum, id) => {
    const item = menuItems.find(m => m.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const savings = regularTotal > comboPrice ? regularTotal - comboPrice : 0;

  const handleAddCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comboName.trim() || selectedItemIds.length < 2 || comboPrice <= 0) return;

    const newCombo: ComboItem = {
      id: `combo-${Date.now()}`,
      name: comboName.trim(),
      price: Number(comboPrice),
      itemIds: [...selectedItemIds],
      description: comboDesc.trim() || undefined
    };

    onCombosChange([...combos, newCombo]);
    setComboName('');
    setComboPrice(15.00);
    setSelectedItemIds([]);
    setComboDesc('');
  };

  const handleRemoveCombo = (id: string) => {
    onCombosChange(combos.filter(c => c.id !== id));
  };

  return (
    <div className="wjl-step-card">
      <div className="wjl-step-title">
        <LayersIcon size={24} className="text-purple-400" />
        <span>Step 7 of 8: Value Combos & Meal Deals</span>
      </div>
      <p className="wjl-step-desc">
        Bundle menu items together at a special promotional price. Combos drive higher order totals and increase customer satisfaction.
      </p>

      {/* Main toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Offer Combo Deals on Your Menu?</h4>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            You can create, edit, or disable combos at any time.
          </p>
        </div>

        <label className="wjl-switch-label">
          <div
            className={`wjl-switch-toggle ${combosEnabled ? 'checked' : ''}`}
            onClick={() => onToggleEnabled(!combosEnabled)}
          />
          <span style={{ fontSize: '13px', color: combosEnabled ? '#34d399' : '#94a3b8', fontWeight: 600 }}>
            {combosEnabled ? 'Yes, Create Combos' : 'No, Skip Combos'}
          </span>
        </label>
      </div>

      {combosEnabled && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
          {/* Combo Creation Form */}
          <form onSubmit={handleAddCombo} style={{
            background: 'rgba(10, 14, 23, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#38bdf8' }}>
              Create New Combo
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div className="wjl-form-group">
                <label className="wjl-label" htmlFor="comboName">Combo Name *</label>
                <input
                  id="comboName"
                  type="text"
                  className="wjl-input"
                  placeholder="e.g. Pizza & Drink Deal"
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  required
                />
              </div>

              <div className="wjl-form-group">
                <label className="wjl-label" htmlFor="comboPrice">Special Price ({currency}) *</label>
                <input
                  id="comboPrice"
                  type="number"
                  step="0.5"
                  className="wjl-input"
                  value={comboPrice}
                  onChange={(e) => setComboPrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            {/* Item multi-select */}
            <div className="wjl-form-group">
              <label className="wjl-label">
                <span>Select Items (minimum 2) *</span>
                <span className="wjl-label-hint">{selectedItemIds.length} selected</span>
              </label>

              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {menuItems.map(item => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', color: isSelected ? '#fff' : '#cbd5e1', fontWeight: isSelected ? 600 : 400 }}>
                          {item.name}
                        </span>
                        <span className="wjl-badge wjl-badge-gray" style={{ fontSize: '10px' }}>
                          {item.category}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
                        {currency}{item.price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pricing Savings Preview */}
            {selectedItemIds.length >= 2 && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#cbd5e1',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Regular Total: <strong style={{ textDecoration: savings > 0 ? 'line-through' : 'none' }}>{currency}{regularTotal.toFixed(2)}</strong></span>
                {savings > 0 && (
                  <span style={{ color: '#34d399', fontWeight: 700 }}>
                    🔥 Customer saves {currency}{savings.toFixed(2)}!
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!comboName.trim() || selectedItemIds.length < 2 || comboPrice <= 0}
              className="wjl-btn wjl-btn-primary"
              style={{ width: '100%' }}
            >
              <PlusIcon size={16} />
              <span>Save & Add Combo</span>
            </button>
          </form>

          {/* Saved Combos Shelf */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>
                Saved Combos ({combos.length})
              </h4>
            </div>

            {combos.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                border: '1px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                color: '#64748b',
                fontSize: '13px'
              }}>
                No combos created yet. Select at least 2 items and a combo price to build one.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {combos.map(c => {
                  const bundledItems = c.itemIds
                    .map(id => menuItems.find(m => m.id === id)?.name)
                    .filter(Boolean);

                  return (
                    <div
                      key={c.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '14px',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#38bdf8' }}>
                            {c.itemIds.length} items bundled
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 700, color: '#34d399' }}>
                            {currency}{c.price.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCombo(c.id)}
                            style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
                            title="Remove combo"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                        {bundledItems.map((name, i) => (
                          <span key={i} className="wjl-badge wjl-badge-gray" style={{ fontSize: '11px' }}>
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="wjl-step-actions">
        <button type="button" onClick={onBack} className="wjl-btn wjl-btn-secondary">
          <ChevronLeftIcon size={16} />
          <span>Back</span>
        </button>
        <button type="button" onClick={onNext} className="wjl-btn wjl-btn-primary">
          <span>Complete Setup ➔ Restaurant Summary</span>
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
