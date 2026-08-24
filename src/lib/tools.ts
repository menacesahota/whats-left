export type ToolMeta = {
  href: string;
  title: string;
  blurb: string;
  icon: "pay" | "budget" | "debt" | "fund" | "home" | "bills";
  related: string[];
};

export const TOOLS: ToolMeta[] = [
  {
    href: "/tools/take-home",
    title: "Take-home pay",
    blurb:
      "See what actually lands in your account after tax, NI, student loan and pension.",
    icon: "pay",
    related: ["/tools/budget", "/tools/bills", "/tools/emergency-fund"],
  },
  {
    href: "/tools/budget",
    title: "Monthly budget",
    blurb:
      "Line up bills and spending against take-home, and see what is left.",
    icon: "budget",
    related: ["/tools/take-home", "/tools/bills", "/tools/debt"],
  },
  {
    href: "/tools/debt",
    title: "Debt payoff",
    blurb:
      "Avalanche or snowball: a payoff order, months to clear, and interest.",
    icon: "debt",
    related: ["/tools/budget", "/tools/take-home", "/tools/emergency-fund"],
  },
  {
    href: "/tools/emergency-fund",
    title: "Emergency fund",
    blurb: "How many months of essentials you could cover, and the gap to target.",
    icon: "fund",
    related: ["/tools/budget", "/tools/take-home", "/tools/debt"],
  },
  {
    href: "/tools/rent-or-buy",
    title: "Rent or buy",
    blurb:
      "A sniff test: monthly rent versus a rough mortgage repayment. Not an offer.",
    icon: "home",
    related: ["/tools/budget", "/tools/bills", "/tools/take-home"],
  },
  {
    href: "/tools/bills",
    title: "Bills converter",
    blurb:
      "Turn weekly, 4-weekly, quarterly and yearly bills into honest monthly totals.",
    icon: "bills",
    related: ["/tools/budget", "/tools/take-home", "/tools/rent-or-buy"],
  },
];

export function getTool(href: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.href === href);
}
