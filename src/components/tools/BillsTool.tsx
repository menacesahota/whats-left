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
import { btnGhost, btnSecondary, cardClass } from "@/components/ui";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  type Frequency,
  FREQUENCY_LABELS,
  toMonthly,
  toYearly,
} from "@/lib/frequency";
import { SITE_NAME } from "@/lib/brand";
import { formatGBP, newId, parseAmount, round2, toNumber } from "@/lib/money";
import { STORAGE_KEYS } from "@/lib/storage";

type BillRow = {
  id: string;
  name: string;
  amount: string;
  frequency: Frequency;
};

type BillsState = {
  bills: BillRow[];
};

const emptyBill = (): BillRow => ({
  id: newId(),
  name: "",
  amount: "",
  frequency: "monthly",
});

const initial: BillsState = {
  bills: [{ id: "bill-0", name: "", amount: "", frequency: "monthly" }],
};

const demo = (): BillsState => ({
  bills: [
    { id: newId(), name: "Travel card", amount: "35", frequency: "weekly" },
    { id: newId(), name: "Gym", amount: "25", frequency: "monthly" },
    { id: newId(), name: "Council tax", amount: "145", frequency: "monthly" },
    { id: newId(), name: "Haircut", amount: "40", frequency: "quarterly" },
    { id: newId(), name: "Car insurance", amount: "480", frequency: "yearly" },
    { id: newId(), name: "Streaming", amount: "15.99", frequency: "monthly" },
  ],
});

function validAmount(raw: string, allowEmpty = true): boolean {
  if (raw.trim() === "") return allowEmpty;
  const n = parseAmount(raw);
  return n !== null && Number.isFinite(n) && n >= 0;
}

export function BillsTool() {
  const [state, setState] = usePersistentState<BillsState>(
    STORAGE_KEYS.bills,
    initial,
  );
  const [copied, setCopied] = useState(false);

  function updateBill(id: string, patch: Partial<BillRow>) {
    setState({
      bills: state.bills.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });
  }

  const rows = useMemo(() => {
    const result: {
      name: string;
      monthly: number;
      yearly: number;
    }[] = [];
    for (const bill of state.bills) {
      if (!bill.name.trim() && bill.amount.trim() === "") continue;
      if (!bill.name.trim() || !validAmount(bill.amount, false)) return null;
      const amount = toNumber(bill.amount);
      result.push({
        name: bill.name.trim(),
        monthly: round2(toMonthly(amount, bill.frequency)),
        yearly: round2(toYearly(amount, bill.frequency)),
      });
    }
    return result;
  }, [state.bills]);

  const totals = rows
    ? {
        monthly: round2(rows.reduce((s, r) => s + r.monthly, 0)),
        yearly: round2(rows.reduce((s, r) => s + r.yearly, 0)),
      }
    : null;

  const tableText =
    rows && totals
      ? [
          "Bill\tMonthly\tYearly",
          ...rows.map(
            (r) => `${r.name}\t${formatGBP(r.monthly)}\t${formatGBP(r.yearly)}`,
          ),
          `Total\t${formatGBP(totals.monthly)}\t${formatGBP(totals.yearly)}`,
        ].join("\n")
      : "";

  async function copyTable() {
    if (!tableText) return;
    await navigator.clipboard.writeText(tableText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const emailBody = tableText
    ? `${SITE_NAME} bills converter\n\n${tableText.replace(/\t/g, " | ")}\n\nEstimate only. Not financial advice.`
    : "";

  return (
    <ToolShell
      title="Bills converter"
      description="Stop lying to yourself about yearly bills. Put each one in at the frequency you actually pay, and see the monthly and yearly truth."
      onDemo={() => setState(demo())}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className={`${cardClass} space-y-4`}
          onSubmit={(e) => e.preventDefault()}
        >
          {state.bills.map((bill, index) => (
            <div
              key={bill.id}
              className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_7rem_9rem_auto] sm:items-end"
            >
              <TextField
                id={`${bill.id}-name`}
                label={index === 0 ? "Name" : `Bill ${index + 1} name`}
                value={bill.name}
                onChange={(name) => updateBill(bill.id, { name })}
              />
              <NumberField
                id={`${bill.id}-amount`}
                label="Amount"
                prefix="£"
                value={bill.amount}
                onChange={(amount) => updateBill(bill.id, { amount })}
                error={
                  bill.amount.trim() !== "" && !validAmount(bill.amount, false)
                    ? "£0 or more"
                    : undefined
                }
              />
              <SelectField
                id={`${bill.id}-freq`}
                label="How often"
                value={bill.frequency}
                onChange={(frequency) =>
                  updateBill(bill.id, { frequency: frequency as Frequency })
                }
              >
                {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((freq) => (
                  <option key={freq} value={freq}>
                    {FREQUENCY_LABELS[freq]}
                  </option>
                ))}
              </SelectField>
              <button
                type="button"
                className={`${btnGhost} h-10`}
                onClick={() =>
                  setState({
                    bills:
                      state.bills.filter((b) => b.id !== bill.id).length > 0
                        ? state.bills.filter((b) => b.id !== bill.id)
                        : [emptyBill()],
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setState({ bills: [...state.bills, emptyBill()] })}
          >
            Add a bill
          </button>
        </form>

        <ResultPanel>
          {rows && totals && rows.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Each bill as a monthly and yearly amount
                  </caption>
                  <thead>
                    <tr className="border-b border-border text-muted">
                      <th className="py-1 pr-2 font-medium">Bill</th>
                      <th className="py-1 pr-2 font-medium">Monthly</th>
                      <th className="py-1 font-medium">Yearly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={`${row.name}-${index}`} className="border-b border-border">
                        <td className="py-1 pr-2">{row.name}</td>
                        <td className="py-1 pr-2">{formatGBP(row.monthly)}</td>
                        <td className="py-1">{formatGBP(row.yearly)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <dl className="mt-4">
                <ResultRow
                  label="Total monthly"
                  value={formatGBP(totals.monthly)}
                  emphasise
                />
                <ResultRow
                  label="Total yearly"
                  value={formatGBP(totals.yearly)}
                />
              </dl>
              <button
                type="button"
                className={`${btnSecondary} no-print mt-4`}
                onClick={copyTable}
              >
                {copied ? "Copied" : "Copy table"}
              </button>
            </>
          ) : (
            <EmptyResult message="Add bills with a name and amount, or try the demo numbers." />
          )}
        </ResultPanel>
      </div>
      <EmailCta
        subject={`${SITE_NAME} bills converter`}
        body={emailBody}
        disabled={!rows || rows.length === 0}
      />
    </ToolShell>
  );
}
