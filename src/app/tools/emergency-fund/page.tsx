import type { Metadata } from "next";
import { EmergencyFundTool } from "@/components/tools/EmergencyFundTool";

export const metadata: Metadata = {
  title: "Emergency fund calculator",
  description:
    "Work out how many months of essential UK costs your savings would cover, the gap to a 3 or 6 month target, and a monthly amount to save.",
};

export default function EmergencyFundPage() {
  return <EmergencyFundTool />;
}
