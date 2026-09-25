import React, { useState } from 'react';
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  DangerButton,
} from '../../../components/ui/actions/Button';
import { IconButton } from '../../../components/ui/actions/IconButton';
import { Input, SearchInput } from '../../../components/ui/form/Input';
import { Textarea } from '../../../components/ui/form/Textarea';
import { Select, MultiSelect } from '../../../components/ui/form/Select';
import { Checkbox, Radio, Switch, DatePicker } from '../../../components/ui/form/Controls';
import { FormField, FormSection } from '../../../components/ui/form/FormField';
import { Card, StatCard } from '../../../components/ui/data-display/Card';
import { StatusBadge } from '../../../components/ui/data-display/StatusBadge';
import { DataTable } from '../../../components/ui/data-display/DataTable';
import { EmptyState, LoadingState, ErrorState } from '../../../components/ui/data-display/FeedbackStates';
import { Alert } from '../../../components/ui/feedback/Alert';
import { Modal, ConfirmationDialog } from '../../../components/ui/feedback/Modal';
import { Tabs } from '../../../components/ui/navigation/Tabs';
import { Avatar } from '../../../components/ui/other/Avatar';
import { FileUpload } from '../../../components/ui/other/FileUpload';
import { useToast } from '../../../components/ui/feedback/Toast';
import {
  Plus,
  Trash2,
  Edit,
  Download,
  Filter,
  CheckCircle,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
} from 'lucide-react';
import './DesignSystemShowcase.css';

