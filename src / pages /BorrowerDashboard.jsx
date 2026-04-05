import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import RoleGuard from '../components/RoleGuard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2, XCircle, Clock, Loader2, FileText, Banknote,
  ArrowRight, ShieldCheck, TrendingUp, RefreshCw, IndianRupee,
  Calendar, Phone, Mail, PenLine, CreditCard, Sparkles, User
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_STEPS = [
  { key: 'submitted', label: 'Submitted', icon: FileText },
  { key: 'under_review', label: 'Under Review', icon: TrendingUp },
  { key: 'approved', label: 'Decision Made', icon: ShieldCheck },
  { key: 'esign_pending', label: 'eSign', icon: PenLine },
  { key: 'emandate_pending', label: 'eMandate', icon: CreditCard },
  { key: 'ready_for_disbursal', label: 'Ready', icon: Sparkles },
  { key: 'disbursed', label: 'Disbursed', icon: Banknote },
];

const STATUS_INDEX = {
  submitted: 0, under_review: 1, approved: 2, rejected: 2,
  esign_pending: 3, emandate_pending: 4, ready_for_disbursal: 5, disbursed: 6
};

const DECISION_CONFIG = {
  APPROVE: {
    bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800',
    icon: CheckCircle2, iconColor: 'text-green-600',
    title: 'Loan Approved!',
    subtitle: 'Your application has been approved. Please complete eSign and eMandate to proceed.',
    badge: 'bg-green-100 text-green-800'
  },
  REJECT: {
    bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800',
    icon: XCircle, iconColor: 'text-red-500',
    title: 'Application Not Approved',
    subtitle: 'Your application does not meet current criteria. You may reapply after 3 months.',
    badge: 'bg-red-100 text-red-800'
  },
  REFER: {
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800',
    icon: Clock, iconColor: 'text-amber-500',
    title: 'Manual Review In Progress',
    subtitle: 'Our team is reviewing your application. Expected update within 24 hours.',
    badge: 'bg-amber-100 text-amber-800'
  },
  PENDING: {
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800',
    icon: Clock, iconColor: 'text-blue-500',
    title: 'Application Submitted',
    subtitle: 'Your application is queued for our AI underwriting engine.',
    badge: 'bg-blue-100 text-blue-800'
  },
};

function calculateFirstEMIDate(completedAt) {
  if (!completedAt) return null;
  const d = new Date(completedAt);
  const day = d.getDate();
  const month = d.getMonth(); // 0-indexed
  const year = d.getFullYear();
  if (day <= 25) {
    // 5th of next month
    const next = new Date(year, month + 1, 5);
    return next;
  } else {
    // 5th of next-to-next month
    const next = new Date(year, month + 2, 5);
    return next;
  }
}

