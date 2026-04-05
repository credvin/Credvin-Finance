import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, UserCheck } from 'lucide-react';

export default function EligibilityChecker() {
  const [formData, setFormData] = useState({ age: '', income: '', employment: '', loanAmount: '' });
  const [result, setResult] = useState(null);

  const checkEligibility = () => {
    const age = parseInt(formData.age);
    const income = parseInt(formData.income);
    const amount = parseInt(formData.loanAmount);

    if (!age || !income || !formData.employment || !amount) return;

    const eligible = age >= 21 && age <= 60 && income >= 15000 && amount <= income * 60;
    const maxAmount = income * 60;

    setResult({
      eligible,
      maxAmount,
      message: eligible
        ? `Congratulations! You may be eligible for a loan up to ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(maxAmount)}.`
        : 'Based on the details provided, you may not meet the minimum eligibility criteria. Please contact us for personalized assistance.',
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserCheck className="w-5 h-5 text-secondary" />
          Check Eligibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Age</Label>
            <Input
              type="number"
              placeholder="e.g. 30"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Monthly Income (₹)</Label>
            <Input
              type="number"
              placeholder="e.g. 50000"
              value={formData.income}
              onChange={(e) => setFormData({ ...formData, income: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm">Employment Type</Label>
          <Select value={formData.employment} onValueChange={(v) => setFormData({ ...formData, employment: v })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salaried">Salaried</SelectItem>
              <SelectItem value="self_employed">Self Employed</SelectItem>
              <SelectItem value="business_owner">Business Owner</SelectItem>
              <SelectItem value="freelancer">Freelancer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Desired Loan Amount (₹)</Label>
          <Input
            type="number"
            placeholder="e.g. 500000"
            value={formData.loanAmount}
            onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
            className="mt-1"
          />
        </div>

        <Button onClick={checkEligibility} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          Check Now
        </Button>

        {result && (
          <div className={`p-4 rounded-xl flex items-start gap-3 ${result.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.eligible ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${result.eligible ? 'text-green-800' : 'text-red-800'}`}>
              {result.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
