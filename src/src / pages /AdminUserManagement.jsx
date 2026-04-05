import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import RoleGuard from '../components/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, Search, RefreshCw, ShieldCheck, Loader2, CheckCircle2,
  XCircle, Clock, ChevronRight, Building2, User, Crown, Briefcase, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const ROLE_CONFIG = {
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-800', icon: Crown },
  lender: { label: 'Lender', color: 'bg-blue-100 text-blue-800', icon: Building2 },
  merchant: { label: 'Merchant', color: 'bg-green-100 text-green-800', icon: Briefcase },
  borrower: { label: 'Borrower', color: 'bg-slate-100 text-slate-700', icon: User },
  user: { label: 'Borrower', color: 'bg-slate-100 text-slate-700', icon: User },
};

const ROLES = ['user', 'borrower', 'merchant', 'lender', 'admin'];

function UserRow({ user: u, currentUser, onRoleChange, pendingOnboarding }) {
  const [changing, setChanging] = useState(false);
  const [newRole, setNewRole] = useState(u.role || 'user');
  const roleConf = ROLE_CONFIG[u.role || 'user'] || ROLE_CONFIG.user;
  const RoleIcon = roleConf.icon;
  const hasPendingApp = pendingOnboarding?.some(d => d.email === u.email);

  const handleChange = async () => {
    if (newRole === u.role) return;
    setChanging(true);
    await base44.entities.User.update(u.id, { role: newRole });
    // If upgrading to merchant, check if there's a pending onboarding and approve it
    if (newRole === 'merchant' && hasPendingApp) {
      const pending = pendingOnboarding.find(d => d.email === u.email);
      if (pending) {
        await base44.entities.DealerOnboarding.update(pending.id, {
          status: 'approved',
          approved_at: new Date().toISOString()
        });
      }
    }
    toast.success(`${u.full_name || u.email} → ${newRole}`);
    setChanging(false);
    onRoleChange();
  };

  return (
    <div className="bg-white rounded-2xl border border-border/50 p-4 flex items-center gap-4 flex-wrap">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-primary font-bold text-sm">{(u.full_name || u.email || 'U')[0].toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground text-sm">{u.full_name || 'Unknown'}</p>
          {hasPendingApp && (
            <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Partner Applicant
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{u.email}</p>
        <p className="text-xs text-muted-foreground">Joined {new Date(u.created_date).toLocaleDateString('en-IN')}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 ${roleConf.color}`}>
          <RoleIcon className="w-3 h-3" /> {roleConf.label}
        </span>
        <select value={newRole} onChange={e => setNewRole(e.target.value)}
          className="text-sm border border-border rounded-xl px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <Button size="sm" onClick={handleChange} disabled={changing || newRole === (u.role || 'user')}
          className="rounded-xl bg-primary text-xs font-medium">
          {changing ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Update'}
        </Button>
      </div>
    </div>
  );
}

function AdminUserManagementContent() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingOnboarding, setPendingOnboarding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [allUsers, onboarding] = await Promise.all([
      base44.entities.User.list('-created_date', 200),
      base44.entities.DealerOnboarding.filter({ status: 'submitted' }, '-created_date', 100),
    ]);
    setUsers(allUsers);
    setPendingOnboarding(onboarding);
    setLoading(false);
  };

  const filtered = users.filter(u => {
    const matchSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || (u.role || 'user') === filterRole;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    lender: users.filter(u => u.role === 'lender').length,
    merchant: users.filter(u => u.role === 'merchant').length,
    borrower: users.filter(u => !u.role || u.role === 'user' || u.role === 'borrower').length,
    pending: pendingOnboarding.length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-primary text-white py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">User Management</h1>
                <p className="text-white/60 text-sm">Role Assignment & Partner Approval</p>
              </div>
            </div>
            <Button onClick={fetchData} variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-xl">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'Total Users', value: stats.total, color: 'bg-white/10' },
              { label: 'Borrowers', value: stats.borrower, color: 'bg-slate-400/30' },
              { label: 'Merchants', value: stats.merchant, color: 'bg-green-500/25' },
              { label: 'Lenders', value: stats.lender, color: 'bg-blue-500/25' },
              { label: 'Admins', value: stats.admin, color: 'bg-purple-500/25' },
              { label: 'Partner Apps', value: stats.pending, color: 'bg-amber-500/25' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Partner Applicants Alert */}
        {pendingOnboarding.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">{pendingOnboarding.length} Partner Application(s) Pending Approval</p>
                <p className="text-xs text-amber-700">Update their role to "merchant" below to approve their onboarding.</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 rounded-xl bg-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'user', 'merchant', 'lender', 'admin'].map(r => (
              <button key={r} onClick={() => setFilterRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  filterRole === r ? 'bg-primary text-white border-primary' : 'bg-white border-border text-foreground hover:border-primary/40'
                }`}>{r === 'all' ? 'All' : r}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-3">
            {filtered.map(u => (
              <UserRow key={u.id} user={u} currentUser={user} onRoleChange={fetchData} pendingOnboarding={pendingOnboarding} />
            ))}
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No users found</p>}
          </div>
        )}

        {/* Role Guide */}
        <div className="mt-8 bg-white rounded-2xl border border-border/50 p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Role Access Guide</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { role: 'Borrower (Default)', desc: 'Apply for loans, track status, upload documents', color: 'bg-slate-50 border-slate-200' },
              { role: 'Merchant', desc: 'Submit leads, track pipeline, view performance, download MIS', color: 'bg-green-50 border-green-200' },
              { role: 'Lender', desc: 'View approved applications, override decisions, fund loans', color: 'bg-blue-50 border-blue-200' },
              { role: 'Admin', desc: 'Full system access, role management, disbursement control', color: 'bg-purple-50 border-purple-200' },
            ].map(({ role, desc, color }) => (
              <div key={role} className={`rounded-xl border p-3 ${color}`}>
                <p className="font-semibold text-foreground text-sm">{role}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUserManagement() {
  return <RoleGuard allowedRoles={['admin']}><AdminUserManagementContent /></RoleGuard>;
}
