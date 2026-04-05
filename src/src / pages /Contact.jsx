import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const contactInfo = [
  { icon: Mail, title: 'Email Us', value: 'credvin001@gmail.com', sub: 'We reply within 24 hours' },
  { icon: Phone, title: 'Call Us', value: '+91 9218052816', sub: 'Mon-Sat, 9AM-6PM IST' },
  { icon: MapPin, title: 'Visit Us', value: 'Credvin Finance Private Limited', sub: 'Pune, Maharashtra, India' },
  { icon: Clock, title: 'Business Hours', value: 'Monday - Saturday', sub: '9:00 AM - 6:00 PM IST' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ContactInquiry.create(formData);
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Message sent successfully!');
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">Get In Touch</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Contact Us</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our loan products? We're here to help you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <c.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                    <p className="text-foreground font-medium text-sm">{c.value}</p>
                    <p className="text-muted-foreground text-xs mt-1">{c.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Enquiry Form</h2>
                  
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                      <Button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }} variant="outline" className="mt-4">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" placeholder="Your name" />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" placeholder="your@email.com" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Phone</Label>
                          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1" placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div>
                          <Label>Loan Amount (₹)</Label>
                          <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="mt-1" placeholder="e.g. 500000" />
                        </div>
                      </div>
                      <div>
                        <Label>Write Details</Label>
                        <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} className="mt-1" placeholder="Write your details here..." />
                      </div>
                      <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 rounded-xl font-semibold py-6">
                        {submitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <Card className="border-0 shadow-lg flex-1 overflow-hidden">
                <div className="h-full min-h-[400px] bg-muted relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Credvin Office Location"
                  />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
