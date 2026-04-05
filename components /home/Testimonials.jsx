import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    text: 'Credvin made my personal loan journey incredibly smooth. Got approved in just 24 hours with a great interest rate. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'IT Professional',
    text: 'I was skeptical at first, but the transparent process and multiple lender options gave me confidence. Best loan experience I\'ve had.',
    rating: 5,
  },
  {
    name: 'Anand Patel',
    role: 'Doctor',
    text: 'The solar loan helped me install a complete solar system for my clinic. The EMI is less than what I was paying for electricity!',
    rating: 5,
  },
  {
    name: 'Meera Reddy',
    role: 'Homemaker',
    text: 'Jewellery loan process was seamless. Got the funds within 2 days and the interest rate was very competitive. Thank you Credvin!',
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What Our Borrowers Say
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-shadow bg-card">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
