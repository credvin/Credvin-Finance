import React from 'react';
import { motion } from 'framer-motion';

const sections = [
  {
    title: '1. Platform Services',
    content: 'Credvin operates a technology platform that connects individuals seeking financial products with partnered banks and NBFCs. Credvin facilitates loan discovery, application, and processing through its digital platform.\n\nCredvin does not provide loans, make credit decisions, or disburse funds. All loan approvals, interest rates, terms, and disbursements are determined solely by the respective lending partners.',
  },
  {
    title: '2. User Eligibility',
    content: 'By using this platform, you confirm that:',
    bullets: ['You are at least 18 years of age', 'You are legally capable of entering into a contract', 'The information you provide is true and accurate'],
  },
  {
    title: '3. User Responsibilities',
    content: 'Users agree to provide accurate and complete information when submitting loan applications. Providing false or misleading information may result in rejection of the application or suspension of access to the platform.',
  },
  {
    title: '4. Consent to Data Sharing',
    content: 'By submitting your details through the Credvin platform, you authorize Credvin to share your information with partnered lenders and service providers for the purpose of evaluating and processing your loan application.',
  },
  {
    title: '5. No Guarantee of Loan Approval',
    content: 'Submission of an application through Credvin does not guarantee loan approval. Final decisions regarding approval, interest rates, loan amounts, and disbursement are made solely by the respective lending institution.',
  },
  {
    title: '6. Limitation of Liability',
    content: 'Credvin shall not be responsible for:',
    bullets: ['Loan rejection by lending partners', 'Changes in loan terms by lenders', 'Delays in loan approval or disbursement', 'Any disputes between the borrower and the lending institution'],
    footer: 'Any loan agreement entered into is solely between the borrower and the lender.',
  },
  {
    title: '7. Intellectual Property',
    content: 'All content on the Credvin platform including text, graphics, logos, and software is the property of Credvin and may not be copied, reproduced, or distributed without permission.',
  },
  {
    title: '8. Modification of Services',
    content: 'Credvin reserves the right to modify, suspend, or discontinue any part of the platform or services at any time without prior notice.',
  },
  {
    title: '9. Governing Law',
    content: 'These Terms and Conditions shall be governed by the laws of India. Any disputes arising from the use of this platform shall fall under the jurisdiction of the courts in Pune, Maharashtra.',
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-foreground">Terms & Conditions</h1>
            <p className="mt-3 text-muted-foreground">Credvin Finance Private Limited</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-card rounded-2xl border border-border p-8 space-y-8">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Credvin Finance Private Limited ("Credvin", "we", "our", or "us"). By accessing or using our website, platform, or services, you agree to comply with and be bound by the following Terms and Conditions.
              </p>

              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="text-xl font-bold text-foreground mb-3">{s.title}</h2>
                  {s.content && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{s.content}</p>}
                  {s.bullets && (
                    <ul className="mt-3 space-y-2 text-muted-foreground">
                      {s.bullets.map(b => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.footer && <p className="text-muted-foreground leading-relaxed mt-3">{s.footer}</p>}
                </div>
              ))}

              <div>
                <h2 className="text-xl font-bold text-foreground mb-3">10. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">For any questions regarding these Terms and Conditions, please contact:</p>
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
