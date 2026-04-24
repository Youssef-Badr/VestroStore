/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useMemo,
  lazy,
  Suspense,
  useRef,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Contexts
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import api from "../../src/api/axiosInstance";

const optimizeImage = (url, width = 800) => {
  if (!url) return "";
  if (!url.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_fill/`
  );
};


// Lazy Product Card
const ProductCard = lazy(() => import("../components/ProductCard"));

/* -------------------- Helpers -------------------- */


const HomeSkeleton = ({ darkMode }) => (
  <div className="space-y-6">
    <div
      className={`h-[320px] rounded-[2.5rem] animate-pulse ${
        darkMode ? "bg-zinc-900" : "bg-zinc-100"
      }`}
    />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`h-56 rounded-3xl animate-pulse ${
            darkMode ? "bg-zinc-900" : "bg-zinc-100"
          }`}
        />
      ))}
    </div>
  </div>
);

/* -------------------- Marquee -------------------- */

const MarqueeScroller = React.memo(({ products, darkMode }) => {
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  const items = useMemo(() => {
    if (!products?.length) return [];
    return [...products, ...products];
  }, [products]);

  const fixLoop = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const half = el.scrollWidth / 2;

    if (el.scrollLeft >= half) {
      el.scrollLeft -= half;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += half;
    }
  }, []);

  const onScroll = useCallback(() => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fixLoop();
    }, 80);
  }, [fixLoop]);

  const scrollManual = (type) => {
    const el = containerRef.current;
    if (!el) return;

    const card =
      el.querySelector(".product-card-container")?.offsetWidth || 280;

    const gap = 16;
    const move = card + gap;

    el.scrollBy({
      left: type === "next" ? move : -move,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <div className="relative w-full py-5" dir="ltr">
      {/* Arrows */}
      <button
        onClick={() => scrollManual("prev")}
        className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow-xl active:scale-90 ${
          darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
        }`}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => scrollManual("next")}
        className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow-xl active:scale-90 ${
          darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
        }`}
      >
        <ChevronRight size={22} />
      </button>

      {/* Slider */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="overflow-x-auto no-scrollbar flex gap-4 px-4 md:px-6"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {items.map((product, index) => (
          <div
            key={`${product._id}-${index}`}
            className="product-card-container flex-shrink-0 w-48 sm:w-72 md:w-80"
          >
            <Suspense
              fallback={
                <div
                  className={`h-72 rounded-3xl animate-pulse ${
                    darkMode ? "bg-zinc-900" : "bg-zinc-100"
                  }`}
                />
              }
            >
              <ProductCard product={product} />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
});

/* -------------------- Home -------------------- */

export default function Home() {
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const isRTL = language === "ar";

  const [pageData, setPageData] = useState({
    hero: null,
    featured: [],
    categories: [],
    allProducts: [],
    loading: true,
  });

  /* -------------------- Load Data Fast -------------------- */

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        // cache first
        const cache = sessionStorage.getItem("home-cache");

        if (cache) {
          setPageData(JSON.parse(cache));
        }

        const [heroRes, featuredRes, catsRes, allRes] = await Promise.all([
          api.get("/settings/hero", { signal: controller.signal }),
          api.get("/products/featured", { signal: controller.signal }),
          api.get("/categories", { signal: controller.signal }),
          api.get("/products", { signal: controller.signal }),
        ]);

        const freshData = {
          hero: heroRes.data,
          featured: featuredRes.data,
          categories: catsRes.data,
          allProducts: allRes.data,
          loading: false,
        };

        setPageData(freshData);
        sessionStorage.setItem("home-cache", JSON.stringify(freshData));
      } catch (error) {
        if (error.name !== "CanceledError") {
          setPageData((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      }
    };

    loadData();

    return () => controller.abort();
  }, []);

  const { hero, featured, categories, allProducts, loading } = pageData;

  if (loading) {
    return (
      <div
        className="min-h-screen pt-24 px-4"
        style={{
          backgroundColor: darkMode ? "#000" : "#fff",
        }}
      >
        <HomeSkeleton darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 md:pt-24 transition-colors duration-500"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        backgroundColor: darkMode ? "#000" : "#fff",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <div className="container mx-auto px-4 py-10 space-y-10">
        {/* HERO */}

        {hero?.isActive && (
          <div
            onClick={() => navigate("/products")}
            className={`relative h-[320px] md:h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer group border ${
              darkMode
                ? "border-red-700 bg-black"
                : "border-zinc-200 bg-white"
            }`}
          >
            {hero?.image?.url && (
              <>
                <img
                  src={optimizeImage(hero.image.url, 1400)}
                  alt="Banner"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/45" />
              </>
            )}

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-5">
              <h1 className="text-3xl md:text-7xl font-black uppercase mb-3">
                {isRTL ? hero.titleAr : hero.titleEn}
              </h1>

              <p className="text-sm md:text-xl opacity-90 max-w-2xl uppercase">
                {isRTL ? hero.subtitleAr : hero.subtitleEn}
              </p>

            <button
  onClick={(e) => {
    e.stopPropagation();
    navigate("/products");
  }}
  className="
    mt-6 px-3 py-3 
    font-black rounded-xl shadow-lg
    transition-all duration-300
    hover:scale-110 active:scale-95
    animate-bounce

    bg-white text-black
    dark:bg-black dark:text-white

    hover:bg-red-700
  "
>
  <span className="inline-flex items-center gap-2">
    {isRTL ? " تسوق المنتجات الآن" : " Shop All Products"}
  </span>
 </button>
            </div>
          </div>
        )}

        {/* COLLECTION */}

       {allProducts.length > 0 && (
  <section className="flex flex-col items-center text-center">
    
    <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">
      {isRTL ? "اكتشف مجموعتنا" : "Explore Collection"}
    </h2>

    <div className="w-full flex justify-center">
      <MarqueeScroller
        products={allProducts}
        darkMode={darkMode}
      />
    </div>

    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate("/products")}
      className={`mt-5 px-10 py-4 rounded-full font-black uppercase hover:bg-red-700 ${
        darkMode ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      {isRTL ? "كل المنتجات" : "Shop All"}
    </motion.button>

  </section>
)}

        {/* CATEGORIES */}

        {categories.length > 0 && (
          <section>
            <h2 className="text-3xl md:text-6xl font-black uppercase text-center mb-8">
              {isRTL ? "الأقسام" : "Categories"}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((cat, index) => {
                const isLastOdd =
                  categories.length % 2 !== 0 &&
                  index === categories.length - 1;

                return (
                  <div
                    key={cat._id}
                    onClick={() =>
                      navigate(`/products/category/${cat._id}`)
                    }
                    className={`relative h-36 sm:h-52 md:h-64 rounded-[2.5rem] overflow-hidden cursor-pointer group ${
                      isLastOdd ? "col-span-2 md:col-span-1" : ""
                    }`}
                  >
                    <img
                      src={optimizeImage(cat.image?.url, 500)}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <h3 className="text-white text-xl md:text-3xl font-black uppercase text-center px-2">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FEATURED */}

        {featured.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-5xl font-black uppercase mb-8">
              {isRTL ? "منتجات مميزة" : "Featured Products"}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((item) => (
                <Suspense
                  key={item._id}
                  fallback={
                    <div
                      className={`h-72 rounded-3xl animate-pulse ${
                        darkMode ? "bg-zinc-900" : "bg-zinc-100"
                      }`}
                    />
                  }
                >
                  <ProductCard product={item} />
                </Suspense>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}