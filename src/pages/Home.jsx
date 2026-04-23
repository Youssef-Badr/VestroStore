/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo, lazy, Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// Contexts
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import api from "../../src/api/axiosInstance";

// Components
import ProductCard from "../components/ProductCard";


const MarqueeScroller = React.memo(({ products, direction = "right", darkMode }) => {
  const containerRef = useRef(null);
  const scrollTimeout = useRef(null);

  const scrollItems = useMemo(() => {
    if (!products?.length) return [];
    return [...products, ...products]; // مرتين كفاية
  }, [products]);

  const handleInfiniteLoop = () => {
    const el = containerRef.current;
    if (!el) return;

    const half = el.scrollWidth / 2;
    const buffer = 5;

    if (el.scrollLeft >= half - buffer) {
      el.scrollLeft = el.scrollLeft - half;
    } else if (el.scrollLeft <= buffer) {
      el.scrollLeft = el.scrollLeft + half;
    }
  };

  // 🔥 نعمل loop بعد ما المستخدم يوقف سحب
  const onScroll = () => {
    clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      handleInfiniteLoop();
    }, 120);
  };

  const scrollManual = (dir) => {
    const el = containerRef.current;
    if (!el) return;

    const cardWidth =
      el.querySelector(".product-card-container")?.offsetWidth || 300;

    const gap = 16;
    const offset = (cardWidth + gap) * (dir === "next" ? 1 : -1);

    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!scrollItems.length) return null;

  return (
    <div className="relative w-full py-5" dir="ltr">
      
      {/* الأسهم */}
      <button
        onClick={() => scrollManual("prev")}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow-xl active:scale-90
        ${darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"}`}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => scrollManual("next")}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow-xl active:scale-90
        ${darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"}`}
      >
        <ChevronRight size={22} />
      </button>

      {/* السلايدر */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="overflow-x-auto no-scrollbar flex gap-4 px-6 scroll-smooth"
        style={{
          scrollSnapType: "x none",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {scrollItems.map((product, index) => (
          <div
            key={`${product._id}-${index}`}
            className="product-card-container flex-shrink-0 w-48 sm:w-72 md:w-80"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
});

export default function Home() {
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const isRTL = language === "ar";

  const [isPaused, setIsPaused] = useState(false);
  const [pageData, setPageData] = useState({
    hero: null,
    featured: [],
    categories: [],
    allProducts: [],
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    async function loadPageData() {
      try {
        const [heroRes, productsRes, catsRes, allRes] = await Promise.all([
          api.get("/settings/hero"),
          api.get("/products/featured"),
          api.get("/categories"),
          api.get("/products"),
        ]);
        if (mounted) {
          setPageData({
            hero: heroRes.data,
            featured: productsRes.data,
            categories: catsRes.data,
            allProducts: allRes.data,
            loading: false,
          });
        }
      } catch (err) {
        if (mounted) setPageData((prev) => ({ ...prev, loading: false }));
      }
    }
    loadPageData();
    return () => { mounted = false; };
  }, []);

  const { hero, featured, categories, allProducts, loading } = pageData;

  return (
    <div
      className="min-h-screen pt-20 md:pt-24 transition-colors duration-500"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ backgroundColor: darkMode ? "#000000" : "#ffffff", color: darkMode ? "#ffffff" : "#000000" }}
    >
      <div className="container mx-auto px-4 py-10 space-y-5">
        
       
    <Suspense
  fallback={
    <div className="h-[400px] bg-zinc-900 animate-pulse rounded-[2.5rem]" />
  }
>
  {hero?.isActive && (
    <div
      onClick={() => navigate("/products")}
      className={`w-full overflow-hidden rounded-[2.5rem] border transition-all duration-700 relative cursor-pointer group ${
        darkMode
          ? "border-red-700 bg-[#0a0a0a]"
          : "border-zinc-200 bg-white"
      }`}
      style={{ height: "300px" }}
    >

      {/* IMAGE */}
      {hero.image?.url && (
        <div className="absolute inset-0 z-0">
        <img
  src={hero.image.url.replace("/upload/", "/upload/f_auto,q_auto,w_1200/")}
  alt="Banner"
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
/>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* TEXT */}
<div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white -translate-y-8 md:-translate-y-12">
        <h1 className="text-3xl md:text-7xl font-black    uppercase  mb-3 ">
          {isRTL ? hero.titleAr : hero.titleEn}
        </h1>

        <p className="text-xl md:text-xl font-medium max-w-2xl opacity-90 uppercase ">
          {isRTL ? hero.subtitleAr : hero.subtitleEn}
        </p>


      <button
  onClick={(e) => {
    e.stopPropagation();
    navigate("/products");
  }}
  className="
    mt-6 px-5 py-3 
    font-black rounded-xl shadow-lg
    transition-all duration-300
    hover:scale-110 active:scale-95
    animate-bounce

    bg-slate-300 text-black
    dark:bg-white dark:text-black

    hover:shadow-red-700
  "
>
  <span className="inline-flex items-center gap-2">
    {isRTL ? "🛍️ تسوق المنتجات الآن" : "🛍️ Shop All Products"}
  </span>
</button>

      </div>

    </div>
  )}
</Suspense>

      {/* --- Scroller Section --- */}
{!loading && allProducts.length > 0 && (
  <div className="flex flex-col items-center w-full overflow-hidden">
    <div className="w-full flex justify-between items-end px-6 mb-1">
      <h3 className="text-2xl font-black uppercase   ">
        {isRTL ? "اكتشف مجموعتنا" : "Explore Collection"}
      </h3>
    </div>
    
    <MarqueeScroller 
      products={allProducts} 
      direction={isRTL ? "right" : "left"} 
      darkMode={darkMode}
      // شيلنا الـ isPaused من هنا عشان المكون بيدير نفسه داخلياً
    />
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      // ... باقي الـ props زي ما هي
      onClick={() => navigate("/products")}
      className={`mt-5 px-12 py-5 rounded-full font-black uppercase text-lg transition-all duration-300
        ${darkMode ? "text-black bg-white" : "bg-black text-white hover:bg-red-600"}`}
    >
      {isRTL ? "تسوق كل المنتجات" : "Shop All Products"}
    </motion.button>
  </div>
)}

{/* Categories Section */}
<div className="py-5">

  <div className="text-center mb-8">
    <h2 className="text-4xl md:text-6xl font-black uppercase">
      {isRTL ? "الأقسام" : "Categories"}
    </h2>
  </div>

  {/* 🔥 SMART 2-COLUMN GRID */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

    {categories.map((cat, index) => {
      const isLastOdd = categories.length % 2 !== 0 && index === categories.length - 1;

      return (
        <div
          key={cat.id || cat._id}
          onClick={() =>
            navigate(`/products/category/${cat.id || cat._id}`)
          }
          className={`
            group relative h-36 sm:h-52 md:h-64 rounded-[2.5rem] overflow-hidden cursor-pointer 
            border border-transparent hover:border-red-700
            transition-all duration-500 shadow-lg

            ${isLastOdd ? "col-span-2 md:col-span-1" : ""}
          `}
        >
          
          {/* Image */}
          {cat.image?.url && (
            <img
  src={cat.image.url.replace("/upload/", "/upload/f_auto,q_auto,w_400/")}
  alt={cat.name}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
/>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center 
                          transition-colors duration-500 group-hover:bg-black/20 text-center">

            <h3 className="text-white text-2xl md:text-4xl font-black uppercase    drop-shadow-2xl text-center">
              {cat.name}
            </h3>

          </div>

          {/* Bottom line */}
          <div className="absolute bottom-0 left-0 w-0 h-2 bg-red-700 
                          group-hover:w-full transition-all duration-500" />

        </div>
      );
    })}

  </div>
</div>
        {/* Featured Section */}
        <div className="pb-7">
           <h2 className="text-2xl md:text-5xl font-black uppercase mb-10   ">
             {isRTL ? "منتجات مميزة" : "Featured Products"}
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {featured.map(p => <ProductCard key={p._id} product={p} />)}
           </div>
        </div>

      </div>
    </div>
  );
}