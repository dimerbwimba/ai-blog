import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { PostsPagination } from "@/components/shared/posts-pagination";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const {slug} = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories/public/${slug}`
    );
    const category = await response.json();

    if (!response.ok) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      };
    }

    return {
      title: `${category.name} - Travel Articles & Guides`,
      description: category.description,
      openGraph: {
        images: [category.image || "/images/default-category.jpg"],
        title: `${category.name} - Travel Articles & Guides`,
        description: category.description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Travel Category",
      description: "Travel articles and guides",
    };
  }
}

const CategoryPage = async ({ params, searchParams }: PageProps) => {
  const {slug} = await params;
  const {page} = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories/public/${slug}?page=${currentPage}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }

    const category = await response.json();

    return (
      <main className="max-w-xl container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden h-[40vh] w-full mb-10">
          <Image
            src={category.image || "/images/default-category.jpg"}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
              <p className="text-lg max-w-2xl mx-auto px-4 line-clamp-3">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-[40px] w-full mb-10">
          <Image
            src={"/blog_divider_735x40_.webp"}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Posts Grid */}
        <div className="space-y-12">
          {category.posts.map((post: any) => (
            <article key={post.id} className="group">
              <div className="block">
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-3">
                  <Link href={`/travel/${post.seo_slug}`} className="block">  
                    <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {post.author.image && (
                        <Image
                          src={post.author.image}
                          alt={post.author.name || ""}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span>{post.author.name}</span>
                    </div>
                    <span>•</span>
                    <time dateTime={post.createdAt}>
                      {formatDate(post.createdAt)}
                    </time>
                    {post.destinations[0] && (
                      <>
                        <span>•</span>
                        <Link
                          href={`/destinations/${post.destinations[0].destination.slug}`}
                          className="hover:text-blue-600"
                        >
                          {post.destinations[0].destination.name}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {category.posts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No Articles Found</h2>
            <p className="text-gray-600">
              There are no articles in this category yet.
            </p>
          </div>
        )}

        {/* Pagination */}
        {category.pagination.pages > 1 && (
          <div className="mt-12">
            <PostsPagination
              currentPage={category.pagination.currentPage}
              totalPages={category.pagination.pages}
              baseUrl={`/category/${slug}`}
            />
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export default CategoryPage; 