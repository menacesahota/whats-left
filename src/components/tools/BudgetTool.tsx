"use client";

import Link from "next/link";
import { useMemo } from "react";
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
  type SimpleFrequency,
  FREQUENCY_LABELS,
  toMonthly,
} from "@/lib/frequency";
import { SITE_NAME } from "@/lib/brand";
import { formatGBP, newId, parseAmount, round2, toNumber } from "@/lib/money";
import { STORAGE_KEYS } from "@/lib/storage";

type BillRow = {
  id: string;
  name: string;
  amount: string;
  frequency: SimpleFrequency;
};

type BudgetState = {
  takeHome: string;
  bills: BillRow[];
  food: string;
  transport: string;
  fun: string;
};

const emptyBill = (): BillRow => ({
  id: newId(),
  name: "",
  amount: "",
  frequency: "monthly",
});

const initial: BudgetState = {
  takeHome: "",
  bills: [{ id: "bill-0", name: "", amount: "", frequency: "monthly" }],
  food: "",
  transport: "",
  fun: "",
};

const demo = (): BudgetState => ({
  takeHome: "2400",
  bills: [
    { id: newId(), name: "Rent", amount: "850", frequency: "monthly" },
    { id: newId(), name: "Council tax", amount: "140", frequency: "monthly" },
    { id: newId(), name: "Energy", amount: "120", frequency: "monthly" },
    { id: newId(), name: "Phone", amount: "20", frequency: "monthly" },
    { id: newId(), name: "Water", amount: "420", frequency: "yearly" },
  ],
  food: "350",
  transport: "120",
  fun: "150",
});

function validAmount(raw: string, allowEmpty = true): boolean {
  if (raw.trim() === "") return allowEmpty;
  const n = parseAmount(raw);
  return n !== null && Number.isFinite(n) && n >= 0;
}

export function BudgetTool() {
  const [state, setState] = usePersistentState<BudgetState>(
    STORAGE_KEYS.budget,
    initial,
  );

  function update<K extends keyof BudgetState>(key: K, value: BudgetState[K]) {
    setState({ ...state, [key]: value });
  }

  function updateBill(id: string, patch: Partial<BillRow>) {
    update(
      "bills",
      state.bills.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  }

  const takeHomeError =
    state.takeHome.trim() === ""
      ? undefined
      : validAmount(state.takeHome, false)
        ? undefined
        : "Take-home must be £0 or more.";

  const formValid = validAmount(state.takeHome, false) && !takeHomeError;

  const result = useMemo(() => {
    if (!formValid) return null;
    const takeHome = toNumber(state.takeHome);
    let billsMonthly = 0;
    for (const bill of state.bills) {
      if (!bill.name.trim() && bill.amount.trim() === "") continue;
      if (!validAmount(bill.amount, false)) return null;
      billsMonthly += toMonthly(toNumber(bill.amount), bill.frequency);
    }
    if (!validAmount(state.food) || !validAmount(state.transport) || !validAmount(state.fun)) {
      return null;
    }
    const spending =
      toNumber(state.food) + toNumber(state.transport) + toNumber(state.fun);
    const leftover = takeHome - billsMonthly - spending;
    const billsShare = takeHome > 0 ? (billsMonthly / takeHome) * 100 : 0;
    return {
      takeHome,
      billsMonthly: round2(billsMonthly),
      spending: round2(spending),
      leftover: round2(leftover),
      billsShare: round2(billsShare),
    };
  }, [formValid, state]);

  const emailBody = result
    ? [
        `${SITE_NAME} monthly budget`,
        `Take-home: ${formatGBP(result.takeHome)}`,
        `Bills (monthly): ${formatGBP(result.billsMonthly)}`,
        `Spending: ${formatGBP(result.spending)}`,
        `Leftover: ${formatGBP(result.leftover)}`,
        `Bills as % of income: ${result.billsShare.toFixed(1)}%`,
        "",
        "Estimate only. Not financial advice.",
      ].join("\n")
    : "";

  const barWidth = result ? Math.min(100, result.billsShare) : 0;

  return (
    <ToolShell
      title="Monthly budget"
      description="Add bills at whatever frequency they actually arrive, then see what is left after food, transport and fun."
      onDemo={() => setState(demo())}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className={`${cardClass} space-y-5`}
          onSubmit={(e) => e.preventDefault()}
        >
          <NumberField
            id="take-home"
            label="Monthly take-home"
            prefix="£"
            value={state.takeHome}
            onChange={(takeHome) => update("takeHome", takeHome)}
            hint="Paste the monthly figure from the take-home pay tool if you like."
            error={takeHomeError}
          />
          <p className="text-sm text-muted">
            Need a take-home figure first?{" "}
            <Link href="/tools/take-home" className="font-medium text-accent">
              Open the take-home pay tool
            </Link>
            .
          </p>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Bills</legend>
            {state.bills.map((bill, index) => (
              <div
                key={bill.id}
                className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_7rem_8rem_auto] sm:items-end"
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
                    updateBill(bill.id, {
                      frequency: frequency as SimpleFrequency,
                    })
                  }
                >
                  <option value="weekly">{FREQUENCY_LABELS.weekly}</option>
                  <option value="monthly">{FREQUENCY_LABELS.monthly}</option>
                  <option value="yearly">{FREQUENCY_LABELS.yearly}</option>
                </SelectField>
                <button
                  type="button"
                  className={`${btnGhost} mb-0.5 h-10`}
                  onClick={() =>
                    update(
                      "bills",
                      state.bills.filter((b) => b.id !== bill.id).length
                        ? state.bills.filter((b) => b.id !== bill.id)
                        : [emptyBill()],
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={btnSecondary}
              onClick={() => update("bills", [...state.bills, emptyBill()])}
            >
              Add a bill
            </button>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-3">
            <NumberField
              id="food"
              label="Food"
              prefix="£"
              value={state.food}
              onChange={(food) => update("food", food)}
              hint="Monthly"
            />
            <NumberField
              id="transport"
              label="Transport"
              prefix="£"
              value={state.transport}
              onChange={(transport) => update("transport", transport)}
            />
            <NumberField
              id="fun"
              label="Fun"
              prefix="£"
              value={state.fun}
              onChange={(fun) => update("fun", fun)}
            />
          </div>
        </form>

        <ResultPanel
          warning={
            result && result.leftover < 0
              ? "Leftover is negative. Bills and spending are higher than take-home."
              : undefined
          }
        >
          {result ? (
            <>
              <dl>
                <ResultRow
                  label="Bills (monthly)"
                  value={formatGBP(result.billsMonthly)}
                />
                <ResultRow
                  label="Spending"
                  value={formatGBP(result.spending)}
                />
                <ResultRow
                  label="Leftover"
                  value={formatGBP(result.leftover)}
                  emphasise
                />
                <ResultRow
                  label="Income on bills"
                  value={`${result.billsShare.toFixed(1)}%`}
                />
              </dl>
              <div className="mt-4">
                <p className="mb-1 text-sm text-muted">Bills as a share of take-home</p>
                <div
                  className="h-3 overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(result.billsShare)}
                  aria-label="Bills as a percentage of take-home"
                >
                  <div
                    className={`h-full ${result.leftover < 0 ? "bg-danger" : "bg-accent"}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <EmptyResult message="Enter monthly take-home, or try the demo numbers." />
          )}
        </ResultPanel>
      </div>
      <EmailCta
        subject={`${SITE_NAME} monthly budget`}
        body={emailBody}
        disabled={!result}
      />
    </ToolShell>
  );
}
