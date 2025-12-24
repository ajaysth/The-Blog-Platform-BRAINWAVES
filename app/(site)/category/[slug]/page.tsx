import { getCategoryWithPosts } from "./actions";
import CategoryClientPage from "./category-client-page";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params; 
  const categoryData = await getCategoryWithPosts(resolvedParams.slug);

  if (!categoryData) {
    notFound();
  }

  return <CategoryClientPage category={categoryData} userId={categoryData.userId} />;
}
