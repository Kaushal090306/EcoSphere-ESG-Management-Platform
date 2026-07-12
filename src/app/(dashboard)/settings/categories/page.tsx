import { getCategories } from "@/actions/categories";
import { CategoriesClient } from "./categories-client";
import { Tags } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Shared categories for CSR activities and challenges"
        icon={Tags}
      />
      <CategoriesClient categories={categories} />
    </div>
  );
}
