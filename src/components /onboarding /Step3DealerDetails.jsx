import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Step3DealerDetails({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Dealer Details</h2>
        <p className="text-sm text-muted-foreground mb-6">Provide your business and banking details.</p>
      </div>

      <div>
        <Label>Dealer / Business Name *</Label>
        <Input value={data.dealer_name || ''} onChange={(e) => onChange('dealer_name', e.target.value)} className="mt-1" placeholder="Enter registered business name" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>PAN Number *</Label>
          <Input value={data.pan || ''} onChange={(e) => onChange('pan', e.target.value.toUpperCase())} className="mt-1 font-mono" placeholder="ABCDE1234F" maxLength={10} />
        </div>
        <div>
          <Label>GST Number</Label>
          <Input value={data.gst || ''} onChange={(e) => onChange('gst', e.target.value.toUpperCase())} className="mt-1 font-mono" placeholder="22AAAAA0000A1Z5" maxLength={15} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>City *</Label>
          <Input value={data.city || ''} onChange={(e) => onChange('city', e.target.value)} className="mt-1" placeholder="e.g. Mumbai" />
        </div>
        <div>
          <Label>State *</Label>
          <Input value={data.state || ''} onChange={(e) => onChange('state', e.target.value)} className="mt-1" placeholder="e.g. Maharashtra" />
        </div>
      </div>

      <div>
        <Label>Business Address</Label>
        <Input value={data.address || ''} onChange={(e) => onChange('address', e.target.value)} className="mt-1" placeholder="Full business address" />
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="font-semibold text-foreground mb-4">Authorised Signatory</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Signatory Name *</Label>
            <Input value={data.authorised_signatory_name || ''} onChange={(e) => onChange('authorised_signatory_name', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Designation</Label>
            <Input value={data.authorised_signatory_designation || ''} onChange={(e) => onChange('authorised_signatory_designation', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Signatory Email ID *</Label>
            <Input type="email" value={data.authorised_signatory_email || ''} onChange={(e) => onChange('authorised_signatory_email', e.target.value)} className="mt-1" placeholder="signatory@business.com" />
          </div>
          <div>
            <Label>Signatory Phone No *</Label>
            <Input value={data.authorised_signatory_phone || ''} onChange={(e) => onChange('authorised_signatory_phone', e.target.value)} className="mt-1" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="font-semibold text-foreground mb-4">Bank Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Bank Name *</Label>
            <Input value={data.bank_name || ''} onChange={(e) => onChange('bank_name', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Account Type</Label>
            <Select value={data.account_type || ''} onValueChange={(v) => onChange('account_type', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Account Number *</Label>
            <Input value={data.account_number || ''} onChange={(e) => onChange('account_number', e.target.value)} className="mt-1 font-mono" />
          </div>
          <div>
            <Label>IFSC Code *</Label>
            <Input value={data.ifsc_code || ''} onChange={(e) => onChange('ifsc_code', e.target.value.toUpperCase())} className="mt-1 font-mono" placeholder="SBIN0001234" />
          </div>
        </div>
      </div>
    </div>
  );
}
