import React from 'react';
import { ChevronLeft, MoreVertical, ArrowRight, PartyPopper, Check, AtSign, Copy, FileText, Clock, QrCode, Download } from 'lucide-react';
import { Button } from '../../../components/ui/actions/Button';
import { useToast } from '../../../components/ui/feedback/Toast';

export interface Step9StoreReadyProps {
  onGoToLiveStore: () => void;
  onBack?: () => void;
  summaryData?: {
    totalItems?: number;
    available?: number;
    categories?: number;
    delivery?: string;
    payment?: string;
    combosCount?: number;
  };
}

export const Step9StoreReady: React.FC<Step9StoreReadyProps> = ({
  onGoToLiveStore,
  onBack,
  summaryData = {
    totalItems: 6,
    available: 6,
    categories: 4,
    delivery: 'My Own Delivery, Third Party Delivery',
    payment: 'Cash on Delivery',
    combosCount: 0,
  },
}) => {
  const { showToast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://yourstore.app/menu/golden-fork');
    showToast('Store URL copied to clipboard!', 'success');
  };

  return (
    <div className="wjl-ob-step">
      {/* Top Header with Step Tag & Overflow Button */}
      <div className="wjl-ob-step__topbar">
        <button type="button" className="wjl-ob-back-circle-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <div className="wjl-ob-topbar-center">
          <span className="wjl-ob-step-tag">STEP 4 OF 4</span>
          <h1 className="wjl-ob-header-title">Ready</h1>
        </div>
        <button type="button" className="wjl-ob-back-circle-btn" aria-label="Options">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* 4-Step Progress Bar (All Complete) */}
      <div className="wjl-ob-progress-track-wrapper">
        <div className="wjl-ob-track-line-bg">
          <div className="wjl-ob-track-line-fill" style={{ width: '100%' }} />
        </div>
        <div className="wjl-ob-step-pills-row">
          <span className="wjl-ob-step-circle wjl-ob-step-circle--done">
            <Check size={12} strokeWidth={3} />
          </span>
          <span className="wjl-ob-step-circle wjl-ob-step-circle--done">
            <Check size={12} strokeWidth={3} />
          </span>
          <span className="wjl-ob-step-circle wjl-ob-step-circle--done">
            <Check size={12} strokeWidth={3} />
          </span>
          <span className="wjl-ob-step-circle wjl-ob-step-circle--active">4</span>
        </div>
      </div>

      {/* Top Celebratory Cyan Banner */}
      <div className="wjl-ready-banner-card">
        <div className="wjl-ready-banner-icon-bg">
          <PartyPopper size={20} className="wjl-ready-banner-icon" />
        </div>
        <div className="wjl-ready-banner-text">
          <h3 className="wjl-ready-banner-title">Your restaurant is ready!</h3>
          <p className="wjl-ready-banner-sub">Everything is set up and live.</p>
        </div>
      </div>

      {/* MENU Section */}
      <div className="wjl-ob-section">
        <h3 className="wjl-ob-section-label">MENU</h3>
        <div className="wjl-ready-stats-grid">
          <div className="wjl-ready-stat-card">
            <span className="wjl-ready-stat-label">Total Items</span>
            <span className="wjl-ready-stat-val">{summaryData.totalItems}</span>
          </div>
          <div className="wjl-ready-stat-card">
            <span className="wjl-ready-stat-label">Available</span>
            <span className="wjl-ready-stat-val">{summaryData.available}</span>
          </div>
          <div className="wjl-ready-stat-card">
            <span className="wjl-ready-stat-label">Categories</span>
            <span className="wjl-ready-stat-val">{summaryData.categories}</span>
          </div>
        </div>
      </div>

      {/* SHOP URL Section */}
      <div className="wjl-ob-section">
        <h3 className="wjl-ob-section-label">SHOP URL</h3>
        <div className="wjl-ready-url-card">
          <div className="wjl-ready-url-left">
            <div className="wjl-url-at-icon">
              <AtSign size={14} />
            </div>
            <span className="wjl-ready-url-text">yourstore.app/menu/golden-fork</span>
          </div>
          <button type="button" className="wjl-ready-copy-btn" onClick={handleCopyLink}>
            Copy
          </button>
        </div>
      </div>

      {/* SETUP SUMMARY Section */}
      <div className="wjl-ob-section">
        <h3 className="wjl-ob-section-label">SETUP SUMMARY</h3>
        <div className="wjl-ready-summary-list">
          <div className="wjl-ready-summary-item">
            <div className="wjl-summary-check-icon">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="wjl-summary-title">Delivery</span>
            <span className="wjl-summary-value">{summaryData.delivery}</span>
          </div>
          <div className="wjl-ready-summary-item">
            <div className="wjl-summary-check-icon">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="wjl-summary-title">Payment</span>
            <span className="wjl-summary-value">{summaryData.payment}</span>
          </div>
          <div className="wjl-ready-summary-item">
            <div className="wjl-summary-check-icon">
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="wjl-summary-title">Combos</span>
            <span className="wjl-summary-value">
              {summaryData.combosCount && summaryData.combosCount > 0 ? `${summaryData.combosCount} combos` : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* DOWNLOADS Section */}
      <div className="wjl-ob-section">
        <h3 className="wjl-ob-section-label">DOWNLOADS</h3>
        <div className="wjl-ready-downloads-list">
          <div className="wjl-ready-download-card">
            <div className="wjl-download-left">
              <div className="wjl-download-icon-box">
                <FileText size={18} />
              </div>
              <span className="wjl-download-name">Menu PDF</span>
            </div>
            <Download size={16} className="wjl-download-arrow" />
          </div>

          <div className="wjl-ready-download-card">
            <div className="wjl-download-left">
              <div className="wjl-download-icon-box">
                <Clock size={18} />
              </div>
              <span className="wjl-download-name">Timings PDF</span>
            </div>
            <Download size={16} className="wjl-download-arrow" />
          </div>

          <div className="wjl-ready-download-card">
            <div className="wjl-download-left">
              <div className="wjl-download-icon-box">
                <QrCode size={18} />
              </div>
              <span className="wjl-download-name">QR Code PDF</span>
            </div>
            <Download size={16} className="wjl-download-arrow" />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="wjl-ob-step__footer">
        <Button
          onClick={onGoToLiveStore}
          variant="primary"
          size="lg"
          fullWidth
          pill
          rightIcon={<ArrowRight size={18} />}
        >
          Go to Live Store →
        </Button>
      </div>
    </div>
  );
};

