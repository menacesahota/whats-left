import { round2 } from "./money";

export type DebtInput = {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
};

export type PayoffMethod = "avalanche" | "snowball";

export type MonthLine = {
  name: string;
  payment: number;
  balance: number;
};

export type MonthSnapshot = {
  month: number;
  interest: number;
  remaining: number;
  lines: MonthLine[];
};

export type PayoffResult = {
  order: string[];
  monthsToClear: number;
  totalInterest: number;
  snapshots: MonthSnapshot[];
  cleared: boolean;
};

const MAX_MONTHS = 600;
const EPS = 0.005;

function pickTarget(
  debts: DebtInput[],
  method: PayoffMethod,
): DebtInput | undefined {
  const active = debts.filter((d) => d.balance > EPS);
  if (active.length === 0) return undefined;
  if (method === "avalanche") {
    return [...active].sort(
      (a, b) => b.apr - a.apr || a.balance - b.balance,
    )[0];
  }
  return [...active].sort(
    (a, b) => a.balance - b.balance || b.apr - a.apr,
  )[0];
}

export function calculatePayoff(
  debts: DebtInput[],
  method: PayoffMethod,
  extraMonthly: number,
): PayoffResult {
  const state: DebtInput[] = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d }));
  const recommended = [...state]
    .sort((a, b) =>
      method === "avalanche"
        ? b.apr - a.apr || a.balance - b.balance
        : a.balance - b.balance || b.apr - a.apr,
    )
    .map((d) => d.name);
  const history: MonthSnapshot[] = [];
  let totalInterest = 0;
  let month = 0;

  const markCleared = (debt: DebtInput) => {
    if (debt.balance <= EPS) debt.balance = 0;
  };

  while (state.some((d) => d.balance > EPS) && month < MAX_MONTHS) {
    month += 1;
    let monthInterest = 0;

    for (const debt of state) {
      if (debt.balance <= EPS) continue;
      const interest = debt.balance * (debt.apr / 100 / 12);
      debt.balance += interest;
      monthInterest += interest;
      totalInterest += interest;
    }

    const payments = new Map<string, number>();
    let leftover = Math.max(0, extraMonthly);

    for (const debt of state) {
      if (debt.balance <= EPS) continue;
      const pay = Math.min(debt.minPayment, debt.balance);
      debt.balance -= pay;
      leftover += Math.max(0, debt.minPayment - pay);
      payments.set(debt.id, (payments.get(debt.id) ?? 0) + pay);
      markCleared(debt);
    }

    while (leftover > EPS) {
      const target = pickTarget(state, method);
      if (!target) break;
      const pay = Math.min(leftover, target.balance);
      target.balance -= pay;
      leftover -= pay;
      payments.set(target.id, (payments.get(target.id) ?? 0) + pay);
      markCleared(target);
    }

    const remaining = state.reduce((sum, d) => sum + Math.max(0, d.balance), 0);
    history.push({
      month,
      interest: round2(monthInterest),
      remaining: round2(remaining),
      lines: state.map((d) => ({
        name: d.name,
        payment: round2(payments.get(d.id) ?? 0),
        balance: round2(Math.max(0, d.balance)),
      })),
    });
  }

  const cleared = !state.some((d) => d.balance > EPS);
  const snapshots: MonthSnapshot[] = [];
  if (history.length <= 7) {
    snapshots.push(...history);
  } else {
    snapshots.push(...history.slice(0, 6));
    snapshots.push(history[history.length - 1]);
  }

  return {
    order: recommended,
    monthsToClear: month,
    totalInterest: round2(totalInterest),
    snapshots,
    cleared,
  };
}
