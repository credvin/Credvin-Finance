import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-10 sm:p-16 text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Start Your Loan Journey Today
            </h2>
            <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
              Join thousands of happy borrowers who found the perfect loan through Credvin.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('ApplyLoan')}>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-base font-semibold rounded-xl shadow-lg">
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/919218052816?text=Hello%20Credvin%2C%20I%20am%20interested%20in%20applying%20for%20a%20loan.%20Please%20guide%20me." target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white border-0 px-8 py-6 text-base font-semibold rounded-xl shadow-lg">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Chat on WhatsApp
                </Button>
              </a>
              <Link to={createPageUrl('Contact')}>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-base font-semibold rounded-xl">
                  Talk to Us
                </Button>
              </Link>
              <Link to={createPageUrl('AIChat')}>
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 px-8 py-6 text-base font-semibold rounded-xl">
                  <Bot className="mr-2 w-5 h-5" />
                  AI Chat
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
