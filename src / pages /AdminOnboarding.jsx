import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Eye, Search, FileText, Clock, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
};

function DocLink({ url, label }) {
  if (!url) return <span className="text-muted-foreground text-xs">Not uploaded</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs hover:underline flex items-center gap-1">
      <Eye className="w-3 h-3" /> {label}
    </a>
  );
}

function ApplicationDetail({ app, onClose, onUpdate }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleAction = async (status) => {
    setProcessing(true);
    await base44.entities.DealerOnboarding.update(app.id, {
      status,
      rejection_reason: status === 'rejected' ? rejectionReason : undefined,
      approved_at: status === 'approved' ? new Date().toISOString() : undefined,
    });
    toast.success(`Application ${status}!`);
    onUpdate();
    onClose();
    setProcessing(false);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="space-y-5 p-1">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{app.dealer_name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{app.category?.replace(/_/g, ' ')} · {app.business_type?.replace(/_/g, ' ')}</p>
          </div>
          <Badge className={STATUS_CONFIG[app.status]?.color}>{STATUS_CONFIG[app.status]?.label}</Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            ['Email', app.email], ['Phone', app.phone], ['PAN', app.pan], ['GST', app.gst],
            ['City', app.city], ['State', app.state], ['Bank', app.bank_name],
            ['Account', app.account_number], ['IFSC', app.ifsc_code],
            ['Product Type', app.product_type], ['Tenure', app.tenure_months ? `${app.tenure_months} months` : ''],
            ['Signatory', app.authorised_signatory_name],
          ].map(([label, val]) => val ? (
            <div key={label}>
              <span className="text-muted-foreground">{label}: </span>
              <span className="font-medium text-foreground">{val}</span>
            </div>
          ) : null)}
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">KYC Documents</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['PAN Card', app.pan_url], ['GST Certificate', app.gst_url],
              ['Registration', app.registration_url], ['Cancelled Cheque', app.cancelled_cheque_url],
              ['Address Proof', app.address_proof_url], ['Partnership Deed', app.partnership_deed_url],
              ['MOA/AOA', app.moa_url],
            ].map(([label, url]) => url ? (
              <div key={label} className="flex items-center gap-2 bg-muted/40 rounded-lg p-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <DocLink url={url} label={label} />
              </div>
            ) : null)}
          </div>
        </div>

        {app.status === 'submitted' || app.status === 'under_review' ? (
          <div className="border-t border-border pt-4 space-y-3">
            <div>
              <Label className="text-sm">Rejection Reason (required if rejecting)</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
                rows={2}
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => handleAction('under_review')}
                disabled={processing}
                variant="outline"
                className="rounded-xl border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                <Clock className="mr-2 w-4 h-4" /> Mark Under Review
              </Button>
              <Button
                onClick={() => handleAction('rejected')}
                disabled={processing || !rejectionReason}
                variant="outline"
                className="rounded-xl border-destructive text-destructive hover:bg-destructive/5"
              >
                <XCircle className="mr-2 w-4 h-4" /> Reject
              </Button>
              <Button
                onClick={() => handleAction('approved')}
                disabled={processing}
                className="rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground ml-auto"
              >
                <CheckCircle className="mr-2 w-4 h-4" /> Approve
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </DialogContent>
  );
}

export default function AdminOnboarding() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const apps = await base44.entities.DealerOnboarding.list('-created_date', 100);
    setApplications(apps);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = applications.filter((a) => {
    const matchFilter = filter === 'all' || a.status === filter;
    const matchSearch = !search || a.dealer_name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: applications.length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    under_review: applications.filter((a) => a.status === 'under_review').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Partner Onboarding Requests</h1>
          <p className="text-muted-foreground mt-1">Review, approve or reject dealer onboarding applications.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {Object.entries(counts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-xl border-2 p-3 text-center transition-all ${filter === key ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/30'}`}
            >
              <div className="text-2xl font-bold text-foreground">{loading ? '—' : count}</div>
              <div className="text-xs text-muted-foreground capitalize mt-0.5">{key === 'all' ? 'All' : key.replace('_', ' ')}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-9 rounded-xl" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No applications found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app, i) => {
              const cfg = STATUS_CONFIG[app.status];
              return (
                <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{app.dealer_name || 'Unnamed'}</p>
                        <p className="text-sm text-muted-foreground capitalize">{app.category?.replace(/_/g, ' ')} · {app.business_type?.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{app.email} · {new Date(app.created_date).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {cfg && <Badge className={cfg.color}>{cfg.label}</Badge>}
                        <Button variant="outline" size="sm" onClick={() => setSelected(app)} className="rounded-xl gap-1">
                          <Eye className="w-3 h-3" /> Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && <ApplicationDetail app={selected} onClose={() => setSelected(null)} onUpdate={load} />}
      </Dialog>
    </div>
  );
}
