import type { Metadata } from "next";
import { RentOrBuyTool } from "@/components/tools/RentOrBuyTool";

export const metadata: Metadata = {
  title: "Rent vs buy calculator",
  description:
    "A UK sniff test comparing monthly rent with a rough repayment mortgage, deposit cash needed, and extra owning costs. Not a mortgage offer.",
};

export default function RentOrBuyPage() {
  return <RentOrBuyTool />;
}
