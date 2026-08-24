import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { RelatedTools } from "@/components/RelatedTools";
import { toolBreadcrumbJsonLd, toolSoftwareJsonLd } from "@/lib/seo";

type ToolPageProps = {
  path: string;
  name: string;
  description: string;
  children: ReactNode;
};

export function ToolPage({ path, name, description, children }: ToolPageProps) {
  return (
    <>
      <JsonLd
        data={[
          toolSoftwareJsonLd({ name, description, path }),
          toolBreadcrumbJsonLd({ name, path }),
        ]}
      />
      {children}
      <RelatedTools currentHref={path} />
    </>
  );
}
