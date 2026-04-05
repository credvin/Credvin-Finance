import React from 'react';
import { motion } from 'framer-motion';
import { User, Gem, Sun, HeartPulse, Sofa, ShoppingBag, GraduationCap } from 'lucide-react';
import LoanProductCard from '../components/loans/LoanProductCard';
import EMICalculator from '../components/shared/EMICalculator';
import EligibilityChecker from '../components/shared/EligibilityChecker';

const loanProducts = [
  {
    type: 'personal',
    icon: User,
    title: 'Personal Loan',
    badge: 'Popular',
    description: 'Instant funding for personal needs — weddings, vacations, emergencies, debt consolidation, and more.',
    gradient: 'from-primary to-primary/60',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    benefits: ['No collateral required', 'Flexible repayment up to 60 months', 'Quick disbursal within 24-48 hours', 'Competitive interest rates from 10.5%'],
    eligibility: ['Age: 21-60 years', 'Minimum income: ₹15,000/month', 'Employment: Salaried or Self-employed', 'Credit score: 650+'],
    documents: ['PAN Card', 'Aadhaar Card', 'Salary Slips', 'Bank Statements', 'Photo'],
  },
  {
    type: 'jewellery',
    icon: Gem,
    title: 'Jewellery Loan',
    badge: 'Secured',
    description: 'Unlock the value of your gold and jewellery. Get instant liquidity without selling your precious assets.',
    gradient: 'from-amber-500 to-amber-400',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    benefits: ['Low interest rates from 7%', 'Up to 75% of gold value', 'No income proof required', 'Same-day disbursement'],
    eligibility: ['Age: 18-70 years', 'Gold purity: 18-24 karat', 'Minimum gold weight: 10 grams'],
    documents: ['PAN Card', 'Aadhaar Card', 'Gold/Jewellery', 'Photo'],
  },
  {
    type: 'solar',
    icon: Sun,
    title: 'Solar Loan',
    badge: 'Green Energy',
    description: 'Finance your solar energy systems and reduce electricity bills. Go green with affordable solar financing.',
    gradient: 'from-green-500 to-green-400',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    benefits: ['Up to 100% financing', 'Tenure up to 7 years', 'Save up to 90% on electricity', 'Subsidy assistance available'],
    eligibility: ['Property owner or tenant', 'Minimum income: ₹20,000/month', 'Valid address proof', 'Age: 21-65 years'],
    documents: ['PAN Card', 'Aadhaar Card', 'Property Documents', 'Electricity Bill', 'Income Proof'],
  },
  {
    type: 'healthcare',
    icon: HeartPulse,
    title: 'Healthcare Loan',
    badge: 'No Collateral',
    description: 'Cover medical emergencies and planned treatments. Don\'t let finances come in the way of health.',
    gradient: 'from-red-500 to-red-400',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    benefits: ['Zero collateral', 'Instant approval for emergencies', 'Covers all medical treatments', 'EMI starting from ₹1,000'],
    eligibility: ['Age: 21-65 years', 'Treatment at partner hospitals', 'Basic income proof', 'Valid ID proof'],
    documents: ['PAN Card', 'Aadhaar Card', 'Hospital Estimate', 'Income Proof', 'Medical Reports'],
  },
  {
    type: 'home_decor',
    icon: Sofa,
    title: 'Home Decor Loan',
    badge: 'Easy EMI',
    description: 'Transform your home with furniture and improvement financing. Create the space you\'ve always dreamed of.',
    gradient: 'from-violet-500 to-violet-400',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    benefits: ['No down payment options', 'Flexible EMI plans', 'Partner store discounts', 'Quick processing'],
    eligibility: ['Age: 21-60 years', 'Minimum income: ₹15,000/month', 'Salaried or Self-employed'],
    documents: ['PAN Card', 'Aadhaar Card', 'Salary Slips', 'Bank Statements', 'Quotation'],
  },
  {
    type: 'retail',
    icon: ShoppingBag,
    title: 'Retail Financing',
    badge: 'Buy Now Pay Later',
    description: 'Purchase electronics, appliances, and more with flexible retail financing. Shop smarter with easy EMIs.',
    gradient: 'from-sky-500 to-sky-400',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    benefits: ['Zero-cost EMI options', 'Instant approval at store', 'Wide partner network', 'No processing fee'],
    eligibility: ['Age: 21-60 years', 'Valid credit/debit card', 'Purchase at partner stores'],
    documents: ['PAN Card', 'Aadhaar Card', 'Address Proof'],
  },
  {
    type: 'education',
    icon: GraduationCap,
    title: 'Education Loan',
    badge: 'Study Now',
    description: 'Fund your education dreams — tuition fees, living expenses, study materials, and more with affordable education loans.',
    gradient: 'from-teal-500 to-teal-400',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    benefits: ['Covers full course fees', 'Flexible repayment after course completion', 'Competitive rates from 8.5%', 'No collateral for smaller amounts'],
    eligibility: ['Age: 18-35 years', 'Admission in recognized institution', 'Co-applicant (parent/guardian) required', 'Valid ID proof'],
    documents: ['PAN Card', 'Aadhaar Card', 'Admission Letter', 'Fee Structure', 'Income Proof (Co-applicant)'],
  },
];

export default function LoanProducts() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Our Products</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Loan Products
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive range of loan products tailored to meet your every financial need.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {loanProducts.map((loan, i) => (
              <LoanProductCard key={loan.type} loan={loan} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Financial Tools</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Plan Your Loan</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <EMICalculator />
            <EligibilityChecker />
          </div>
        </div>
      </section>
    </div>
  );
}
