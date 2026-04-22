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
  ({ products, direction, darkMode, isPaused, setIsPaused }) => {
    const containerRef = useRef(null);
    const resumeTimeout = useRef(null);
    const rafRef = useRef(null);

    const scrollItems = useMemo(() => {
      if (!products || products.length === 0) return [];
      return [...products, ...products];
    }, [products]);

    // 🎯 Auto Scroll باستخدام requestAnimationFrame (أنعم بكتير)
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      let speed = direction === "right" ? 0.3 : -0.3;

      const animate = () => {
        if (!isPaused) {
          el.scrollLeft += speed;

          const halfWidth = el.scrollWidth / 2;

          if (el.scrollLeft >= halfWidth) el.scrollLeft = 0;
          if (el.scrollLeft <= 0) el.scrollLeft = halfWidth;
        }

        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(rafRef.current);
    }, [isPaused, direction]);

    // ⏸️ Pause + Resume بعد 3 ثواني
    const handlePause = () => {
      setIsPaused(true);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };

    const handleResume = () => {
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);

      resumeTimeout.current = setTimeout(() => {
        setIsPaused(false);
      }, 3000); // ⏱️ 3 ثواني
    };

    // 👉 الأسهم
    const scrollManual = (offset) => {
      handlePause();

      const el = containerRef.current;
      if (!el) return;

      el.scrollBy({
        left: offset,
        behavior: "smooth",
      });

      handleResume();
    };

    if (scrollItems.length === 0) return null;

    const arrowClass = `absolute top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-xl transition-all duration-300 backdrop-blur-md
      ${darkMode
        ? "bg-zinc-900/80 text-white hover:bg-[#86FE05] hover:text-black"
        : "bg-white/80 text-black hover:bg-black hover:text-white"
      }`;

    return (
      <div className="w-full relative py-6">

        {/* الأسهم */}
        <button
          onClick={() => scrollManual(-320)}
          className={`${arrowClass} left-2`}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => scrollManual(320)}
          className={`${arrowClass} right-2`}
        >
          <ChevronRight size={22} />
        </button>

        {/* SCROLLER */}
        <div
          ref={containerRef}
          className="w-full overflow-x-auto whitespace-nowrap scroll-smooth no-scrollbar"
          
          // 💡 Mobile Touch محترم
          onTouchStart={handlePause}
          onTouchEnd={handleResume}

          // 💻 Desktop
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
        >
          <div className="inline-flex gap-4 px-3">
            {scrollItems.map((product, index) => (
              <div
                key={`${product._id}-${index}`}
                className="w-56 sm:w-64 md:w-72 flex-shrink-0"
                
                // 🔥 يمنع double click
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ProductCard
                  product={product}
                  onClick={() => handlePause()} // أول ضغطة تشتغل
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
          ? "border-[#86FE05]/20 bg-[#0a0a0a]"
          : "border-zinc-200 bg-white"
      }`}
      style={{ height: "350px" }}
    >

      {/* IMAGE */}
      {hero.image?.url && (
        <div className="absolute inset-0 z-0">
          <img
            src={hero.image.url}
            alt="Banner"
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
      ? ["0px 0px 0px #86FE05", "0px 0px 20px #86FE05", "0px 0px 0px #86FE05"] // نبض ضوئي في الدارك مود
      : ["0px 0px 0px rgba(0,0,0,0)", "0px 10px 20px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"]
  }}
 transition={{
  duration: 6,   // ⬅️ بدل 3 = أبطأ وناعم
  repeat: Infinity,
  ease: "easeInOut"
}}
  // ------------------------------------------

  onClick={() => navigate("/products")}
  className={`mt-6 px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm border-2 transition-all duration-300
    ${darkMode ? "border-white text-black bg-white " : "bg-black border-black text-white hover:bg-zinc-800"}`}
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
  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
    {categories.map((cat) => (
      <div 
        key={cat.id || cat._id} // دعم للـ id أو _id
        onClick={() => navigate(`/products/category/${cat.id || cat._id}`)}
        className="group relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden cursor-pointer border border-transparent hover:border-[#86FE05] transition-all duration-500 shadow-lg"
      >
        {/* الصورة - اتأكدت إنها بتقرأ من cat.image.url */}
        {cat.image?.url && (
          <img 
            src={cat.image.url} 
            alt={cat.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        )}
        
        {/* الطبقة الشفافة واسم القسم */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors duration-500 group-hover:bg-black/20">
          <h3 className="text-white text-2xl md:text-4xl font-black uppercase italic tracking-tighter drop-shadow-2xl">
            {/* التعديل هنا: بما إن الـ JSON فيه "name" فقط */}
            {cat.name} 
          </h3>
        </div>

        {/* خط ديكور سفلي */}
        <div className="absolute bottom-0 left-0 w-0 h-2 bg-[#86FE05] group-hover:w-full transition-all duration-500" />
      </div>
    ))}
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