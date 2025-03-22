import { Metadata } from "next";
import { BlogPost } from "@/components/blog/blog-post";
import { NotFound } from "@/components/blog/not-found";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/travel/${slug}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch post");
    return await response.json();
  } catch (error) {
    console.error("[GET_POST_ERROR]", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Travel Article Not Found",
      description:
        "The travel article you are looking for seems to have wandered off. Let's help you find your way back to familiar territory.",
      openGraph: {
        title: "Travel Article Not Found",
        description:
          "The travel article you are looking for seems to have wandered off. Let's help you find your way back to familiar territory.",
      },
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function TravelPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <article>
      <BlogPost post={post} />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          image: post.image,
          datePublished: post.createdAt,
          author: {
            "@type": "Person",
            name: post.author.name,
          },
          description: post.description,
          keywords: post.keywords,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": post.seo_slug,
          },
        })}
      </script>
    </article>
  );
}
