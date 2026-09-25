import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  sizeVariant?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
  name?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  disabled = false,
  error = false,
  sizeVariant = 'md',
  className = '',
  id,
  name,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { value: val } });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`wjl-custom-select-wrapper ${disabled ? 'wjl-select--disabled' : ''} ${className}`}
    >
      {/* Hidden Native Select for Form Compatibility */}
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange && onChange(e)}
        className="wjl-select-hidden-native"
        tabIndex={-1}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Select Trigger Button */}
      <div
        className={`wjl-custom-select-trigger wjl-select--${sizeVariant} ${error ? 'wjl-select--error' : ''} ${isOpen ? 'wjl-custom-select-trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="wjl-custom-select-label">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`wjl-select__chevron ${isOpen ? 'wjl-select__chevron--open' : ''}`}
        />
      </div>

      {/* Custom Options Dropdown */}
      {isOpen && (
        <div className="wjl-custom-select-dropdown" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value || (selectedOption && opt.value === selectedOption.value);
            return (
              <div
                key={opt.value}
                className={`wjl-custom-select-option ${isSelected ? 'wjl-custom-select-option--selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
                role="option"
                aria-selected={isSelected}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={16} className="wjl-custom-select-check" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  disabled,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((item) => item !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((item) => item !== val));
  };

  return (
    <div className={`wjl-multiselect ${error ? 'wjl-multiselect--error' : ''} ${disabled ? 'wjl-multiselect--disabled' : ''}`}>
      <div
        className="wjl-multiselect__control"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <div className="wjl-multiselect__tags">
          {value.length === 0 ? (
            <span className="wjl-multiselect__placeholder">{placeholder}</span>
          ) : (
            value.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span key={val} className="wjl-multiselect__tag">
                  {opt?.label || val}
                  <X size={12} className="wjl-multiselect__tag-remove" onClick={(e) => removeValue(val, e)} />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown size={16} className={`wjl-multiselect__chevron ${isOpen ? 'wjl-multiselect__chevron--open' : ''}`} />
      </div>

      {isOpen && (
        <div className="wjl-multiselect__dropdown">
          {options.map((opt) => {
            const selected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`wjl-multiselect__option ${selected ? 'wjl-multiselect__option--selected' : ''}`}
                onClick={() => toggleOption(opt.value)}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  readOnly
                  className="wjl-multiselect__checkbox"
                />
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
