import type { Metadata } from "next";
import { TakeHomeTool } from "@/components/tools/TakeHomeTool";

export const metadata: Metadata = {
  title: "Take-home pay calculator",
  description:
    "Estimate UK take-home pay for 2025/26 after income tax, employee National Insurance, student loan and pension. England, Wales, NI and Scotland.",
};

export default function TakeHomePage() {
  return <TakeHomeTool />;
}
