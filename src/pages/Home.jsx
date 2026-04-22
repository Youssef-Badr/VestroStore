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


const MarqueeScroller = React.memo(
  ({ products, direction = "right", darkMode }) => {
    const containerRef = useRef(null);

    const [isPaused, setIsPaused] = useState(false);

    const rafRef = useRef(null);
    const velocityRef = useRef(0);
    const lastTouchX = useRef(0);
    const lastTime = useRef(0);
    const resumeTimeout = useRef(null);

    const scrollItems = useMemo(() => {
      if (!products?.length) return [];
      return [...products, ...products];
    }, [products]);

    // 🔁 Infinite Loop Fix
    const handleInfiniteLoop = () => {
      const el = containerRef.current;
      if (!el) return;

      const half = el.scrollWidth / 2;

      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
      }

      if (el.scrollLeft <= 0) {
        el.scrollLeft += half;
      }
    };

    // 🎯 Auto Scroll Engine
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const baseSpeed = direction === "right" ? 0.7 : -0.7;

      const animate = () => {
        if (!isPaused) {
          el.scrollLeft += baseSpeed + velocityRef.current;

          velocityRef.current *= 0.96;

          handleInfiniteLoop(); // 🔥 أهم سطر
        }

        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(rafRef.current);
    }, [isPaused, direction]);

    // ⏸️ Pause / Resume
    const pause = () => {
      setIsPaused(true);
      clearTimeout(resumeTimeout.current);
    };

    const resume = () => {
      clearTimeout(resumeTimeout.current);
      resumeTimeout.current = setTimeout(() => {
        setIsPaused(false);
      }, 3000);
    };

    // 👆 Touch (Mobile)
    const onTouchStart = (e) => {
      pause();
      lastTouchX.current = e.touches[0].clientX;
      lastTime.current = Date.now();
    };

    const onTouchMove = (e) => {
      const x = e.touches[0].clientX;
      const dx = lastTouchX.current - x;

      const now = Date.now();
      const dt = now - lastTime.current;

      velocityRef.current = (dx / dt) * 1.8;

      const el = containerRef.current;
      el.scrollLeft += dx;

      handleInfiniteLoop(); // 🔥 يخلي السحب لا نهائي

      lastTouchX.current = x;
      lastTime.current = now;
    };

    const onTouchEnd = () => {
      resume();
    };

    // 👉 الأسهم
    const scrollManual = (offset) => {
      pause();

      const el = containerRef.current;

      el.scrollBy({
        left: offset,
        behavior: "smooth",
      });

      setTimeout(() => {
        handleInfiniteLoop(); // 🔥 مهم
      }, 300);

      resume();
    };

    if (!scrollItems.length) return null;

    return (
      <div className="relative w-full py-6" dir="ltr">

        {/* ⬅️➡️ Arrows */}
        <button
          onClick={() => scrollManual(-300)}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-xl
          ${darkMode
              ? "bg-zinc-900/80 text-white"
              : "bg-white/80 text-black"
            }`}
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => scrollManual(300)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-xl
          ${darkMode
              ? "bg-zinc-900/80 text-white"
              : "bg-white/80 text-black"
            }`}
        >
          <ChevronRight />
        </button>

        {/* 🔥 SCROLLER */}
        <div
          ref={containerRef}
          className="overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="inline-flex gap-4 px-3">
            {scrollItems.map((product, index) => (
              <div
                key={`${product._id}-${index}`}
                className="w-56 sm:w-64 md:w-72 flex-shrink-0"
              >
                <ProductCard
                  product={product}
                  onClick={(e) => e.stopPropagation()} // ✅ click من أول مرة
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

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
      className="min-h-screen pt-24 transition-colors duration-500"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ backgroundColor: darkMode ? "#000000" : "#ffffff", color: darkMode ? "#ffffff" : "#000000" }}
    >
      <div className="container mx-auto px-4 py-10 space-y-20">
        
       
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
      style={{ height: "350px" }}
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
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-3 ">
          {isRTL ? hero.titleAr : hero.titleEn}
        </h1>

        <p className="text-lg md:text-xl font-medium max-w-2xl opacity-90 uppercase tracking-widest">
          {isRTL ? hero.subtitleAr : hero.subtitleEn}
        </p>

      <button
  onClick={(e) => {
    e.stopPropagation();
    navigate("/products");
  }}
  className="
    mt-6 px-7 py-3 
    font-black rounded-xl shadow-lg
    transition-all duration-300
    hover:scale-110 active:scale-95
    animate-bounce

    bg-slate-300 text-black
    dark:bg-white dark:text-black

    hover:shadow-[0_0_25px_rgba(103,190,10,0.6)]
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
            <div className="w-full flex justify-between items-end px-4 mb-2">
               <h3 className="text-2xl font-black uppercase tracking-tighter">
                 {isRTL ? "اكتشف مجموعتنا" : "Explore Collection"}
               </h3>
            </div>
            
            <MarqueeScroller 
              products={allProducts} 
              direction={isRTL ? "right" : "left"} 
              darkMode={darkMode}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
            />
            
           <motion.button
  whileHover={{ scale: 1.1 }} // بيكبر أكتر شوية وقت الهوفر
  whileTap={{ scale: 0.9 }}
  
  // --- الحركة المستمرة (Infinite Animation) ---
  animate={{
    y: [0, -8, 0], // بيطلع 8 بيكسل وينزل مكانه
    boxShadow: darkMode 
      ? ["0px 0px 0px #B91C1C", "0px 0px 20px #B91C1C", "0px 0px 0px #B91C1C"] // نبض ضوئي في الدارك مود
      : ["0px 0px 0px rgba(0,0,0,0)", "0px 10px 20px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"]
  }}
 transition={{
  duration: 6,   // ⬅️ بدل 3 = أبطأ وناعم
  repeat: Infinity,
  ease: "easeInOut"
}}
  // ------------------------------------------

  onClick={() => navigate("/products")}
  className={`mt-6 px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm  transition-all duration-300
    ${darkMode ? " text-black bg-white hover:bg-red-600 " : "bg-black  text-white hover:bg-red-600 "}`}
>
  {isRTL ? " تسوق كل المنتجات " : " Shop All Products"}
</motion.button>
          </div>
        )}

{/* Categories Section */}
<div className="py-10">

  <div className="text-center mb-12">
    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
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
            group relative h-44 sm:h-52 md:h-64 rounded-[2.5rem] overflow-hidden cursor-pointer 
            border border-transparent hover:border-red-700
            transition-all duration-500 shadow-lg

            ${isLastOdd ? "col-span-2 md:col-span-1" : ""}
          `}
        >
          
          {/* Image */}
          {cat.image?.url && (
            <img
              src={cat.image.url}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center 
                          transition-colors duration-500 group-hover:bg-black/20 text-center">

            <h3 className="text-white text-2xl md:text-4xl font-black uppercase italic tracking-tighter drop-shadow-2xl text-center">
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
        <div className="py-10">
           <h2 className="text-4xl md:text-7xl font-black uppercase mb-12 italic">
             {isRTL ? "منتجات مميزة" : "Featured Produts"}
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {featured.map(p => <ProductCard key={p._id} product={p} />)}
           </div>
        </div>

      </div>
    </div>
  );
}