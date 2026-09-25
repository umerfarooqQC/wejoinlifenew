import React, { useState } from 'react';
import { ChevronLeft, Plus, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/actions/Button';
import { Switch } from '../../../components/ui/form/Controls';

export interface DayHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Step3StoreHoursProps {
  onNext: (hours: DayHour[]) => void;
  onBack: () => void;
}

export const Step3StoreHours: React.FC<Step3StoreHoursProps> = ({ onNext, onBack }) => {
  const [hours, setHours] = useState<DayHour[]>([
    { day: 'Mon', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
    { day: 'Tue', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
    { day: 'Wed', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
    { day: 'Thu', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
    { day: 'Fri', isOpen: true, openTime: '09:00 AM', closeTime: '10:00 PM' },
    { day: 'Sat', isOpen: false, openTime: '09:00 AM', closeTime: '10:00 PM' },
    { day: 'Sun', isOpen: false, openTime: '09:00 AM', closeTime: '10:00 PM' },
  ]);

  const [holidayDate, setHolidayDate] = useState('');

  const toggleDay = (index: number) => {
    setHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isOpen: !item.isOpen } : item))
    );
  };

  const applyPreset = (preset: 'mon-fri' | 'all-week' | 'weekends') => {
    setHours((prev) =>
      prev.map((item) => {
        if (preset === 'mon-fri') {
          const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(item.day);
          return { ...item, isOpen: isWeekday };
        } else if (preset === 'all-week') {
          return { ...item, isOpen: true };
        } else {
          const isWeekend = ['Sat', 'Sun'].includes(item.day);
          return { ...item, isOpen: isWeekend };
        }
      })
    );
  };

  const openDaysCount = hours.filter((h) => h.isOpen).length;

  return (
    <div className="wjl-ob-step">
      {/* Top Bar */}
      <div className="wjl-ob-step__topbar">
        <button type="button" className="wjl-ob-back-circle-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <h1 className="wjl-ob-header-title">Store Hours</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* Subtitle */}
      <p className="wjl-ob-subtitle">When are you open?</p>

      {/* Days Open Badge Line Divider */}
      <div className="wjl-ob-badge-divider-row">
        <div className="wjl-ob-badge-line" />
        <span className="wjl-ob-badge-pill">{openDaysCount} days open</span>
        <div className="wjl-ob-badge-line" />
      </div>

      {/* Days Table Card */}
      <div className="wjl-ob-hours-card">
        {hours.map((item, idx) => (
          <div key={item.day} className="wjl-ob-hours-row">
            <div className="wjl-ob-hours-left">
              <span className={item.isOpen ? 'wjl-ob-hours-day' : 'wjl-ob-hours-day wjl-ob-hours-day--muted'}>
                {item.day}
              </span>
              <Switch checked={item.isOpen} onChange={() => toggleDay(idx)} />
            </div>

            {item.isOpen ? (
              <div className="wjl-ob-hours-times">
                <input
                  type="text"
                  value={item.openTime}
                  onChange={(e) =>
                    setHours((prev) =>
                      prev.map((h, i) => (i === idx ? { ...h, openTime: e.target.value } : h))
                    )
                  }
                  className="wjl-ob-time-input"
                />
                <span className="wjl-ob-time-dash">-</span>
                <input
                  type="text"
                  value={item.closeTime}
                  onChange={(e) =>
                    setHours((prev) =>
                      prev.map((h, i) => (i === idx ? { ...h, closeTime: e.target.value } : h))
                    )
                  }
                  className="wjl-ob-time-input"
                />
              </div>
            ) : (
              <span className="wjl-ob-hours-closed">Closed</span>
            )}
          </div>
        ))}
      </div>

      {/* Quick Presets */}
      <div className="wjl-ob-section">
        <h3 className="wjl-ob-section-label">QUICK PRESETS</h3>
        <div className="wjl-ob-presets-group">
          <button type="button" className="wjl-ob-preset-btn" onClick={() => applyPreset('mon-fri')}>
            Mon – Fri
          </button>
          <button type="button" className="wjl-ob-preset-btn" onClick={() => applyPreset('all-week')}>
            All Week
          </button>
          <button type="button" className="wjl-ob-preset-btn" onClick={() => applyPreset('weekends')}>
            Weekends Only
          </button>
        </div>
      </div>

      {/* Holiday Hours */}
      <div className="wjl-ob-section">
        <h3 className="wjl-ob-section-label">HOLIDAY HOURS</h3>
        <div className="wjl-ob-holiday-row">
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
            className="wjl-ob-holiday-input"
          />
          <button type="button" className="wjl-ob-add-btn">
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
        <div className="wjl-ob-holiday-empty">
          <Calendar size={18} className="wjl-ob-calendar-icon" />
          <span>No holidays added yet. Pick a date above.</span>
        </div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="wjl-ob-step__footer">
        <Button
          onClick={() => onNext(hours)}
          variant="primary"
          size="lg"
          fullWidth
          pill
          rightIcon={<ArrowRight size={18} />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

