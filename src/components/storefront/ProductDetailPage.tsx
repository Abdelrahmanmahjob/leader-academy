"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { PRODUCTS, type StoreProduct } from "@/content/products";
import { useStoreCart } from "./StoreCartContext";

function formatCurrency(locale: string, amount: number) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatReviewCount(locale: string, amount: number) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductDetailPage({ product }: { product: StoreProduct }) {
  const locale = useLocale();
  const t = useTranslations("productsPage");
  const detailT = useTranslations("productDetail");
  const { addToCart } = useStoreCart();
  const [added, setAdded] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const relatedProducts = [
    ...PRODUCTS.filter(
      (item) => item.id !== product.id && item.category === product.category,
    ),
    ...PRODUCTS.filter(
      (item) => item.id !== product.id && item.category !== product.category,
    ),
  ].slice(0, 4);
  const BackArrow = locale === "ar" ? ArrowRight : ArrowLeft;

  useEffect(
    () => () => {
      if (addedTimeout.current) clearTimeout(addedTimeout.current);
    },
    [],
  );

  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    if (addedTimeout.current) clearTimeout(addedTimeout.current);
    addedTimeout.current = setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main id="main-content" className="overflow-hidden pb-20 pt-28 sm:pt-36">
      <Container>
        <Link
          href="/products#shop-products"
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-bold text-foreground/70 transition-colors hover:text-accent"
        >
          <BackArrow
            className="size-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
            aria-hidden="true"
          />
          {detailT("backToShop")}
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-[28px] border border-border bg-surface-raised">
            <Image
              src={product.image}
              alt={t(`items.${product.id}.imageAlt`)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className={`absolute inset-0 bg-linear-to-br ${product.accent} mix-blend-multiply`}
            />
            <span className="absolute start-5 top-5 rounded-full border border-white/25 bg-background/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur-md rtl:tracking-normal">
              {t(`categories.${product.category}`)}
            </span>
            {product.compareAt ? (
              <span className="absolute end-5 top-5 rounded-full bg-accent px-4 py-2 text-xs font-extrabold text-inverse shadow-md">
                {t("sale")}
              </span>
            ) : null}
            <span className="absolute bottom-5 end-5 text-sm font-bold tracking-[0.16em] text-white/85">
              LA / {product.label}
            </span>
          </div>

          <div className="flex flex-col justify-center py-2 lg:py-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal">
              {detailT("eyebrow")}
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {t(`items.${product.id}.name`)}
            </h1>
            {product.rating !== undefined ? (
              <p className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-bold text-foreground/65">
                <Star
                  className="size-4 fill-accent text-accent"
                  aria-hidden="true"
                />
                {product.rating.toFixed(1)}
                {product.reviews
                  ? ` (${formatReviewCount(locale, product.reviews)})`
                  : ""}
              </p>
            ) : null}
            <p className="mt-6 text-base leading-8 text-foreground/70 sm:text-lg">
              {t(`items.${product.id}.description`)}
            </p>

            <div className="mt-8 border-y border-border py-5">
              <p className="text-sm font-bold text-foreground/55">
                {detailT("productId")}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                {product.id}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-3xl font-extrabold tabular-nums text-foreground">
                  {formatCurrency(locale, product.price)}
                </p>
                {product.compareAt ? (
                  <p className="mt-1 text-sm font-medium text-foreground/45 line-through">
                    {formatCurrency(locale, product.compareAt)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-extrabold transition-[background-color,color,transform] active:scale-95 ${
                  added
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                    : "bg-accent text-inverse"
                }`}
              >
                {added ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Plus className="size-4" aria-hidden="true" />
                )}
                {added ? t("addedToCart") : t("addToCart")}
              </button>
            </div>
            <p className="mt-6 text-xs leading-5 text-foreground/50">
              {t("demoNotice")}
            </p>
          </div>
        </section>

        <section className="pt-20 sm:pt-28" aria-labelledby="related-products">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal">
            {detailT("relatedEyebrow")}
          </p>
          <h2
            id="related-products"
            className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
          >
            {detailT("relatedTitle")}
          </h2>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <li key={relatedProduct.id}>
                <Link
                  href={`/products/${relatedProduct.id}`}
                  className="group block h-full overflow-hidden rounded-[22px] border border-border bg-surface transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="relative aspect-[1.15] overflow-hidden bg-surface-raised">
                    <Image
                      src={relatedProduct.image}
                      alt={t(`items.${relatedProduct.id}.imageAlt`)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 bg-linear-to-br ${relatedProduct.accent} mix-blend-multiply`}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-foreground/50">
                      {t(`categories.${relatedProduct.category}`)}
                    </p>
                    <h3 className="mt-2 line-clamp-2 min-h-12 font-extrabold leading-6 text-foreground">
                      {t(`items.${relatedProduct.id}.name`)}
                    </h3>
                    <p className="mt-3 text-lg font-extrabold tabular-nums text-foreground">
                      {formatCurrency(locale, relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}
