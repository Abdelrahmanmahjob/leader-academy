"use client";

import Image from "next/image";
import { ArrowDown, Check, Plus, ShoppingBasket, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import {
  PRODUCTS,
  type ProductCategory,
  type StoreProduct,
} from "@/content/products";
import { gsap, useGSAP } from "@/components/sections/about/shared/Motion";
import { useStoreCart } from "./StoreCartContext";

const productCategories: ProductCategory[] = [
  "apparel",
  "protection",
  "training",
  "bags",
];

const categoryFilters: Array<"all" | ProductCategory> = [
  "all",
  ...productCategories,
];

function formatCurrency(locale: string, amount: number) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(locale: string, amount: number) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA").format(
    amount,
  );
}

export function ProductsPage() {
  const locale = useLocale();
  const t = useTranslations("productsPage");
  const { addToCart } = useStoreCart();
  const [activeCategory, setActiveCategory] = useState<"all" | ProductCategory>(
    "all",
  );
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const visibleProductCount =
    activeCategory === "all"
      ? PRODUCTS.length
      : PRODUCTS.filter((product) => product.category === activeCategory)
          .length;

  useEffect(
    () => () => {
      if (addedTimeout.current) clearTimeout(addedTimeout.current);
    },
    [],
  );

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-product-card]");
        if (cards.length === 0) return;

        gsap.from(cards, {
          autoAlpha: 0,
          y: 28,
          scale: 0.98,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 84%",
            once: true,
          },
        });
      });

      return () => motion.revert();
    },
    { scope: gridRef, dependencies: [activeCategory], revertOnUpdate: true },
  );

  const handleAdd = (productId: string) => {
    addToCart(productId);
    setAddedProductId(productId);
    if (addedTimeout.current) clearTimeout(addedTimeout.current);
    addedTimeout.current = setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <main id="main-content" className="overflow-hidden pb-20 pt-28 sm:pt-36">
      <Container>
        <section className="relative grid items-center gap-10 overflow-hidden rounded-[32px] border border-border bg-surface-raised p-5 sm:p-8 lg:grid-cols-[1fr_0.88fr] lg:gap-12 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-24 -top-32 size-80 rounded-full bg-accent/15 blur-[90px]"
          />
          <div className="relative z-10 py-3 lg:py-8">
            <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 max-w-2xl text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.06em] text-foreground rtl:leading-[1.2] rtl:tracking-normal">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-foreground/70 sm:text-lg">
              {t("description")}
            </p>
            <a
              href="#shop-products"
              className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-6 font-bold text-inverse shadow-[0_12px_30px_-12px_color-mix(in_srgb,var(--la-accent)_80%,transparent)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              {t("shopNow")}
              <ArrowDown
                className="size-4 transition-transform group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <div className="mt-9 flex flex-wrap gap-3">
              {[t("perks.official"), t("perks.training"), t("perks.demo")].map(
                (perk) => (
                  <span
                    key={perk}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-2 text-xs font-semibold text-foreground/75"
                  >
                    <Check
                      className="size-3.5 text-accent"
                      aria-hidden="true"
                    />
                    {perk}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="group relative min-h-[300px] overflow-hidden rounded-[26px] border border-border sm:min-h-[400px] lg:min-h-[480px]">
            <Image
              src="/images/home-page/hero/hero1.jpg"
              alt={t("heroImageAlt")}
              fill
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105 motion-reduce:transition-none"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/85 via-background/5 to-transparent" />
            <span className="absolute end-4 top-4 flex size-14 items-center justify-center rounded-full border border-white/20 bg-background/60 text-accent shadow-lg backdrop-blur-md sm:end-6 sm:top-6 sm:size-16">
              <ShoppingBasket className="size-7" aria-hidden="true" />
            </span>
          </div>
        </section>

        <section id="shop-products" className="scroll-mt-28 pt-20 sm:pt-28">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-accent rtl:tracking-normal">
                {t("collectionEyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t("collectionTitle")}
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-foreground/65">
                {t("collectionDescription")}
              </p>
            </div>
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-foreground/75">
              <ShoppingBasket
                className="size-4 text-accent"
                aria-hidden="true"
              />
              {t("productCount", { count: visibleProductCount })}
            </p>
          </div>

          <div
            className="mt-7 flex gap-2 overflow-x-auto pb-2"
            role="group"
            aria-label={t("filterLabel")}
          >
            {categoryFilters.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-[background-color,color,border-color,transform] duration-300 active:scale-95 ${
                    active
                      ? "border-accent bg-accent text-inverse shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--la-accent)_80%,transparent)]"
                      : "border-border bg-surface text-foreground/70 hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {t(`categories.${category}`)}
                </button>
              );
            })}
          </div>

          <div ref={gridRef} className="mt-8 space-y-12 lg:mt-10 lg:space-y-16">
            {productCategories
              .filter(
                (category) =>
                  activeCategory === "all" || category === activeCategory,
              )
              .map((category) => {
                const products = PRODUCTS.filter(
                  (product) => product.category === category,
                );

                return (
                  <section
                    key={category}
                    aria-labelledby={`category-${category}`}
                  >
                    <div className="mb-5 border-s-2 border-accent ps-4">
                      <h3
                        id={`category-${category}`}
                        className="text-xl font-extrabold sm:text-2xl"
                      >
                        {t(`categories.${category}`)}
                      </h3>
                      <p className="mt-1 max-w-3xl text-sm leading-6 text-foreground/65 sm:text-base">
                        {t(`categoryDescriptions.${category}`)}
                      </p>
                    </div>
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          locale={locale}
                          formatPrice={(amount) =>
                            formatCurrency(locale, amount)
                          }
                          name={t(`items.${product.id}.name`)}
                          description={t(`items.${product.id}.description`)}
                          imageAlt={t(`items.${product.id}.imageAlt`)}
                          categoryLabel={t(`categories.${product.category}`)}
                          addLabel={t("addToCart")}
                          addedLabel={t("addedToCart")}
                          saleLabel={t("sale")}
                          newLabel={t("newProduct")}
                          ratingLabel={t("ratingLabel", {
                            rating: product.rating?.toFixed(1) ?? "",
                            reviews: formatNumber(locale, product.reviews ?? 0),
                          })}
                          added={addedProductId === product.id}
                          onAdd={() => handleAdd(product.id)}
                        />
                      ))}
                    </ul>
                  </section>
                );
              })}
          </div>

          <p className="mt-8 rounded-2xl border border-dashed border-accent/30 bg-accent/5 px-5 py-4 text-sm leading-6 text-foreground/65">
            {t("demoNotice")}
          </p>
        </section>
      </Container>
    </main>
  );
}

