import { ToolPage } from "@/components/ToolPage";
import { BudgetTool } from "@/components/tools/BudgetTool";
import { pageMetadata } from "@/lib/seo";

const PATH = "/tools/budget";
const TITLE = "Monthly budget calculator";
const DESCRIPTION =
  "Build a simple UK monthly budget from take-home pay, bills and everyday spending. See leftover and the share of income that goes on bills.";

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
});

export default function BudgetPage() {
  return (
    <ToolPage path={PATH} name={TITLE} description={DESCRIPTION}>
      <BudgetTool />
    </ToolPage>
  );
}
