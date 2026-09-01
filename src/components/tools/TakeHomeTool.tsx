"use client";

import { useMemo, useState } from "react";
import { EmailCta } from "@/components/EmailCta";
import { NumberField, SelectField, TextField } from "@/components/fields";
import {
  EmptyResult,
  ResultPanel,
  ResultRow,
} from "@/components/ResultPanel";
import { ToolShell } from "@/components/ToolShell";
import { cardClass, choiceClass, choiceGroupClass } from "@/components/ui";
import { SITE_NAME } from "@/lib/brand";
import { formatGBP, parseAmount, toNumber } from "@/lib/money";
import {
  TAX_YEAR,
  annualGrossFromPeriod,
  calculateTakeHome,
  personalAllowanceFromTaxCode,
  STUDENT_LOAN_PLANS,
  type StudentLoanPlan,
  type TaxRegion,
} from "@/lib/uk-tax";

type Period = "annual" | "monthly" | "weekly";

const PERIOD_LABEL: Record<Period, string> = {
  annual: "Annual",
  monthly: "Monthly",
  weekly: "Weekly",
};

function convertGross(amount: string, from: Period, to: Period): string {
  if (amount.trim() === "") return amount;
  const n = parseAmount(amount);
  if (n === null || !Number.isFinite(n) || n < 0) return amount;
  const annual = annualGrossFromPeriod(n, from);
  if (to === "annual") return String(annual);
  if (to === "monthly") return String(Math.round((annual / 12) * 100) / 100);
  return String(Math.round((annual / 52) * 100) / 100);
}

export function TakeHomeTool() {
  const [period, setPeriod] = useState<Period>("annual");
  const [gross, setGross] = useState("");
  const [taxCode, setTaxCode] = useState("1257L");
  const [region, setRegion] = useState<TaxRegion>("ruk");
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>("none");
  const [pension, setPension] = useState("");

  function loadDemo() {
    setPeriod("annual");
    setGross("35000");
    setTaxCode("1257L");
    setRegion("ruk");
    setStudentLoan("none");
    setPension("5");
  }

  const errors = useMemo(() => {
    const next: { gross?: string; taxCode?: string; pension?: string } = {};
    if (gross.trim() === "") {
      next.gross = "Enter your gross salary.";
    } else {
      const n = parseAmount(gross);
      if (n === null || !Number.isFinite(n) || n < 0) {
        next.gross = "Salary must be £0 or more.";
      }
    }
    if (!personalAllowanceFromTaxCode(taxCode)) {
      next.taxCode = "Use a code like 1257L. Emergency codes such as BR are not supported.";
    }
    if (pension.trim() !== "") {
      const n = parseAmount(pension);
      if (n === null || !Number.isFinite(n) || n < 0 || n > 100) {
        next.pension = "Pension must be between 0 and 100.";
      }
    }
    return next;
  }, [gross, taxCode, pension]);

  const result =
    !errors.gross && !errors.taxCode && !errors.pension
      ? calculateTakeHome({
          annualGross: annualGrossFromPeriod(toNumber(gross), period),
          taxCode,
          region,
          studentLoan,
          pensionPercent: toNumber(pension),
        })
      : null;

  const emailBody = result
    ? [
        `${SITE_NAME} take-home estimate (${result.taxYear})`,
        `Gross (annual): ${formatGBP(result.annualGross)}`,
        `Pension (salary sacrifice): ${formatGBP(result.pension)}`,
        `Income tax: ${formatGBP(result.incomeTax)}`,
        `Employee NI: ${formatGBP(result.employeeNI)}`,
        `Student loan: ${formatGBP(result.studentLoan)}`,
        `Annual take-home: ${formatGBP(result.annualTakeHome)}`,
        `Monthly take-home: ${formatGBP(result.monthlyTakeHome)}`,
        "",
        "Estimate only. Not financial advice.",
      ].join("\n")
    : "";

  return (
    <ToolShell
      title="Take-home pay"
      description={`Estimate monthly pay after income tax, employee National Insurance, student loan and pension. Figures are an estimate for the ${TAX_YEAR} tax year.`}
      onDemo={loadDemo}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className={`${cardClass} space-y-5`}
          onSubmit={(e) => e.preventDefault()}
        >
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Salary period</legend>
            <div className={choiceGroupClass}>
              {(Object.keys(PERIOD_LABEL) as Period[]).map((p) => (
                <label key={p} className={choiceClass(period === p)}>
                  <input
                    type="radio"
                    name="period"
                    className="sr-only"
                    checked={period === p}
                    onChange={() => {
                      setGross((current) => convertGross(current, period, p));
                      setPeriod(p);
                    }}
                  />
                  {PERIOD_LABEL[p]}
                </label>
              ))}
            </div>
          </fieldset>

          <NumberField
            id="gross"
            label={`${PERIOD_LABEL[period]} gross salary`}
            prefix="£"
            value={gross}
            onChange={setGross}
            error={gross.trim() === "" ? undefined : errors.gross}
          />

          <TextField
            id="tax-code"
            label="Tax code"
            value={taxCode}
            onChange={setTaxCode}
            hint="Default 1257L. We use the number × 10 as your personal allowance."
            error={errors.taxCode}
            autoCapitalize="characters"
          />

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Tax bands</legend>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="region"
                  checked={region === "ruk"}
                  onChange={() => setRegion("ruk")}
                />
                England, Northern Ireland and Wales
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="region"
                  checked={region === "scotland"}
                  onChange={() => setRegion("scotland")}
                />
                Scotland
              </label>
            </div>
          </fieldset>

          <SelectField
            id="student-loan"
            label="Student loan plan"
            value={studentLoan}
            onChange={(v) => setStudentLoan(v as StudentLoanPlan)}
          >
            <option value="none">None</option>
            {Object.entries(STUDENT_LOAN_PLANS).map(([key, plan]) => (
              <option key={key} value={key}>
                {plan.label} — {Math.round(plan.rate * 100)}% above{" "}
                {formatGBP(plan.threshold)}
              </option>
            ))}
          </SelectField>

          <NumberField
            id="pension"
            label="Pension contribution"
            suffix="%"
            value={pension}
            onChange={setPension}
            hint="Optional. Treated as salary sacrifice, so it reduces tax and NI."
            error={errors.pension}
            max={100}
            step="0.1"
          />
        </form>

        <ResultPanel title={`Estimate for ${TAX_YEAR} tax year`}>
          {result ? (
            <dl>
              <ResultRow
                label="Monthly take-home"
                value={formatGBP(result.monthlyTakeHome)}
                emphasise
              />
              <ResultRow
                label="Annual take-home"
                value={formatGBP(result.annualTakeHome)}
              />
              <ResultRow label="Income tax" value={formatGBP(result.incomeTax)} />
              <ResultRow
                label="Employee NI"
                value={formatGBP(result.employeeNI)}
              />
              <ResultRow
                label="Student loan"
                value={formatGBP(result.studentLoan)}
              />
              <ResultRow label="Pension" value={formatGBP(result.pension)} />
            </dl>
          ) : (
            <EmptyResult message="Enter a salary, or try the demo numbers, to see take-home pay." />
          )}
        </ResultPanel>
      </div>
      <EmailCta
        subject={`${SITE_NAME} take-home estimate (${TAX_YEAR})`}
        body={emailBody}
        disabled={!result}
      />
    </ToolShell>
  );
}
