import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, FileText, ShieldCheck, Banknote, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const steps = [
  {
    icon: FileSearch,
    step: 1,
    title: 'Choose Your Loan Type',
    description: 'Browse through our various loan products including Personal Loans, Jewellery Loans, Solar Loans, Healthcare Loans, and more. Select the one that best suits your financial needs.',
    details: ['Compare different loan options', 'Check interest rates and terms', 'Read eligibility requirements'],
  },
  {
    icon: FileText,
    step: 2,
    title: 'Submit Online Application',
    description: 'Fill out our simple digital application form with your basic personal, employment, and financial details. The entire process takes just a few minutes.',
    details: ['Quick 5-minute application', 'Minimal documentation required', 'Upload documents digitally'],
  },
  {
    icon: ShieldCheck,
    step: 3,
    title: 'Verification Process',
    description: 'Our team verifies your documents and matches your profile with the most suitable lending partners. We ensure accuracy and speed throughout the verification.',
    details: ['Secure document verification', 'Credit assessment by partners', 'Best lender matching'],
  },
  {
    icon: Banknote,
    step: 4,
    title: 'Loan Approval & Disbursement',
    description: 'Once approved by our partner lender, the loan amount is disbursed directly to your bank account. Track your application status in real-time.',
    details: ['Direct bank transfer', 'Partner lender approval', 'Real-time status tracking'],
  },
];

const faqs = [
  { q: 'How long does the approval process take?', a: 'Most loans are approved within 24-48 hours of complete documentation submission.' },
  { q: 'Is Credvin a direct lender?', a: 'No, Credvin is a loan marketplace platform. We connect you with registered banks and NBFCs who are our lending partners.' },
  { q: 'What documents do I need?', a: 'Basic documents include PAN Card, Aadhaar Card, income proof, and bank statements. Specific requirements vary by loan type.' },
  { q: 'Are there any hidden charges?', a: 'No. Credvin maintains complete transparency. All fees and charges are disclosed upfront before you proceed.' },
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Simple Process</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">How Credvin Works</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From application to disbursement, we make every step of your loan journey simple and transparent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-20 bg-primary/5 flex items-center justify-center p-6 sm:p-0">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            Step {step.step}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                        <div className="space-y-2">
                          {step.details.map((d) => (
                            <div key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 text-lg">Apply for a loan in just a few minutes.</p>
            <Link to={createPageUrl('ApplyLoan')}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
