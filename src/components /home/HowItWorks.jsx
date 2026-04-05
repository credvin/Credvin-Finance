import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, FileText, ShieldCheck, Banknote } from 'lucide-react';

const steps = [
  {
    icon: FileSearch,
    step: '01',
    title: 'Choose Loan Type',
    description: 'Browse our range of loan products and select the one that fits your needs.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Submit Application',
    description: 'Fill out a simple online application form with your basic details.',
  },
  {
    icon: ShieldCheck,
    step: '03',
    title: 'Verification Process',
    description: 'Our team verifies your documents and matches you with the best lender.',
    badge: '⚡ Approval in 15 Minutes',
  },
  {
    icon: Banknote,
    step: '04',
    title: 'Loan Disbursement',
    description: 'Approved loans are disbursed directly by our partner lenders to your account.',
    badge: '🕐 Within 24 Hours',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How Credvin Works
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Get your loan in four simple steps. Our streamlined process makes borrowing easy.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative text-center group"
            >
              {i < 3 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t-2 border-dashed border-primary/20" />
              )}
              
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-9 h-9 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {step.step}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              {step.badge && (
                <div className="mt-3 inline-block bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  {step.badge}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
