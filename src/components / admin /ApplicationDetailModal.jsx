import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { runUnderwritingEngine } from './UnderwritingEngine';
import ManualDecisionPanel from './ManualDecisionPanel';
import { toast } from 'sonner';
import {
  Loader2, ShieldCheck, ShieldX, AlertTriangle, CheckCircle2, XCircle,
  Clock, FileText, Banknote, Brain, Eye, Banknote as BankIcon
} from 'lucide-react';

const decisionConfig = {
  APPROVE: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2, iconColor: 'text-green-600' },
  REJECT: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, iconColor: 'text-red-600' },
  REFER: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock, iconColor: 'text-amber-600' },
  PENDING: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock, iconColor: 'text-slate-500' },
};

function ScoreBar({ label, value, color = 'bg-primary' }) {
  const pct = Math.min(100, value || 0);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">{value ?? '—'}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ApplicationDetailModal({ app, open, onClose, onUpdated }) {
  const [running, setRunning] = useState(false);
  const [markingDisbursed, setMarkingDisbursed] = useState(false);

  if (!app) return null;

  const finalDecision = app.final_decision || app.uw_decision || 'PENDING';
  const hasUWResult = app?.uw_decision && app.uw_decision !== 'PENDING';
  const dc = decisionConfig[app?.uw_decision || 'PENDING'];
  const DecisionIcon = dc.icon;

  const runEngine = async () => {
    setRunning(true);
    toast.info('🧠 Underwriting engine running...');
    const result = await runUnderwritingEngine(app);
    const statusMap = { APPROVE: 'approved', REJECT: 'rejected', REFER: 'under_review' };
    const newStatus = statusMap[result.decision] || 'under_review';
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
      status: newStatus,
      // Set final_decision only if no manual override exists
      final_decision: app.manual_decision || result.decision,
    });
    toast.success(`AI Decision: ${result.decision}`);
    setRunning(false);
    onUpdated();
  };

  const markDisbursed = async () => {
    setMarkingDisbursed(true);
    await base44.entities.LoanApplication.update(app.id, {
      status: 'disbursed',
      disbursed_at: new Date().toISOString(),
    });
    toast.success('Loan marked as disbursed!');
    setMarkingDisbursed(false);
    onUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold">{app.full_name}</h2>
              <p className="text-white/70 text-sm mt-0.5">{app.email} · {app.phone}</p>
              <p className="text-white/60 text-xs mt-1">ID: {app.id?.slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold ${decisionConfig[app.uw_decision || 'PENDING'].color}`}>
                <DecisionIcon className={`w-4 h-4 ${dc.iconColor}`} />
                AI: {app.uw_decision || 'PENDING'}
              </div>
              {app.final_decision && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold ${decisionConfig[app.final_decision].color}`}>
                  Final: {app.final_decision}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Loan Details */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Loan Type', value: app.loan_type?.replace(/_/g, ' ')?.toUpperCase() },
              { label: 'Requested Amount', value: `₹${app.loan_amount?.toLocaleString('en-IN') || 0}` },
              { label: 'Tenure', value: `${app.tenure_months || 0} months` },
              { label: 'Monthly Income', value: app.monthly_income ? `₹${app.monthly_income.toLocaleString('en-IN')}` : '—' },
              { label: 'Employment', value: app.employment_type?.replace(/_/g, ' ') || '—' },
              { label: 'Status', value: app.status?.replace(/_/g, ' ') || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-semibold text-foreground capitalize text-sm mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><FileText className="w-4 h-4" />Documents</p>
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
              {!app.selfie_url && !app.aadhaar_url && <p className="text-xs text-muted-foreground">No documents uploaded</p>}
            </div>
          </div>

          {/* Run Engine */}
          {!hasUWResult && (
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-6 text-center">
              <Brain className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Underwriting Engine Ready</h3>
              <p className="text-sm text-muted-foreground mb-4">Run the AI credit decision engine to evaluate this application.</p>
              <Button onClick={runEngine} disabled={running} className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-semibold">
                {running ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Evaluating...</> : <><Brain className="w-4 h-4 mr-2" />Run Underwriting Engine</>}
              </Button>
            </div>
          )}

          {/* UW Results */}
          {hasUWResult && (
            <div className="space-y-4">
              <div className={`rounded-2xl border p-5 ${
                app.uw_decision === 'APPROVE' ? 'bg-green-50 border-green-200' :
                app.uw_decision === 'REJECT' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <DecisionIcon className={`w-7 h-7 ${dc.iconColor}`} />
                    <div>
                      <p className="font-bold text-lg text-foreground">{app.uw_decision} (AI)</p>
                      <p className="text-xs text-muted-foreground">Credit Engine Decision</p>
                    </div>
                  </div>
                  {app.uw_fraud_flag ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                      <ShieldX className="w-4 h-4" /> FRAUD FLAGGED
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                      <ShieldCheck className="w-4 h-4" /> FRAUD CLEAR
                    </div>
                  )}
                </div>
                {app.uw_decision === 'APPROVE' && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white/80 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Approved Amount</p>
                      <p className="text-lg font-bold text-green-700">₹{app.uw_approved_amount?.toLocaleString('en-IN') || 0}</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">Eligible EMI</p>
                      <p className="text-lg font-bold text-green-700">₹{app.uw_eligible_emi?.toLocaleString('en-IN') || 0}/mo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scores */}
              <div className="bg-muted/30 rounded-2xl p-5 space-y-3">
                <p className="font-semibold text-foreground text-sm">Credit Scores</p>
                <ScoreBar label="Risk Score" value={app.uw_risk_score} color={app.uw_risk_score >= 70 ? 'bg-green-500' : app.uw_risk_score >= 50 ? 'bg-amber-500' : 'bg-red-500'} />
                <ScoreBar label="Confidence Score" value={app.uw_confidence_score} color="bg-primary" />
              </div>

              {/* Decision Reasons */}
              {app.uw_reasons?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Decision Reasons</p>
                  <div className="space-y-1.5">
                    {app.uw_reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                        <span className="text-primary mt-0.5">•</span> {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {app.uw_risk_flags?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" />Risk Flags</p>
                  <div className="flex flex-wrap gap-2">
                    {app.uw_risk_flags.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium border border-amber-200">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bureau & Bank Summary */}
              <div className="grid sm:grid-cols-2 gap-4">
                {app.uw_bureau_summary && (
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Bureau Summary</p>
                    {Object.entries(app.uw_bureau_summary).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-foreground">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {app.uw_bank_summary && (
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Banking Summary</p>
                    {Object.entries(app.uw_bank_summary).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-foreground">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="outline" onClick={runEngine} disabled={running} className="w-full rounded-xl text-sm">
                {running ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Re-evaluating...</> : '🔄 Re-run Credit Engine'}
              </Button>
            </div>
          )}

          {/* Manual Decision Override (Admin) */}
          <ManualDecisionPanel app={app} onUpdated={onUpdated} decisionSource="admin" />

          {/* Disburse Button */}
          {(app.final_decision === 'APPROVE' || app.uw_decision === 'APPROVE') && app.status !== 'disbursed' && app.esign_completed && app.emandate_completed && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-800 text-sm">Ready for Disbursement</p>
                <p className="text-xs text-muted-foreground">eSign & eMandate completed. Mark as disbursed.</p>
              </div>
              <Button onClick={markDisbursed} disabled={markingDisbursed} className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold">
                {markingDisbursed ? <Loader2 className="w-4 h-4 animate-spin" /> : <><BankIcon className="w-4 h-4 mr-1" />Mark Disbursed</>}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
