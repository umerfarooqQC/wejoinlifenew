import React, { useState } from 'react';
import { MenuItem } from '../types';
import { UtensilsIcon, EditIcon, TrashIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../common/Icons';

interface StepMenuProps {
  menuItems: MenuItem[];
  currency: string;
  onChange: (items: MenuItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepMenu: React.FC<StepMenuProps> = ({
  menuItems,
  currency,
  onChange,
  onNext,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for editing or creating an item
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formCategory, setFormCategory] = useState('Mains');
  const [formDescription, setFormDescription] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setFormName(item.name);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormAvailable(item.available);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsAddingNew(true);
    setFormName('');
    setFormPrice(9.99);
    setFormCategory(selectedCategory !== 'All' ? selectedCategory : 'Mains');
    setFormDescription('');
    setFormAvailable(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isAddingNew) {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: formName.trim(),
        price: Number(formPrice),
        category: formCategory.trim() || 'Mains',
        description: formDescription.trim(),
        available: formAvailable
      };
      onChange([...menuItems, newItem]);
    } else if (editingItem) {
      const updated = menuItems.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formName.trim(),
              price: Number(formPrice),
              category: formCategory.trim(),
              description: formDescription.trim(),
              available: formAvailable
            }
          : item
      );
      onChange(updated);
    }
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleToggleAvailability = (id: string) => {
    const updated = menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    onChange(updated);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item from your menu?')) {
      onChange(menuItems.filter(item => item.id !== id));
    }
  };

  return (
    <div className="wjl-step-card">
      <div className="wjl-step-title">
        <UtensilsIcon size={24} className="text-amber-400" />
        <span>Step 4 of 8: Scanned Menu Review & Price Editing</span>
      </div>
      <p className="wjl-step-desc">
        Review items automatically detected from your menu scan. You can click any item to adjust its name, price, or description.
      </p>

      {/* Top Banner & Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✅</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#34d399' }}>
            Menu parsed: {menuItems.length} items across {new Set(menuItems.map(i => i.category)).size} categories
          </span>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="wjl-btn wjl-btn-primary wjl-btn-sm"
        >
          <PlusIcon size={14} />
          <span>Add Custom Item</span>
        </button>
      </div>

      {/* Controls: Category Filter + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`wjl-btn wjl-btn-sm ${selectedCategory === cat ? 'wjl-btn-primary' : 'wjl-btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '6px 14px' }}
            >
              {cat}
              <span style={{
                marginLeft: '6px',
                fontSize: '11px',
                opacity: 0.8,
                background: 'rgba(255,255,255,0.15)',
                padding: '1px 6px',
                borderRadius: '10px'
              }}>
                {cat === 'All' ? menuItems.length : menuItems.filter(i => i.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        <div style={{ minWidth: '220px' }}>
          <input
            type="text"
            className="wjl-input"
            style={{ padding: '8px 12px', fontSize: '13px' }}
            placeholder="🔍 Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="wjl-menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="wjl-menu-card">
            <div>
              <div className="wjl-menu-card-header">
                <div>
                  <div className="wjl-menu-card-title">{item.name}</div>
                  <span className="wjl-badge wjl-badge-blue" style={{ marginTop: '4px' }}>
                    {item.category}
                  </span>
                </div>
                <div className="wjl-menu-card-price">
                  {currency}{item.price.toFixed(2)}
                </div>
              </div>

              <div className="wjl-menu-card-desc">
                {item.description || 'No description provided.'}
              </div>
            </div>

            <div className="wjl-menu-card-footer">
              <label className="wjl-switch-label" style={{ fontSize: '12px' }}>
                <div
                  className={`wjl-switch-toggle ${item.available ? 'checked' : ''}`}
                  onClick={() => handleToggleAvailability(item.id)}
                />
                <span style={{ color: item.available ? '#34d399' : '#64748b' }}>
                  {item.available ? 'Available' : 'Sold Out'}
                </span>
              </label>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="wjl-btn wjl-btn-secondary wjl-btn-sm"
                  title="Edit item name, price, category or description"
                >
                  <EditIcon size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  style={{
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    color: '#f43f5e',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  title="Delete item"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal (matching Screen 13 of PDF) */}
      {(editingItem || isAddingNew) && (
        <div className="wjl-modal-overlay">
          <div className="wjl-modal-content">
            <div className="wjl-modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                {isAddingNew ? 'Add Menu Item' : `Edit Item: ${editingItem?.name}`}
              </h3>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setIsAddingNew(false); }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="wjl-form-group">
                  <label className="wjl-label" htmlFor="modalItemName">Item Name *</label>
                  <input
                    id="modalItemName"
                    type="text"
                    className="wjl-input"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="wjl-form-group">
                    <label className="wjl-label" htmlFor="modalPrice">Price ({currency}) *</label>
                    <input
                      id="modalPrice"
                      type="number"
                      step="0.01"
                      className="wjl-input"
                      value={formPrice}
                      onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="wjl-form-group">
                    <label className="wjl-label" htmlFor="modalCategory">Category *</label>
                    <input
                      id="modalCategory"
                      type="text"
                      className="wjl-input"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="Mains, Salads, etc."
                      required
                    />
                  </div>
                </div>

                <div className="wjl-form-group">
                  <label className="wjl-label" htmlFor="modalDescription">
                    <span>Description</span>
                    <span className="wjl-label-hint">{formDescription.length} chars</span>
                  </label>
                  <textarea
                    id="modalDescription"
                    className="wjl-textarea"
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe fresh ingredients and taste profile..."
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Available on Customer Menu</span>
                  <label className="wjl-switch-label">
                    <div
                      className={`wjl-switch-toggle ${formAvailable ? 'checked' : ''}`}
                      onClick={() => setFormAvailable(!formAvailable)}
                    />
                    <span style={{ fontSize: '13px', color: formAvailable ? '#34d399' : '#94a3b8' }}>
                      {formAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => { setEditingItem(null); setIsAddingNew(false); }}
                  className="wjl-btn wjl-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="wjl-btn wjl-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="wjl-step-actions">
        <button type="button" onClick={onBack} className="wjl-btn wjl-btn-secondary">
          <ChevronLeftIcon size={16} />
          <span>Back</span>
        </button>
        <button type="button" onClick={onNext} className="wjl-btn wjl-btn-primary">
          <span>Confirm & Next: Delivery Methods</span>
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
