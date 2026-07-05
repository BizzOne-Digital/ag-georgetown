import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/products", "/offers", "/about", "/contact", "/privacy", "/terms"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/offers" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
