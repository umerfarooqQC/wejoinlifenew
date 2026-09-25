import React, { useState } from 'react';
import { ChevronLeft, Check, Edit3, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/actions/Button';
import { Tabs } from '../../../components/ui/navigation/Tabs';
import { useToast } from '../../../components/ui/feedback/Toast';
import { EditItemScreen, MenuItemData } from '../onboarding/EditItemScreen';
import './ReviewMenuPage.css';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'MAINS' | 'SALADS' | 'DESSERTS' | 'DRINKS';
  description: string;
}

const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    price: 14.99,
    category: 'MAINS',
    description: 'Classic tomato base with fresh mozzarella and hand-torn basil.',
  },
  {
    id: '2',
    name: 'Crispy Chicken Burger',
    price: 12.50,
    category: 'MAINS',
    description: 'Buttermilk-fried chicken with shredded lettuce, tomato and smoky aioli.',
  },
  {
    id: '3',
    name: 'Pasta Carbonara',
    price: 16.99,
    category: 'MAINS',
    description: 'Spaghetti with pancetta, egg yolk, aged pecorino and cracked black pepper.',
  },
  {
    id: '4',
    name: 'Caesar Salad',
    price: 9.99,
    category: 'SALADS',
    description: 'Romaine hearts, sourdough croutons, shaved parmesan, house caesar dressing.',
  },
  {
    id: '5',
    name: 'Tiramisu',
    price: 7.50,
    category: 'DESSERTS',
    description: 'Mascarpone cream, espresso-soaked ladyfingers, dusted with cocoa.',
  },
  {
    id: '6',
    name: 'Classic Soft Drink',
    price: 3.50,
    category: 'DRINKS',
    description: 'Coke, Sprite or Fanta — your choice, served chilled over ice.',
  },
];

export interface ReviewMenuPageProps {
  isMobileSimulated?: boolean;
  onNext?: () => void;
}

export const ReviewMenuPage: React.FC<ReviewMenuPageProps> = ({ isMobileSimulated = false, onNext }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Category Tabs
  const categoryTabs = [
    { id: 'all', label: 'All' },
    { id: 'MAINS', label: 'Mains' },
    { id: 'SALADS', label: 'Salads' },
    { id: 'DESSERTS', label: 'Desserts' },
    { id: 'DRINKS', label: 'Drinks' },
  ];

  // Group items by category
  const categories: ('MAINS' | 'SALADS' | 'DESSERTS' | 'DRINKS')[] = [
    'MAINS',
    'SALADS',
    'DESSERTS',
    'DRINKS',
  ];

  const handleEditClick = (item: MenuItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveItem = (updated: MenuItemData) => {
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

  const handleContinue = () => {
    showToast('Menu confirmed!', 'success', 'Menu Verified');
    if (onNext) {
      onNext();
    }
  };

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
        onSave={handleSaveItem}
        onCancel={() => setEditingItem(null)}
      />
    );
  }

  const filteredCategories =
    activeCategory === 'all'
      ? categories
      : categories.filter((cat) => cat === activeCategory);

  return (
    <div className={`wjl-review-menu-page ${isMobileSimulated ? 'wjl-review-menu-page--mobile-sim' : ''}`}>
      {/* Top Header */}
      <header className="wjl-rm-header">
        <button className="wjl-rm-back-btn" aria-label="Go back">
          <ChevronLeft size={20} />
        </button>
        <h1 className="wjl-ob-serif-title" style={{ fontSize: '20px' }}>Review Your Menu</h1>
        <div style={{ width: 36 }} /> {/* Spacer to balance flex layout */}
      </header>

      {/* Scanned Success Banner */}
      <div className="wjl-rm-banner-container">
        <div className="wjl-rm-banner">
          <div className="wjl-rm-banner__icon">
            <Check size={16} />
          </div>
          <div className="wjl-rm-banner__text">
            <strong>Menu scanned successfully</strong>
            <span>{items.length} items · 4 categories — tap any item to edit</span>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="wjl-rm-pills-container">
        <Tabs
          tabs={categoryTabs}
          activeTab={activeCategory}
          onChange={setActiveCategory}
          variant="pills"
        />
      </div>

      {/* Categorized Menu Items List */}
      <div className="wjl-rm-content">
        {filteredCategories.map((cat) => {
          const categoryItems = items.filter((item) => item.category === cat);
          if (categoryItems.length === 0) return null;

          return (
            <section key={cat} className="wjl-rm-section">
              <h2 className="wjl-rm-section__title">{cat}</h2>
              <div className="wjl-rm-cards-list">
                {categoryItems.map((item) => (
                  <div key={item.id} className="wjl-rm-card">
                    <div className="wjl-rm-card__top">
                      <h3 className="wjl-rm-card__name">{item.name}</h3>
                      <span className="wjl-rm-card__price">${item.price.toFixed(2)}</span>
                    </div>

                    <p className="wjl-rm-card__desc">{item.description}</p>

                    <div className="wjl-rm-card__footer">
                      <button
                        className="wjl-rm-edit-btn"
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit3 size={14} />
                        <span>Edit item</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="wjl-rm-bottom-bar">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          pill
          rightIcon={<ArrowRight size={18} />}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

