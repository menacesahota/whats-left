export type Frequency =
  | "weekly"
  | "fourWeekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export type SimpleFrequency = "weekly" | "monthly" | "yearly";

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  weekly: "Weekly",
  fourWeekly: "Every 4 weeks",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export function toMonthly(amount: number, frequency: Frequency): number {
  switch (frequency) {
    case "weekly":
      return (amount * 52) / 12;
    case "fourWeekly":
      return (amount * 13) / 12;
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "yearly":
      return amount / 12;
  }
}

export function toYearly(amount: number, frequency: Frequency): number {
  switch (frequency) {
    case "weekly":
      return amount * 52;
    case "fourWeekly":
      return amount * 13;
    case "monthly":
      return amount * 12;
    case "quarterly":
      return amount * 4;
    case "yearly":
      return amount;
  }
}
