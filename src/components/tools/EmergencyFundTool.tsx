"use client";

import Link from "next/link";
import { useState } from "react";
import { EmailCta } from "@/components/EmailCta";
import { NumberField } from "@/components/fields";
import {
  EmptyResult,
  ResultPanel,
  ResultRow,
} from "@/components/ResultPanel";
import { ToolShell } from "@/components/ToolShell";
import { btnSecondary, cardClass } from "@/components/ui";
import { type SimpleFrequency, toMonthly } from "@/lib/frequency";
import { SITE_NAME } from "@/lib/brand";
import { formatGBP, parseAmount, round2, toNumber } from "@/lib/money";
import { loadJson, STORAGE_KEYS } from "@/lib/storage";

type BudgetStored = {
  bills?: { amount: string; frequency: SimpleFrequency }[];
  food?: string;
  transport?: string;
  fun?: string;
};

type TargetChoice = "3" | "6" | "custom";

function budgetEssentials(): number | null {
  const stored = loadJson<BudgetStored>(STORAGE_KEYS.budget);
  if (!stored) return null;
  let bills = 0;
  for (const bill of stored.bills ?? []) {
    const n = parseAmount(bill.amount);
    if (n === null || !Number.isFinite(n) || n < 0) continue;
    bills += toMonthly(n, bill.frequency);
  }
  const spending =
    toNumber(stored.food ?? "") +
    toNumber(stored.transport ?? "") +
    toNumber(stored.fun ?? "");
  const total = bills + spending;
  return total > 0 ? round2(total) : null;
}

function validAmount(raw: string, allowEmpty = true): boolean {
  if (raw.trim() === "") return allowEmpty;
  const n = parseAmount(raw);
  return n !== null && Number.isFinite(n) && n >= 0;
}

export function EmergencyFundTool() {
  const [savings, setSavings] = useState("");
  const [essentials, setEssentials] = useState("");
  const [target, setTarget] = useState<TargetChoice>("6");
  const [customMonths, setCustomMonths] = useState("9");
  const [budgetHint, setBudgetHint] = useState<string | null>(null);

  function loadDemo() {
    setSavings("1200");
    setEssentials("1800");
    setTarget("6");
    setCustomMonths("9");
    setBudgetHint(null);
  }

  function useBudgetTotal() {
    const total = budgetEssentials();
    if (total === null) {
      setBudgetHint("No saved budget found. Fill in the budget tool first.");
      return;
    }
    setEssentials(String(total));
    setBudgetHint(`Using ${formatGBP(total)} from your last budget (bills + spending).`);
  }

  const savingsError =
    savings.trim() !== "" && !validAmount(savings, false)
      ? "Savings must be £0 or more."
      : undefined;
  const essentialsError =
    essentials.trim() !== "" && !validAmount(essentials, false)
      ? "Essential costs must be £0 or more."
      : undefined;
  const customError =
    target === "custom" &&
    customMonths.trim() !== "" &&
    (!validAmount(customMonths, false) || toNumber(customMonths) < 1)
      ? "Enter at least 1 month."
      : undefined;

  const months =
    target === "custom" ? toNumber(customMonths) : Number(target);
  const ready =
    validAmount(savings, false) &&
    validAmount(essentials, false) &&
    months >= 1 &&
    !savingsError &&
    !essentialsError &&
    !customError;

  const savingsN = toNumber(savings);
  const essentialsN = toNumber(essentials);
  const runway = ready && essentialsN > 0 ? savingsN / essentialsN : ready ? Infinity : null;
  const targetAmount = ready ? essentialsN * months : null;
  const gap =
    targetAmount !== null ? Math.max(0, targetAmount - savingsN) : null;

  const emailBody =
    ready && targetAmount !== null && gap !== null
      ? [
          `${SITE_NAME} emergency fund`,
          `Savings: ${formatGBP(savingsN)}`,
          `Essential monthly costs: ${formatGBP(essentialsN)}`,
          `Runway now: ${essentialsN === 0 ? "n/a" : `${runway!.toFixed(1)} months`}`,
          `Target (${months} months): ${formatGBP(targetAmount)}`,
          `Gap: ${formatGBP(gap)}`,
          `To close the gap in 6 months: ${formatGBP(gap / 6)} / month`,
          `To close the gap in 12 months: ${formatGBP(gap / 12)} / month`,
          "",
          "Estimate only. Not financial advice.",
        ].join("\n")
      : "";

  return (
    <ToolShell
      title="Emergency fund"
      description="How many months of essential costs your savings would cover, and what to put aside to hit a 3 or 6 month target."
      onDemo={loadDemo}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className={`${cardClass} space-y-5`}
          onSubmit={(e) => e.preventDefault()}
        >
          <NumberField
            id="savings"
            label="Current savings"
            prefix="£"
            value={savings}
            onChange={setSavings}
            error={savingsError}
          />
          <NumberField
            id="essentials"
            label="Essential monthly costs"
            prefix="£"
            value={essentials}
            onChange={setEssentials}
            hint="Rent, bills, food — the amount you would still need if work stopped."
            error={essentialsError}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={btnSecondary} onClick={useBudgetTotal}>
              Use last budget total
            </button>
            <Link href="/tools/budget" className="text-sm font-medium text-accent">
              Open budget tool
            </Link>
          </div>
          {budgetHint ? <p className="text-sm text-muted">{budgetHint}</p> : null}

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Target months</legend>
            <div className="flex flex-wrap gap-3">
              {(["3", "6", "custom"] as TargetChoice[]).map((choice) => (
                <label key={choice} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="target"
                    checked={target === choice}
                    onChange={() => setTarget(choice)}
                  />
                  {choice === "custom" ? "Custom" : `${choice} months`}
                </label>
              ))}
            </div>
          </fieldset>
          {target === "custom" ? (
            <NumberField
              id="custom-months"
              label="Custom target (months)"
              value={customMonths}
              onChange={setCustomMonths}
              min={1}
              step="1"
              error={customError}
            />
          ) : null}
        </form>

        <ResultPanel>
          {ready && targetAmount !== null && gap !== null && runway !== null ? (
            <dl>
              <ResultRow
                label="Runway now"
                value={
                  essentialsN === 0
                    ? "No essential costs entered"
                    : `${runway.toFixed(1)} months`
                }
                emphasise
              />
              <ResultRow
                label={`Target (${months} months)`}
                value={formatGBP(targetAmount)}
              />
              <ResultRow label="Gap to target" value={formatGBP(gap)} />
              <ResultRow
                label="Save over 6 months"
                value={`${formatGBP(gap / 6)} / month`}
              />
              <ResultRow
                label="Save over 12 months"
                value={`${formatGBP(gap / 12)} / month`}
              />
            </dl>
          ) : (
            <EmptyResult message="Enter savings and essential costs, or try the demo numbers." />
          )}
        </ResultPanel>
      </div>
      <EmailCta
        subject={`${SITE_NAME} emergency fund`}
        body={emailBody}
        disabled={!ready}
      />
    </ToolShell>
  );
}
