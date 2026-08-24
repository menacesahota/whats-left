import type { Metadata } from "next";
import { DebtTool } from "@/components/tools/DebtTool";

export const metadata: Metadata = {
  title: "Debt payoff calculator",
  description:
    "Compare avalanche and snowball debt payoff. See a recommended order, months to clear and an interest estimate.",
};

export default function DebtPage() {
  return <DebtTool />;
}
