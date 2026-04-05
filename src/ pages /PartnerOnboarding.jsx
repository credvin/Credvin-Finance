import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

import StepIndicator from '../components/onboarding/StepIndicator';
import Step1Category from '../components/onboarding/Step1Category';
import Step2Scheme from '../components/onboarding/Step2Scheme';
import Step3DealerDetails from '../components/onboarding/Step3DealerDetails';
import Step4BusinessType from '../components/onboarding/Step4BusinessType';
import Step5Documents from '../components/onboarding/Step5Documents';
import Step6Agreement from '../components/onboarding/Step6Agreement';
import Step7Terms from '../components/onboarding/Step7Terms';

const canGoNext = (step, data) => {
  if (step === 0) return !!(data.category && data.email && data.phone);
  if (step === 1) return !!(data.product_type && Array.isArray(data.tenure_months) && data.tenure_months.length > 0);
  if (step === 2) return !!(data.dealer_name && data.pan && data.city && data.state && data.bank_name && data.account_number && data.ifsc_code && data.authorised_signatory_name);
  if (step === 3) return !!data.business_type;
  if (step === 4) return !!(data.pan_url && data.cancelled_cheque_url);
  if (step === 5) return true;
  if (step === 6) return !!data.terms_accepted;
  return true;
};

export default function PartnerOnboarding() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [formData, setFormData] = useState({});

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    const record = await base44.entities.DealerOnboarding.create({ ...formData, status: 'submitted' });
    setRefId(`CRVD-${record.id?.slice(-8).toUpperCase() || Date.now().toString().slice(-8)}`);
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Application submitted successfully!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Application Submitted!</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your onboarding request has been successfully submitted and is currently under review. Our team will update you shortly.
              </p>
              <div className="mt-4 bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Reference ID</p>
                <p className="font-mono font-bold text-lg text-foreground">{refId}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-3">A confirmation will be sent to <strong>{formData.email}</strong></p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={createPageUrl('Home')}>
                  <Button variant="outline" className="rounded-xl w-full sm:w-auto">Back to Home</Button>
                </Link>
                <Link to={createPageUrl('DealerDashboard')}>
                  <Button className="bg-primary hover:bg-primary/90 rounded-xl w-full sm:w-auto">Go to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">Dealer / Merchant</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Partner Onboarding</h1>
            <p className="mt-2 text-muted-foreground">Complete the steps below to onboard your business with Credvin.</p>
          </motion.div>

          <StepIndicator currentStep={step} />

          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                {step === 0 && <Step1Category data={formData} onChange={update} />}
                {step === 1 && <Step2Scheme data={formData} onChange={update} />}
                {step === 2 && <Step3DealerDetails data={formData} onChange={update} />}
                {step === 3 && <Step4BusinessType data={formData} onChange={update} />}
                {step === 4 && <Step5Documents data={formData} onChange={update} />}
                {step === 5 && <Step6Agreement data={formData} />}
                {step === 6 && <Step7Terms data={formData} onChange={update} />}
                {step === 7 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Review & Submit</h2>
                    <p className="text-sm text-muted-foreground">Please review your details before submitting.</p>
                    <div className="bg-muted/40 rounded-xl p-5 space-y-2 text-sm">
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                        {[
                          ['Business Name', formData.dealer_name],
                          ['Category', formData.category],
                          ['PAN', formData.pan],
                          ['Business Type', formData.business_type],
                          ['Product Type', formData.product_type],
                          ['Tenure', formData.tenure_months ? `${formData.tenure_months} months` : ''],
                          ['Email', formData.email],
                          ['Phone', formData.phone],
                        ].map(([label, val]) => val ? (
                          <div key={label}>
                            <span className="text-muted-foreground">{label}: </span>
                            <span className="font-medium text-foreground capitalize">{String(val).replace(/_/g, ' ')}</span>
                          </div>
                        ) : null)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 0 ? (
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-xl">
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                  ) : <div />}

                  {step < 7 ? (
                    <Button
                      onClick={() => setStep(step + 1)}
                      disabled={!canGoNext(step, formData)}
                      className="bg-primary hover:bg-primary/90 rounded-xl font-semibold"
                    >
                      Next <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl font-semibold"
                    >
                      {submitting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Submitting...</> : <><Send className="mr-2 w-4 h-4" />Submit Application</>}
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
