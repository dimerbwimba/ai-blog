import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started - Travel Categories",
  description: "Explore our travel categories and start your journey",
};

interface Category {
  id: string;
  name: string;
  description: string;
  image: string | null;
  slug: string | null;
  postsCount: number;
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories/public`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

export default async function GettingStartedPage() {
  const categories = await getCategories();

  return (
    <main className="max-w-xl container mx-auto px-4 py-20">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Getting Started</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our travel categories and find inspiration for your next
          adventure. Each category offers unique perspectives and expert travel
          guides.
        </p>
      </div>
      <div className="relative h-[40px] w-full mb-10">
        <Image
          src={"/blog_divider_735x40_.webp"}
          alt={"divider"}
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group block"
          >
            <div className="relative h-64 rounded-lg overflow-hidden mb-4">
              <Image
                src={category.image || "/images/default-category.jpg"}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end">
                <div className="p-6">
                  <h2 className="text-white text-2xl font-semibold mb-2">
                    {category.name}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {category.postsCount}{" "}
                    {category.postsCount === 1 ? "article" : "articles"}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 line-clamp-2">{category.description}</p>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Categories Found</h2>
          <p className="text-gray-600">
            Please check back later for travel categories.
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600 mb-8">
          Choose a category above or explore our latest travel guides.
        </p>
        <Link
          href="/travel-guides"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse All Travel Guides
        </Link>
      </div>
    </main>
  );
}
