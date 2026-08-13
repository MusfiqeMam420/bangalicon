import CategoryDirectory from "@/components/CategoryDirectory";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Icon Categories",
  path: "/categories",
  description:
    "Browse Bangalicon icon categories, explore grouped icon families, and jump into the exact style or topic you need faster.",
  keywords: [
    "icon categories",
    "browse icons by category",
    "UI icon groups",
    "brand icon categories",
  ],
});

export default function CategoriesPage() {
  return <CategoryDirectory />;
}
