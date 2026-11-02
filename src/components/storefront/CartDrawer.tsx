"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PRODUCTS } from "@/content/products";
import { useStoreCart } from "./StoreCartContext";

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const subscribeToMount = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function formatCurrency(locale: string, amount: number) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CartDrawer() {
  const locale = useLocale();
  const t = useTranslations("storeCart");
  const p = useTranslations("productsPage");
  const {
    cart,
    cartCount,
    subtotal,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useStoreCart();
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isCartOpen) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !drawerRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !drawerRef.current.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isCartOpen, closeCart]);

  const handleCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = couponCode.trim().toUpperCase();
    const discounts: Record<string, number> = {
      LEADER10: 10,
      TEAM15: 15,
    };
    const discount = discounts[normalizedCode];

    if (!discount) {
      setCouponError(true);
      setCouponMessage(t("couponInvalid"));
      return;
    }

    setDiscountPercent(discount);
    setCouponCode(normalizedCode);
    setCouponError(false);
    setCouponMessage(t("couponApplied", { percent: discount }));
  };

  const clearCoupon = () => {
    setDiscountPercent(0);
    setCouponCode("");
    setCouponMessage("");
    setCouponError(false);
  };

  const discountAmount = Math.round(subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!isCartOpen}
      inert={!isCartOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCart();
      }}
      className={`fixed inset-0 z-[90] bg-background/45 backdrop-blur-sm transition-opacity duration-300 ${
        isCartOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal={isCartOpen}
        aria-labelledby="store-cart-title"
        style={{
          transform: isCartOpen
            ? "translateX(0)"
            : `translateX(${locale === "ar" ? "-100%" : "100%"})`,
        }}
        className="fixed inset-y-0 end-0 flex w-full max-w-[min(100vw,480px)] flex-col border-s border-border bg-surface shadow-[-24px_0_80px_-32px_color-mix(in_srgb,var(--la-inverse)_65%,transparent)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="store-cart-title" className="text-xl font-extrabold">
                {t("title")}
              </h2>
              <p className="mt-0.5 text-sm text-foreground/60">
                {t("itemCount", { count: cartCount })}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label={t("closeCart")}
            className="glass-panel inline-flex size-10 items-center justify-center rounded-full text-foreground transition-[color,transform] hover:text-accent active:scale-95"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex size-20 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
              <ShoppingBag className="size-9" aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-2xl font-extrabold">{t("emptyTitle")}</h3>
            <p className="mt-2 max-w-xs leading-7 text-foreground/65">
              {t("emptyDescription")}
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 font-bold text-inverse transition-transform hover:scale-[1.03] active:scale-[.98]"
            >
              {t("continueShopping")}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
              {cart.map((line) => {
                const product = PRODUCTS.find(
                  (item) => item.id === line.productId,
                );
                if (!product) {
                  throw new Error(`Unknown store product in cart: ${line.productId}`);
                }

                const name = p(`items.${product.id}.name`);

                return (
                  <li
                    key={product.id}
                    className="flex gap-4 rounded-2xl border border-border bg-background/65 p-3 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/30"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-raised">
                      <Image
                        src={product.image}
                        alt={p(`items.${product.id}.imageAlt`)}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-bold">{name}</p>
                          <p className="mt-1 text-sm font-semibold text-accent">
                            {formatCurrency(locale, product.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={t("removeItem", { name })}
                          className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1 rounded-full border border-border p-1">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(product.id)}
                            aria-label={t("decreaseItem", { name })}
                            className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-foreground/10"
                          >
                            <Minus className="size-3.5" aria-hidden="true" />
                          </button>
                          <span
                            aria-live="polite"
                            className="min-w-6 text-center text-sm font-bold tabular-nums"
                          >
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQuantity(product.id)}
                            aria-label={t("increaseItem", { name })}
                            className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-foreground/10"
                          >
                            <Plus className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        <span className="text-sm font-extrabold tabular-nums">
                          {formatCurrency(locale, product.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border bg-surface-raised/60 px-5 py-5 sm:px-7">
              <form onSubmit={handleCoupon}>
                <label
                  htmlFor="store-coupon"
                  className="text-sm font-bold text-foreground/80"
                >
                  {t("couponLabel")}
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="store-coupon"
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.target.value);
                      setCouponMessage("");
                      setCouponError(false);
                    }}
                    placeholder={t("couponPlaceholder")}
                    autoComplete="off"
                    dir="ltr"
                    className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold uppercase tracking-wide outline-none transition-colors placeholder:font-normal placeholder:normal-case placeholder:tracking-normal focus:border-accent"
                  />
                  {discountPercent > 0 ? (
                    <button
                      type="button"
                      onClick={clearCoupon}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 text-sm font-extrabold text-accent transition-colors hover:bg-accent/20"
                    >
                      <Check className="size-4" aria-hidden="true" />
                      {t("removeCoupon")}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 text-sm font-extrabold text-accent transition-colors hover:bg-accent/20"
                    >
                      {t("applyCoupon")}
                    </button>
                  )}
                </div>
                <p
                  aria-live="polite"
                  className={`mt-2 min-h-5 text-xs ${
                    couponError ? "text-destructive" : "text-accent"
                  }`}
                >
                  {couponMessage || t("demoCodes")}
                </p>
              </form>

              <dl className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-foreground/65">{t("subtotal")}</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatCurrency(locale, subtotal)}
                  </dd>
                </div>
                {discountPercent > 0 ? (
                  <div className="flex justify-between gap-3 text-accent">
                    <dt>{t("discount", { percent: discountPercent })}</dt>
                    <dd className="font-bold tabular-nums">
                      −{formatCurrency(locale, discountAmount)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-3 border-t border-border pt-3 text-base">
                  <dt className="font-extrabold">{t("total")}</dt>
                  <dd className="text-lg font-extrabold tabular-nums">
                    {formatCurrency(locale, total)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => setCheckoutMessage(true)}
                className="mt-4 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 font-extrabold text-inverse shadow-[0_12px_30px_-12px_color-mix(in_srgb,var(--la-accent)_80%,transparent)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_color-mix(in_srgb,var(--la-accent)_90%,transparent)] active:translate-y-0"
              >
                {t("checkout")}
                <span aria-hidden="true">·</span>
                {formatCurrency(locale, total)}
              </button>
              <p aria-live="polite" className="mt-2 min-h-5 text-center text-xs text-foreground/60">
                {checkoutMessage ? t("demoCheckout") : t("shippingNote")}
              </p>
            </div>
          </>
        )}

      </aside>
    </div>,
    document.body,
  );
}
