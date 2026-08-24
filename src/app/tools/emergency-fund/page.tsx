import { ToolPage } from "@/components/ToolPage";
import { EmergencyFundTool } from "@/components/tools/EmergencyFundTool";
import { pageMetadata } from "@/lib/seo";

const PATH = "/tools/emergency-fund";
const TITLE = "Emergency fund calculator";
const DESCRIPTION =
  "Work out how many months of essential UK costs your savings would cover, the gap to a 3 or 6 month target, and a monthly amount to save.";

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
});

export default function EmergencyFundPage() {
  return (
    <ToolPage path={PATH} name={TITLE} description={DESCRIPTION}>
      <EmergencyFundTool />
    </ToolPage>
  );
}
