import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  { name: 'HDFC Bank', logo: 'https://logo.clearbit.com/hdfcbank.com', color: '#004C8F' },
  { name: 'ICICI Bank', logo: 'https://logo.clearbit.com/icicibank.com', color: '#F05A28' },
  { name: 'SBI', logo: 'https://logo.clearbit.com/sbi.co.in', color: '#2D5FA6' },
  { name: 'Axis Bank', logo: 'https://logo.clearbit.com/axisbank.com', color: '#97144D' },
  { name: 'Kotak Mahindra', logo: 'https://logo.clearbit.com/kotak.com', color: '#ED1C24' },
  { name: 'Yes Bank', logo: 'https://logo.clearbit.com/yesbank.in', color: '#00AEEF' },
  { name: 'Bajaj Finance', logo: 'https://logo.clearbit.com/bajajfinserv.in', color: '#1D3180' },
  { name: 'L&T Finance', logo: 'https://logo.clearbit.com/ltfs.com', color: '#E31E24' },
];

export default function PartnerLenders() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Our Network</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Trusted Lending Partners
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            We work with India's leading banks and NBFCs to offer you the best loan options.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-border/40 p-5 flex flex-col items-center justify-center h-28 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="hidden items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-lg"
                style={{ backgroundColor: partner.color }}
              >
                {partner.name.charAt(0)}
              </div>
              <p className="text-xs font-semibold text-muted-foreground mt-2 group-hover:text-primary transition-colors text-center">{partner.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-sm font-medium">
            🔒 RBI Regulated Partners · Secure & Compliant
          </span>
        </motion.div>
      </div>
    </section>
  );
}