export const DesignSystemShowcase: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMulti, setSelectedMulti] = useState<string[]>(['mains']);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Demo Table Data
  const demoTableData = [
    { id: '1', name: 'Margherita Pizza', category: 'Mains', price: '$14.99', status: 'success', stock: '24 units' },
    { id: '2', name: 'Crispy Chicken Burger', category: 'Mains', price: '$12.50', status: 'success', stock: '18 units' },
    { id: '3', name: 'Caesar Salad', category: 'Salads', price: '$9.99', status: 'info', stock: '30 units' },
    { id: '4', name: 'Tiramisu', category: 'Desserts', price: '$7.50', status: 'warning', stock: '5 units left' },
    { id: '5', name: 'Specialty Espresso', category: 'Drinks', price: '$4.20', status: 'error', stock: 'Out of stock' },
  ];

  return (
    <div className="wjl-showcase">
      {/* Hero Banner */}
      <div className="wjl-showcase__hero">
        <div className="wjl-showcase__hero-badge">WJL SELLER DESIGN SYSTEM</div>
        <h1 className="wjl-showcase__title">Centralized Design Tokens & UI Component Library</h1>
        <p className="wjl-showcase__subtitle">
          Visual source of truth powering every screen in the WJL Seller Portal ecosystem.
        </p>
      </div>

      {/* 1. DESIGN TOKENS */}
      <section className="wjl-showcase__section">
        <h2 className="wjl-showcase__section-title">1. Design Tokens System</h2>
        
        {/* Colors */}
        <h3 className="wjl-showcase__sub-title">Semantic Colors Palette</h3>
        <div className="wjl-showcase__grid-swatches">
          <div className="wjl-swatch" style={{ backgroundColor: 'var(--wjl-color-primary)' }}>
            <span>Primary</span>
            <code>--wjl-color-primary</code>
          </div>
          <div className="wjl-swatch" style={{ backgroundColor: 'var(--wjl-color-primary-hover)' }}>
            <span>Primary Hover</span>
            <code>--wjl-color-primary-hover</code>
          </div>
          <div className="wjl-swatch" style={{ backgroundColor: 'var(--wjl-color-secondary)', color: 'white' }}>
            <span>Secondary</span>
            <code>--wjl-color-secondary</code>
          </div>
          <div className="wjl-swatch" style={{ backgroundColor: 'var(--wjl-color-background)', border: '1px solid #ddd' }}>
            <span>Background</span>
            <code>--wjl-color-background</code>
          </div>
          <div className="wjl-swatch" style={{ backgroundColor: 'var(--wjl-color-surface)', border: '1px solid #ddd' }}>
            <span>Surface</span>
            <code>--wjl-color-surface</code>
          </div>
          <div className="wjl-swatch" style={{ backgroundColor: 'var(--wjl-color-success)', color: 'white' }}>
            <span>Success</span>
            <code>--wjl-color-success</code>
          </div>
          <div className="wjl-swatch" style={{ backgroundColor: 'var(--wjl-color-warning)', color: 'white' }}>
            <span>Warning</span>
            <code>--wjl-color-warning</code>
          </div>
          <div className="wjl-swatch" style={{ backgroundColor: 'var(--wjl-color-error)', color: 'white' }}>
            <span>Error</span>
            <code>--wjl-color-error</code>
          </div>
        </div>

        {/* Typography Scale */}
        <h3 className="wjl-showcase__sub-title" style={{ marginTop: '24px' }}>Typography Scale</h3>
        <Card padding="md">
          <div className="wjl-showcase__type-stack">
            <div className="wjl-type-row">
              <span className="wjl-type-label">Heading 1</span>
              <span style={{ fontFamily: 'var(--wjl-font-heading)', fontSize: 'var(--wjl-font-size-3xl)', fontWeight: 800 }}>
                Review Your Menu
              </span>
            </div>
            <div className="wjl-type-row">
              <span className="wjl-type-label">Heading 2</span>
              <span style={{ fontFamily: 'var(--wjl-font-heading)', fontSize: 'var(--wjl-font-size-xl)', fontWeight: 700 }}>
                Categorized Items
              </span>
            </div>
            <div className="wjl-type-row">
              <span className="wjl-type-label">Body Text</span>
              <span style={{ fontSize: 'var(--wjl-font-size-sm)', color: 'var(--wjl-color-text-secondary)' }}>
                Classic tomato base with fresh mozzarella and hand-torn basil.
              </span>
            </div>
            <div className="wjl-type-row">
              <span className="wjl-type-label">Mono Code</span>
              <span style={{ fontFamily: 'var(--wjl-font-mono)', fontSize: 'var(--wjl-font-size-xs)', color: 'var(--wjl-color-primary-dark)' }}>
                token.color.primary = #16C2D5
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* 2. BUTTONS & ACTIONS */}
      <section className="wjl-showcase__section">
        <h2 className="wjl-showcase__section-title">2. Buttons & Action Components</h2>
        <Card padding="md">
          <div className="wjl-showcase__btn-group">
            <PrimaryButton leftIcon={<Plus size={16} />}>Primary Button</PrimaryButton>
            <SecondaryButton>Secondary Button</SecondaryButton>
            <OutlineButton leftIcon={<Download size={16} />}>Outline Button</OutlineButton>
            <GhostButton>Ghost Button</GhostButton>
            <DangerButton leftIcon={<Trash2 size={16} />}>Danger Button</DangerButton>
            <PrimaryButton pill rightIcon={<Plus size={16} />}>Pill Button</PrimaryButton>
            <PrimaryButton isLoading>Loading</PrimaryButton>
            <PrimaryButton disabled>Disabled</PrimaryButton>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <IconButton icon={<Edit size={16} />} aria-label="Edit" variant="outline" />
            <IconButton icon={<Trash2 size={16} />} aria-label="Delete" variant="ghost" />
            <IconButton icon={<Filter size={16} />} aria-label="Filter" variant="primary" pill />
          </div>
        </Card>
      </section>

      {/* 3. FORM CONTROLS */}
      <section className="wjl-showcase__section">
        <h2 className="wjl-showcase__section-title">3. Form Controls & Inputs</h2>
        <Card padding="lg">
          <FormSection title="Seller Item Information" description="Standardized form input patterns">
            <div className="wjl-showcase__grid-2">
              <FormField label="Item Name" required helpText="Enter exact name as printed on menu">
                <Input placeholder="e.g. Margherita Pizza" />
              </FormField>

              <FormField label="Search Menu">
                <SearchInput placeholder="Search items..." />
              </FormField>

              <FormField label="Category" required>
                <Select
                  options={[
                    { label: 'Mains', value: 'mains' },
                    { label: 'Salads', value: 'salads' },
                    { label: 'Desserts', value: 'desserts' },
                    { label: 'Drinks', value: 'drinks' },
                  ]}
                />
              </FormField>

              <FormField label="Tags (MultiSelect)">
                <MultiSelect
                  options={[
                    { label: 'Mains', value: 'mains' },
                    { label: 'Vegetarian', value: 'veg' },
                    { label: 'Gluten Free', value: 'gf' },
                    { label: 'Popular', value: 'pop' },
                  ]}
                  value={selectedMulti}
                  onChange={setSelectedMulti}
                />
              </FormField>

              <FormField label="Availability Date">
                <DatePicker />
              </FormField>

              <FormField label="Item Description" className="wjl-col-span-2">
                <Textarea placeholder="Write detailed ingredients and preparation notes..." rows={3} />
              </FormField>
            </div>

            <div className="wjl-showcase__controls-group">
              <Checkbox label="Featured item on menu homepage" defaultChecked />
              <Radio name="type" label="In-house preparation" defaultChecked />
              <Radio name="type" label="Pre-packaged product" />
              <Switch label="Active & Available" checked={switchChecked} onChange={(e) => setSwitchChecked(e.target.checked)} />
            </div>
          </FormSection>
        </Card>
      </section>

      {/* 4. DATA DISPLAY & STAT CARDS */}
      <section className="wjl-showcase__section">
        <h2 className="wjl-showcase__section-title">4. Stat Cards & Status Badges</h2>
        <div className="wjl-showcase__grid-3">
          <StatCard
            title="Total Menu Revenue"
            value="$42,850.00"
            change={{ value: "+14.2%", type: "increase" }}
            icon={<DollarSign size={20} />}
            subtitle="Compared to last month"
          />
          <StatCard
            title="Active Menu Items"
            value="148"
            change={{ value: "+4 items", type: "increase" }}
            icon={<ShoppingBag size={20} />}
            subtitle="Across 6 categories"
          />
          <StatCard
            title="Customer Rating"
            value="4.9 / 5.0"
            change={{ value: "Stable", type: "neutral" }}
            icon={<TrendingUp size={20} />}
            subtitle="Based on 1,240 reviews"
          />
        </div>

        <h3 className="wjl-showcase__sub-title" style={{ marginTop: '24px' }}>Status Badges</h3>
        <Card padding="md">
          <div className="wjl-showcase__btn-group">
            <StatusBadge status="success" label="Active & Published" />
            <StatusBadge status="warning" label="Low Inventory" />
            <StatusBadge status="error" label="Out of Stock" />
            <StatusBadge status="info" label="Draft Mode" />
            <StatusBadge status="neutral" label="Archived" />
          </div>
        </Card>
      </section>

      {/* 5. DATA TABLE SYSTEM */}
      <section className="wjl-showcase__section">
        <h2 className="wjl-showcase__section-title">5. Data Table System</h2>
        <DataTable
          title="Menu Products Table"
          columns={[
            { key: 'name', header: 'Product Name', sortable: true },
            { key: 'category', header: 'Category', sortable: true },
            { key: 'price', header: 'Price', sortable: true },
            {
              key: 'status',
              header: 'Status',
              render: (val) => <StatusBadge status={val} label={val} size="sm" />,
            },
            { key: 'stock', header: 'Inventory Stock' },
          ]}
          data={demoTableData}
          keyExtractor={(row) => row.id}
          selectable
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          actions={(row) => (
            <div style={{ display: 'flex', gap: '4px' }}>
              <IconButton icon={<Edit size={14} />} aria-label="Edit item" size="sm" />
              <IconButton icon={<Trash2 size={14} />} aria-label="Delete item" size="sm" />
            </div>
          )}
        />
      </section>

      {/* 6. NAVIGATION & TABS */}
      <section className="wjl-showcase__section">
        <h2 className="wjl-showcase__section-title">6. Navigation & Tabs</h2>
        <Card padding="md">
          <h4 style={{ marginBottom: '12px', fontSize: '13px' }}>Pills Filter Variant (Used in Menu Review):</h4>
          <Tabs
            variant="pills"
            tabs={[
              { id: 'all', label: 'All' },
              { id: 'mains', label: 'Mains', count: 3 },
              { id: 'salads', label: 'Salads', count: 1 },
              { id: 'desserts', label: 'Desserts', count: 1 },
              { id: 'drinks', label: 'Drinks', count: 1 },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </Card>
      </section>

      {/* 7. FEEDBACK & MODALS */}
      <section className="wjl-showcase__section">
        <h2 className="wjl-showcase__section-title">7. Feedback, Alerts & Modals</h2>
        <div className="wjl-showcase__grid-alerts">
          <Alert variant="info" title="System Notice">
            Centralized design tokens allow global theme updates without code changes.
          </Alert>
          <Alert variant="success" title="Success Alert">
            Menu scanned successfully — 6 items imported.
          </Alert>
        </div>

        <Card padding="md" style={{ marginTop: '20px' }}>
          <div className="wjl-showcase__btn-group">
            <PrimaryButton onClick={() => showToast('Toast notification triggered!', 'success')}>
              Trigger Toast Notification
            </PrimaryButton>
            <OutlineButton onClick={() => setIsModalOpen(true)}>Open Modal</OutlineButton>
            <DangerButton onClick={() => setIsConfirmOpen(true)}>Trigger Confirm Dialog</DangerButton>
          </div>
        </Card>
      </section>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reusable Modal Component"
        footer={<PrimaryButton onClick={() => setIsModalOpen(false)}>Close Modal</PrimaryButton>}
      >
        <p style={{ fontSize: '14px', color: 'var(--wjl-color-text-secondary)' }}>
          This modal uses standard design tokens, backdrop filters, ESC key closing, and focus traps.
        </p>
      </Modal>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          showToast('Item deleted successfully', 'error');
        }}
        title="Delete Item Confirmation"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        variant="danger"
        confirmText="Delete Permanently"
      />
    </div>
  );
};
