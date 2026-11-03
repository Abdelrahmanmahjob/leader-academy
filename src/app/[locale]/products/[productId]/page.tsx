import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductDetailPage } from "@/components/storefront/ProductDetailPage";
import { PRODUCTS } from "@/content/products";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; productId: string }>;
}): Promise<Metadata> {
  const { locale, productId } = await params;
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return {};

  const t = await getTranslations({ locale, namespace: "productsPage" });
  return {
    title: t(`items.${product.id}.name`),
    description: t(`items.${product.id}.description`),
  };
}

export default async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) notFound();

  return <ProductDetailPage product={product} />;
}
