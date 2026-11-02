import type { Metadata } from "next";
import { ProductsPage } from "@/components/storefront/ProductsPage";

export const metadata: Metadata = {
  title: "Academy Shop",
  description:
    "Shop Leader Academy sportswear, football equipment, and academy merchandise.",
};

export default function AcademyProductsPage() {
  return <ProductsPage />;
}
