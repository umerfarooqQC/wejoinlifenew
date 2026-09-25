import React, { useEffect, useState } from 'react';
import { Store } from 'lucide-react';

export interface Step5StoreCreatedProps {
  onComplete: () => void;
}

export const Step5StoreCreated: React.FC<Step5StoreCreatedProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 12;
      });
    }, 280);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="wjl-ob-step wjl-ob-step--center">
      <div className="wjl-ob-store-created">
        {/* Cyan Glowing Circle with Storefront Icon */}
        <div className="wjl-ob-store-created__icon-circle">
          <Store size={40} className="wjl-ob-store-created__icon" />
        </div>

        {/* Title */}
        <h1 className="wjl-ob-store-created__title">Creating your store...</h1>

        {/* Multi-line Subtitle */}
        <p className="wjl-ob-store-created__subtitle">
          Setting up your digital presence.
          <br />
          This takes just a moment.
        </p>

        {/* Horizontal Progress Bar */}
        <div className="wjl-ob-progress-track">
          <div
            className="wjl-ob-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

