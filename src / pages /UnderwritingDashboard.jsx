import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ApplicationDetailModal from '../components/admin/ApplicationDetailModal';
import ManualDecisionPanel from '../components/admin/ManualDecisionPanel';
import { runUnderwritingEngine } from '../components/admin/UnderwritingEngine';
import {
  Brain, Search, RefreshCw, CheckCircle2, XCircle, Clock,
  Loader2, ShieldCheck, ShieldX, ChevronRight, AlertTriangle, Zap
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_FILTER = ['all', 'PENDING', 'APPROVE', 'REJECT', 'REFER'];

const decisionStyle = {
  APPROVE: 'bg-green-100 text-green-800 border-green-200',
  REJECT: 'bg-red-100 text-red-800 border-red-200',
  REFER: 'bg-amber-100 text-amber-800 border-amber-200',
  PENDING: 'bg-slate-100 text-slate-600 border-slate-200',
};

const DecisionIcon = ({ decision }) => {
  if (decision === 'APPROVE') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  if (decision === 'REJECT') return <XCircle className="w-4 h-4 text-red-500" />;
  if (decision === 'REFER') return <Clock className="w-4 h-4 text-amber-500" />;
  return <Clock className="w-4 h-4 text-slate-400" />;
};

export default function UnderwritingDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [runningIds, setRunningIds] = useState(new Set());

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) fetchApplications();
  }, [isAdmin]);

  const fetchApplications = async () => {
    setLoading(true);
    const data = await base44.entities.LoanApplication.list('-created_date', 100);
    setApplications(data);
    setLoading(false);
  };

  const runSingle = async (app, e) => {
    e.stopPropagation();
    setRunningIds(prev => new Set([...prev, app.id]));
    const result = await runUnderwritingEngine(app);
    const statusMap = { APPROVE: 'approved', REJECT: 'rejected', REFER: 'under_review' };
    await base44.entities.LoanApplication.update(app.id, {
      uw_decision: result.decision,
      uw_confidence_score: result.confidence_score,
      uw_risk_score: result.risk_score,
      uw_approved_amount: result.approved_amount,
      uw_eligible_emi: result.eligible_emi,
      uw_fraud_flag: result.fraud_flag,
      uw_kyc_status: result.kyc_status,
      uw_reasons: result.reasons,
      uw_risk_flags: result.risk_flags,
      uw_bureau_summary: result.bureau_summary,
      uw_bank_summary: result.bank_summary,
      uw_processed_at: new Date().toISOString(),
      status: statusMap[result.decision] || 'under_review',
    });
    toast.success(`${app.full_name}: ${result.decision}`);
    setRunningIds(prev => { const s = new Set(prev); s.delete(app.id); return s; });
    fetchApplications();
  };

  const runBulkPending = async () => {
    const pending = applications.filter(a => !a.uw_decision || a.uw_decision === 'PENDING');
    if (!pending.length) { toast.info('No pending applications'); return; }
    setBulkRunning(true);
    toast.info(`Running engine on ${pending.length} applications...`);
    for (const app of pending) {
      setRunningIds(prev => new Set([...prev, app.id]));
      const result = await runUnderwritingEngine(app);
      const statusMap = { APPROVE: 'approved', REJECT: 'rejected', REFER: 'under_review' };
      await base44.entities.LoanApplication.update(app.id, {
        uw_decision: result.decision, uw_confidence_score: result.confidence_score,
        uw_risk_score: result.risk_score, uw_approved_amount: result.approved_amount,
        uw_eligible_emi: result.eligible_emi, uw_fraud_flag: result.fraud_flag,
        uw_kyc_status: result.kyc_status, uw_reasons: result.reasons,
        uw_risk_flags: result.risk_flags, uw_bureau_summary: result.bureau_summary,
        uw_bank_summary: result.bank_summary, uw_processed_at: new Date().toISOString(),
        status: statusMap[result.decision] || 'under_review',
      });
      setRunningIds(prev => { const s = new Set(prev); s.delete(app.id); return s; });
    }
    toast.success('Bulk evaluation complete!');
    setBulkRunning(false);
    fetchApplications();
  };

  const filtered = applications.filter(a => {
    const matchSearch = a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search);
    const matchFilter = filter === 'all' || (a.uw_decision || 'PENDING') === filter;
    return matchSearch && matchFilter;
  });

  // Stats
  const stats = {
    total: applications.length,
    approve: applications.filter(a => a.uw_decision === 'APPROVE').length,
    reject: applications.filter(a => a.uw_decision === 'REJECT').length,
    refer: applications.filter(a => a.uw_decision === 'REFER').length,
    pending: applications.filter(a => !a.uw_decision || a.uw_decision === 'PENDING').length,
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldX className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground mt-2">This page is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Credvin Underwriting AI</h1>
                <p className="text-white/70 text-sm">Credit Decision Engine v1.0 · Admin Only</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={runBulkPending} disabled={bulkRunning} className="bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl font-semibold">
                {bulkRunning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running...</> : <><Zap className="w-4 h-4 mr-2" />Run Pending ({stats.pending})</>}
              </Button>
              <Button onClick={fetchApplications} variant="ghost" className="text-white hover:bg-white/10 rounded-xl">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            {[
              { label: 'Total', value: stats.total, color: 'bg-white/15' },
              { label: 'Approved', value: stats.approve, color: 'bg-green-500/30' },
              { label: 'Rejected', value: stats.reject, color: 'bg-red-500/30' },
              { label: 'Referred', value: stats.refer, color: 'bg-amber-500/30' },
              { label: 'Pending', value: stats.pending, color: 'bg-slate-400/30' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-white/70 text-xs font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..." className="pl-9 rounded-xl" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTER.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${
                  filter === f ? 'bg-primary text-white border-primary' : 'bg-background border-border hover:border-primary/40 text-foreground'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No applications found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => {
              const isRunning = runningIds.has(app.id);
              const decision = app.uw_decision || 'PENDING';
              return (
                <div key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="bg-white rounded-2xl border border-border/50 p-4 flex items-center gap-4 hover:shadow-md hover:border-primary/30 cursor-pointer transition-all group"
                >
                  {/* Decision Badge */}
                  <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${decisionStyle[decision]}`}>
                    <DecisionIcon decision={decision} />
                    {decision}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">{app.full_name}</p>
                      {app.uw_fraud_flag && <span className="flex items-center gap-1 text-xs text-red-600 font-medium"><ShieldX className="w-3 h-3" />Fraud</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{app.email} · {app.loan_type?.replace(/_/g, ' ')} · ₹{app.loan_amount?.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Score */}
                  {app.uw_risk_score != null && (
                    <div className="hidden sm:block text-center">
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                      <p className={`text-lg font-bold ${app.uw_risk_score >= 70 ? 'text-green-600' : app.uw_risk_score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {app.uw_risk_score}
                      </p>
                    </div>
                  )}

                  {/* Date */}
                  <div className="hidden md:block text-right text-xs text-muted-foreground">
                    {new Date(app.created_date).toLocaleDateString('en-IN')}
                  </div>

                  {/* Run Button */}
                  <Button size="sm" onClick={(e) => runSingle(app, e)} disabled={isRunning}
                    className="flex-shrink-0 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white border-0 font-medium text-xs">
                    {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Brain className="w-3 h-3 mr-1" />{decision === 'PENDING' ? 'Run' : 'Re-run'}</>}
                  </Button>

                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          app={applications.find(a => a.id === selectedApp.id) || selectedApp}
          open={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdated={fetchApplications}
        />
      )}
    </div>
  );
}
