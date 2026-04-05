import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Loader2, ShieldCheck, History } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Reusable Manual Decision Override Panel
 * allowedRoles: ['admin'] | ['lender'] | ['admin','lender']
 * decisionSource: 'admin' | 'lender' | 'underwriter'
 */
export default function ManualDecisionPanel({ app, onUpdated, decisionSource = 'admin', compact = false }) {
  const { user } = useAuth();
  const [decision, setDecision] = useState('');
  const [remarks, setRemarks] = useState('');
  const [conditions, setConditions] = useState('');
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (!app) return null;

  const currentFinal = app.final_decision || app.uw_decision || 'PENDING';
  const history = app.decision_history || [];

  const handleSubmit = async () => {
    if (!decision) { toast.error('Please select a decision'); return; }
    if (!remarks.trim()) { toast.error('Remarks are mandatory'); return; }

    setSaving(true);
    const historyEntry = {
      decision,
      previous_decision: currentFinal,
      source: decisionSource,
      actor_email: user.email,
      actor_role: user.role,
      remarks: remarks.trim(),
      conditions: conditions.trim() || null,
      timestamp: new Date().toISOString(),
    };

    const statusMap = { APPROVE: 'approved', REJECT: 'rejected', PENDING: 'under_review' };
    await base44.entities.LoanApplication.update(app.id, {
      manual_decision: decision,
      manual_decision_by: user.email,
      manual_decision_role: user.role,
      manual_remarks: remarks.trim(),
      manual_conditions: conditions.trim() || undefined,
      final_decision: decision,
      status: statusMap[decision],
      decision_history: [...history, historyEntry],
    });

    // Log to audit trail
    await base44.entities.DecisionAuditLog.create({
      application_id: app.id,
      applicant_name: app.full_name,
      previous_decision: currentFinal,
      new_decision: decision,
      decision_source: decisionSource,
      actor_email: user.email,
      actor_role: user.role,
      remarks: remarks.trim(),
      conditions: conditions.trim() || undefined,
      timestamp: new Date().toISOString(),
    });

    toast.success(`Decision recorded: ${decision}`);
    setSaving(false);
    setDecision('');
    setRemarks('');
    setConditions('');
    onUpdated?.();
  };

  const decisionBtns = [
    { value: 'APPROVE', label: 'Approve', icon: CheckCircle2, style: 'bg-green-50 border-green-300 text-green-800 hover:bg-green-100', activeStyle: 'bg-green-600 border-green-600 text-white' },
    { value: 'REJECT', label: 'Reject', icon: XCircle, style: 'bg-red-50 border-red-300 text-red-800 hover:bg-red-100', activeStyle: 'bg-red-600 border-red-600 text-white' },
    { value: 'PENDING', label: 'Mark Pending', icon: Clock, style: 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100', activeStyle: 'bg-amber-500 border-amber-500 text-white' },
  ];

  return (
    <div className={`rounded-2xl border border-primary/20 bg-primary/3 ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <p className="font-semibold text-foreground text-sm">Manual Decision Override</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Current state */}
          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
            currentFinal === 'APPROVE' ? 'bg-green-100 text-green-800 border-green-200' :
            currentFinal === 'REJECT' ? 'bg-red-100 text-red-800 border-red-200' :
            'bg-amber-100 text-amber-800 border-amber-200'
          }`}>
            Final: {currentFinal}
          </span>
          {history.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1 text-xs text-primary hover:underline">
              <History className="w-3 h-3" /> History ({history.length})
            </button>
          )}
        </div>
      </div>

      {/* AI Decision info */}
      {app.uw_decision && (
        <div className="mb-3 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
          🧠 Credit Engine Decision: <span className="font-bold text-foreground">{app.uw_decision}</span>
          {app.manual_decision && <> · Last Override by <span className="font-bold">{app.manual_decision_role}</span>: <span className="font-bold text-foreground">{app.manual_decision}</span></>}
        </div>
      )}

      {/* Decision buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {decisionBtns.map(({ value, label, icon: Icon, style, activeStyle }) => (
          <button key={value} onClick={() => setDecision(decision === value ? '' : value)}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-all ${decision === value ? activeStyle : style}`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Remarks (mandatory) */}
      <textarea
        value={remarks}
        onChange={e => setRemarks(e.target.value)}
        rows={2}
        placeholder="Remarks (mandatory) — explain your decision..."
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2"
      />

      {/* Conditions (optional) */}
      {!compact && (
        <textarea
          value={conditions}
          onChange={e => setConditions(e.target.value)}
          rows={1}
          placeholder="Conditions (optional) — e.g., require additional documents..."
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
        />
      )}

      <Button onClick={handleSubmit} disabled={saving || !decision} className="w-full rounded-xl bg-primary font-semibold text-sm">
        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : `Confirm ${decision || 'Decision'}`}
      </Button>

      {/* Decision History */}
      {showHistory && history.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-foreground">Decision History</p>
          {[...history].reverse().map((h, i) => (
            <div key={i} className="bg-white rounded-xl border border-border/50 p-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold px-2 py-0.5 rounded-full ${
                  h.decision === 'APPROVE' ? 'bg-green-100 text-green-800' :
                  h.decision === 'REJECT' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}>{h.decision}</span>
                <span className="text-muted-foreground">{new Date(h.timestamp).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-muted-foreground">By <span className="font-medium text-foreground capitalize">{h.source}</span> ({h.actor_email})</p>
              <p className="text-foreground mt-1">"{h.remarks}"</p>
              {h.conditions && <p className="text-amber-700 mt-0.5">Conditions: {h.conditions}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
