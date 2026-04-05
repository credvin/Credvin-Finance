import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import RoleGuard from '../components/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ManualDecisionPanel from '../components/admin/ManualDecisionPanel';
import {
  Building2, CheckCircle2, XCircle, Clock, Loader2, Search,
  RefreshCw, IndianRupee, TrendingUp, ShieldCheck, ShieldX,
  Eye, BarChart3, Users, Zap, FileText, User, ChevronDown, ChevronUp
} from 'lucide-react';

const decisionBadge = {
  APPROVE: 'bg-green-100 text-green-800 border-green-200',
  REJECT: 'bg-red-100 text-red-800 border-red-200',
  REFER: 'bg-amber-100 text-amber-800 border-amber-200',
  PENDING: 'bg-slate-100 text-slate-600 border-slate-200',
};

const riskLabel = (score) => {
  if (score == null) return { label: 'Not Scored', color: 'text-muted-foreground' };
  if (score >= 75) return { label: 'Low Risk', color: 'text-green-600' };
  if (score >= 55) return { label: 'Medium Risk', color: 'text-amber-600' };
  return { label: 'High Risk', color: 'text-red-500' };
};

function AppDetailDrawer({ app, onClose, onUpdated }) {
  if (!app) return null;
  const finalDecision = app.final_decision || app.uw_decision || 'PENDING';
  const risk = riskLabel(app.uw_risk_score);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-5 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">{app.full_name}</h2>
              <p className="text-white/70 text-sm">{app.email} · {app.phone}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-xl font-bold">×</button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${decisionBadge[finalDecision]}`}>
              Final: {finalDecision}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white`}>
              AI: {app.uw_decision || 'PENDING'}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Borrower Info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Borrower Profile</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Loan Type', value: app.loan_type?.replace(/_/g, ' ') },
                { label: 'Requested', value: `₹${app.loan_amount?.toLocaleString('en-IN')}` },
                { label: 'Tenure', value: `${app.tenure_months}m` },
                { label: 'Income', value: app.monthly_income ? `₹${app.monthly_income?.toLocaleString('en-IN')}/mo` : '—' },
                { label: 'Employment', value: app.employment_type?.replace(/_/g, ' ') },
                { label: 'Applied', value: new Date(app.created_date).toLocaleDateString('en-IN') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-semibold text-foreground text-sm capitalize mt-0.5">{value || '—'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Credit Engine Data */}
          {app.uw_decision && app.uw_decision !== 'PENDING' && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">🧠 Credit Engine Analysis</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                    <p className={`text-2xl font-bold ${risk.color}`}>{app.uw_risk_score ?? '—'}</p>
                    <p className={`text-xs font-medium ${risk.color}`}>{risk.label}</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-bold text-primary">{app.uw_confidence_score ?? '—'}</p>
                    <p className="text-xs font-medium text-muted-foreground">Score</p>
                  </div>
                </div>
                {app.uw_decision === 'APPROVE' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Approved Amount</p>
                      <p className="text-lg font-bold text-green-700">₹{app.uw_approved_amount?.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Monthly EMI</p>
                      <p className="text-lg font-bold text-green-700">₹{app.uw_eligible_emi?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                )}
                {app.uw_reasons?.length > 0 && (
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-xs font-semibold text-foreground mb-2">Decision Reasons</p>
                    {app.uw_reasons.map((r, i) => <p key={i} className="text-xs text-muted-foreground">• {r}</p>)}
                  </div>
                )}
                {app.uw_fraud_flag && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-bold text-red-700">
                    <ShieldX className="w-4 h-4" /> FRAUD FLAG DETECTED
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bureau & Bank Summary */}
          {(app.uw_bureau_summary || app.uw_bank_summary) && (
            <div className="grid grid-cols-1 gap-4">
              {app.uw_bureau_summary && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Bureau Summary</p>
                  {Object.entries(app.uw_bureau_summary).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs py-1 border-b border-border/30 last:border-0">
                      <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
              {app.uw_bank_summary && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Banking Summary</p>
                  {Object.entries(app.uw_bank_summary).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs py-1 border-b border-border/30 last:border-0">
                      <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Documents</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Selfie', url: app.selfie_url },
                { label: 'Aadhaar', url: app.aadhaar_url },
                { label: 'PAN', url: app.pan_url },
                { label: 'Bank Statement', url: app.bank_statement_url },
                { label: 'Payslip', url: app.payslip_url },
                { label: 'ITR', url: app.itr_url },
              ].filter(d => d.url).map(({ label, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/8 text-primary text-xs font-medium hover:bg-primary/15 border border-primary/20">
                  <Eye className="w-3 h-3" /> {label}
                </a>
              ))}
            </div>
          </div>

          {/* Manual Decision Panel */}
          <ManualDecisionPanel app={app} onUpdated={onUpdated} decisionSource="lender" />
        </div>
      </div>
    </div>
  );
}

function LenderPortalContent() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDecision, setFilterDecision] = useState('APPROVE');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const data = await base44.entities.LoanApplication.list('-created_date', 100);
    setApplications(data);
    setLoading(false);
  };

  const filtered = applications.filter(a => {
    const finalD = a.final_decision || a.uw_decision || 'PENDING';
    const matchDecision = filterDecision === 'all' || finalD === filterDecision;
    const matchSearch = a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.loan_type?.includes(search.toLowerCase());
    return matchDecision && matchSearch;
  });

  const approvedApps = applications.filter(a => (a.final_decision || a.uw_decision) === 'APPROVE');
  const totalLoanBook = approvedApps.reduce((s, a) => s + (a.uw_approved_amount || a.loan_amount || 0), 0);
  const avgRiskScore = approvedApps.length > 0
    ? Math.round(approvedApps.reduce((s, a) => s + (a.uw_risk_score || 0), 0) / approvedApps.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary/3">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Lender Portal</h1>
                <p className="text-white/70 text-sm">Credvin Partner Lender Dashboard · Decision Intelligence</p>
              </div>
            </div>
            <Button onClick={fetchApplications} variant="ghost" className="text-white hover:bg-white/10 rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Total Applications', value: applications.length, sub: 'All time' },
              { label: 'Approved for Lending', value: approvedApps.length, sub: 'Final approved' },
              { label: 'Total Loan Book', value: `₹${(totalLoanBook / 100000).toFixed(1)}L`, sub: 'Approved value' },
              { label: 'Avg Risk Score', value: avgRiskScore, sub: 'Higher = safer' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-white/80 text-sm font-medium mt-0.5">{label}</p>
                <p className="text-white/50 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Pipeline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applicants..." className="pl-9 rounded-xl bg-white" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'APPROVE', 'REFER', 'PENDING', 'REJECT'].map(f => (
                  <button key={f} onClick={() => setFilterDecision(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      filterDecision === f ? 'bg-primary text-white border-primary' : 'bg-white border-border text-foreground hover:border-primary/40'
                    }`}>{f === 'all' ? 'All' : f}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-3">
                {filtered.map(app => {
                  const finalD = app.final_decision || app.uw_decision || 'PENDING';
                  const risk = riskLabel(app.uw_risk_score);
                  return (
                    <div key={app.id} onClick={() => setSelectedApp(app)}
                      className="bg-white rounded-2xl border border-border/50 p-4 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-foreground">{app.full_name}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${decisionBadge[finalD]}`}>{finalD}</span>
                            {app.manual_decision && <span className="text-xs text-primary font-medium">Human Override</span>}
                            {app.uw_fraud_flag && <span className="text-xs font-bold text-red-600">FRAUD FLAG</span>}
                          </div>
                          <p className="text-sm text-muted-foreground capitalize mt-0.5">
                            {app.loan_type?.replace(/_/g, ' ')} · ₹{app.loan_amount?.toLocaleString('en-IN')} · {app.tenure_months}m
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {app.uw_risk_score != null && <p className={`text-lg font-bold ${risk.color}`}>{app.uw_risk_score}</p>}
                          <p className={`text-xs font-medium ${risk.color}`}>{risk.label}</p>
                        </div>
                        {finalD === 'APPROVE' && (
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-muted-foreground">Approved</p>
                            <p className="font-bold text-green-700 text-sm">₹{(app.uw_approved_amount || app.loan_amount)?.toLocaleString('en-IN')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No applications found.</p>}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border/50 p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Portfolio Risk Distribution</h3>
              {[
                { label: 'Low Risk (75+)', count: applications.filter(a => (a.uw_risk_score || 0) >= 75).length, color: 'bg-green-500' },
                { label: 'Medium (55–74)', count: applications.filter(a => (a.uw_risk_score || 0) >= 55 && (a.uw_risk_score || 0) < 75).length, color: 'bg-amber-400' },
                { label: 'High Risk (<55)', count: applications.filter(a => a.uw_risk_score != null && (a.uw_risk_score || 0) < 55).length, color: 'bg-red-400' },
                { label: 'Not Scored', count: applications.filter(a => a.uw_risk_score == null).length, color: 'bg-slate-300' },
              ].map(({ label, count, color }) => (
                <div key={label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${applications.length ? (count / applications.length) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-border/50 p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Loan Type Mix</h3>
              {['personal', 'jewellery', 'solar', 'healthcare', 'home_decor', 'retail', 'education'].map(type => {
                const count = applications.filter(a => a.loan_type === type).length;
                if (!count) return null;
                return (
                  <div key={type} className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-0 text-xs">
                    <span className="text-muted-foreground capitalize">{type.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5">
              <h3 className="font-semibold text-foreground text-sm mb-2">Partner Support</h3>
              <p className="text-xs text-muted-foreground mb-3">Dedicated lender support for funding queries.</p>
              <p className="text-xs font-medium text-primary">partners@credvin.in</p>
              <p className="text-xs font-medium text-primary mt-1">+91 92180 52816</p>
            </div>
          </div>
        </div>
      </div>

      {/* App Detail Drawer */}
      {selectedApp && (
        <AppDetailDrawer
          app={applications.find(a => a.id === selectedApp.id) || selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdated={() => { fetchApplications(); setSelectedApp(null); }}
        />
      )}
    </div>
  );
}

export default function LenderPortal() {
  return <RoleGuard allowedRoles={['lender', 'admin']}><LenderPortalContent /></RoleGuard>;
}
