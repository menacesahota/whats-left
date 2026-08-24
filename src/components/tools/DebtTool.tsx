"use client";

import { useMemo } from "react";
import { EmailCta } from "@/components/EmailCta";
import { NumberField, TextField } from "@/components/fields";
import {
  EmptyResult,
  ResultPanel,
  ResultRow,
} from "@/components/ResultPanel";
import { ToolShell } from "@/components/ToolShell";
import { btnGhost, btnSecondary, cardClass } from "@/components/ui";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  calculatePayoff,
  type DebtInput,
  type PayoffMethod,
} from "@/lib/debt";
import { SITE_NAME } from "@/lib/brand";
import { formatGBP, newId, parseAmount, toNumber } from "@/lib/money";
import { STORAGE_KEYS } from "@/lib/storage";

type DebtRow = {
  id: string;
  name: string;
  balance: string;
  apr: string;
  minPayment: string;
};

type DebtState = {
  debts: DebtRow[];
  method: PayoffMethod;
  extra: string;
};

const emptyDebt = (): DebtRow => ({
  id: newId(),
  name: "",
  balance: "",
  apr: "",
  minPayment: "",
});

const initial: DebtState = {
  debts: [
    {
      id: "debt-0",
      name: "",
      balance: "",
      apr: "",
      minPayment: "",
    },
  ],
  method: "avalanche",
  extra: "",
};

const demo = (): DebtState => ({
  method: "avalanche",
  extra: "100",
  debts: [
    {
      id: newId(),
      name: "Credit card",
      balance: "2400",
      apr: "24.9",
      minPayment: "60",
    },
    {
      id: newId(),
      name: "Car loan",
      balance: "6800",
      apr: "8.9",
      minPayment: "180",
    },
    {
      id: newId(),
      name: "Overdraft",
      balance: "650",
      apr: "39.9",
      minPayment: "20",
    },
  ],
});

function validAmount(raw: string, allowEmpty = true): boolean {
  if (raw.trim() === "") return allowEmpty;
  const n = parseAmount(raw);
  return n !== null && Number.isFinite(n) && n >= 0;
}

