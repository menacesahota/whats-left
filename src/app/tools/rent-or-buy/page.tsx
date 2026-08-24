import { ToolPage } from "@/components/ToolPage";
import { RentOrBuyTool } from "@/components/tools/RentOrBuyTool";
import { pageMetadata } from "@/lib/seo";

const PATH = "/tools/rent-or-buy";
const TITLE = "Rent vs buy calculator";
const DESCRIPTION =
  "A UK sniff test comparing monthly rent with a rough repayment mortgage, deposit cash needed, and extra owning costs. Not a mortgage offer.";

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
});

export default function RentOrBuyPage() {
  return (
    <ToolPage path={PATH} name={TITLE} description={DESCRIPTION}>
      <RentOrBuyTool />
    </ToolPage>
  );
}
