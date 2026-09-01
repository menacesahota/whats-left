/**
 * UK PAYE estimate rates for the 2026/27 tax year (6 April 2026 – 5 April 2027).
 *
 * Update this file when HMRC publishes new bands. Sources:
 * - https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
 * - https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past
 *
 * This is an annualised estimate, not a PAYE period-by-period payroll run.
 */

import { round2 } from "./money";

export const TAX_YEAR = "2026/27";

export const PERSONAL_ALLOWANCE = 12_570;
export const PA_TAPER_THRESHOLD = 100_000;
export const ADDITIONAL_RATE_THRESHOLD = 125_140;
export const BASIC_RATE_BAND = 37_700;

export const NI_PRIMARY_THRESHOLD = 12_570;
export const NI_UPPER_EARNINGS_LIMIT = 50_270;
export const NI_MAIN_RATE = 0.08;
export const NI_UPPER_RATE = 0.02;

export type TaxRegion = "ruk" | "scotland";
export type StudentLoanPlan =
  | "none"
  | "plan1"
  | "plan2"
  | "plan4"
  | "plan5"
  | "postgrad";

export const STUDENT_LOAN_PLANS: Record<
  Exclude<StudentLoanPlan, "none">,
  { label: string; threshold: number; rate: number }
> = {
  plan1: { label: "Plan 1", threshold: 26_900, rate: 0.09 },
  plan2: { label: "Plan 2", threshold: 29_385, rate: 0.09 },
  plan4: { label: "Plan 4", threshold: 33_795, rate: 0.09 },
  plan5: { label: "Plan 5", threshold: 25_000, rate: 0.09 },
  postgrad: { label: "Postgraduate", threshold: 21_000, rate: 0.06 },
};

type TaxBand = {
  name: string;
  rate: number;
  /** Width of this band of taxable income (after personal allowance). */
  width?: number;
  /** This band runs until this amount of total income (not taxable income). */
  untilTotalIncome?: number;
};

/** England, Northern Ireland and Wales. */
const RUK_BANDS: TaxBand[] = [
  { name: "Basic", rate: 0.2, width: BASIC_RATE_BAND },
  { name: "Higher", rate: 0.4, untilTotalIncome: ADDITIONAL_RATE_THRESHOLD },
  { name: "Additional", rate: 0.45 },
];

/**
 * Scottish bands as widths above the personal allowance (GOV.UK employer tables),
 * with advanced/top using the £125,140 additional-rate threshold of total income.
 */
const SCOTLAND_BANDS: TaxBand[] = [
  { name: "Starter", rate: 0.19, width: 3_967 },
  { name: "Basic", rate: 0.2, width: 16_956 - 3_967 },
  { name: "Intermediate", rate: 0.21, width: 31_092 - 16_956 },
  { name: "Higher", rate: 0.42, width: 62_430 - 31_092 },
  { name: "Advanced", rate: 0.45, untilTotalIncome: ADDITIONAL_RATE_THRESHOLD },
  { name: "Top", rate: 0.48 },
];

export type TakeHomeInput = {
  annualGross: number;
  taxCode: string;
  region: TaxRegion;
  studentLoan: StudentLoanPlan;
  /** Percent of gross, modelled as salary sacrifice (reduces tax and NI). */
  pensionPercent: number;
};

export type TakeHomeResult = {
  taxYear: string;
  annualGross: number;
  personalAllowance: number;
  pension: number;
  taxablePay: number;
  incomeTax: number;
  employeeNI: number;
  studentLoan: number;
  annualTakeHome: number;
  monthlyTakeHome: number;
};

/** 1257L → £12,570. Only the leading number × 10 is used (K/BR/NT not supported). */
export function personalAllowanceFromTaxCode(taxCode: string): number | null {
  const trimmed = taxCode.trim().toUpperCase();
  const match = trimmed.match(/^(\d+)[A-Z]*$/);
  if (!match) return null;
  return Number(match[1]) * 10;
}

export function taperedPersonalAllowance(
  baseAllowance: number,
  income: number,
): number {
  if (income <= PA_TAPER_THRESHOLD) return baseAllowance;
  const reduction = Math.floor((income - PA_TAPER_THRESHOLD) / 2);
  return Math.max(0, baseAllowance - reduction);
}

function incomeTaxOn(
  income: number,
  personalAllowance: number,
  region: TaxRegion,
): number {
  const taxable = Math.max(0, income - personalAllowance);
  if (taxable === 0) return 0;

  const bands = region === "scotland" ? SCOTLAND_BANDS : RUK_BANDS;
  let remaining = taxable;
  let consumed = 0;
  let tax = 0;

  for (const band of bands) {
    if (remaining <= 0) break;

    let room: number;
    if (band.width !== undefined) {
      room = band.width;
    } else if (band.untilTotalIncome !== undefined) {
      room = Math.max(0, band.untilTotalIncome - personalAllowance - consumed);
    } else {
      room = remaining;
    }

    const slice = Math.min(remaining, room);
    tax += slice * band.rate;
    remaining -= slice;
    consumed += slice;
  }

  return tax;
}

export function employeeNI(earnings: number): number {
  if (earnings <= NI_PRIMARY_THRESHOLD) return 0;
  const mainBand =
    Math.min(earnings, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD;
  const upperBand = Math.max(0, earnings - NI_UPPER_EARNINGS_LIMIT);
  return mainBand * NI_MAIN_RATE + upperBand * NI_UPPER_RATE;
}

export function studentLoanRepayment(
  income: number,
  plan: StudentLoanPlan,
): number {
  if (plan === "none") return 0;
  const { threshold, rate } = STUDENT_LOAN_PLANS[plan];
  return Math.max(0, income - threshold) * rate;
}

export function annualGrossFromPeriod(
  amount: number,
  period: "annual" | "monthly" | "weekly",
): number {
  if (period === "annual") return amount;
  if (period === "monthly") return amount * 12;
  return amount * 52;
}

export function calculateTakeHome(input: TakeHomeInput): TakeHomeResult {
  const basePA =
    personalAllowanceFromTaxCode(input.taxCode) ?? PERSONAL_ALLOWANCE;
  const pensionPercent = Math.min(100, Math.max(0, input.pensionPercent));
  const pension = (input.annualGross * pensionPercent) / 100;
  const taxablePay = Math.max(0, input.annualGross - pension);
  const personalAllowance = taperedPersonalAllowance(basePA, taxablePay);

  const incomeTax = incomeTaxOn(taxablePay, personalAllowance, input.region);
  const ni = employeeNI(taxablePay);
  const loan = studentLoanRepayment(taxablePay, input.studentLoan);

  const annualTakeHome = Math.max(
    0,
    input.annualGross - pension - incomeTax - ni - loan,
  );

  return {
    taxYear: TAX_YEAR,
    annualGross: round2(input.annualGross),
    personalAllowance: round2(personalAllowance),
    pension: round2(pension),
    taxablePay: round2(taxablePay),
    incomeTax: round2(incomeTax),
    employeeNI: round2(ni),
    studentLoan: round2(loan),
    annualTakeHome: round2(annualTakeHome),
    monthlyTakeHome: round2(annualTakeHome / 12),
  };
}
