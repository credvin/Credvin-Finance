import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Zap, ShieldCheck, Eye, Clock } from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'Multiple Lenders',
    description: 'Access 50+ lending partners through one unified platform.',
  },
  {
    icon: Zap,
    title: 'Quick Digital Application',
    description: 'Apply in minutes with our fully digital, paperless process.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Verification',
    description: 'Bank-grade security for all your documents and personal data.',
  },
  {
    icon: Eye,
    title: 'Transparent Process',
    description: 'No hidden fees. Track your application status in real-time.',
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'Get loan approval within 24 hours of complete documentation.',
  },
];

export default function WhyChoose() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Why Credvin</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              The Smarter Way to Borrow
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Credvin connects you with the right lender for your specific needs. Our platform ensures you get the best rates with minimal hassle.
            </p>

            <div className="mt-10 space-y-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{f.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl rotate-3" />
              <div className="relative bg-card rounded-3xl p-8 shadow-2xl border border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="text-2xl font-bold text-foreground">₹5,00,000</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-secondary font-bold">✓</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="text-2xl font-bold text-primary">10.5% p.a.</p>
                    </div>
                    <div className="text-sm text-secondary font-medium">Best Rate</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly EMI</p>
                      <p className="text-2xl font-bold text-foreground">₹10,747</p>
                    </div>
                    <div className="text-sm text-muted-foreground">60 months</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-xl">
                    <p className="text-secondary font-semibold">🎉 Pre-approved for 3 lenders!</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
