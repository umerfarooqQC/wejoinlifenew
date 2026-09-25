import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Camera,
  Bot,
} from 'lucide-react';
import { Switch } from '../../../components/ui/form/Controls';
import { Modal } from '../../../components/ui/feedback/Modal';
import { FormField } from '../../../components/ui/form/FormField';
import { Input } from '../../../components/ui/form/Input';
import { Textarea } from '../../../components/ui/form/Textarea';
import { Select } from '../../../components/ui/form/Select';
import { Button } from '../../../components/ui/actions/Button';
import { useToast } from '../../../components/ui/feedback/Toast';
import { EditItemScreen, MenuItemData } from './EditItemScreen';

export interface LiveMenuItem {
  id: string;
  name: string;
  price: number;
  category: 'MAINS' | 'SALADS' | 'DESSERTS' | 'DRINKS';
  description: string;
  isAvailable: boolean;
}

const INITIAL_LIVE_ITEMS: LiveMenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    price: 14.99,
    category: 'MAINS',
    description: 'Classic tomato base with fresh mozzarella and hand-torn basil.',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Crispy Chicken Burger',
    price: 12.50,
    category: 'MAINS',
    description: 'Buttermilk-fried chicken with shredded lettuce, tomato and smoky aioli.',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Pasta Carbonara',
    price: 16.99,
    category: 'MAINS',
    description: 'Spaghetti with pancetta, egg yolk, aged pecorino and cracked black pepper.',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Caesar Salad',
    price: 9.99,
    category: 'SALADS',
    description: 'Romaine hearts, sourdough croutons, shaved parmesan, house caesar dressing.',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Tiramisu',
    price: 7.50,
    category: 'DESSERTS',
    description: 'Mascarpone cream, espresso-soaked ladyfingers, dusted with cocoa.',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Classic Soft Drink',
    price: 3.50,
    category: 'DRINKS',
    description: 'Coke, Sprite or Fanta — your choice, served chilled over ice.',
    isAvailable: true,
  },
];

