import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function LoanProductCard({ loan, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className={`h-2 bg-gradient-to-r ${loan.gradient}`} />
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl ${loan.iconBg} flex items-center justify-center`}>
                <loan.icon className={`w-7 h-7 ${loan.iconColor}`} />
              </div>
              <Badge variant="secondary" className="text-xs">{loan.badge}</Badge>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-2">{loan.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{loan.description}</p>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-2">Benefits</h4>
                <div className="space-y-1.5">
                  {loan.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-sm mb-2">Eligibility</h4>
                <div className="space-y-1.5">
                  {loan.eligibility.map((e) => (
                    <div key={e} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {e}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground text-sm mb-2">Required Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {loan.documents.map((d) => (
                    <Badge key={d} variant="outline" className="text-xs font-normal">{d}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <Link to={createPageUrl('ApplyLoan') + `?type=${loan.type}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold">
                Apply for {loan.title}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
