import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ApplicationDetailModal from '../components/admin/ApplicationDetailModal';
import ManualDecisionPanel from '../components/admin/ManualDecisionPanel';
import { runUnderwritingEngine } from '../components/admin/UnderwritingEngine';
import {
  Brain, Search, RefreshCw, CheckCircle2, XCircle, Clock, Loader2,
  ShieldX, ShieldCheck, ChevronRight, Zap, TrendingUp, Users,
  IndianRupee, AlertTriangle, BarChart3, Filter, Bell
} from 'lucide-react';
import { toast } from 'sonner';

const decisionStyle = {
  APPROVE: 'bg-green-100 text-green-800 border-green-200',
  REJECT: 'bg-red-100 text-red-800 border-red-200',
  REFER: 'bg-amber-100 text-amber-800 border-amber-200',
  PENDING: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function AdminLOS() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [runningIds, setRunningIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('pipeline');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) fetchApplications();
  }, [isAdmin]);

  // Real-time subscription
  useEffect(() => {
    if (!isAdmin) return;
    const unsub = base44.entities.LoanApplication.subscribe((event) => {
      if (event.type === 'create') {
        setApplications(prev => [event.data, ...prev]);
        toast.info(`New application: ${event.data.full_name}`);
      } else if (event.type === 'update') {
        setApplications(prev => prev.map(a => a.id === event.id ? event.data : a));
      } else if (event.type === 'delete') {
        setApplications(prev => prev.filter(a => a.id !== event.id));
      }
    });
    return unsub;
  }, [isAdmin]);

  const fetchApplications = async () => {
    setLoading(true);
    const data = await base44.entities.LoanApplication.list('-created_date', 200);
    setApplications(data);
    setLoading(false);
  };

  const runSingle = async (app, e) => {
    e?.stopPropagation();
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
      final_decision: app.manual_decision || result.decision,
    });
    toast.success(`${app.full_name}: ${result.decision}`);
    setRunningIds(prev => { const s = new Set(prev); s.delete(app.id); return s; });
  };

  const runBulkPending = async () => {
    const pending = applications.filter(a => !a.uw_decision || a.uw_decision === 'PENDING');
    if (!pending.length) { toast.info('No pending applications'); return; }
    setBulkRunning(true);
    toast.info(`Running AI engine on ${pending.length} applications...`);
    for (const app of pending) {
      await runSingle(app);
    }
    toast.success('Bulk evaluation complete!');
    setBulkRunning(false);
  };

  const stats = {
    total: applications.length,
    approve: applications.filter(a => a.uw_decision === 'APPROVE').length,
    reject: applications.filter(a => a.uw_decision === 'REJECT').length,
    refer: applications.filter(a => a.uw_decision === 'REFER').length,
    pending: applications.filter(a => !a.uw_decision || a.uw_decision === 'PENDING').length,
    fraud: applications.filter(a => a.uw_fraud_flag).length,
    totalApprovedValue: applications.filter(a => a.uw_decision === 'APPROVE').reduce((s, a) => s + (a.uw_approved_amount || 0), 0),
  };

  const filtered = applications.filter(a => {
    const matchSearch = a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) || a.phone?.includes(search);
    const matchFilter = filter === 'all' || (a.uw_decision || 'PENDING') === filter || (filter === 'fraud' && a.uw_fraud_flag);
    return matchSearch && matchFilter;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldX className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground mt-2">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-primary text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Credvin LOS</h1>
                  <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> LIVE
                  </span>
                </div>
                <p className="text-white/60 text-sm">Loan Origination System · AI Underwriting Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={runBulkPending} disabled={bulkRunning} size="sm"
                className="bg-secondary hover:bg-secondary/90 text-white rounded-xl font-semibold">
                {bulkRunning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <><Zap className="w-4 h-4 mr-2" />Run Pending AI ({stats.pending})</>}
              </Button>
              <Button onClick={fetchApplications} variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-xl">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 mt-5">
            {[
              { label: 'Total', value: stats.total, color: 'bg-white/10' },
              { label: 'Approved', value: stats.approve, color: 'bg-green-500/25' },
              { label: 'Rejected', value: stats.reject, color: 'bg-red-500/25' },
              { label: 'Referred', value: stats.refer, color: 'bg-amber-500/25' },
              { label: 'Pending', value: stats.pending, color: 'bg-white/10' },
              { label: 'Fraud Flags', value: stats.fraud, color: 'bg-red-700/30' },
              { label: 'Loan Book', value: `₹${(stats.totalApprovedValue / 100000).toFixed(1)}L`, color: 'bg-secondary/30' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-border/50 p-1 mb-5 w-fit">
          {[
            { key: 'pipeline', label: 'Pipeline', icon: BarChart3 },
            { key: 'exceptions', label: `Exceptions (${stats.refer + stats.fraud})`, icon: AlertTriangle },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applications..." className="pl-9 rounded-xl bg-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'PENDING', 'APPROVE', 'REJECT', 'REFER', 'fraud'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  filter === f ? 'bg-primary text-white border-primary' : 'bg-white border-border text-foreground hover:border-primary/40'
                }`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Application Pipeline */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-2">
            {(activeTab === 'exceptions' ? filtered.filter(a => a.uw_decision === 'REFER' || a.uw_fraud_flag) : filtered).map(app => {
              const isRunning = runningIds.has(app.id);
              const decision = app.uw_decision || 'PENDING';
              return (
                <div key={app.id} onClick={() => setSelectedApp(app)}
                  className="bg-white rounded-2xl border border-border/30 px-4 py-3 flex items-center gap-4 hover:shadow-md hover:border-primary/30 cursor-pointer transition-all group">
                  <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border ${decisionStyle[decision]}`}>
                    {decision}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">{app.full_name}</p>
                      {app.uw_fraud_flag && <span className="text-xs text-red-600 font-bold flex items-center gap-0.5"><ShieldX className="w-3 h-3" />FRAUD</span>}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{app.loan_type?.replace(/_/g, ' ')} · ₹{app.loan_amount?.toLocaleString('en-IN')} · {app.email}</p>
                  </div>
                  {app.uw_risk_score != null && (
                    <div className="hidden sm:block text-center flex-shrink-0">
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <p className={`font-bold text-sm ${app.uw_risk_score >= 70 ? 'text-green-600' : app.uw_risk_score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{app.uw_risk_score}</p>
                    </div>
                  )}
                  {app.uw_decision === 'APPROVE' && app.uw_approved_amount && (
                    <div className="hidden md:block text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">Approved</p>
                      <p className="font-bold text-sm text-green-700">₹{app.uw_approved_amount?.toLocaleString('en-IN')}</p>
                    </div>
                  )}
                  <p className="hidden lg:block text-xs text-muted-foreground flex-shrink-0">{new Date(app.created_date).toLocaleDateString('en-IN')}</p>
                  <Button size="sm" onClick={e => runSingle(app, e)} disabled={isRunning}
                    className="flex-shrink-0 rounded-xl bg-primary/8 text-primary hover:bg-primary hover:text-white border-0 text-xs font-medium">
                    {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Brain className="w-3 h-3 mr-1" />{decision === 'PENDING' ? 'Run' : 'Re-run'}</>}
                  </Button>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No applications found.</p>}
          </div>
        )}
      </div>

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
