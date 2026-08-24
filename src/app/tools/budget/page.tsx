import type { Metadata } from "next";
import { BudgetTool } from "@/components/tools/BudgetTool";

export const metadata: Metadata = {
  title: "Monthly budget calculator",
  description:
    "Build a simple UK monthly budget from take-home pay, bills and everyday spending. See leftover and the share of income that goes on bills.",
};

export default function BudgetPage() {
  return <BudgetTool />;
}
