import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Users, BarChart3, Shield, TrendingUp, Handshake, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const benefits = [
  { icon: Users, title: 'Access Borrower Network', desc: 'Reach thousands of pre-verified loan applicants through our platform.' },
  { icon: BarChart3, title: 'Data-Driven Leads', desc: 'Get quality leads with verified borrower data and credit profiles.' },
  { icon: Shield, title: 'Secure Platform', desc: 'Bank-grade security for all data exchanges and document handling.' },
  { icon: TrendingUp, title: 'Grow Your Portfolio', desc: 'Expand your lending book with diverse borrower segments across India.' },
  { icon: Handshake, title: 'Easy Integration', desc: 'Seamless API integration with your existing loan management systems.' },
  { icon: Building2, title: 'Brand Visibility', desc: 'Get featured on our platform and increase your brand presence.' },
];

export default function PartnerWithUs() {
  const [formData, setFormData] = useState({
    company_name: '', contact_person: '', email: '', phone: '', company_type: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.PartnerInquiry.create(formData);
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Partnership inquiry submitted successfully!');
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">For Lenders</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Partner With Credvin</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our growing network of banks and NBFCs. Expand your reach and grow your lending portfolio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground">Why Partner With Us</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <b.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Form */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Partnership Inquiry</h2>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">We've received your partnership inquiry. Our team will get back to you within 2 business days.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Company Name *</Label>
                        <Input required value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Contact Person *</Label>
                        <Input required value={formData.contact_person} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} className="mt-1" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Email *</Label>
                        <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label>Institution Type</Label>
                      <Select value={formData.company_type} onValueChange={(v) => setFormData({ ...formData, company_type: v })}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank</SelectItem>
                          <SelectItem value="nbfc">NBFC</SelectItem>
                          <SelectItem value="microfinance">Microfinance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className="mt-1" />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 rounded-xl font-semibold py-6">
                      {submitting ? 'Submitting...' : 'Submit Partnership Inquiry'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
