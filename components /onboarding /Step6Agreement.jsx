import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const formatTenures = (data) => {
  const tenures = Array.isArray(data.tenure_months) ? data.tenure_months : [];
  const rates = data.tenure_rates || {};
  return tenures.map((t) => `${t} months @ ${rates[t] || 'TBD'}% p.a.`).join(', ') || 'N/A';
};

export default function Step6Agreement({ data }) {
  const [generating, setGenerating] = useState(false);
  const [agreement, setAgreement] = useState(null);

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const tenureStr = formatTenures(data);

  const generateAgreement = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Draft a comprehensive, legally binding Fintech Dealer Onboarding Agreement between Credvin Finance Private Limited ("Credvin") and the dealer described below. The agreement must fully protect Credvin from all legal risks. Use professional legal language throughout.

DEALER DETAILS:
- Business Name: ${data.dealer_name || 'N/A'}
- Category: ${data.category || 'N/A'}
- Business Type: ${data.business_type?.replace(/_/g, ' ') || 'N/A'}
- PAN: ${data.pan || 'N/A'}
- GST: ${data.gst || 'N/A'}
- City/State: ${data.city || 'N/A'}, ${data.state || 'N/A'}
- Address: ${data.address || 'N/A'}
- Authorised Signatory: ${data.authorised_signatory_name || 'N/A'}, ${data.authorised_signatory_designation || ''}
- Signatory Email: ${data.authorised_signatory_email || 'N/A'}
- Signatory Phone: ${data.authorised_signatory_phone || 'N/A'}
- Bank: ${data.bank_name || 'N/A'}, A/C: ${data.account_number || 'N/A'}, IFSC: ${data.ifsc_code || 'N/A'}
- Product Type: ${data.product_type || 'N/A'}
- EMI Protection: ${data.emi_protection || 'None'}
- Tenures & Rates: ${tenureStr}

AGREEMENT STRUCTURE (include all sections):

CREDVIN DEALER ONBOARDING AGREEMENT

Preamble / Recitals

ARTICLE 1 – DEFINITIONS
Define: Agreement, Dealer, Credvin, Loan Products, Subvention, ROI, EMI, KYC, Confidential Information, Force Majeure, Regulatory Authority.

ARTICLE 2 – SCOPE OF ENGAGEMENT
Dealer's role as a loan facilitation partner. Non-exclusivity clause. No agency or employment relationship.

ARTICLE 3 – REPRESENTATIONS AND WARRANTIES
Dealer warrants: valid business registration, PAN/GST compliance, no pending legal proceedings, all submitted documents are genuine.

ARTICLE 4 – DEALER OBLIGATIONS
Promote Credvin products ethically. Not charge customers hidden fees. Ensure customer KYC compliance. Not misrepresent loan terms. Maintain customer data confidentiality.

ARTICLE 5 – CREDVIN'S RIGHTS AND OBLIGATIONS
Right to suspend/terminate dealer at any time. Provide timely commission/payouts per Schedule 2. No liability for lender credit decisions.

ARTICLE 6 – INDEMNIFICATION AND LIABILITY
Dealer to indemnify Credvin against all losses arising from dealer's misconduct, misrepresentation, or fraud. Credvin's maximum liability limited to last 30 days of payouts.

ARTICLE 7 – CONFIDENTIALITY
Both parties to maintain strict confidentiality. Survives termination for 3 years.

ARTICLE 8 – DATA PROTECTION AND PRIVACY
Dealer must comply with IT Act 2000, DPDP Act 2023. No unauthorized sharing of customer data.

ARTICLE 9 – ANTI-MONEY LAUNDERING & KYC COMPLIANCE
Dealer must follow RBI AML guidelines. Any suspicious transaction to be immediately reported.

ARTICLE 10 – TERMINATION
Either party may terminate with 30 days notice. Credvin may terminate immediately for breach, fraud, or regulatory non-compliance.

ARTICLE 11 – DISPUTE RESOLUTION
Disputes to be resolved by arbitration under Arbitration & Conciliation Act 1996. Seat of arbitration: Mumbai.

ARTICLE 12 – GOVERNING LAW
Laws of India. Exclusive jurisdiction: Courts of Mumbai.

ARTICLE 13 – FORCE MAJEURE
Neither party liable for events beyond reasonable control.

ARTICLE 14 – ENTIRE AGREEMENT
This agreement supersedes all prior discussions. Amendments only in writing signed by both parties.

SIGNATURE BLOCK:
For Credvin Finance Private Limited: _________________ (Authorised Signatory)
For ${data.dealer_name || '[DEALER NAME]'}: _________________ (${data.authorised_signatory_name || 'Authorised Signatory'}, ${data.authorised_signatory_designation || ''})
Date: ${today}  |  Place: _________________

---

SCHEDULE 1 – MERCHANT DETAILS

Present the following merchant information in a clearly formatted table:

| Parameter | Details |
|---|---|
| Business Name | ${data.dealer_name || 'N/A'} |
| Dealer Category | ${data.category?.replace(/_/g, ' ') || 'N/A'} |
| Business Type | ${data.business_type?.replace(/_/g, ' ') || 'N/A'} |
| PAN Number | ${data.pan || 'N/A'} |
| GST Number | ${data.gst || 'N/A'} |
| Registered Address | ${data.address || 'N/A'}, ${data.city || 'N/A'}, ${data.state || 'N/A'} |
| Authorised Signatory | ${data.authorised_signatory_name || 'N/A'} |
| Designation | ${data.authorised_signatory_designation || 'N/A'} |
| Signatory Email | ${data.authorised_signatory_email || 'N/A'} |
| Signatory Phone | ${data.authorised_signatory_phone || 'N/A'} |
| Bank Name | ${data.bank_name || 'N/A'} |
| Account Number | ${data.account_number || 'N/A'} |
| IFSC Code | ${data.ifsc_code || 'N/A'} |
| Account Type | ${data.account_type || 'N/A'} |

---

SCHEDULE 2 – COMMERCIAL TERMS

Present the commercial structure in a table format:

| Parameter | Details |
|---|---|
| Product Type | ${data.product_type || 'N/A'} |
| EMI Protection | ${data.emi_protection || 'None'} |

Then a second table for Tenure & Rates:
${Array.isArray(data.tenure_months) ? data.tenure_months.map((t) => `| ${t} Months | ${(data.tenure_rates || {})[t] || 'TBD'}% p.a. |`).join('\n') : '| N/A | N/A |'}

Add a note: "All commercial terms are as mutually agreed. Credvin reserves the right to revise rates with 15 days prior written notice."

Output the full agreement as plain text with clear section headings. Do not truncate any section.`,
      model: 'claude_sonnet_4_6',
    });
    setAgreement(result);
    setGenerating(false);
  };

  const downloadAgreement = () => {
    const blob = new Blob([agreement], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Credvin_Dealer_Agreement_${data.dealer_name || 'Draft'}_${today.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Agreement Preview</h2>
        <p className="text-sm text-muted-foreground mb-1">Review your dealer onboarding agreement before proceeding.</p>
        <p className="text-xs text-muted-foreground">The agreement includes Schedule 1 (Merchant Details) and Schedule 2 (Commercial Terms) populated with your data.</p>
      </div>

      {!agreement ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-1">Click below to generate your personalized dealer agreement.</p>
          <p className="text-xs text-muted-foreground mb-4">Includes full legal terms + Schedule 1 & 2 with your submitted details.</p>
          <Button onClick={generateAgreement} disabled={generating} className="bg-primary hover:bg-primary/90 rounded-xl">
            {generating ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Generating Agreement...</> : 'Generate Agreement'}
          </Button>
          {generating && <p className="text-xs text-muted-foreground mt-2">This may take a few seconds…</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-6 bg-muted/20 max-h-96 overflow-y-auto">
            <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">{agreement}</pre>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => setAgreement(null)} className="text-muted-foreground">
              Regenerate
            </Button>
            <Button variant="outline" onClick={downloadAgreement} className="rounded-xl gap-2">
              <Download className="w-4 h-4" /> Download Agreement
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
