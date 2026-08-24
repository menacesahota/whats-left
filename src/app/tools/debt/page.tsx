import { ToolPage } from "@/components/ToolPage";
import { DebtTool } from "@/components/tools/DebtTool";
import { pageMetadata } from "@/lib/seo";

const PATH = "/tools/debt";
const TITLE = "Debt payoff calculator";
const DESCRIPTION =
  "Compare avalanche and snowball debt payoff. See a recommended order, months to clear and an interest estimate.";

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
});

export default function DebtPage() {
  return (
    <ToolPage path={PATH} name={TITLE} description={DESCRIPTION}>
      <DebtTool />
    </ToolPage>
  );
}
