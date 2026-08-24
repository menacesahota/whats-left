import { ToolPage } from "@/components/ToolPage";
import { BillsTool } from "@/components/tools/BillsTool";
import { pageMetadata } from "@/lib/seo";

const PATH = "/tools/bills";
const TITLE = "Bills converter";
const DESCRIPTION =
  "Convert weekly, 4-weekly, monthly, quarterly and yearly UK bills into honest monthly and yearly totals.";

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
});

export default function BillsPage() {
  return (
    <ToolPage path={PATH} name={TITLE} description={DESCRIPTION}>
      <BillsTool />
    </ToolPage>
  );
}
