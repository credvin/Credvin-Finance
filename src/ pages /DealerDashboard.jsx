import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart3, FileText, CheckCircle, Clock, XCircle, ArrowRight, TrendingUp, IndianRupee, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function DealerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me();
      setUser(me);
      const apps = await base44.entities.DealerOnboarding.filter({ created_by: me.email });
      setApplications(apps);
      setLoading(false);
    };
    load();
  }, []);

  const approved = applications.filter((a) => a.status === 'approved');
  const latest = applications[0];
  const latestStatus = latest ? STATUS_CONFIG[latest.status] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dealer Dashboard</h1>
          {user && <p className="text-muted-foreground mt-1">Welcome back, <strong>{user.full_name || user.email}</strong></p>}
        </motion.div>

        {/* Status Banner */}
        {latest && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className={`rounded-2xl p-5 mb-8 flex items-center gap-4 ${
              latest.status === 'approved' ? 'bg-green-50 border border-green-200' :
              latest.status === 'rejected' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              {latestStatus && <latestStatus.icon className={`w-6 h-6 flex-shrink-0 ${latest.status === 'approved' ? 'text-green-600' : latest.status === 'rejected' ? 'text-red-600' : 'text-blue-600'}`} />}
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {latest.status === 'approved' ? '🎉 Your dealer account is active!' :
                   latest.status === 'rejected' ? 'Application Rejected' :
                   'Application Under Review'}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {latest.status === 'approved' ? `${latest.dealer_name} — You can now apply loans for customers.` :
                   latest.status === 'rejected' ? (latest.rejection_reason || 'Please contact support for details.') :
                   'Our team is reviewing your application. You will be notified shortly.'}
                </p>
              </div>
              <Badge className={latestStatus?.color}>{latestStatus?.label}</Badge>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          {[
            { icon: FileText, label: 'Total Applications', value: applications.length, color: 'text-primary', bg: 'bg-primary/10' },
            { icon: CheckCircle, label: 'Approved', value: approved.length, color: 'text-secondary', bg: 'bg-secondary/10' },
            { icon: Percent, label: 'Approval Rate', value: applications.length ? `${Math.round((approved.length / applications.length) * 100)}%` : '—', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{loading ? '...' : stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        {latest?.status === 'approved' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to={createPageUrl('ApplyLoan')}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">Apply Loan</p>
                      <p className="text-xs text-muted-foreground">Apply for customer</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">Track Loans</p>
                    <p className="text-xs text-muted-foreground">View loan statuses</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">Download MIS</p>
                    <p className="text-xs text-muted-foreground">Last 30 days report</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Applications History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">My Onboarding Applications</h2>
            <Link to={createPageUrl('PartnerOnboarding')}>
              <Button variant="outline" size="sm" className="rounded-xl gap-1">
                New Application <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : applications.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">No applications yet.</p>
                <Link to={createPageUrl('PartnerOnboarding')}>
                  <Button className="mt-4 bg-primary hover:bg-primary/90 rounded-xl">Start Onboarding</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const cfg = STATUS_CONFIG[app.status];
                return (
                  <Card key={app.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{app.dealer_name || 'Unnamed Application'}</p>
                        <p className="text-sm text-muted-foreground capitalize">{app.category?.replace(/_/g, ' ')} · {app.business_type?.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(app.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        {cfg && <Badge className={cfg.color}>{cfg.label}</Badge>}
                        {app.status === 'rejected' && app.rejection_reason && (
                          <span className="text-xs text-destructive max-w-[150px] truncate" title={app.rejection_reason}>{app.rejection_reason}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
