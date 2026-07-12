import { MetadataRoute } from "next";
import { CLASSES, TOPICS, SITE_METADATA } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_METADATA.siteUrl;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Vedic Math class pages
  const vedicMathPages: MetadataRoute.Sitemap = CLASSES.map((cls) => ({
    url: `${baseUrl}/vedic-math/${cls.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Math Tricks class pages
  const mathTricksPages: MetadataRoute.Sitemap = CLASSES.map((cls) => ({
    url: `${baseUrl}/math-tricks/${cls.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Topic cluster pages
  const topicPages: MetadataRoute.Sitemap = TOPICS.map((topic) => ({
    url: `${baseUrl}/topics/${topic.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...vedicMathPages, ...mathTricksPages, ...topicPages];
}
