import { getProductProfiles } from "@/actions/product-profiles";
import { ProductProfilesClient } from "./product-profiles-client";
import { PackageSearch } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function ProductProfilesPage() {
  const profiles = await getProductProfiles();
  return (
    <div className="space-y-6">
      <PageHeader title="Product ESG Profiles" description="Attach ESG metadata to products" icon={PackageSearch} />
      <ProductProfilesClient profiles={profiles} />
    </div>
  );
}
