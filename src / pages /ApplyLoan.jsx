import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ArrowLeft, ArrowRight, User, FileText, Banknote, Upload, Loader2, Camera } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const loanTypes = [
  { value: 'personal', label: 'Personal Loan' },
  { value: 'jewellery', label: 'Jewellery Loan' },
  { value: 'solar', label: 'Solar Loan' },
  { value: 'healthcare', label: 'Healthcare Loan' },
  { value: 'home_decor', label: 'Home Decor Loan' },
  { value: 'retail', label: 'Retail Financing' },
  { value: 'education', label: 'Education Loan' },
];

const steps = [
  { icon: User, label: 'Personal Details' },
  { icon: Banknote, label: 'Loan Details' },
  { icon: FileText, label: 'KYC Documents' },
];

function FileUploadField({ label, required, onChange, uploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url);
      toast.success(`${label} uploaded successfully`);
    } catch (err) {
      toast.error(`Failed to upload ${label}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium">
        {label} {required ? <span className="text-destructive">*</span> : <span className="text-muted-foreground text-xs">(Optional)</span>}
      </Label>
      <div className={`mt-1 border-2 border-dashed rounded-xl p-4 flex items-center gap-3 transition-colors ${uploaded ? 'border-secondary bg-secondary/5' : 'border-border hover:border-primary/50'}`}>
        {uploading ? (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        ) : uploaded ? (
          <CheckCircle className="w-5 h-5 text-secondary" />
        ) : (
          <Upload className="w-5 h-5 text-muted-foreground" />
        )}
        <div className="flex-1">
          {uploaded ? (
            <p className="text-sm text-secondary font-medium">Uploaded successfully</p>
          ) : (
            <label className="cursor-pointer">
              <span className="text-sm text-primary font-medium hover:underline">
                {uploading ? 'Uploading...' : 'Click to upload'}
              </span>
              <span className="text-sm text-muted-foreground"> (PDF, JPG, PNG)</span>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} disabled={uploading} />
            </label>
          )}
        </div>
        {uploaded && (
          <button onClick={() => onChange('')} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
        )}
      </div>
    </div>
  );
}

export default function ApplyLoan() {
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedType = urlParams.get('type') || '';

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', employment_type: '', monthly_income: '',
    loan_type: preselectedType, loan_amount: '', tenure_months: '',
    aadhaar_url: '', pan_url: '', bank_statement_url: '', payslip_url: '', itr_url: '', selfie_url: '',
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const isSalaried = formData.employment_type === 'salaried';
  const isSelfEmployed = ['self_employed', 'business_owner'].includes(formData.employment_type);

  const canProceed = () => {
    if (step === 0) return formData.full_name && formData.email && formData.phone && formData.employment_type;
    if (step === 1) return formData.loan_type && formData.loan_amount && formData.tenure_months;
    if (step === 2) return formData.aadhaar_url && formData.pan_url && formData.bank_statement_url && formData.selfie_url;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await base44.entities.LoanApplication.create({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      employment_type: formData.employment_type,
      monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : undefined,
      loan_type: formData.loan_type,
      loan_amount: parseFloat(formData.loan_amount),
      tenure_months: parseInt(formData.tenure_months),
      aadhaar_url: formData.aadhaar_url,
      pan_url: formData.pan_url,
      bank_statement_url: formData.bank_statement_url,
      payslip_url: formData.payslip_url || undefined,
      itr_url: formData.itr_url || undefined,
      selfie_url: formData.selfie_url || undefined,
      status: 'submitted',
    });
    setSubmitting(false);
    setShowSuccessDialog(true);
  };

  const refNumber = `CRV-${Date.now().toString().slice(-8)}`;

  return (
    <div>
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md text-center p-8">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Application Received!</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your application has been received and is currently under review. We will update you shortly.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Reference: <span className="font-mono font-semibold text-foreground">{refNumber}</span>
          </p>
        </DialogContent>
      </Dialog>

      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Apply for a Loan</h1>
            <p className="mt-3 text-lg text-muted-foreground">Complete the 3-step form to start your loan application.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {i < step ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-3 mt-[-20px] transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">

                {/* Step 1: Personal Details */}
                {step === 0 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-foreground mb-4">Personal Details</h2>
                    <div>
                      <Label>Full Name *</Label>
                      <Input value={formData.full_name} onChange={(e) => update('full_name', e.target.value)} className="mt-1" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} className="mt-1" placeholder="your@email.com" />
                    </div>
                    <div>
                      <Label>Phone Number *</Label>
                      <Input value={formData.phone} onChange={(e) => update('phone', e.target.value)} className="mt-1" placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                      <Label>Employment Type *</Label>
                      <Select value={formData.employment_type} onValueChange={(v) => update('employment_type', v)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select employment type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salaried">Salaried</SelectItem>
                          <SelectItem value="self_employed">Self Employed</SelectItem>
                          <SelectItem value="business_owner">Business Owner</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Monthly Income (₹)</Label>
                      <Input type="number" value={formData.monthly_income} onChange={(e) => update('monthly_income', e.target.value)} className="mt-1" placeholder="e.g. 50000" />
                    </div>
                  </div>
                )}

                {/* Step 2: Loan Details */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-foreground mb-4">Loan Details</h2>
                    <div>
                      <Label>Loan Type *</Label>
                      <Select value={formData.loan_type} onValueChange={(v) => update('loan_type', v)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select loan type" /></SelectTrigger>
                        <SelectContent>
                          {loanTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Loan Amount (₹) *</Label>
                      <Input type="number" value={formData.loan_amount} onChange={(e) => update('loan_amount', e.target.value)} className="mt-1" placeholder="e.g. 500000" />
                    </div>
                    <div>
                      <Label>Tenure *</Label>
                      <Select value={formData.tenure_months} onValueChange={(v) => update('tenure_months', v)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select tenure" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months (1 Year)</SelectItem>
                          <SelectItem value="18">18 Months</SelectItem>
                          <SelectItem value="24">24 Months (2 Years)</SelectItem>
                          <SelectItem value="36">36 Months (3 Years)</SelectItem>
                          <SelectItem value="48">48 Months (4 Years)</SelectItem>
                          <SelectItem value="60">60 Months (5 Years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 3: KYC Documents */}
                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-foreground mb-1">Upload KYC Documents</h2>
                    <p className="text-sm text-muted-foreground mb-4">Please upload clear, readable copies of the following documents.</p>

                    <FileUploadField label="Selfie / Photo" required onChange={(url) => update('selfie_url', url)} uploaded={!!formData.selfie_url} />
                    <FileUploadField label="Aadhaar Card" required onChange={(url) => update('aadhaar_url', url)} uploaded={!!formData.aadhaar_url} />
                    <FileUploadField label="PAN Card" required onChange={(url) => update('pan_url', url)} uploaded={!!formData.pan_url} />
                    <FileUploadField label="Last 6 Month Bank Statement" required onChange={(url) => update('bank_statement_url', url)} uploaded={!!formData.bank_statement_url} />

                    {isSalaried && (
                      <FileUploadField label="Last 3 Month Salary Slips" required={false} onChange={(url) => update('payslip_url', url)} uploaded={!!formData.payslip_url} />
                    )}
                    {isSelfEmployed && (
                      <FileUploadField label="Last Year ITR (Income Tax Return)" required={false} onChange={(url) => update('itr_url', url)} uploaded={!!formData.itr_url} />
                    )}

                    <p className="text-xs text-muted-foreground pt-2">
                      By submitting, you confirm that the documents provided are genuine and consent to our lending partners reviewing your application. Your data is stored securely.
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  {step > 0 ? (
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-xl">
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                  ) : <div />}

                  {step < 2 ? (
                    <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="bg-primary hover:bg-primary/90 rounded-xl font-semibold">
                      Next <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={submitting || !canProceed()} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl font-semibold">
                      {submitting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Submitting...</> : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
