import { getAllCategoriesWithPostCount } from "./actions";
import CategoriesClientPage from "./categories-client-page";

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithPostCount();

  return (
    <CategoriesClientPage
      initialCategories={categories}
    />
  );
}