function ProgressTracker({ status }) {
  const current = STATUS_INDEX[status] ?? 0;
  const isRejected = status === 'rejected';
  return (
    <div className="overflow-x-auto">
      <div className="flex items-start min-w-[600px] w-full">
        {STATUS_STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const Icon = step.icon;
          const isRejectedStep = isRejected && i === 2;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isRejectedStep ? 'bg-red-100 border-red-400' :
                  done ? 'bg-primary border-primary' :
                  active ? 'bg-primary/10 border-primary' :
                  'bg-muted border-border'
                }`}>
                  {done && !isRejectedStep ? <CheckCircle2 className="w-5 h-5 text-white" /> :
                   isRejectedStep ? <XCircle className="w-4 h-4 text-red-500" /> :
                   <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />}
                </div>
                <span className={`text-xs mt-1.5 font-medium text-center max-w-[68px] leading-tight ${
                  active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
                }`}>{step.label}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mt-5 ${done ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function BorrowerDashboardContent() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    if (user?.email) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    const data = await base44.entities.LoanApplication.filter({ email: user.email }, '-created_date', 20);
    setApplications(data);
    if (data.length > 0 && !selected) setSelected(data[0]);
    setLoading(false);
  };

  const app = selected ? applications.find(a => a.id === selected.id) || selected : null;
  const finalDecision = app?.final_decision || app?.uw_decision || 'PENDING';
  const dc = DECISION_CONFIG[finalDecision] || DECISION_CONFIG.PENDING;

  const handleESign = async () => {
    setActionLoading('esign');
    const now = new Date().toISOString();
    const esignDone = true;
    const emandateDone = app?.emandate_completed;
    let newStatus = 'esign_pending';
    if (esignDone && emandateDone) {
      const emiDate = calculateFirstEMIDate(now);
      newStatus = 'ready_for_disbursal';
      await base44.entities.LoanApplication.update(app.id, {
        esign_completed: true, esign_completed_at: now,
        status: newStatus, first_emi_date: emiDate?.toISOString(),
      });
    } else {
      newStatus = app?.emandate_completed ? 'ready_for_disbursal' : 'emandate_pending';
      await base44.entities.LoanApplication.update(app.id, {
        esign_completed: true, esign_completed_at: now, status: newStatus
      });
    }
    toast.success('eSign completed successfully!');
    setActionLoading('');
    fetchApplications();
  };

  const handleEMandate = async () => {
    setActionLoading('emandate');
    const now = new Date().toISOString();
    const esignDone = app?.esign_completed;
    if (esignDone) {
      const completedAt = app?.esign_completed_at || now;
      const emiDate = calculateFirstEMIDate(completedAt);
      await base44.entities.LoanApplication.update(app.id, {
        emandate_completed: true, emandate_completed_at: now,
        status: 'ready_for_disbursal', first_emi_date: emiDate?.toISOString(),
      });
    } else {
      await base44.entities.LoanApplication.update(app.id, {
        emandate_completed: true, emandate_completed_at: now, status: 'esign_pending'
      });
    }
    toast.success('eMandate setup completed!');
    setActionLoading('');
    fetchApplications();
  };

  const formatEMIDate = (isoStr) => {
    if (!isoStr) return null;
    return new Date(isoStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/3 via-background to-secondary/3">
      {/* Header */}
      <div className="bg-white border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">My Loan Dashboard</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={fetchApplications}><RefreshCw className="w-4 h-4" /></Button>
            <Link to="/ApplyLoan">
              <Button size="sm" className="bg-primary rounded-xl font-semibold">New Application <ArrowRight className="w-3 h-3 ml-1" /></Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <Banknote className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No Applications Yet</h2>
            <p className="text-muted-foreground mb-6">Start your loan journey today.</p>
            <Link to="/ApplyLoan"><Button className="bg-primary rounded-xl">Apply for a Loan</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Application List */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Your Applications</h2>
              {applications.map(a => {
                const fd = a.final_decision || a.uw_decision || 'PENDING';
                const d = DECISION_CONFIG[fd] || DECISION_CONFIG.PENDING;
                return (
                  <div key={a.id} onClick={() => setSelected(a)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selected?.id === a.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-white hover:border-primary/30'
                    }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.badge}`}>{fd}</span>
                      <span className="text-xs text-muted-foreground">{new Date(a.created_date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm capitalize">{a.loan_type?.replace(/_/g, ' ')} Loan</p>
                    <p className="text-primary font-bold text-sm">₹{a.loan_amount?.toLocaleString('en-IN')}</p>
                    {a.status && <p className="text-xs text-muted-foreground capitalize mt-0.5">{a.status?.replace(/_/g, ' ')}</p>}
                  </div>
                );
              })}
            </div>

            {/* Detail Panel */}
            {app && (
              <div className="lg:col-span-2 space-y-4">
                {/* Decision Status */}
                <div className={`rounded-2xl border p-5 ${dc.bg} ${dc.border}`}>
                  <div className="flex items-start gap-3">
                    <dc.icon className={`w-7 h-7 mt-0.5 flex-shrink-0 ${dc.iconColor}`} />
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${dc.text}`}>{dc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{dc.subtitle}</p>
                      {app.manual_decision && (
                        <p className="text-xs text-muted-foreground mt-1 bg-white/60 rounded-lg px-2 py-1 inline-block">
                          Reviewed by: <span className="font-semibold capitalize">{app.manual_decision_role}</span> · {app.manual_remarks}
                        </p>
                      )}
                      {finalDecision === 'APPROVE' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                          <div className="bg-white/80 rounded-xl p-3 text-center">
                            <p className="text-xs text-muted-foreground">Approved Amount</p>
                            <p className="text-lg font-bold text-green-700">₹{(app.uw_approved_amount || app.loan_amount)?.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="bg-white/80 rounded-xl p-3 text-center">
                            <p className="text-xs text-muted-foreground">Monthly EMI</p>
                            <p className="text-lg font-bold text-green-700">₹{app.uw_eligible_emi?.toLocaleString('en-IN') || '—'}</p>
                          </div>
                          {app.first_emi_date && (
                            <div className="bg-white/80 rounded-xl p-3 text-center">
                              <p className="text-xs text-muted-foreground">1st EMI Date</p>
                              <p className="text-sm font-bold text-green-700">{formatEMIDate(app.first_emi_date)}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="bg-white rounded-2xl border border-border/50 p-5">
                  <h3 className="font-semibold text-foreground text-sm mb-4">Loan Progress</h3>
                  <ProgressTracker status={app.status || 'submitted'} />
                </div>

                {/* eSign + eMandate (only when approved) */}
                {finalDecision === 'APPROVE' && app.status !== 'disbursed' && (
                  <div className="bg-white rounded-2xl border border-border/50 p-5">
                    <h3 className="font-semibold text-foreground text-sm mb-4">Post-Approval Actions</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className={`rounded-xl border p-4 ${app.esign_completed ? 'bg-green-50 border-green-200' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {app.esign_completed ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <PenLine className="w-5 h-5 text-primary" />}
                          <p className="font-semibold text-sm">eSign Agreement</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">Sign the loan agreement digitally</p>
                        {app.esign_completed ? (
                          <p className="text-xs text-green-700 font-medium">✓ Completed on {new Date(app.esign_completed_at).toLocaleDateString('en-IN')}</p>
                        ) : (
                          <Button size="sm" onClick={handleESign} disabled={actionLoading === 'esign'} className="rounded-xl w-full bg-primary font-medium text-xs">
                            {actionLoading === 'esign' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Sign Agreement'}
                          </Button>
                        )}
                      </div>
                      <div className={`rounded-xl border p-4 ${app.emandate_completed ? 'bg-green-50 border-green-200' : 'bg-muted/30 border-border'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {app.emandate_completed ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <CreditCard className="w-5 h-5 text-primary" />}
                          <p className="font-semibold text-sm">Setup eMandate</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">Authorize auto-debit for EMI payments</p>
                        {app.emandate_completed ? (
                          <p className="text-xs text-green-700 font-medium">✓ Completed on {new Date(app.emandate_completed_at).toLocaleDateString('en-IN')}</p>
                        ) : (
                          <Button size="sm" onClick={handleEMandate} disabled={actionLoading === 'emandate'} className="rounded-xl w-full bg-secondary font-medium text-xs text-white">
                            {actionLoading === 'emandate' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Setup eMandate'}
                          </Button>
                        )}
                      </div>
                    </div>
                    {app.esign_completed && app.emandate_completed && !app.first_emi_date && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-center text-sm text-green-800 font-medium">
                        🎉 All steps complete! Ready for disbursement.
                      </div>
                    )}
                  </div>
                )}

                {/* Disbursed banner */}
                {app.status === 'disbursed' && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                    <Banknote className="w-10 h-10 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-800 text-lg">Loan Disbursed!</p>
                    <p className="text-sm text-muted-foreground mt-1">Your loan has been disbursed. Your first EMI is on {formatEMIDate(app.first_emi_date) || 'the 5th of next month'}.</p>
                  </div>
                )}

                {/* Loan Details */}
                <div className="bg-white rounded-2xl border border-border/50 p-5">
                  <h3 className="font-semibold text-foreground text-sm mb-4">Loan Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Loan Type', value: app.loan_type?.replace(/_/g, ' '), icon: FileText },
                      { label: 'Loan Amount', value: `₹${app.loan_amount?.toLocaleString('en-IN')}`, icon: IndianRupee },
                      { label: 'Tenure', value: `${app.tenure_months} months`, icon: Calendar },
                      { label: 'Employment', value: app.employment_type?.replace(/_/g, ' '), icon: ShieldCheck },
                      { label: 'Applied On', value: new Date(app.created_date).toLocaleDateString('en-IN'), icon: Calendar },
                      { label: 'Ref No', value: app.id?.slice(-8).toUpperCase(), icon: FileText },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-muted/30 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-semibold text-foreground text-sm capitalize mt-0.5">{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credit Assessment */}
                {app.uw_risk_score != null && (
                  <div className="bg-white rounded-2xl border border-border/50 p-5">
                    <h3 className="font-semibold text-foreground text-sm mb-4">Credit Assessment</h3>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${app.uw_risk_score >= 70 ? 'bg-green-500' : app.uw_risk_score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${app.uw_risk_score}%` }} />
                        </div>
                        <p className="text-sm font-bold mt-1">{app.uw_risk_score}/100</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${app.uw_confidence_score}%` }} />
                        </div>
                        <p className="text-sm font-bold mt-1">{app.uw_confidence_score}/100</p>
                      </div>
                    </div>
                    {app.uw_reasons?.slice(0, 3).map((r, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span> {r}
                      </p>
                    ))}
                  </div>
                )}

                {/* Support */}
                <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">Need Help?</p>
                    <p className="text-xs text-muted-foreground">Mon–Sat, 9AM–6PM</p>
                  </div>
                  <div className="flex gap-2">
                    <a href="tel:+919218052816" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium">
                      <Phone className="w-3 h-3" /> Call Us
                    </a>
                    <Link to="/Contact">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-medium text-foreground">
                        <Mail className="w-3 h-3" /> Email
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BorrowerDashboard() {
  return <RoleGuard allowedRoles={['borrower', 'user', 'admin']}><BorrowerDashboardContent /></RoleGuard>;
}
