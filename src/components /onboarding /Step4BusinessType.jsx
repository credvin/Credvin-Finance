import React from 'react';
import { Building2, Users, Heart, Briefcase, Building } from 'lucide-react';

const BUSINESS_TYPES = [
  { value: 'proprietorship', label: 'Proprietorship', icon: Briefcase, desc: 'Single owner business' },
  { value: 'partnership', label: 'Partnership', icon: Users, desc: 'Two or more partners' },
  { value: 'trust', label: 'Trust', icon: Heart, desc: 'Charitable or religious trust' },
  { value: 'llp', label: 'LLP', icon: Building2, desc: 'Limited Liability Partnership' },
  { value: 'pvt_ltd', label: 'Pvt. Ltd.', icon: Building, desc: 'Private Limited Company' },
];

export default function Step4BusinessType({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Business Type</h2>
        <p className="text-sm text-muted-foreground mb-6">Select your business entity type. This determines the required documents.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BUSINESS_TYPES.map((bt) => {
          const Icon = bt.icon;
          const selected = data.business_type === bt.value;
          return (
            <div
              key={bt.value}
              onClick={() => onChange('business_type', bt.value)}
              className={`cursor-pointer rounded-xl border-2 p-5 transition-all hover:shadow-md ${
                selected ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`font-semibold text-sm ${selected ? 'text-primary' : 'text-foreground'}`}>{bt.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{bt.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
