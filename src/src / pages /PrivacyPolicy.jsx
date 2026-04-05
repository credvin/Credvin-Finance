import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="mt-3 text-muted-foreground">Credvin Finance Private Limited</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="prose prose-slate max-w-none">
            
            <div className="bg-card rounded-2xl border border-border p-8 space-y-8">
              <p className="text-muted-foreground leading-relaxed">
                Credvin Finance Private Limited ("Credvin", "we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share information when you use our website or services.
              </p>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">We may collect personal information such as your name, mobile number, email address, address, PAN, income details, and other information required to process loan applications.</p>
                <p className="text-muted-foreground leading-relaxed mt-3">We may also collect technical information such as IP address, device type, and browsing data when you use our platform.</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-3">Your information may be used to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  {['Process and facilitate loan applications', 'Connect you with partnered lenders', 'Verify your identity and conduct KYC checks', 'Communicate updates about your application', 'Improve our platform and services', 'Comply with legal and regulatory requirements'].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">By using our platform, you agree that Credvin may share your information with partnered banks, NBFCs, and authorized service providers for the purpose of evaluating and processing your loan application.</p>
                <p className="text-muted-foreground leading-relaxed mt-3">Credvin does not sell your personal information to third parties.</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Platform Role</h2>
                <p className="text-muted-foreground leading-relaxed">Credvin is a technology platform that connects borrowers with partnered financial institutions. Credvin does not provide loans, make credit decisions, or disburse funds. Loan approval and terms are determined by the respective lending partners.</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">We take reasonable security measures to protect your information from unauthorized access or misuse.</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Policy Updates</h2>
                <p className="text-muted-foreground leading-relaxed">Credvin may update this Privacy Policy from time to time. Updated versions will be posted on our website.</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">If you have any questions regarding this policy, you may contact:</p>
                <div className="mt-3 p-4 bg-muted/50 rounded-xl">
                  <p className="font-semibold text-foreground">Credvin Finance Private Limited</p>
                  <p className="text-muted-foreground text-sm mt-1">Email: credvin001@gmail.com</p>
                  <p className="text-muted-foreground text-sm">Phone: 9218052816</p>
                  <p className="text-muted-foreground text-sm">Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
