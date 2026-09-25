import React from 'react';
import { OnboardingState, MenuItem } from '../types';
import { CloseIcon, EditIcon, TrashIcon } from '../common/Icons';

interface LiveStoreModalProps {
  state: OnboardingState;
  onClose: () => void;
  onToggleItemAvailability: (id: string) => void;
}

export const LiveStoreModal: React.FC<LiveStoreModalProps> = ({
  state,
  onClose,
  onToggleItemAvailability
}) => {
  const { shopInfo, menuItems, combos, delivery } = state;
  const categories = Array.from(new Set(menuItems.map(i => i.category)));
  const availableCount = menuItems.filter(i => i.available).length;

  return (
    <div className="wjl-modal-overlay">
      <div className="wjl-modal-content" style={{ maxWidth: '800px', maxHeight: '85vh', padding: '24px' }}>
        {/* Modal Header */}
        <div className="wjl-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏪</span>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>
                Live Store Preview
              </h2>
              <span style={{ fontSize: '13px', color: '#38bdf8' }}>
                {shopInfo.name} • {shopInfo.cuisineType}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <CloseIcon size={22} />
          </button>
        </div>

        {/* Top Metric Cards - matching Screen 12 of PDF */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Items</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{menuItems.length}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Available</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{availableCount}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Categories</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>{categories.length}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Combos</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>{combos.length}</div>
          </div>
        </div>

        {/* Combos section if any */}
        {combos.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔥 Combos & Bundles</span>
              <span className="wjl-badge wjl-badge-blue">{combos.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
              {combos.map(combo => (
                <div key={combo.id} style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '10px',
                  padding: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: '#fff', fontSize: '14px' }}>{combo.name}</strong>
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>{shopInfo.currency}{combo.price.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {combo.itemIds.map(id => menuItems.find(m => m.id === id)?.name).filter(Boolean).join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categorized Menu Items - matching Screen 12 of PDF */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {categories.map(cat => {
            const items = menuItems.filter(i => i.category === cat);
            return (
              <div key={cat}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  paddingBottom: '6px',
                  marginBottom: '10px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
                    {cat}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.04)'
                      }}
                    >
                      <div style={{ maxWidth: '65%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>
                            {item.name}
                          </span>
                          <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px' }}>
                            {shopInfo.currency}{item.price.toFixed(2)}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                          {item.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label className="wjl-switch-label" style={{ fontSize: '11px' }}>
                          <div
                            className={`wjl-switch-toggle ${item.available ? 'checked' : ''}`}
                            onClick={() => onToggleItemAvailability(item.id)}
                          />
                          <span style={{ color: item.available ? '#34d399' : '#64748b' }}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button type="button" onClick={onClose} className="wjl-btn wjl-btn-primary">
            Back to Summary
          </button>
        </div>
      </div>
    </div>
  );
};
