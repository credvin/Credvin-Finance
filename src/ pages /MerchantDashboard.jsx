import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import RoleGuard from '../components/RoleGuard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, TrendingUp, CheckCircle2, XCircle, Clock, Loader2,
  Search, RefreshCw, IndianRupee, ShieldCheck, AlertTriangle,
  ChevronRight, Copy, Download, Banknote, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const decisionBadge = {
  APPROVE: 'bg-green-100 text-green-800',
  REJECT: 'bg-red-100 text-red-800',
  REFER: 'bg-amber-100 text-amber-800',
  PENDING: 'bg-slate-100 text-slate-600',
};

function exportCSV(applications) {
  const headers = ['Name', 'Email', 'Phone', 'Loan Type', 'Amount', 'Status', 'Decision', 'Applied Date'];
  const rows = applications.map(a => [
    a.full_name, a.email, a.phone,
    a.loan_type?.replace(/_/g, ' '),
    a.loan_amount,
    a.status,
    a.final_decision || a.uw_decision || 'PENDING',
    new Date(a.created_date).toLocaleDateString('en-IN')
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `credvin_mis_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  toast.success('MIS Report downloaded!');
}

function MerchantDashboardContent() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dealerData, setDealerData] = useState(null);
  const [misMonths, setMisMonths] = useState(1);

  useEffect(() => { if (user?.email) fetchData(); }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const dealers = await base44.entities.DealerOnboarding.filter({ email: user.email }, '-created_date', 1);
    if (dealers.length > 0) setDealerData(dealers[0]);
    const apps = await base44.entities.LoanApplication.list('-created_date', 100);
    setApplications(apps);
    setLoading(false);
  };

  const getMISApplications = () => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - Math.min(misMonths, 3));
    return applications.filter(a => new Date(a.created_date) >= cutoff);
  };

  const filtered = applications.filter(a =>
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.phone?.includes(search)
  );

  const stats = {
    total: applications.length,
    approved: applications.filter(a => (a.final_decision || a.uw_decision) === 'APPROVE').length,
    rejected: applications.filter(a => (a.final_decision || a.uw_decision) === 'REJECT').length,
    pending: applications.filter(a => !(a.final_decision || a.uw_decision) || (a.final_decision || a.uw_decision) === 'PENDING').length,
    disbursed: applications.filter(a => a.status === 'disbursed').length,
    totalValue: applications.filter(a => (a.final_decision || a.uw_decision) === 'APPROVE').reduce((s, a) => s + (a.uw_approved_amount || a.loan_amount || 0), 0),
    conversionRate: applications.length > 0 ? Math.round((applications.filter(a => (a.final_decision || a.uw_decision) === 'APPROVE').length / applications.length) * 100) : 0,
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/ApplyLoan?ref=${user?.email}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/3 via-background to-secondary/3">
      {/* Header */}
      <div className="bg-white border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Merchant Dashboard</h1>
            <p className="text-sm text-muted-foreground">{dealerData?.dealer_name || user?.full_name || 'Merchant'} · Partner Portal</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyReferralLink} className="rounded-xl text-xs">
              <Copy className="w-3 h-3 mr-1" /> Referral Link
            </Button>
            <Button variant="ghost" size="sm" onClick={fetchData}><RefreshCw className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dealer Status Banner */}
        {dealerData && (
          <div className={`rounded-2xl border p-4 mb-6 flex items-center justify-between flex-wrap gap-3 ${
            dealerData.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              {dealerData.status === 'approved' ? <ShieldCheck className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {dealerData.status === 'approved' ? '✓ Verified Partner' : `Onboarding: ${dealerData.status}`}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{dealerData.category?.replace(/_/g, ' ')} · {dealerData.city}, {dealerData.state}</p>
              </div>
            </div>
            {dealerData.status !== 'approved' && (
              <Link to="/PartnerOnboarding">
                <Button size="sm" className="rounded-xl text-xs">Complete Onboarding <ChevronRight className="w-3 h-3" /></Button>
              </Link>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Applications', value: stats.total, icon: Users, color: 'text-primary', bg: 'bg-primary/8' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
            { label: 'Disbursed', value: stats.disbursed, icon: Banknote, color: 'text-secondary', bg: 'bg-secondary/10' },
            { label: 'Approval %', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/8' },
          ].map(({ label, value, icon: IconComp, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-border/50 p-4">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <IconComp className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Approval Breakdown */}
          <div className="bg-white rounded-2xl border border-border/50 p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Portfolio Performance</h3>
            <div className="space-y-3">
              {[
                { label: 'Approved', count: stats.approved, color: 'bg-green-500', pct: stats.total ? (stats.approved/stats.total)*100 : 0 },
                { label: 'Rejected', count: stats.rejected, color: 'bg-red-400', pct: stats.total ? (stats.rejected/stats.total)*100 : 0 },
                { label: 'Disbursed', count: stats.disbursed, color: 'bg-secondary', pct: stats.total ? (stats.disbursed/stats.total)*100 : 0 },
                { label: 'Pending', count: stats.pending, color: 'bg-slate-300', pct: stats.total ? (stats.pending/stats.total)*100 : 0 },
              ].map(({ label, count, color, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-bold">{count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">Total Approved Value</p>
                <p className="text-lg font-bold text-primary">₹{(stats.totalValue/100000).toFixed(2)}L</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-border/50 p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Add New Lead', desc: 'Submit application', href: '/ApplyLoan', color: 'bg-primary text-white' },
                { label: 'Partner Onboarding', desc: 'Complete profile', href: '/PartnerOnboarding', color: 'bg-secondary text-white' },
                { label: 'Loan Products', desc: 'View products', href: '/LoanProducts', color: 'bg-white border border-border text-foreground' },
                { label: 'Copy Referral', desc: 'Share link', action: copyReferralLink, color: 'bg-white border border-border text-foreground' },
              ].map(({ label, desc, href, action, color }) => (
                <div key={label} onClick={action} className={`rounded-xl p-3 cursor-pointer hover:shadow-md transition-all ${color}`}>
                  {href ? <Link to={href} className="block"><p className="font-semibold text-sm">{label}</p><p className="text-xs opacity-70 mt-0.5">{desc}</p></Link>
                         : <><p className="font-semibold text-sm">{label}</p><p className="text-xs opacity-70 mt-0.5">{desc}</p></>}
                </div>
              ))}
            </div>
          </div>

          {/* MIS Report */}
          <div className="bg-white rounded-2xl border border-border/50 p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2"><Download className="w-4 h-4 text-primary" />MIS Report</h3>
            <p className="text-xs text-muted-foreground mb-4">Download your applications report in CSV/Excel format.</p>
            <div className="space-y-2 mb-4">
              {[1, 2, 3].map(m => (
                <label key={m} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${misMonths === m ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <input type="radio" name="mis" checked={misMonths === m} onChange={() => setMisMonths(m)} className="accent-primary" />
                  <span className="text-sm font-medium">Last {m} Month{m > 1 ? 's' : ''}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{getMISApplications().length} records</span>
                </label>
              ))}
            </div>
            <Button onClick={() => exportCSV(getMISApplications())} className="w-full rounded-xl bg-primary font-semibold text-sm">
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl border border-border/50 p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h3 className="font-semibold text-foreground">Customer Applications</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 rounded-xl w-64" />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No applications found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    {['Customer', 'Loan Type', 'Amount', 'Applied', 'Status', 'Decision', 'Score'].map(h => (
                      <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.map(a => {
                    const fd = a.final_decision || a.uw_decision || 'PENDING';
                    return (
                      <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 pr-4"><p className="font-medium text-foreground">{a.full_name}</p><p className="text-xs text-muted-foreground">{a.phone}</p></td>
                        <td className="py-3 pr-4 capitalize text-muted-foreground">{a.loan_type?.replace(/_/g, ' ')}</td>
                        <td className="py-3 pr-4 font-semibold">₹{a.loan_amount?.toLocaleString('en-IN')}</td>
                        <td className="py-3 pr-4 text-muted-foreground text-xs">{new Date(a.created_date).toLocaleDateString('en-IN')}</td>
                        <td className="py-3 pr-4"><span className="text-xs text-muted-foreground capitalize">{a.status?.replace(/_/g, ' ')}</span></td>
                        <td className="py-3 pr-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${decisionBadge[fd]}`}>{fd}</span></td>
                        <td className="py-3">{a.uw_risk_score != null ? <span className={`text-xs font-bold ${a.uw_risk_score >= 70 ? 'text-green-600' : a.uw_risk_score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{a.uw_risk_score}/100</span> : <span className="text-muted-foreground text-xs">—</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MerchantDashboard() {
  return <RoleGuard allowedRoles={['merchant', 'admin']}><MerchantDashboardContent /></RoleGuard>;
}
