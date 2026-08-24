import { round2 } from "./money";

export type MortgageInput = {
  housePrice: number;
  depositPercent: number;
  annualRatePercent: number;
  termYears: number;
};

export type MortgageResult = {
  deposit: number;
  loan: number;
  monthlyRepayment: number;
};

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const deposit = (input.housePrice * input.depositPercent) / 100;
  const loan = Math.max(0, input.housePrice - deposit);
  const n = Math.max(1, Math.round(input.termYears * 12));
  const r = input.annualRatePercent / 100 / 12;

  let monthlyRepayment: number;
  if (loan === 0) {
    monthlyRepayment = 0;
  } else if (r === 0) {
    monthlyRepayment = loan / n;
  } else {
    monthlyRepayment = (loan * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  }

  return {
    deposit: round2(deposit),
    loan: round2(loan),
    monthlyRepayment: round2(monthlyRepayment),
  };
}
