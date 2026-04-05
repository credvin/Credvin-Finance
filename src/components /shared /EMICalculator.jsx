import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

const loanRates = {
  personal:    { label: 'Personal Loan',     min: 10.5, max: 18,   default: 14 },
  jewellery:   { label: 'Jewellery Loan',    min: 9,    max: 12,   default: 10 },
  solar:       { label: 'Solar Loan',        min: 9.5,  max: 14,   default: 11 },
  healthcare:  { label: 'Healthcare Loan',   min: 10,   max: 16,   default: 12 },
  home_decor:  { label: 'Home Decor Loan',   min: 10,   max: 15,   default: 13 },
  retail:      { label: 'Retail Financing',  min: 12,   max: 24,   default: 18 },
  education:   { label: 'Education Loan',    min: 8.5,  max: 15,   default: 10 },
};

export default function EMICalculator() {
  const [loanType, setLoanType] = useState('personal');
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(14);
  const [tenure, setTenure] = useState(36);

  const handleLoanTypeChange = (type) => {
    setLoanType(type);
    setRate(loanRates[type].default);
  };

  const rateInfo = loanRates[loanType];

  const { emi, totalAmount, totalInterest } = useMemo(() => {
    const totalInterest = principal * (rate / 100) * (tenure / 12);
    const totalAmount = principal + totalInterest;
    const emi = totalAmount / tenure;
    return { emi, totalAmount, totalInterest };
  }, [principal, rate, tenure]);

  const fmt = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="w-5 h-5 text-primary" />
          EMI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Loan Type */}
        <div>
          <Label className="text-sm">Loan Type</Label>
          <Select value={loanType} onValueChange={handleLoanTypeChange}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(loanRates).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Interest rate: {rateInfo.min}% – {rateInfo.max}% p.a.</p>
        </div>

        {/* Loan Amount */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Loan Amount</Label>
            <span className="text-sm font-semibold text-primary">{fmt(principal)}</span>
          </div>
          <Slider value={[principal]} onValueChange={([v]) => setPrincipal(v)} min={10000} max={5000000} step={10000} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹10K</span><span>₹50L</span></div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Interest Rate (% p.a.)</Label>
            <span className="text-sm font-semibold text-primary">{rate}%</span>
          </div>
          <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={rateInfo.min} max={rateInfo.max} step={0.5} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>{rateInfo.min}%</span><span>{rateInfo.max}%</span></div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Tenure</Label>
            <span className="text-sm font-semibold text-primary">{tenure} months</span>
          </div>
          <Slider value={[tenure]} onValueChange={([v]) => setTenure(v)} min={3} max={60} step={1} className="mt-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>3 mo</span><span>60 mo</span></div>
        </div>

        {/* Results */}
        <div className="bg-primary/5 rounded-xl p-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Monthly EMI</span>
            <span className="text-xl font-bold text-primary">{fmt(emi)}</span>
          </div>
          <div className="border-t border-border/50 pt-3 flex justify-between">
            <span className="text-muted-foreground text-sm">Total Interest</span>
            <span className="font-semibold text-foreground">{fmt(totalInterest)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Total Amount Payable</span>
            <span className="font-semibold text-foreground">{fmt(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
