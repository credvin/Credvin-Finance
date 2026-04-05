import React from 'react';
import HeroSection from '../components/home/HeroSection';
import LoanCategories from '../components/home/LoanCategories';
import HowItWorks from '../components/home/HowItWorks';
import WhyChoose from '../components/home/WhyChoose';
import PartnerLenders from '../components/home/PartnerLenders';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import EMICalculator from '../components/shared/EMICalculator';

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Calculator (left) + How It Works (right) */}
      <div className="lg:grid lg:grid-cols-2">
        <div className="bg-muted/30 py-16 lg:py-20 flex items-start">
          <div className="w-full max-w-xl mx-auto px-6 lg:px-10">
            <div className="mb-8">
              <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Plan Your Finances</p>
              <h2 className="text-3xl font-bold text-foreground">Loan EMI Calculator</h2>
              <p className="mt-2 text-muted-foreground">Estimate your monthly payments instantly</p>
            </div>
            <EMICalculator />
          </div>
        </div>
        <div className="bg-background">
          <HowItWorks />
        </div>
      </div>

      <LoanCategories />
      <WhyChoose />
      <PartnerLenders />
      <Testimonials />
      <CTASection />
    </div>
  );
}
