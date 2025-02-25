
import React, { useState } from "react";
import { calculateSeoScore, getSeoRecommendations, SEOData, Recommendation } from "@/lib/seo-checker"; // Adjust the path as needed
import { Button } from "./button";

const SEOChecker: React.FC<SEOData> = ({
  title,
  content,
  slug,
  seo_slug,
  description,
  image,
  tags,
  keywords,
}) => {
  const [seoResult, setSeoResult] = useState<{ score: number; feedback: string[] } | null>(null);
  const [seoRecommendations, setSeoRecommendations] = useState<Recommendation[]>([]);

  const handleSeoCheck = () => {
    // Perform SEO analysis
    const result = calculateSeoScore({ title, content, slug, seo_slug, description, image, tags, keywords });
    const recommendations = getSeoRecommendations({ title, content, slug, seo_slug, description, image, tags, keywords });

    setSeoResult(result);
    setSeoRecommendations(recommendations);
  };

  return (
    <div className=" px-10 my-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SEO Analysis</h2>
          <p className="text-sm text-muted-foreground">Check and optimize your content <br/> for search engines</p>
        </div>
        <Button
            size={"sm"}
          onClick={handleSeoCheck}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <span className="mr-2">Analyze SEO</span>
          {!seoResult && <span className="animate-pulse">→</span>}
        </Button>
      </div>

      {seoResult && (
        <div className="space-y-4">
          <div className="flex justify-center my-2 items-center gap-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={seoResult.score > 75 ? "#22c55e" : seoResult.score > 50 ? "#eab308" : "#ef4444"}
                  strokeWidth="8"
                  strokeDasharray={`${seoResult.score * 2.827433388} 282.7433388`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{seoResult.score}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">SEO Score</h3>
              <p className="text-sm text-muted-foreground">
                {seoResult.score > 75 ? "Great! Your content is well optimized" :
                 seoResult.score > 50 ? "Good, but there's room for improvement" :
                 "Needs significant optimization"}
              </p>
            </div>
          </div>

          {seoResult.feedback.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <h4 className="font-medium text-red-800 mb-2">Issues Found</h4>
              <ul className="space-y-2">
                {seoResult.feedback.map((feedback, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-700">
                    <span className="mt-1">•</span>
                    <span>{feedback}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {seoRecommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Optimization Recommendations</h3>
          <div className="grid gap-4">
            {seoRecommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-1">{rec.requirement}</h4>
                <p className="text-sm text-blue-700">{rec.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOChecker;