export const Step10LiveStoreDashboard: React.FC<{ onBackToOnboarding?: () => void }> = ({
  onBackToOnboarding,
}) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<LiveMenuItem[]>(INITIAL_LIVE_ITEMS);
  const [isMenuPicturesOn, setIsMenuPicturesOn] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<LiveMenuItem | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);

  const [newItem, setNewItem] = useState({
    name: '',
    price: 10.0,
    category: 'MAINS' as const,
    description: '',
  });

  const handleRemoveItem = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast(`Removed "${name}" from menu`, 'error');
  };

  const handleSaveEdit = (updated: MenuItemData) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === updated.id
          ? {
              ...i,
              name: updated.name,
              price: updated.price,
              category: (updated.category.toUpperCase() as any) || i.category,
              description: updated.description || '',
            }
          : i
      )
    );
    setEditingItem(null);
    showToast(`Updated "${updated.name}"`, 'success');
  };

  const handleAddItem = () => {
    if (!newItem.name) return;
    const addedItem: LiveMenuItem = {
      id: Math.random().toString(),
      name: newItem.name,
      price: newItem.price,
      category: newItem.category,
      description: newItem.description,
      isAvailable: true,
    };
    setItems([...items, addedItem]);
    setIsAddItemModalOpen(false);
    setNewItem({ name: '', price: 10.0, category: 'MAINS', description: '' });
    showToast(`Added "${addedItem.name}" to menu`, 'success');
  };

  const categories: ('MAINS' | 'SALADS' | 'DESSERTS' | 'DRINKS')[] = [
    'MAINS',
    'SALADS',
    'DESSERTS',
    'DRINKS',
  ];

  // Render Full Screen Edit Item View when an item is selected for editing
  if (editingItem) {
    const categoryLabel =
      editingItem.category.charAt(0).toUpperCase() + editingItem.category.slice(1).toLowerCase();

    return (
      <EditItemScreen
        item={{
          id: editingItem.id,
          name: editingItem.name,
          price: editingItem.price,
          category: categoryLabel,
          description: editingItem.description,
        }}
        onSave={handleSaveEdit}
        onCancel={() => setEditingItem(null)}
      />
    );
  }

  const availableCount = items.filter((i) => i.isAvailable).length;
  const categoriesCount = new Set(items.map((i) => i.category)).size;

  return (
    <div className="wjl-ob-step">
      {/* Top Header */}
      <div className="wjl-live-header-top">
        <div className="wjl-live-title-area">
          <span className="wjl-live-tag">LIVE STORE</span>
          <h1 className="wjl-ob-serif-title" style={{ fontSize: '20px' }}>
            Golden Fork
          </h1>
        </div>
        <div className="wjl-live-avatar-circle" onClick={onBackToOnboarding} title="Back to onboarding">
          <Bot size={22} />
        </div>
      </div>

      {/* Quick Metrics Row */}
      <div className="wjl-ready-stats-grid" style={{ marginBottom: '16px' }}>
        <div className="wjl-ready-stat-card">
          <span className="wjl-ready-stat-label">Total Items</span>
          <span className="wjl-ready-stat-val">{items.length}</span>
        </div>
        <div className="wjl-ready-stat-card">
          <span className="wjl-ready-stat-label">Available</span>
          <span className="wjl-ready-stat-val">{availableCount}</span>
        </div>
        <div className="wjl-ready-stat-card">
          <span className="wjl-ready-stat-label">Categories</span>
          <span className="wjl-ready-stat-val">{categoriesCount}</span>
        </div>
      </div>

      {/* Menu Pictures Toggle Card */}
      <div className={`wjl-live-pics-card ${isMenuPicturesOn ? 'wjl-live-pics-card--active' : ''}`}>
        <div className="wjl-live-pics-left">
          <div className={`wjl-live-pics-icon-box ${isMenuPicturesOn ? 'wjl-live-pics-icon-box--active' : ''}`}>
            <ImageIcon size={20} />
          </div>
          <div>
            <h4 className={`wjl-live-pics-title ${isMenuPicturesOn ? 'wjl-live-pics-title--active' : ''}`}>
              Menu Pictures
            </h4>
            <p className="wjl-live-pics-sub">Add photos to your menu items</p>
          </div>
        </div>
        <Switch
          checked={isMenuPicturesOn}
          onChange={(e) => setIsMenuPicturesOn(e.target.checked)}
        />
      </div>

      {/* Categorized Menu List */}
      <div className="wjl-live-menu-content">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="wjl-live-cat-block">
              {/* Category Header Row with Count Badge */}
              <div className="wjl-live-cat-header">
                <span className="wjl-ob-section-label" style={{ margin: 0 }}>
                  {cat}
                </span>
                <span className="wjl-live-cat-count-badge">{catItems.length}</span>
              </div>

              {/* Items Cards */}
              <div className="wjl-live-cards-list">
                {catItems.map((item) => (
                  <div key={item.id} className="wjl-live-item-card">
                    <div className="wjl-live-card-top">
                      <h3 className="wjl-live-card-name">{item.name}</h3>
                      <span className="wjl-live-card-price">${item.price.toFixed(2)}</span>
                    </div>

                    <p className="wjl-live-card-desc">{item.description}</p>

                    {/* Badges Row */}
                    <div className="wjl-live-badges-row">
                      <span className="wjl-live-status-badge">● Available</span>
                      {isMenuPicturesOn && (
                        <button
                          type="button"
                          className="wjl-live-add-photo-btn"
                          onClick={() => setEditingItem(item)}
                        >
                          <Camera size={13} />
                          <span>Add photo</span>
                        </button>
                      )}
                    </div>

                    {/* Footer Actions Row with Vertical Divider */}
                    <div className="wjl-live-card-actions-row">
                      <button
                        type="button"
                        className="wjl-live-action-btn-flat"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit3 size={15} />
                        <span>Edit</span>
                      </button>
                      <div className="wjl-live-action-vdivider" />
                      <button
                        type="button"
                        className="wjl-live-action-btn-flat wjl-live-action-btn-flat--danger"
                        onClick={() => handleRemoveItem(item.id, item.name)}
                      >
                        <Trash2 size={15} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Add Item Button */}
      <button
        type="button"
        className="wjl-floating-add-btn"
        onClick={() => setIsAddItemModalOpen(true)}
        aria-label="Add new menu item"
      >
        <Plus size={24} />
      </button>

      {/* Add New Item Modal */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title="Add New Menu Item"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant="outline" size="sm" onClick={() => setIsAddItemModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddItem}>
              Add Item
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="ITEM NAME" required>
            <Input
              placeholder="e.g. Hawaiian Pizza"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </FormField>

          <FormField label="PRICE ($)" required>
            <Input
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
            />
          </FormField>

          <FormField label="CATEGORY" required>
            <Select
              options={[
                { label: 'Mains', value: 'MAINS' },
                { label: 'Salads', value: 'SALADS' },
                { label: 'Desserts', value: 'DESSERTS' },
                { label: 'Drinks', value: 'DRINKS' },
              ]}
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
            />
          </FormField>

          <FormField label="DESCRIPTION">
            <Textarea
              rows={3}
              placeholder="Enter ingredients..."
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
};

