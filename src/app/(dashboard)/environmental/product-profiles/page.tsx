import { getProductProfiles } from "@/actions/product-profiles";
import { ProductProfilesClient } from "./product-profiles-client";

export default async function ProductProfilesPage() {
  const profiles = await getProductProfiles();
  return (
    <div className="space-y-4">
      <ProductProfilesClient profiles={profiles} />
    </div>
  );
}
