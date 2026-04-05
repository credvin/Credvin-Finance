import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollText, ShieldCheck } from 'lucide-react';

const TERMS = [
  'All documents submitted are genuine and accurate.',
  'Credvin may share your information with partner lenders for credit evaluation.',
  'Dealer agrees to comply with RBI and FEMA guidelines for loan facilitation.',
  'Any misrepresentation may result in immediate suspension of the dealer account.',
  'Credvin reserves the right to modify scheme terms with prior intimation.',
  'Dealer will not charge customers any hidden fees outside the sanctioned scheme.',
  'This agreement is governed by the laws of India under jurisdiction of Mumbai courts.',
];

export default function Step7Terms({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Terms & Conditions</h2>
        <p className="text-sm text-muted-foreground mb-4">Please read and accept the following terms to proceed.</p>
      </div>

      <div className="border border-border rounded-xl p-5 bg-muted/20 max-h-72 overflow-y-auto space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <ScrollText className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Dealer Onboarding Agreement — Key Terms</span>
        </div>
        {TERMS.map((term, i) => (
          <div key={i} className="flex gap-3 text-sm text-muted-foreground">
            <span className="text-primary font-semibold flex-shrink-0">{i + 1}.</span>
            <span>{term}</span>
          </div>
        ))}
      </div>

      <div
        className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all ${
          data.terms_accepted ? 'border-secondary bg-secondary/5' : 'border-border hover:border-primary/50'
        }`}
        onClick={() => onChange('terms_accepted', !data.terms_accepted)}
      >
        <Checkbox checked={!!data.terms_accepted} onCheckedChange={(v) => onChange('terms_accepted', v)} className="mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">I agree to the Terms & Conditions</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            By checking this box, I confirm I have read, understood, and agree to the Credvin Dealer Onboarding Terms & Conditions.
          </p>
        </div>
      </div>

      {data.terms_accepted && (
        <div className="flex items-center gap-2 text-secondary text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Terms accepted. You're ready to submit your application.
        </div>
      )}
    </div>
  );
}
