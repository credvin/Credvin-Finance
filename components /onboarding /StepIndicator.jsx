import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  'Category',
  'Scheme',
  'Details',
  'Business Type',
  'Documents',
  'Agreement',
  'Terms',
  'Submit',
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full mb-8">
      {/* Mobile: show step X of Y */}
      <div className="sm:hidden text-center mb-4">
        <span className="text-sm font-semibold text-primary">Step {currentStep + 1} of {STEPS.length}</span>
        <p className="text-muted-foreground text-xs mt-1">{STEPS[currentStep]}</p>
      </div>

      {/* Desktop stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
              i < currentStep
                ? 'bg-primary border-primary text-primary-foreground'
                : i === currentStep
                ? 'bg-background border-primary text-primary'
                : 'bg-background border-border text-muted-foreground'
            }`}>
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-2 font-medium text-center max-w-[60px] leading-tight ${
              i <= currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
