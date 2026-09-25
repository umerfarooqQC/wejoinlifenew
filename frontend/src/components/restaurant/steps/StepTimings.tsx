import React, { useState } from 'react';
import { WeekdayTiming, HolidayTiming } from '../types';
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon } from '../common/Icons';

interface StepTimingsProps {
  weekdayTimings: WeekdayTiming[];
  holidayTimings: HolidayTiming[];
  onWeekdayChange: (timings: WeekdayTiming[]) => void;
  onHolidayChange: (holidays: HolidayTiming[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepTimings: React.FC<StepTimingsProps> = ({
  weekdayTimings,
  holidayTimings,
  onWeekdayChange,
  onHolidayChange,
  onNext,
  onBack
}) => {
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayIsOpen, setNewHolidayIsOpen] = useState(false);
  const [newHolidayOpen, setNewHolidayOpen] = useState('11:00');
  const [newHolidayClose, setNewHolidayClose] = useState('18:00');

  const handleDayToggle = (index: number) => {
    const updated = [...weekdayTimings];
    updated[index] = { ...updated[index], isOpen: !updated[index].isOpen };
    onWeekdayChange(updated);
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const updated = [...weekdayTimings];
    updated[index] = { ...updated[index], [field]: value };
    onWeekdayChange(updated);
  };

  const applyMondayToAll = () => {
    const monday = weekdayTimings[0];
    const updated = weekdayTimings.map(d => ({
      ...d,
      isOpen: monday.isOpen,
      openTime: monday.openTime,
      closeTime: monday.closeTime
    }));
    onWeekdayChange(updated);
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !newHolidayDate) return;
    const newHoliday: HolidayTiming = {
      id: `h-${Date.now()}`,
      name: newHolidayName.trim(),
      date: newHolidayDate,
      isOpen: newHolidayIsOpen,
      openTime: newHolidayIsOpen ? newHolidayOpen : undefined,
      closeTime: newHolidayIsOpen ? newHolidayClose : undefined,
      note: newHolidayIsOpen ? 'Special holiday hours' : 'Closed for holiday'
    };
    onHolidayChange([...holidayTimings, newHoliday]);
    setNewHolidayName('');
    setNewHolidayDate('');
    setNewHolidayIsOpen(false);
  };

  const handleRemoveHoliday = (id: string) => {
    onHolidayChange(holidayTimings.filter(h => h.id !== id));
  };

  return (
    <div className="wjl-step-card">
      <div className="wjl-step-title">
        <ClockIcon size={24} className="text-cyan-400" />
        <span>Step 3 of 8: Operating Hours & Holiday Timings</span>
      </div>
      <p className="wjl-step-desc">
        Define standard weekly opening hours for online order acceptance and prepare holiday exceptions in advance.
      </p>

      {/* Weekday Timings */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>
            Weekly Schedule (Monday – Sunday)
          </h3>
          <button
            type="button"
            onClick={applyMondayToAll}
            className="wjl-btn wjl-btn-secondary wjl-btn-sm"
          >
            ⚡ Copy Monday Hours to All Days
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {weekdayTimings.map((day, idx) => (
            <div
              key={day.day}
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 100px 1fr 1fr',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 18px',
                borderRadius: '12px',
                background: day.isOpen ? 'rgba(15, 23, 42, 0.6)' : 'rgba(15, 23, 42, 0.25)',
                border: day.isOpen ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.03)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 700, color: day.isOpen ? '#fff' : '#64748b' }}>
                {day.day}
              </div>

              <label className="wjl-switch-label">
                <div
                  className={`wjl-switch-toggle ${day.isOpen ? 'checked' : ''}`}
                  onClick={() => handleDayToggle(idx)}
                />
                <span style={{ fontSize: '13px', color: day.isOpen ? '#34d399' : '#94a3b8', fontWeight: 600 }}>
                  {day.isOpen ? 'Open' : 'Closed'}
                </span>
              </label>

              {day.isOpen ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Opens:</span>
                    <input
                      type="time"
                      className="wjl-input"
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      value={day.openTime}
                      onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Closes:</span>
                    <input
                      type="time"
                      className="wjl-input"
                      style={{ padding: '6px 10px', fontSize: '13px' }}
                      value={day.closeTime}
                      onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div style={{ gridColumn: 'span 2', color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
                  Orders will be paused automatically all day
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Holiday / Special Timings */}
      <div style={{
        background: 'rgba(10, 14, 23, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
          🎉 Holiday & Special Event Timings
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '18px' }}>
          Add upcoming calendar dates with custom hours or mark complete closures.
        </p>

        {holidayTimings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {holidayTimings.map((h) => (
              <div
                key={h.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>
                  <strong style={{ color: '#fff', marginRight: '10px' }}>{h.name}</strong>
                  <span style={{ color: '#38bdf8', fontSize: '12px', marginRight: '12px', fontFamily: 'monospace' }}>
                    {h.date}
                  </span>
                  <span className={`wjl-badge ${h.isOpen ? 'wjl-badge-green' : 'wjl-badge-gray'}`}>
                    {h.isOpen ? `Special Hours (${h.openTime} - ${h.closeTime})` : 'Closed'}
                  </span>
                  {h.note && (
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '10px' }}>
                      ({h.note})
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHoliday(h.id)}
                  style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
                  title="Remove holiday"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Holiday Form */}
        <form onSubmit={handleAddHoliday} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr auto auto', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label className="wjl-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Holiday Name</label>
            <input
              type="text"
              className="wjl-input"
              style={{ padding: '8px 12px', fontSize: '13px' }}
              value={newHolidayName}
              onChange={(e) => setNewHolidayName(e.target.value)}
              placeholder="e.g. Labor Day"
            />
          </div>

          <div>
            <label className="wjl-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Date</label>
            <input
              type="date"
              className="wjl-input"
              style={{ padding: '8px 12px', fontSize: '13px' }}
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px' }}>
            <label className="wjl-switch-label" style={{ fontSize: '12px' }}>
              <div
                className={`wjl-switch-toggle ${newHolidayIsOpen ? 'checked' : ''}`}
                onClick={() => setNewHolidayIsOpen(!newHolidayIsOpen)}
              />
              <span style={{ color: '#cbd5e1' }}>{newHolidayIsOpen ? 'Open' : 'Closed'}</span>
            </label>
          </div>

          <button
            type="submit"
            className="wjl-btn wjl-btn-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
            disabled={!newHolidayName || !newHolidayDate}
          >
            <PlusIcon size={14} />
            <span>Add Holiday</span>
          </button>
        </form>
      </div>

      <div className="wjl-step-actions">
        <button type="button" onClick={onBack} className="wjl-btn wjl-btn-secondary">
          <ChevronLeftIcon size={16} />
          <span>Back</span>
        </button>
        <button type="button" onClick={onNext} className="wjl-btn wjl-btn-primary">
          <span>Confirm & Next: Menu Items</span>
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
