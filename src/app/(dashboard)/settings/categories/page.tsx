import { getCategories } from "@/actions/categories";
import { CategoriesClient } from "./categories-client";
import { auth } from "@/auth";
import { AccessDenied } from "@/components/shared/access-denied";

export default async function CategoriesPage() {
  const session = await auth();

  if ((session?.user as any)?.role !== "admin") {
    return <AccessDenied />;
  }

  const categories = await getCategories();

  return <CategoriesClient categories={categories} />;
}
