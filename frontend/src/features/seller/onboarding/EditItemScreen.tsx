import React, { useState } from 'react';
import { ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { FormField } from '../../../components/ui/form/FormField';
import { Input } from '../../../components/ui/form/Input';
import { Textarea } from '../../../components/ui/form/Textarea';
import { Select } from '../../../components/ui/form/Select';

export interface MenuItemData {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  imageUrl?: string;
}

export interface EditItemScreenProps {
  item?: MenuItemData;
  onSave: (updatedItem: MenuItemData) => void;
  onCancel: () => void;
}

export const EditItemScreen: React.FC<EditItemScreenProps> = ({
  item = {
    id: '1',
    name: 'Margherita Pizza',
    price: 14.99,
    category: 'Mains',
    description: 'Classic tomato base with fresh mozzarella and hand-torn basil.',
  },
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(
    item.description || 'Classic tomato base with fresh mozzarella and hand-torn basil.'
  );

  const initialPriceStr = item.price.toString();
  const initialCategory = item.category;
  const initialDescription = item.description || 'Classic tomato base with fresh mozzarella and hand-torn basil.';

  const isModified =
    name !== item.name ||
    price !== initialPriceStr ||
    category !== initialCategory ||
    description !== initialDescription;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      name,
      price: parseFloat(price) || item.price,
      category,
      description,
    });
  };

  return (
    <form className="wjl-ob-step" onSubmit={handleSubmit}>
      {/* Top Bar Header */}
      <div className="wjl-ob-step__topbar">
        <button type="button" className="wjl-ob-back-circle-btn" onClick={onCancel} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <h1 className="wjl-ob-header-title">Edit Item</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* EDITING Cyan Info Card Banner */}
      <div className="wjl-edit-banner-card">
        <span className="wjl-edit-banner-tag">EDITING</span>
        <h3 className="wjl-edit-banner-name">{name || item.name}</h3>
        <p className="wjl-edit-banner-sub">
          {category || item.category} · ${parseFloat(price) ? parseFloat(price).toFixed(2) : item.price.toFixed(2)}
        </p>
      </div>

      {/* Form Fields */}
      <div className="wjl-ob-step__form">
        {/* Item Photo Upload Zone */}
        <FormField label="ITEM PHOTO">
          <div className="wjl-edit-photo-box">
            <ImageIcon size={32} className="wjl-edit-photo-icon" />
            <span className="wjl-edit-photo-title">Tap to upload a photo</span>
            <span className="wjl-edit-photo-sub">PNG, JPG up to 20 MB</span>
          </div>
        </FormField>

        {/* Item Name */}
        <FormField label="ITEM NAME">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Margherita Pizza"
          />
        </FormField>

        {/* Price & Category Grid Row */}
        <div className="wjl-ob-form-row">
          <FormField label="PRICE ($)">
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="14.99"
            />
          </FormField>
          <FormField label="CATEGORY">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { label: 'Mains', value: 'Mains' },
                { label: 'Salads', value: 'Salads' },
                { label: 'Desserts', value: 'Desserts' },
                { label: 'Drinks', value: 'Drinks' },
              ]}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="DESCRIPTION">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your dish..."
            rows={3}
          />
          <div className="wjl-edit-char-counter">{description.length} chars</div>
        </FormField>
      </div>

      {/* Action Footer Buttons */}
      <div className="wjl-edit-footer-row">
        <button type="button" className="wjl-edit-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isModified}
          className={isModified ? 'wjl-edit-save-btn wjl-edit-save-btn--active' : 'wjl-edit-save-btn'}
        >
          {isModified ? 'Save Changes' : 'No Changes'}
        </button>
      </div>
    </form>
  );
};
