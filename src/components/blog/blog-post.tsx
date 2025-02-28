"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import { TableOfContents } from "./table-of-contents";
import { ViewCounter } from "../shared/view-counter";

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    description: string;
    image: string;
    seo_slug: string;
    tags: string[];
    keywords: string[];
    views: number;
    author: {
      name: string;
      image: string;
    };
    createdAt: string;
    updatedAt: string;
    destinations: Array<{
      name: string;
      slug: string;
      image: string;
    }>;
    categories: Array<{
      name: string;
      slug: string;
    }>;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <article className="container max-w-xl py-20 space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 space-x-2">
          {post.categories.map((category) => (
            <Badge key={category.slug} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-4">
          <ViewCounter views={post.views} postId={post.id} />

          <div className="text-muted-foreground">
            <time>{formatDate(post.createdAt)}</time>
            {post.updatedAt !== post.createdAt && (
              <>
                {" "}
                · Updated <time>{formatDate(post.updatedAt)}</time>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative aspect-video">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>
      <div className="flex items-center gap-2">
        <span>
            Written by
        </span>
        <Image
          src={post.author.image}
          alt={post.author.name}
          width={14}
          height={14}
          className="rounded-full"
        />
        <span className="font-bold underline">{post.author.name}</span>
      </div>
      <TableOfContents contentRef={contentRef} />

      <div className="prose prose-a:text-blue-500 prose-a:text-bold prose-a:no-underline prose-lg dark:prose-invert max-w-none">
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      <div className="flex flex-wrap gap-2 ">
        {post.tags.map((tag, index) => (
          <Badge className="text-xs" key={index}>
            <span>{tag}</span>
          </Badge>
        ))}
      </div>
      {post.faqs.length > 0 && (
        <>
          <Separator />
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <div
              className="space-y-4"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {post.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="space-y-2"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="text-xl font-semibold" itemProp="name">
                    {faq.question}
                  </h3>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p className="text-muted-foreground" itemProp="text">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      <Separator />
      <div className="flex flex-wrap gap-2 space-x-2">
        <h2 className="text-2xl font-bold px-2">Popular Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {post.keywords.map((keyword, index) => (
            <Badge className="text-xs" key={index}>
              <span>{keyword}</span>
            </Badge>
          ))}
        </div>
      </div>
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
          hasPart:
            post.faqs.length > 0
              ? {
                  "@type": "FAQPage",
                  mainEntity: post.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.answer,
                    },
                  })),
                }
              : undefined,
        })}
      </script>
    </article>
  );
}
