"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStoreCart } from "./StoreCartContext";

type CartButtonProps = {
  className?: string;
};

export function CartButton({ className = "" }: CartButtonProps) {
  const t = useTranslations("storeCart");
  const { cartCount, isCartOpen, openCart } = useStoreCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={`glass-panel relative inline-flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition-[color,transform] duration-200 hover:text-accent active:scale-95 ${className}`}
      aria-label={t("openCart", { count: cartCount })}
      aria-haspopup="dialog"
      aria-expanded={isCartOpen}
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      {cartCount > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -end-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full border-2 border-background bg-accent px-1 text-[0.65rem] font-extrabold leading-4 text-inverse shadow-sm"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      ) : null}
    </button>
  );
}
