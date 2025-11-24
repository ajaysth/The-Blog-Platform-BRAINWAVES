import { getCategoriesWithPostCount } from "./actions";
import CategoriesClientPage from "./categories-client-page";

export default async function CategoriesPage() {
  const {
    categories,
    totalPages,
  } = await getCategoriesWithPostCount({ page: 1, limit: 6 });

  return (
    <CategoriesClientPage
      initialCategories={categories}
      initialTotalPages={totalPages}
    />
  );
}