type ProductCardProps = {
  product: StoreProduct;
  locale: string;
  formatPrice: (amount: number) => string;
  name: string;
  description: string;
  imageAlt: string;
  categoryLabel: string;
  addLabel: string;
  addedLabel: string;
  saleLabel: string;
  newLabel: string;
  ratingLabel: string;
  added: boolean;
  onAdd: () => void;
};

function ProductCard({
  product,
  locale,
  formatPrice,
  name,
  description,
  imageAlt,
  categoryLabel,
  addLabel,
  addedLabel,
  saleLabel,
  newLabel,
  ratingLabel,
  added,
  onAdd,
}: ProductCardProps) {
  return (
    <li data-product-card="">
      <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-surface transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_26px_55px_-30px_color-mix(in_srgb,var(--la-inverse)_85%,transparent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <div className="relative aspect-[1.15] overflow-hidden bg-surface-raised">
          <Image
            src={product.image}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
          />
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-linear-to-br ${product.accent} mix-blend-multiply`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/55 via-transparent to-background/10" />
          <span className="absolute start-4 top-4 rounded-full border border-white/25 bg-background/70 px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-foreground shadow-sm backdrop-blur-md rtl:tracking-normal">
            {categoryLabel}
          </span>
          {product.compareAt ? (
            <span className="absolute end-4 top-4 rounded-full bg-accent px-3 py-1.5 text-xs font-extrabold text-inverse shadow-md">
              {saleLabel}
            </span>
          ) : null}
          <span className="absolute bottom-4 end-4 text-xs font-bold tracking-[0.16em] text-white/85">
            LA / {product.label}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-extrabold leading-snug">{name}</h3>
              <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-foreground/65">
                {description}
              </p>
            </div>
            {product.rating !== undefined ? (
              <span
                aria-label={ratingLabel}
                className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-foreground/60"
              >
                <Star
                  className="size-3.5 fill-accent text-accent"
                  aria-hidden="true"
                />
                {product.rating.toFixed(1)}
                {product.reviews ? (
                  <span className="text-foreground/45">
                    (
                    {new Intl.NumberFormat(
                      locale === "ar" ? "ar-SA" : "en-SA",
                      {
                        notation: "compact",
                        maximumFractionDigits: 0,
                      },
                    ).format(product.reviews)}
                    )
                  </span>
                ) : null}
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-foreground/5 px-2 py-1 text-[0.65rem] font-bold text-foreground/50">
                {newLabel}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div>
              <p className="text-lg font-extrabold tabular-nums text-foreground">
                {formatPrice(product.price)}
              </p>
              {product.compareAt ? (
                <p className="mt-0.5 text-xs font-medium text-foreground/45 line-through">
                  {formatPrice(product.compareAt)}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onAdd}
              aria-label={`${added ? addedLabel : addLabel}: ${name}`}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-extrabold transition-[background-color,color,transform,box-shadow] duration-300 active:scale-95 ${
                added
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                  : "bg-accent text-inverse shadow-[0_8px_22px_-12px_color-mix(in_srgb,var(--la-accent)_80%,transparent)] hover:shadow-[0_12px_26px_-10px_color-mix(in_srgb,var(--la-accent)_90%,transparent)]"
              }`}
            >
              {added ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Plus className="size-4" aria-hidden="true" />
              )}
              {added ? addedLabel : addLabel}
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}
