import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Gem, Sun, HeartPulse, Sofa, ShoppingBag, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const loans = [
  {
    icon: User,
    title: 'Personal Loans',
    description: 'Instant funding for personal needs – weddings, travel, emergencies, and more.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Gem,
    title: 'Jewellery Loans',
    description: 'Unlock the value of your gold and jewellery with quick, secure loans.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Sun,
    title: 'Solar Loans',
    description: 'Finance your solar energy systems and save on electricity bills.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare Loans',
    description: 'Cover medical emergencies and planned treatments without financial stress.',
    color: 'bg-red-100 text-red-500',
  },
  {
    icon: Sofa,
    title: 'Home Decor Loans',
    description: 'Transform your home with furniture and improvement financing.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: ShoppingBag,
    title: 'Retail Financing',
    description: 'Buy now, pay later with flexible retail purchase financing options.',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    icon: GraduationCap,
    title: 'Education Loans',
    description: 'Fund your education — tuition, living expenses, and study materials with affordable loans.',
    color: 'bg-teal-100 text-teal-600',
  },
];

export default function LoanCategories() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Our Products</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Loan Solutions for Every Need
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose from our wide range of loan products designed to help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan, i) => (
            <motion.div
              key={loan.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="group h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-card">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl ${loan.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <loan.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{loan.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">{loan.description}</p>
                  <Link to={createPageUrl('ApplyLoan') + `?type=${loan.title.toLowerCase().replace(/ /g, '_')}`}>
                    <Button variant="ghost" className="mt-4 p-0 text-primary hover:text-primary/80 font-semibold group/btn">
                      Apply Now
                      <ArrowRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