export function DebtTool() {
  const [state, setState] = usePersistentState<DebtState>(
    STORAGE_KEYS.debt,
    initial,
  );

  function updateDebt(id: string, patch: Partial<DebtRow>) {
    setState({
      ...state,
      debts: state.debts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    });
  }

  const extraError =
    state.extra.trim() !== "" && !validAmount(state.extra, false)
      ? "Extra payment must be £0 or more."
      : undefined;

  const parsedDebts: DebtInput[] | null = useMemo(() => {
    const active = state.debts.filter(
      (d) => d.name.trim() || d.balance.trim() || d.apr.trim() || d.minPayment.trim(),
    );
    if (active.length === 0) return null;
    const debts: DebtInput[] = [];
    for (const row of active) {
      if (!row.name.trim()) return null;
      if (
        !validAmount(row.balance, false) ||
        !validAmount(row.apr, false) ||
        !validAmount(row.minPayment, false)
      ) {
        return null;
      }
      const apr = toNumber(row.apr);
      if (apr > 100) return null;
      debts.push({
        id: row.id,
        name: row.name.trim(),
        balance: toNumber(row.balance),
        apr,
        minPayment: toNumber(row.minPayment),
      });
    }
    return debts.filter((d) => d.balance > 0);
  }, [state.debts]);

  const result =
    parsedDebts && parsedDebts.length > 0 && !extraError
      ? calculatePayoff(parsedDebts, state.method, toNumber(state.extra))
      : null;

  const emailBody = result
    ? [
        `${SITE_NAME} debt payoff (${state.method})`,
        `Order: ${result.order.join(" → ") || "—"}`,
        result.cleared
          ? `Months to clear: ${result.monthsToClear}`
          : "May not clear within 50 years at this payment rate.",
        `Estimated interest: ${formatGBP(result.totalInterest)}`,
        "",
        "Estimate only. Not financial advice.",
      ].join("\n")
    : "";

  return (
    <ToolShell
      title="Debt payoff"
      description="List each debt, pick avalanche (dearest interest first) or snowball (smallest balance first), and see a simple payoff path."
      onDemo={() => setState(demo())}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className={`${cardClass} space-y-5`}
          onSubmit={(e) => e.preventDefault()}
        >
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Method</legend>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="method"
                  checked={state.method === "avalanche"}
                  onChange={() => setState({ ...state, method: "avalanche" })}
                />
                Avalanche (highest APR first)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="method"
                  checked={state.method === "snowball"}
                  onChange={() => setState({ ...state, method: "snowball" })}
                />
                Snowball (smallest balance first)
              </label>
            </div>
          </fieldset>

          <NumberField
            id="extra"
            label="Extra monthly payment"
            prefix="£"
            value={state.extra}
            onChange={(extra) => setState({ ...state, extra })}
            hint="Optional amount on top of the minimums."
            error={extraError}
          />

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Debts</legend>
            {state.debts.map((debt, index) => (
              <div
                key={debt.id}
                className="space-y-2 rounded-lg border border-border p-3"
              >
                <TextField
                  id={`${debt.id}-name`}
                  label={`Debt ${index + 1} name`}
                  value={debt.name}
                  onChange={(name) => updateDebt(debt.id, { name })}
                />
                <div className="grid gap-2 sm:grid-cols-3">
                  <NumberField
                    id={`${debt.id}-balance`}
                    label="Balance"
                    prefix="£"
                    value={debt.balance}
                    onChange={(balance) => updateDebt(debt.id, { balance })}
                    error={
                      debt.balance.trim() !== "" &&
                      !validAmount(debt.balance, false)
                        ? "£0 or more"
                        : undefined
                    }
                  />
                  <NumberField
                    id={`${debt.id}-apr`}
                    label="APR"
                    suffix="%"
                    value={debt.apr}
                    onChange={(apr) => updateDebt(debt.id, { apr })}
                    error={
                      debt.apr.trim() !== "" &&
                      (!validAmount(debt.apr, false) || toNumber(debt.apr) > 100)
                        ? "0 to 100"
                        : undefined
                    }
                    max={100}
                    step="0.1"
                  />
                  <NumberField
                    id={`${debt.id}-min`}
                    label="Minimum"
                    prefix="£"
                    value={debt.minPayment}
                    onChange={(minPayment) =>
                      updateDebt(debt.id, { minPayment })
                    }
                    error={
                      debt.minPayment.trim() !== "" &&
                      !validAmount(debt.minPayment, false)
                        ? "£0 or more"
                        : undefined
                    }
                  />
                </div>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() =>
                    setState({
                      ...state,
                      debts:
                        state.debts.filter((d) => d.id !== debt.id).length > 0
                          ? state.debts.filter((d) => d.id !== debt.id)
                          : [emptyDebt()],
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
              onClick={() =>
                setState({ ...state, debts: [...state.debts, emptyDebt()] })
              }
            >
              Add a debt
            </button>
          </fieldset>
        </form>

        <ResultPanel
          warning={
            result && !result.cleared
              ? "At this rate these debts may not clear within 50 years. Check that payments cover the interest."
              : undefined
          }
        >
          {result ? (
            <>
              <dl>
                <ResultRow
                  label="Recommended order"
                  value={result.order.join(" → ") || "—"}
                />
                <ResultRow
                  label="Months to clear"
                  value={
                    result.cleared ? String(result.monthsToClear) : "50+ years"
                  }
                  emphasise
                />
                <ResultRow
                  label="Total interest (estimate)"
                  value={formatGBP(result.totalInterest)}
                />
              </dl>
              <h3 className="mt-5 text-sm font-medium">
                Month-by-month (first 6 and final)
              </h3>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Debt remaining after each month
                  </caption>
                  <thead>
                    <tr className="border-b border-border text-muted">
                      <th className="py-1 pr-2 font-medium">Month</th>
                      <th className="py-1 pr-2 font-medium">Interest</th>
                      <th className="py-1 font-medium">Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.snapshots.map((snap, i) => (
                      <tr key={`${snap.month}-${i}`} className="border-b border-border">
                        <td className="py-1 pr-2">
                          {i === result.snapshots.length - 1 &&
                          result.snapshots.length > 6 &&
                          snap.month > 6
                            ? `${snap.month} (final)`
                            : snap.month}
                        </td>
                        <td className="py-1 pr-2">{formatGBP(snap.interest)}</td>
                        <td className="py-1">{formatGBP(snap.remaining)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <EmptyResult message="Add at least one debt with a balance, or try the demo numbers." />
          )}
        </ResultPanel>
      </div>
      <EmailCta
        subject={`${SITE_NAME} debt payoff`}
        body={emailBody}
        disabled={!result}
      />
    </ToolShell>
  );
}
