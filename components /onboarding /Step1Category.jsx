import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const CATEGORIES = [
  { value: 'education', label: '🎓 Education Institute' },
  { value: 'electronics', label: '📱 Electronics' },
  { value: 'healthcare', label: '🏥 Healthcare' },
  { value: 'home_decor', label: '🛋️ Home Decor' },
  { value: 'interior', label: '🏠 Interior' },
  { value: 'jewellers', label: '💍 Jewellers' },
  { value: 'real_estate', label: '🏢 Real Estate' },
  { value: 'solar', label: '☀️ Solar' },
  { value: 'vehicle_2w', label: '🛵 Vehicle (2W)' },
  { value: 'vehicle_4w', label: '🚗 Vehicle (4W)' },
];

export default function Step1Category({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Dealer Category</h2>
        <p className="text-sm text-muted-foreground mb-6">Select your business category to get started with onboarding.</p>
      </div>

      <div>
        <Label>Dealer Category *</Label>
        <Select value={data.category || ''} onValueChange={(v) => onChange('category', v)}>
          <SelectTrigger className="mt-1 h-12">
            <SelectValue placeholder="Select your dealer category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Contact Email *</Label>
          <Input type="email" value={data.email || ''} onChange={(e) => onChange('email', e.target.value)} className="mt-1" placeholder="dealer@business.com" />
        </div>
        <div>
          <Label>Contact Phone *</Label>
          <Input value={data.phone || ''} onChange={(e) => onChange('phone', e.target.value)} className="mt-1" placeholder="+91 XXXXX XXXXX" />
        </div>
      </div>
    </div>
  );
}
