import { ToolPage } from "@/components/ToolPage";
import { TakeHomeTool } from "@/components/tools/TakeHomeTool";
import { pageMetadata } from "@/lib/seo";
import { TAX_YEAR } from "@/lib/uk-tax";

const PATH = "/tools/take-home";
const TITLE = "Take-home pay calculator";
const DESCRIPTION = `Estimate UK take-home pay for ${TAX_YEAR} after income tax, employee National Insurance, student loan and pension. England, Wales, NI and Scotland.`;

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
});

export default function TakeHomePage() {
  return (
    <ToolPage path={PATH} name={TITLE} description={DESCRIPTION}>
      <TakeHomeTool />
    </ToolPage>
  );
}
