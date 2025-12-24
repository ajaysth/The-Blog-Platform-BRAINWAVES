import FeaturedAuthors from "@/components/featured-authors";
import Hero from "@/components/hero";
import HowItWorks from "@/components/howitworks";
import BlogCard from "@/components/blog-card"; // Keep BlogCard for type definition if still needed, but not directly rendered here
import Stats from "@/components/stats";
import Newsletter from "@/components/newsletter";
import CTA1 from "@/components/mvpblocks/cta-1";
import FAQ from "@/components/FAQ";
import Banner from "@/components/banner";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import RecentPostsSection from "@/components/home/recent-posts-section"; // New import for the client component

// Remove BlogCardProps interface from here as it's defined in blog-card.tsx
// and will be dynamically constructed from Prisma query

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  console.log("Home Page - userId:", userId); // Added for debugging

  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      author: true,
      category: true,
      likes: {
        where: { userId: userId || "" },
        select: { userId: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    image: post.coverImage || "/hero-blog.jpg",
    category: post.category?.name || "Uncategorized",
    author: {
      name: post.author.name || "Unknown",
      avatar: post.author.image || "/placeholder-avatar.jpg",
    },
    date: new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    readTime: post.readTime || "5 min",
    isLiked: post.likes.length > 0,
    userId: userId,
  }));

  return (
    <main>
      <Hero />
      <HowItWorks />
      {/* Categories Filter - Temporarily removed as it requires client-side state management */}
      {/* <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Find content that matches your interests
            </p>
          </div>

          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section> */}
      <FeaturedAuthors />

      {/* Recent Posts Grid */}
      <RecentPostsSection formattedPosts={formattedPosts} userId={userId} />

      <Stats />
      <Newsletter />
      <Banner />
      <FAQ />
    </main>
  );
}
