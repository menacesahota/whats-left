import type { Metadata } from "next";
import { BillsTool } from "@/components/tools/BillsTool";

export const metadata: Metadata = {
  title: "Bills converter",
  description:
    "Convert weekly, 4-weekly, monthly, quarterly and yearly UK bills into honest monthly and yearly totals.",
};

export default function BillsPage() {
  return <BillsTool />;
}
