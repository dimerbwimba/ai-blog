import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { PostsPagination } from "@/components/shared/posts-pagination";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {slug} = await params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/destinations/public/${slug}`,
      {
        next: {
          revalidate: 60
        }
      }
    );
    const destination = await response.json();

    if (!response.ok) {
      return {
        title: "Destination Not Found",
        description: "The requested destination could not be found.",
      };
    }

    return {
      title: `${destination.name} Travel Guide & Information`,
      description: destination.description,
      openGraph: {
        images: [destination.image || "/images/default-destination.jpg"],
        title: `${destination.name} - Travel Guide`,
        description: destination.description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Destination",
      description: "Travel destination information",
    };
  }
}


const DestinationPage = async ({ params, searchParams }: PageProps) => {
  const {slug} = await params;
  const {page} = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/destinations/public/${slug}?page=${currentPage}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error("Failed to fetch destination");
    }

    const destination = await response.json();

    return (
      <main className="max-w-xl container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden h-[60vh] w-full">
          <Image
            src={destination.image || "/images/default-destination.jpg"}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="container mx-auto px-4 py-8 text-white">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold">{destination.name}</h1>
                {destination.region && (
                  <p className="text-xl opacity-90">{destination.region}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Description Section */}
          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              About {destination.name}
            </h2>

            <p className="text-gray-700 line-clamp-3">
              {destination.description}
            </p>
          </section>
          <div className="relative h-[40px] w-full mb-10">
            <Image
              src={"/blog_divider_735x40_.webp"}
              alt={"divider"}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Related Posts Section */}
          {destination.posts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                Travel Guides & Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {destination.posts.map(({ post }: { post: any }) => (
                  <Link
                    key={post.id}
                    href={`/travel/${post.seo_slug}`}
                    className="group block bg-white rounded-lg border overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {destination.pagination.pages > 1 && (
                <div className="mt-8">
                  <PostsPagination
                    currentPage={destination.pagination.currentPage}
                    totalPages={destination.pagination.pages}
                    baseUrl={`/destinations/${slug}`}
                  />
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching destination:", error);
    throw error;
  }
};

export default DestinationPage;
