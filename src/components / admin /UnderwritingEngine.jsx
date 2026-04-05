import { base44 } from '@/api/base44Client';

const UNDERWRITING_PROMPT = `You are "Credvin Underwriting AI", a highly strict, real-time, production-grade credit decision engine.
Your job is to instantly evaluate loan applications using KYC, Bureau, Banking, and Fraud signals and return a FINAL DECISION.
You MUST strictly follow Credvin Instant Credit Underwriting Policy Version 1.0.

UNDERWRITING POLICY:
STEP 1 - KYC VALIDATION: IF pan_status != valid OR aadhaar_status != valid → REJECT with "KYC verification failed"
STEP 2 - FRAUD ENGINE: Flag FRAUD if same PAN used across multiple device_ids, name mismatch, suspicious IP, fake salary pattern, bank statement manipulation. IF fraud_flag=HIGH → REJECT "High fraud risk detected"
STEP 3 - LOAN AMOUNT: IF requested_amount > 150000 → mark REFER "High ticket size requires manual underwriting"
STEP 4 - AUTO REJECTION if ANY: cibil_score < 650, dpd_last_6_months > 0, dpd_24_months_over_15_days > 2, loan_enquiries_6m > 5, written_off_amount > 10000, overdue_amount > 5000, average_bank_balance < (1.5 × emi)
STEP 5 - NEW TO CREDIT: IF cibil_score == -1 or 0: IF ABB >= 2×emi → APPROVE else REJECT
STEP 6 - BANKING SCORE (0-100): ABB strength 40%, salary stability 30%, EMI burden 20%, bounce behavior 10%
STEP 7 - RISK SCORE: risk_score = (0.4 × normalized_cibil) + (0.4 × banking_score) + (0.2 × fraud_score_inverse) where normalized_cibil = (cibil_score/900)×100
STEP 8 - ELIGIBLE EMI = 30% of monthly_salary. If salary=0, use 20% of ABB
STEP 9 - FINAL DECISION: If all conditions met AND amount<=150000 → APPROVE. If risk_score>=80 → APPROVE. If risk_score 60-79 → REFER. Else → REJECT
STEP 10 - SMART OFFER: If requested > eligibility, offer lower approved_amount = min(requested, eligibility_based_amount)

You will receive application data and must return a strict JSON decision.`;

export async function runUnderwritingEngine(application) {
  const monthlyIncome = application.monthly_income || 0;
  const loanAmount = application.loan_amount || 0;
  const tenure = application.tenure_months || 12;
  const estimatedEmi = loanAmount > 0 ? Math.round((loanAmount / tenure) * 1.12) : 0;

  // Build input payload from available application data
  // Since we don't have real bureau/banking data, we simulate based on what we have
  const inputPayload = {
    kyc: {
      name: application.full_name,
      pan: "available",
      aadhaar_masked: "available",
      pan_status: application.pan_url ? "valid" : "invalid",
      aadhaar_status: application.aadhaar_url ? "valid" : "invalid"
    },
    bureau: {
      cibil_score: 720, // Default assumption for new applications
      dpd_last_6_months: 0,
      dpd_24_months_over_15_days: 0,
      loan_enquiries_6m: 1,
      written_off_amount: 0,
      overdue_amount: 0,
      active_loans: 1
    },
    banking: {
      average_bank_balance: application.bank_statement_url ? (monthlyIncome * 1.8) : (monthlyIncome * 1.2),
      monthly_salary: monthlyIncome,
      salary_detected: application.employment_type === 'salaried' && !!application.payslip_url,
      emi_obligations: estimatedEmi * 0.3,
      bounce_count: 0,
      cashflow_stability: monthlyIncome > 30000 ? "strong" : monthlyIncome > 15000 ? "moderate" : "weak"
    },
    loan: {
      requested_amount: loanAmount,
      tenure_months: tenure,
      emi: estimatedEmi
    },
    device: {
      ip: "verified",
      device_id: application.id,
      location: "India"
    },
    applicant_profile: {
      employment_type: application.employment_type,
      loan_type: application.loan_type,
      has_bank_statement: !!application.bank_statement_url,
      has_payslip: !!application.payslip_url,
      has_itr: !!application.itr_url,
      has_selfie: !!application.selfie_url
    }
  };

  const prompt = `${UNDERWRITING_PROMPT}

APPLICATION DATA:
${JSON.stringify(inputPayload, null, 2)}

Evaluate this application strictly per policy. Return ONLY valid JSON matching this schema exactly:
{
  "decision": "APPROVE or REJECT or REFER",
  "confidence_score": number 0-100,
  "risk_score": number 0-100,
  "approved_amount": number,
  "eligible_emi": number,
  "kyc_status": "verified or rejected",
  "fraud_flag": boolean,
  "reasons": ["array of reason strings"],
  "risk_flags": ["array of risk flag strings"],
  "bureau_summary": {"cibil": "string", "dpd_status": "string", "enquiries": "string", "overdue": "string", "written_off": "string"},
  "bank_summary": {"abb": "string", "salary_detected": boolean, "cashflow": "string"}
}`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: "object",
      properties: {
        decision: { type: "string" },
        confidence_score: { type: "number" },
        risk_score: { type: "number" },
        approved_amount: { type: "number" },
        eligible_emi: { type: "number" },
        kyc_status: { type: "string" },
        fraud_flag: { type: "boolean" },
        reasons: { type: "array", items: { type: "string" } },
        risk_flags: { type: "array", items: { type: "string" } },
        bureau_summary: { type: "object" },
        bank_summary: { type: "object" }
      }
    }
  });

  return result;
}
