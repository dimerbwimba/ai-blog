import { parse } from 'node-html-parser';

export type SEOData = {
    title: string;
    content: string; // HTML content
    slug: string;
    seo_slug: string;
    description: string;
    image: string;
    tags: string[];
    keywords: string[];
  };
  
export type SEOResult = {
    score: number;
    feedback: string[];
  };
  
export type Recommendation = {
    requirement: string;
    fix: string;
  };
  export function calculateSeoScore(data: SEOData): SEOResult {
    const feedback: string[] = [];
    let score = 0;
  
    // Parse HTML content
    const root = parse(data.content);
  
    // 1. Title
    if (data.title.length >= 50 && data.title.length <= 60) {
      score += 10;
    } 
  
    // 2. Description
    if (data.description.length >= 150 && data.description.length <= 160) {
      score += 10;
    } 
  
    // 3. Slug and SEO Slug
    if (data.slug === data.seo_slug) {
      score += 5;
    } 
  
    // 4. Heading Hierarchy
    const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (const heading of headings) {
        if (heading.tagName === "H2") {
            score += 5;
        }
    }
    //
    const h2Count = root.querySelectorAll("h2").length;
    if (h2Count >= 5) {
      score += 10;
    } else {
      feedback.push("Add at least 5 H2 tags to improve SEO.");
    }

    
  
    // 5. Images and Alt Attributes
    const images = root.querySelectorAll("img");
    const imagesWithAlt = images.filter((img) => img.getAttribute("alt"));
    if (imagesWithAlt.length === images.length) {
      score += 10;
    } 
  
    // 6. Keyword Density
    const contentText = root.textContent.toLowerCase();
    const keywordMatches = data.keywords.map((keyword) => ({
      keyword,
      count: (contentText.match(new RegExp(keyword.toLowerCase(), "g")) || [])
        .length,
    }));
    const totalKeywords = keywordMatches.reduce((sum, k) => sum + k.count, 0);
    if (totalKeywords > 0) {
      score += 10;
    } else {
      feedback.push("Add keywords to the content to improve SEO.");
    }
  
    // 7. Links (Internal and External)
    const links = root.querySelectorAll("a");
    const internalLinks = links.filter(
      (link) => link.getAttribute("href")?.startsWith("/")
    );
    const externalLinks = links.filter(
      (link) =>
        link.getAttribute("href")?.startsWith("http") &&
        !link.getAttribute("href")?.includes("yourwebsite.com")
    );
    if (internalLinks.length > 0) {
      score += 5;
    } 
    if (externalLinks.length > 0) {
      score += 5;
    } 
  
    // Final Score Calculation
    return {
      score: Math.min(score, 100),
      feedback,
    };
  }
  
  export function getSeoRecommendations(data: SEOData): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const root = parse(data.content);
  
    // Title
    if (data.title.length < 50 || data.title.length > 60) {
      recommendations.push({
        requirement: "Title length should be between 50-60 characters.",
        fix: `Adjust the title length (currently ${data.title.length} characters).`,
      });
    }
  
    // Description
    if (data.description.length < 150 || data.description.length > 160) {
      recommendations.push({
        requirement: "Description length should be between 150-160 characters.",
        fix: `Adjust the description length (currently ${data.description.length} characters).`,
      });
    }
  
    // Images
    const images = root.querySelectorAll("img");
    const imagesWithoutAlt = images.filter((img) => !img.getAttribute("alt"));
    if (imagesWithoutAlt.length > 0) {
      recommendations.push({
        requirement: "All images should have alt attributes.",
        fix: `Add alt attributes to ${imagesWithoutAlt.length} image(s) without alt text.`,
      });
    }

  
   // Keywords
  const contentText = root.textContent.toLowerCase();
  const keywordMatches = data.keywords.map((keyword) => ({
    keyword,
    count: (contentText.match(new RegExp(keyword.toLowerCase(), "g")) || []).length,
  }));
  const totalKeywordCount = keywordMatches.reduce((sum, match) => sum + match.count, 0);

  if (totalKeywordCount === 0) {
    recommendations.push({
      requirement: "Keywords should be included in the content.",
      fix: `Include relevant keywords such as ${data.title.split(" ").join(", ")} in your content.`,
    });
  } else {
    // Check if all provided keywords are used
    data.keywords.forEach((keyword) => {
      const count = keywordMatches.find((match) => match.keyword === keyword)?.count || 0;
      if (count === 0) {
        recommendations.push({
          requirement: `Keyword '${keyword}' is missing in the content.`,
          fix: `Include the keyword '${keyword}' at least once in your content.`,
        });
      }
    });
  }

  
    // Links
    const internalLinks = root.querySelectorAll("a[href^='/']").length;
    const externalLinks = root.querySelectorAll(
      "a[href^='http']:not([href*='yourwebsite.com'])"
    ).length;
    if (internalLinks === 0) {
      recommendations.push({
        requirement: "Add internal links.",
        fix: "Link to other pages on your website to improve navigation.",
      });
    }
    if (externalLinks === 0) {
      recommendations.push({
        requirement: "Add external links.",
        fix: "Link to reputable external sources to build credibility.",
      });
    }
  
    return recommendations;
  }