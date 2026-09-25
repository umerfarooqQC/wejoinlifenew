import React from 'react';
import { CheckCircleIcon } from './Icons';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onSelectStep: (step: number) => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  onSelectStep
}) => {
  return (
    <nav className="wjl-stepper" aria-label="Restaurant setup progress">
      {stepLabels.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <button
            key={label}
            type="button"
            className={`wjl-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => onSelectStep(stepNum)}
            aria-current={isActive ? 'step' : undefined}
          >
            <div className="wjl-step-number">
              {isCompleted ? <CheckCircleIcon size={14} /> : stepNum}
            </div>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
