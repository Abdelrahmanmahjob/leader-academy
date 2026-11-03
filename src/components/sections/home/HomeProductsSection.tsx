"use client";

import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { PRODUCTS } from "@/content/products";

const featuredProductIds = [
  "custom-soccer-kit",
  "junior-goalkeeper-gloves",
  "speed-agility-ladder",
];

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

export function HomeProductsSection() {
  const locale = useLocale();
  const t = useTranslations("home.products");
  const productT = useTranslations("productsPage");
  const featuredProducts = featuredProductIds.map((id) => {
    const product = PRODUCTS.find((item) => item.id === id);
    if (!product) {
      throw new Error(`Unknown featured store product: ${id}`);
    }
    return product;
  });

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 leading-7 text-foreground/65">
              {t("description")}
            </p>
          </div>
          <Link
            href="/products#shop-products"
            className="group inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-bold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            {t("shopAll")}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}`}
                className="group block h-full overflow-hidden rounded-[24px] border border-border bg-surface transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_26px_55px_-30px_color-mix(in_srgb,var(--la-inverse)_85%,transparent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-[1.2] overflow-hidden bg-surface-raised">
                  <Image
                    src={product.image}
                    alt={productT(`items.${product.id}.imageAlt`)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-linear-to-br ${product.accent} mix-blend-multiply`}
                  />
                  <span className="absolute start-4 top-4 rounded-full border border-white/25 bg-background/80 px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur-md rtl:tracking-normal">
                    {productT(`categories.${product.category}`)}
                  </span>
                  <span className="absolute bottom-4 end-4 text-xs font-bold tracking-[0.16em] text-white/85">
                    LA / {product.label}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-extrabold leading-snug text-foreground">
                        {productT(`items.${product.id}.name`)}
                      </h3>
                      <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-foreground/65">
                        {productT(`items.${product.id}.description`)}
                      </p>
                    </div>
                    {product.rating !== undefined ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-foreground/60">
                        <Star
                          className="size-3.5 fill-accent text-accent"
                          aria-hidden="true"
                        />
                        {product.rating.toFixed(1)}
                        {product.reviews ? (
                          <span className="text-foreground/45">
                            ({formatReviewCount(locale, product.reviews)})
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div>
                      <p className="text-lg font-extrabold tabular-nums text-foreground">
                        {formatCurrency(locale, product.price)}
                      </p>
                      {product.compareAt ? (
                        <p className="mt-0.5 text-xs font-medium text-foreground/45 line-through">
                          {formatCurrency(locale, product.compareAt)}
                        </p>
                      ) : null}
                    </div>
                    <span className="inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-extrabold text-inverse">
                      {t("viewProduct")}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
