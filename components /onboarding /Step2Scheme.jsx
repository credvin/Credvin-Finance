import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

const PRODUCT_TYPES = [
  { value: 'subvention', label: 'Subvention', desc: 'Lender bears interest cost; customer pays 0% EMI' },
  { value: 'roi', label: 'ROI (Rate of Interest)', desc: 'Standard interest-bearing loan scheme' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Partial subvention with reduced ROI' },
];

const TENURES = [3, 6, 9, 12, 15, 18, 24];

const EMI_PROTECTION = [
  'None',
  '1 Month EMI Protection',
  '2 Month EMI Protection',
  '3 Month EMI Protection',
];

export default function Step2Scheme({ data, onChange }) {
  // tenure_months is now an array of selected tenures
  const selectedTenures = Array.isArray(data.tenure_months) ? data.tenure_months : [];

  const toggleTenure = (t) => {
    if (selectedTenures.includes(t)) {
      onChange('tenure_months', selectedTenures.filter((x) => x !== t));
      // Clear rate for this tenure if removed
      const newRates = { ...(data.tenure_rates || {}) };
      delete newRates[t];
      onChange('tenure_rates', newRates);
    } else {
      onChange('tenure_months', [...selectedTenures, t].sort((a, b) => a - b));
    }
  };

  const setRate = (t, val) => {
    onChange('tenure_rates', { ...(data.tenure_rates || {}), [t]: val });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Scheme Selection</h2>
        <p className="text-sm text-muted-foreground mb-6">Choose the financing scheme and tenures for your customers.</p>
      </div>

      {/* Product Type */}
      <div>
        <Label>Product Type *</Label>
        <div className="mt-2 grid sm:grid-cols-3 gap-3">
          {PRODUCT_TYPES.map((pt) => (
            <div
              key={pt.value}
              onClick={() => onChange('product_type', pt.value)}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                data.product_type === pt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              }`}
            >
              <div className="font-semibold text-sm text-foreground">{pt.label}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-tight">{pt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tenure — multi-select list on left */}
      <div>
        <Label>Tenure (select one or more) *</Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3">Enter the agreed rate % for each selected tenure.</p>
        <div className="flex flex-col gap-2">
          {TENURES.map((t) => {
            const selected = selectedTenures.includes(t);
            return (
              <div key={t} className="flex items-center gap-3">
                {/* Tenure pill on left */}
                <button
                  type="button"
                  onClick={() => toggleTenure(t)}
                  className={`w-24 flex-shrink-0 py-2 rounded-lg border-2 text-sm font-semibold transition-all text-center ${
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:border-primary/50'
                  }`}
                >
                  {t} Month{t > 1 ? 's' : ''}
                </button>

                {/* Rate input appears only when selected */}
                {selected && (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Agreed Rate % p.a."
                      value={(data.tenure_rates || {})[t] || ''}
                      onChange={(e) => setRate(t, e.target.value)}
                      className="max-w-[200px]"
                    />
                    <span className="text-sm text-muted-foreground">% p.a.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedTenures.length > 0 && (
        <div className="flex items-start gap-3 bg-secondary/10 rounded-xl p-4 border border-secondary/20">
          <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-foreground">Selected Tenures: </span>
            <span className="text-muted-foreground">{selectedTenures.map((t) => `${t}M @ ${(data.tenure_rates || {})[t] || '—'}%`).join(' | ')}</span>
            <p className="text-xs text-muted-foreground mt-0.5">Rates are as agreed between Credvin and the merchant.</p>
          </div>
        </div>
      )}

      {/* EMI Protection */}
      <div>
        <Label>EMI Protection</Label>
        <Select value={data.emi_protection || ''} onValueChange={(v) => onChange('emi_protection', v)}>
          <SelectTrigger className="mt-1 h-12">
            <SelectValue placeholder="Select EMI protection plan" />
          </SelectTrigger>
          <SelectContent>
            {EMI_PROTECTION.map((e) => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
