import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-secondary/8 pt-20 pb-24 lg:pt-32 lg:pb-36" style={{background: 'linear-gradient(135deg, hsl(221 75% 38% / 0.06) 0%, hsl(30 25% 98%) 50%, hsl(38 80% 45% / 0.06) 100%)'}}>
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              Trusted by 10,000+ Borrowers
            </div>
            
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">Start Your Loan Journey Today</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tighter">
              Fast, Simple & <br />
              <span className="text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Accessible Loans</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Get the financial support you need with Credvin – <strong className="text-foreground">Loans for Everyone.</strong> Connect with multiple lenders through one simple platform.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('ApplyLoan')}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5">
                  Apply for Loan
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('LoanProducts')}>
                <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold rounded-xl border-2">
                  Check Eligibility
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-foreground">₹50L+</p>
                <p className="text-sm text-muted-foreground">Loans Processed</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">20+</p>
                <p className="text-sm text-muted-foreground">Lending Partners</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">4.8★</p>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-7xl font-bold mb-2">₹</div>
                  <p className="text-2xl font-semibold">Get Instant Loans</p>
                  <p className="text-white/80 mt-2">From ₹10,000 to ₹50,00,000</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="font-semibold">Low Interest</p>
                      <p className="text-white/70">Starting 10.5%</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="font-semibold">Quick Approval</p>
                      <p className="text-white/70">Within 15 Mins</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="font-semibold">Minimal Docs</p>
                      <p className="text-white/70">Easy process</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="font-semibold">Flexible EMI</p>
                      <p className="text-white/70">6, 12, 18, 24 & more</p>
                    </div>
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
