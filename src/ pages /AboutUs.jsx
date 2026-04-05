import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Shield, Users, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  { icon: Heart, title: 'Customer First', desc: 'Every decision we make is centered around making borrowing easier and more accessible for everyone.' },
  { icon: Shield, title: 'Trust & Transparency', desc: 'No hidden charges, no fine print surprises. Complete clarity at every step of the process.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'We leverage technology to simplify complex financial processes and deliver faster results.' },
  { icon: Users, title: 'Inclusion', desc: 'We believe financial services should be accessible to all, regardless of background or location.' },
];

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function AboutUs() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...anim()} className="max-w-3xl mx-auto text-center">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">About Credvin</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Making Loans <span className="text-primary">Accessible</span> for Everyone
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Credvin is a fintech loan marketplace platform that connects borrowers with verified lending partners. 
              We simplify the entire loan journey — from discovery and application to verification and processing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div {...anim()}>
              <Card className="h-full border-0 shadow-lg bg-primary/5">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize access to credit by building a technology-driven platform that connects borrowers with the 
                    right lending partners. We aim to make the loan process faster, simpler, and more transparent for every Indian.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...anim(0.1)}>
              <Card className="h-full border-0 shadow-lg bg-secondary/5">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5">
                    <Eye className="w-7 h-7 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To become India's most trusted loan marketplace where anyone can find and access the perfect financial 
                    product for their needs — with complete transparency and zero hassle.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...anim()} className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              What Makes Credvin Different
            </h2>
            <div className="bg-card rounded-2xl p-8 shadow-md border border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Credvin is a loan marketplace platform, not a direct lender.</strong> We partner 
                with registered banks and NBFCs to offer you a variety of loan products. Our role is to simplify your loan discovery, 
                application, and verification process. The final loan approval and disbursement are handled by our respected lending partners, 
                ensuring you get the best rates and terms available in the market.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...anim()} className="text-center mb-14">
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Our Values</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">What We Stand For</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} {...anim(i * 0.1)}>
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <v.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
