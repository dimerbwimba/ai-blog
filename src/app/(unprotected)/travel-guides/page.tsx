import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { PostsPagination } from "@/components/shared/posts-pagination";
import { formatDate } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Travel Guides - Expert Tips & Destinations",
  description:
    "Discover comprehensive travel guides, expert tips, and detailed destination information to plan your perfect trip.",
};

interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  seo_slug: string;
  createdAt: string;
  destinations: {
    destination: {
      name: string;
      slug: string;
    };
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  categories: {
    description: string;
    name: string;
    slug: string;
  }[];
  author: {
    name: string | null;
    image: string | null;
  };
}

interface TravelGuidesResponse {
  posts: Post[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    perPage: number;
  };
}

async function getTravelGuides(page: number): Promise<TravelGuidesResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/travel-guides?page=${page}&limit=10`,
      {
        next: {
          revalidate: 600,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch travel guides");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading travel guides:", error);
    throw error;
  }
}

export default async function TravelGuidesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { posts, pagination } = await getTravelGuides(currentPage);

  return (
    <main className="max-w-xl container mx-auto px-4 py-20">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Travel Guides</h1>
        <p className="text-lg text-gray-600">
          {posts[0].categories[0].description}
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
      {/* Posts List */}
      <div className=" space-y-10">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link href={`/travel/${post.seo_slug}`}>
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-2">{post.description}</p>
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
                </div>
              </div>
            </Link>

            {/* FAQs Accordion */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">
                <span className="text-blue-600">
                  {post?.destinations?.length > 0
                    ? `Frequently Asked Questions about ${post?.destinations[0]?.destination?.name}`
                    : "Frequently Asked Questions"}
                </span>
              </h2>
            </div>
            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  {post.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-md text-muted-foreground py-1">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                        <Link
                          href={`/travel/${post.seo_slug}`}
                          className="text-blue-600"
                        >
                          Read More
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            No Travel Guides Found
          </h2>
          <p className="text-gray-600">
            Please check back later for new travel guides.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-12">
          <PostsPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.pages}
            baseUrl="/travel-guides"
          />
        </div>
      )}
    </main>
  );
}
