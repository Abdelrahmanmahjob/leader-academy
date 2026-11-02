export type ProductCategory = "apparel" | "protection" | "training" | "bags";

export type StoreProduct = {
  id: string;
  category: ProductCategory;
  price: number;
  compareAt?: number;
  rating?: number;
  reviews?: number;
  image: string;
  accent: string;
  label: string;
};

export const PRODUCTS: StoreProduct[] = [
  {
    id: "custom-soccer-kit",
    category: "apparel",
    price: 80.51,
    image: "/images/products-page/product.png",
    accent: "from-blue-500/30 to-cyan-400/10",
    label: "01",
  },
  {
    id: "competition-training-jacket",
    category: "apparel",
    price: 152.9,
    rating: 4.7,
    reviews: 43,
    image: "/images/products-page/product-2.webp",
    accent: "from-accent/35 to-amber-400/10",
    label: "02",
  },
  {
    id: "2026-city-hoodie",
    category: "apparel",
    price: 484.32,
    rating: 4.9,
    reviews: 10,
    image: "/images/products-page/product-3.webp",
    accent: "from-violet-500/30 to-fuchsia-400/10",
    label: "03",
  },
  {
    id: "junior-goalkeeper-gloves",
    category: "protection",
    price: 199,
    rating: 4.3,
    reviews: 128,
    image: "/images/products-page/product-4.webp",
    accent: "from-emerald-500/30 to-lime-400/10",
    label: "04",
  },
  {
    id: "youth-shin-guards",
    category: "protection",
    price: 65,
    rating: 4.7,
    reviews: 386,
    image: "/images/products-page/product-5.webp",
    accent: "from-orange-500/35 to-yellow-400/10",
    label: "05",
  },
  {
    id: "non-slip-grip-socks",
    category: "protection",
    price: 96,
    rating: 4.5,
    reviews: 211,
    image: "/images/products-page/product-6.webp",
    accent: "from-sky-500/35 to-blue-400/10",
    label: "06",
  },
  {
    id: "speed-agility-ladder",
    category: "training",
    price: 146.06,
    rating: 4.8,
    reviews: 6,
    image: "/images/products-page/product-7.webp",
    accent: "from-orange-500/35 to-yellow-400/10",
    label: "07",
  },
  {
    id: "portable-soccer-goal",
    category: "training",
    price: 348.16,
    rating: 4.6,
    reviews: 116,
    image: "/images/products-page/product-8.webp",
    accent: "from-emerald-500/30 to-lime-400/10",
    label: "08",
  },
  {
    id: "precision-target-net",
    category: "training",
    price: 558.18,
    rating: 5,
    reviews: 7,
    image: "/images/products-page/product-9.webp",
    accent: "from-violet-500/30 to-fuchsia-400/10",
    label: "09",
  },
  {
    id: "soccer-backpack-ball-holder",
    category: "bags",
    price: 236.15,
    image: "/images/products-page/product-10.webp",
    accent: "from-rose-500/30 to-orange-400/10",
    label: "10",
  },
  {
    id: "multi-compartment-sports-backpack",
    category: "bags",
    price: 99.74,
    compareAt: 104.99,
    image: "/images/products-page/product-11.webp",
    accent: "from-indigo-500/30 to-violet-400/10",
    label: "11",
  },
  {
    id: "boot-bag",
    category: "bags",
    price: 74.12,
    rating: 4.8,
    reviews: 1000,
    image: "/images/products-page/product-12.webp",
    accent: "from-sky-500/35 to-blue-400/10",
    label: "12",
  },
];
