// /* eslint-disable no-unused-vars */
// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   lazy,
//   Suspense,
//   useRef,
//   useCallback,
// } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// // Contexts
// import { useLanguage } from "../contexts/LanguageContext";
// import { useTheme } from "../contexts/ThemeContext";
// import api from "../../src/api/axiosInstance";

// const optimizeImage = (url, width = 800) => {
//   if (!url) return "";
//   if (!url.includes("cloudinary")) return url;

//   return url.replace(
//     "/upload/",
//     `/upload/f_auto,q_auto,w_${width},c_fill/`
//   );
// };


// // Lazy Product Card
// const ProductCard = lazy(() => import("../components/ProductCard"));

// /* -------------------- Helpers -------------------- */


// const HomeSkeleton = ({ darkMode }) => (
//   <div className="space-y-6">
//     <div
//       className={`h-[320px] rounded-[2.5rem] animate-pulse ${
//         darkMode ? "bg-zinc-900" : "bg-zinc-100"
//       }`}
//     />
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {[...Array(4)].map((_, i) => (
//         <div
//           key={i}
//           className={`h-56 rounded-3xl animate-pulse ${
//             darkMode ? "bg-zinc-900" : "bg-zinc-100"
//           }`}
//         />
//       ))}
//     </div>
//   </div>
// );

// /* -------------------- Marquee -------------------- */

// // const MarqueeScroller = React.memo(({ products, darkMode }) => {
// //   const containerRef = useRef(null);
// //   const timeoutRef = useRef(null);

// //   const items = useMemo(() => {
// //     if (!products?.length) return [];
// //     return [...products, ...products];
// //   }, [products]);

// //   const fixLoop = useCallback(() => {
// //     const el = containerRef.current;
// //     if (!el) return;

// //     const half = el.scrollWidth / 2;

// //     if (el.scrollLeft >= half) {
// //       el.scrollLeft -= half;
// //     } else if (el.scrollLeft <= 0) {
// //       el.scrollLeft += half;
// //     }
// //   }, []);

// //   const onScroll = useCallback(() => {
// //     clearTimeout(timeoutRef.current);

// //     timeoutRef.current = setTimeout(() => {
// //       fixLoop();
// //     }, 80);
// //   }, [fixLoop]);

// //   const scrollManual = (type) => {
// //     const el = containerRef.current;
// //     if (!el) return;

// //     const card =
// //       el.querySelector(".product-card-container")?.offsetWidth || 280;

// //     const gap = 16;
// //     const move = card + gap;

// //     el.scrollBy({
// //       left: type === "next" ? move : -move,
// //       behavior: "smooth",
// //     });
// //   };

// //   if (!items.length) return null;

// //   return (
// //     <div className="relative w-full py-5" dir="ltr">
// //       {/* Arrows */}
// //       <button
// //         onClick={() => scrollManual("prev")}
// //         className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow-xl active:scale-90 ${
// //           darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
// //         }`}
// //       >
// //         <ChevronLeft size={22} />
// //       </button>

// //       <button
// //         onClick={() => scrollManual("next")}
// //         className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow-xl active:scale-90 ${
// //           darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
// //         }`}
// //       >
// //         <ChevronRight size={22} />
// //       </button>

// //       {/* Slider */}
// //       <div
// //         ref={containerRef}
// //         onScroll={onScroll}
// //         className="overflow-x-auto no-scrollbar flex gap-4 px-4 md:px-6"
// //         style={{
// //           WebkitOverflowScrolling: "touch",
// //           scrollBehavior: "smooth",
// //         }}
// //       >
// //         {items.map((product, index) => (
// //           <div
// //             key={`${product._id}-${index}`}
// //             className="product-card-container flex-shrink-0 w-48 sm:w-72 md:w-80"
// //           >
// //             <Suspense
// //               fallback={
// //                 <div
// //                   className={`h-72 rounded-3xl animate-pulse ${
// //                     darkMode ? "bg-zinc-900" : "bg-zinc-100"
// //                   }`}
// //                 />
// //               }
// //             >
// //               <ProductCard product={product} />
// //             </Suspense>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // });
// const MarqueeScroller = React.memo(({ products, darkMode }) => {
//   const containerRef = useRef(null);

//   // 🔁 كرر 3 مرات عشان نعمل seamless loop
//   const items = useMemo(() => {
//     if (!products?.length) return [];
//     return [...products, ...products, ...products];
//   }, [products]);

//   // 📍 نبدأ من النص
//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el || !products?.length) return;

//     requestAnimationFrame(() => {
//       const third = el.scrollWidth / 3;
//       el.scrollLeft = third;
//     });
//   }, [products]);

//   // 🔄 infinite loop بدون جليتش
//   const onScroll = useCallback(() => {
//     const el = containerRef.current;
//     if (!el) return;

//     const oneThird = el.scrollWidth / 3;
//     const threshold = 5;

//     // لو قرب من آخر نسخة
//     if (el.scrollLeft >= oneThird * 2 - threshold) {
//       el.scrollLeft -= oneThird;
//     }

//     // لو قرب من أول نسخة
//     if (el.scrollLeft <= threshold) {
//       el.scrollLeft += oneThird;
//     }
//   }, []);

//   // ⬅️➡️ manual scroll
//   const scrollManual = (dir) => {
//     const el = containerRef.current;
//     if (!el) return;

//     const card =
//       el.querySelector(".product-card-container")?.offsetWidth || 280;

//     const move = card + 16;

//     el.scrollBy({
//       left: dir === "next" ? move : -move,
//       behavior: "smooth",
//     });
//   };

//   if (!items.length) return null;

//   return (
//     <div className="relative w-full py-5" dir="ltr">
//       {/* Left */}
//       <button
//         onClick={() => scrollManual("prev")}
//         className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow ${
//           darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
//         }`}
//       >
//         <ChevronLeft size={22} />
//       </button>

//       {/* Right */}
//       <button
//         onClick={() => scrollManual("next")}
//         className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow ${
//           darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
//         }`}
//       >
//         <ChevronRight size={22} />
//       </button>

//       {/* Slider */}
//       <div
//         ref={containerRef}
//         onScroll={onScroll}
//         className="overflow-x-auto no-scrollbar flex gap-4 px-4 md:px-6"
//         style={{
//           WebkitOverflowScrolling: "touch",
//         }}
//       >
//         {items.map((product, index) => (
//           <div
//             key={`${product._id}-${index}`}
//             className="product-card-container flex-shrink-0 w-48 sm:w-72 md:w-80"
//           >
//             <Suspense
//               fallback={
//                 <div
//                   className={`h-72 rounded-3xl animate-pulse ${
//                     darkMode ? "bg-zinc-900" : "bg-zinc-100"
//                   }`}
//                 />
//               }
//             >
//               <ProductCard product={product} />
//             </Suspense>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// });
// /* -------------------- Home -------------------- */

// export default function Home() {
//   const { language } = useLanguage();
//   const { darkMode } = useTheme();
//   const navigate = useNavigate();

//   const isRTL = language === "ar";

//   const [pageData, setPageData] = useState({
//     hero: null,
//     featured: [],
//     categories: [],
//     allProducts: [],
//     loading: true,
//   });

//   /* -------------------- Load Data Fast -------------------- */

//   useEffect(() => {
//     const controller = new AbortController();

//     const loadData = async () => {
//       try {
//         // cache first
//         const cache = sessionStorage.getItem("home-cache");

//         if (cache) {
//           setPageData(JSON.parse(cache));
//         }

//         const [heroRes, featuredRes, catsRes, allRes] = await Promise.all([
//           api.get("/settings/hero", { signal: controller.signal }),
//           api.get("/products/featured", { signal: controller.signal }),
//           api.get("/categories", { signal: controller.signal }),
//           api.get("/products", { signal: controller.signal }),
//         ]);

//         const freshData = {
//           hero: heroRes.data,
//           featured: featuredRes.data,
//           categories: catsRes.data,
//            allProducts: allRes.data.filter(p => p.isActive),
//           loading: false,
//         };

//         setPageData(freshData);
//         sessionStorage.setItem("home-cache", JSON.stringify(freshData));
//       } catch (error) {
//         if (error.name !== "CanceledError") {
//           setPageData((prev) => ({
//             ...prev,
//             loading: false,
//           }));
//         }
//       }
//     };

//     loadData();

//     return () => controller.abort();
//   }, []);

//   const { hero, featured, categories, allProducts, loading } = pageData;

//   if (loading) {
//     return (
//       <div
//         className="min-h-screen pt-24 px-4"
//         style={{
//           backgroundColor: darkMode ? "#000" : "#fff",
//         }}
//       >
//         <HomeSkeleton darkMode={darkMode} />
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen pt-20 md:pt-24 transition-colors duration-500"
//       dir={isRTL ? "rtl" : "ltr"}
//       style={{
//         backgroundColor: darkMode ? "#000" : "#fff",
//         color: darkMode ? "#fff" : "#000",
//       }}
//     >
//       <div className="container mx-auto px-4 py-10 space-y-10">
//         {/* HERO */}

//         {hero?.isActive && (
//           <div
//             onClick={() => navigate("/products")}
//             className={`relative h-[320px] md:h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer group border ${
//               darkMode
//                 ? "border-red-700 bg-black"
//                 : "border-zinc-200 bg-white"
//             }`}
//           >
//             {hero?.image?.url && (
//               <>
//                 <img
//                   src={optimizeImage(hero.image.url, 1400)}
//                   alt="Banner"
//                   loading="eager"
//                   decoding="async"
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
//                 <div className="absolute inset-0 bg-black/45" />
//               </>
//             )}

//             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-5">
//               <h1 className="text-3xl md:text-7xl font-black uppercase mb-3">
//                 {isRTL ? hero.titleAr : hero.titleEn}
//               </h1>

//               <p className="text-sm md:text-xl opacity-90 max-w-2xl uppercase">
//                 {isRTL ? hero.subtitleAr : hero.subtitleEn}
//               </p>

//             <button
//   onClick={(e) => {
//     e.stopPropagation();
//     navigate("/products");
//   }}
//   className="
//     mt-6 px-3 py-3 
//     font-black rounded-xl shadow-lg
//     transition-all duration-300
//     hover:scale-110 active:scale-95
//     animate-bounce

//     bg-white text-black
//     dark:bg-black dark:text-white

//     hover:bg-red-700
//   "
// >
//   <span className="inline-flex items-center gap-2">
//     {isRTL ? " تسوق المنتجات الآن" : " Shop All Products"}
//   </span>
//  </button>
//             </div>
//           </div>
//         )}

//         {/* COLLECTION */}

//        {allProducts.length > 0 && (
//   <section className="flex flex-col items-center text-center">
    
//     <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">
//       {isRTL ? "اكتشف مجموعتنا" : "Explore Collection"}
//     </h2>

//     <div className="w-full flex justify-center">
//       <MarqueeScroller
//         products={allProducts}
//         darkMode={darkMode}
//       />
//     </div>

//     <motion.button
//       whileHover={{ scale: 1.04 }}
//       whileTap={{ scale: 0.96 }}
//       onClick={() => navigate("/products")}
//       className={`mt-5 px-10 py-4 rounded-full font-black uppercase hover:bg-red-700 ${
//         darkMode ? "bg-white text-black" : "bg-black text-white"
//       }`}
//     >
//       {isRTL ? "كل المنتجات" : "Shop All"}
//     </motion.button>

//   </section>
// )}

//         {/* CATEGORIES */}

//         {categories.length > 0 && (
//           <section>
//             <h2 className="text-3xl md:text-6xl font-black uppercase text-center mb-8">
//               {isRTL ? "الأقسام" : "Categories"}
//             </h2>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//               {categories.map((cat, index) => {
//                 const isLastOdd =
//                   categories.length % 2 !== 0 &&
//                   index === categories.length - 1;

//                 return (
//                   <div

                 
//                     key={cat._id}
//                     onClick={() =>
//                       navigate(`/products/category/${cat.id || cat._id}`)
//                     }
//                     className={`relative h-36 sm:h-52 md:h-64 rounded-[2.5rem] overflow-hidden cursor-pointer group ${
//                       isLastOdd ? "col-span-2 md:col-span-1" : ""
//                     }`}
//                   >
//                     <img
//                       src={optimizeImage(cat.image?.url, 500)}
//                       alt={cat.name}
//                       loading="lazy"
//                       decoding="async"
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                     />

//                     <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
//                       <h3 className="text-white text-xl md:text-3xl font-black uppercase text-center px-2">
//                         {cat.name}
//                       </h3>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         )}

//         {/* FEATURED */}

//         {featured.length > 0 && (
//           <section>
//             <h2 className="text-2xl md:text-5xl font-black uppercase mb-8">
//               {isRTL ? "منتجات مميزة" : "Featured Products"}
//             </h2>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {featured.map((item) => (
//                 <Suspense
//                   key={item._id}
//                   fallback={
//                     <div
//                       className={`h-72 rounded-3xl animate-pulse ${
//                         darkMode ? "bg-zinc-900" : "bg-zinc-100"
//                       }`}
//                     />
//                   }
//                 >
//                   <ProductCard product={item} />
//                 </Suspense>
//               ))}
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// }


// ---------------------

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

import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

import api from "../../src/api/axiosInstance";

// =========================================================
// Cloudinary Image Optimization
// =========================================================

const optimizeImage = (url, width = 800) => {
  if (!url) return "";

  if (!url.includes("cloudinary")) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_fill/`
  );
};

// =========================================================
// Lazy Product Card
// =========================================================

const ProductCard = lazy(() =>
  import("../components/ProductCard")
);

// =========================================================
// Home Skeleton
// =========================================================

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

// =========================================================
// Marquee Product Scroller
// =========================================================

const MarqueeScroller = React.memo(
  ({ products, darkMode }) => {

    const containerRef = useRef(null);

    const items = useMemo(() => {
      if (!products?.length) return [];

      return [
        ...products,
        ...products,
        ...products,
      ];
    }, [products]);

    // -------------------------------------------------------
    // Start from middle copy
    // -------------------------------------------------------

    useEffect(() => {

      const el = containerRef.current;

      if (!el || !products?.length) return;

      requestAnimationFrame(() => {
        const third = el.scrollWidth / 3;

        el.scrollLeft = third;
      });

    }, [products]);

    // -------------------------------------------------------
    // Infinite loop
    // -------------------------------------------------------

    const onScroll = useCallback(() => {

      const el = containerRef.current;

      if (!el) return;

      const oneThird = el.scrollWidth / 3;

      const threshold = 5;

      if (
        el.scrollLeft >=
        oneThird * 2 - threshold
      ) {
        el.scrollLeft -= oneThird;
      }

      if (
        el.scrollLeft <= threshold
      ) {
        el.scrollLeft += oneThird;
      }

    }, []);

    // -------------------------------------------------------
    // Manual scroll
    // -------------------------------------------------------

    const scrollManual = (dir) => {

      const el = containerRef.current;

      if (!el) return;

      const card =
        el.querySelector(
          ".product-card-container"
        )?.offsetWidth || 280;

      const move = card + 16;

      el.scrollBy({
        left:
          dir === "next"
            ? move
            : -move,
        behavior: "smooth",
      });
    };

    if (!items.length) {
      return null;
    }

    return (
      <div
        className="relative w-full py-5"
        dir="ltr"
      >

        {/* Left */}

        <button
          type="button"
          onClick={() =>
            scrollManual("prev")
          }
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow ${
            darkMode
              ? "bg-zinc-900 text-white"
              : "bg-white text-black"
          }`}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right */}

        <button
          type="button"
          onClick={() =>
            scrollManual("next")
          }
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow ${
            darkMode
              ? "bg-zinc-900 text-white"
              : "bg-white text-black"
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
            WebkitOverflowScrolling:
              "touch",
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
                      darkMode
                        ? "bg-zinc-900"
                        : "bg-zinc-100"
                    }`}
                  />
                }
              >

                <ProductCard
                  product={product}
                />

              </Suspense>

            </div>

          ))}

        </div>

      </div>
    );
  }
);

// =========================================================
// HERO MEDIA SLIDER
// =========================================================

const HeroMedia = ({
  media,
  darkMode,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageTimerRef = useRef(null);
  const videoRef = useRef(null);

  const currentMedia = media?.[currentIndex];

  // =========================================================
  // Reset index if media changes
  // =========================================================

  useEffect(() => {
    if (!media?.length) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= media.length) {
      setCurrentIndex(0);
    }
  }, [media, currentIndex]);

  // =========================================================
  // Cleanup image timer
  // =========================================================

  useEffect(() => {
    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, []);

  // =========================================================
  // Next media
  // =========================================================

  const goNext = useCallback(() => {
    if (!media?.length) return;

    setCurrentIndex(
      (prev) => (prev + 1) % media.length
    );
  }, [media]);

  // =========================================================
  // Previous media
  // =========================================================

  const goPrevious = useCallback(() => {
    if (!media?.length) return;

    setCurrentIndex(
      (prev) =>
        (prev - 1 + media.length) % media.length
    );
  }, [media]);

  // =========================================================
  // Image auto advance - 4 seconds
  // =========================================================

  useEffect(() => {
    if (!currentMedia) return;

    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current);
    }

    if (
      currentMedia.type === "image" &&
      media.length > 1
    ) {
      imageTimerRef.current = setTimeout(() => {
        goNext();
      }, 4000);
    }

    return () => {
      if (imageTimerRef.current) {
        clearTimeout(imageTimerRef.current);
      }
    };
  }, [
    currentIndex,
    currentMedia,
    media,
    goNext,
  ]);

  // =========================================================
  // Video autoplay
  // =========================================================

  useEffect(() => {
    if (!currentMedia) return;

    if (currentMedia.type === "video") {
      const video = videoRef.current;

      if (!video) return;

      video.muted = true;
      video.playsInline = true;

      const playVideo = () => {
        video.play().catch(() => {});
      };

      playVideo();

      video.addEventListener("canplay", playVideo);
      video.addEventListener("loadeddata", playVideo);

      return () => {
        video.removeEventListener("canplay", playVideo);
        video.removeEventListener("loadeddata", playVideo);
      };
    }
  }, [currentIndex, currentMedia]);

  // =========================================================
  // No media
  // =========================================================

  if (!media?.length) {
    return (
      <div
        className={`absolute inset-0 ${
          darkMode
            ? "bg-black"
            : "bg-zinc-100"
        }`}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* IMAGE */}

      {currentMedia.type === "image" && (
        <img
          key={currentMedia.public_id}
          src={optimizeImage(
            currentMedia.url,
            1400
          )}
          alt="Banner"
          loading={
            currentIndex === 0
              ? "eager"
              : "lazy"
          }
          decoding="async"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            animate-[heroFadeIn_700ms_ease-in-out]
          "
        />
      )}

      {/* VIDEO */}

      {currentMedia.type === "video" && (
        <video
          key={currentMedia.public_id}
          ref={videoRef}
          src={currentMedia.url}
          autoPlay
          muted
          playsInline
          controls={false}
          preload="auto"
          onLoadedData={() => {
            const video = videoRef.current;

            if (!video) return;

            video.muted = true;
            video.play().catch(() => {});
          }}
          onCanPlay={() => {
            const video = videoRef.current;

            if (!video) return;

            video.play().catch(() => {});
          }}
          onEnded={() => {
            if (media.length > 1) {
              goNext();
            } else {
              const video = videoRef.current;

              if (!video) return;

              video.currentTime = 0;
              video.play().catch(() => {});
            }
          }}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            animate-[heroFadeIn_700ms_ease-in-out]
          "
        />
      )}

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-black/35 pointer-events-none z-[5]" />

      {/* NAVIGATION */}

      {media.length > 1 && (
        <>

          {/* Previous */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {media.map((item, index) => (
              <button
                key={`${item.public_id}-${index}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-white"
                    : "w-2 h-2 bg-white/50"
                }`}
              />
            ))}
          </div>

        </>
      )}
    </div>
  );
};

// =========================================================
// HOME
// =========================================================

export default function Home() {

  const { language } =
    useLanguage();

  const { darkMode } =
    useTheme();

  const navigate =
    useNavigate();

  const isRTL =
    language === "ar";

  // =======================================================
  // Page Data
  // =======================================================

  const [pageData, setPageData] =
    useState({
      hero: null,
      featured: [],
      categories: [],
      allProducts: [],
      loading: true,
    });

  // =======================================================
  // Load Home Data
  // =======================================================

  useEffect(() => {

    const controller =
      new AbortController();

    const loadData = async () => {

      try {

        // -------------------------------------------------
        // Cache
        // -------------------------------------------------

        const cache =
          sessionStorage.getItem(
            "home-cache"
          );

        if (cache) {

          try {

            const cachedData =
              JSON.parse(cache);

            setPageData({
              ...cachedData,
              loading: false,
            });

          } catch (error) {

            console.error(
              "Invalid home cache",
              error
            );

            sessionStorage.removeItem(
              "home-cache"
            );

          }

        }

        // -------------------------------------------------
        // API Requests
        // -------------------------------------------------

        const [
          heroRes,
          featuredRes,
          catsRes,
          allRes,
        ] = await Promise.all([

          api.get(
            "/settings/hero",
            {
              signal:
                controller.signal,
            }
          ),

          api.get(
            "/products/featured",
            {
              signal:
                controller.signal,
            }
          ),

          api.get(
            "/categories",
            {
              signal:
                controller.signal,
            }
          ),

          api.get(
            "/products",
            {
              signal:
                controller.signal,
            }
          ),

        ]);

        // -------------------------------------------------
        // Products
        // -------------------------------------------------

        const allProducts =
          Array.isArray(allRes.data)
            ? allRes.data.filter(
                (p) => p.isActive
              )
            : [];

        // -------------------------------------------------
        // Hero
        // -------------------------------------------------

        const hero =
          heroRes.data || null;

        // Make sure media is always array

        if (hero) {

          hero.media =
            Array.isArray(hero.media)
              ? hero.media
              : [];

        }

        // -------------------------------------------------
        // Fresh Data
        // -------------------------------------------------

        const freshData = {

          hero,

          featured:
            Array.isArray(
              featuredRes.data
            )
              ? featuredRes.data
              : [],

          categories:
            Array.isArray(
              catsRes.data
            )
              ? catsRes.data
              : [],

          allProducts,

          loading: false,

        };

        setPageData(
          freshData
        );

        sessionStorage.setItem(
          "home-cache",
          JSON.stringify(
            freshData
          )
        );

      } catch (error) {

        if (
          error.name ===
          "CanceledError"
        ) {
          return;
        }

        console.error(
          "Home loading error:",
          error
        );

        setPageData(
          (prev) => ({
            ...prev,
            loading: false,
          })
        );

      }

    };

    loadData();

    return () => {
      controller.abort();
    };

  }, []);

  // =======================================================
  // Destructure
  // =======================================================

  const {
    hero,
    featured,
    categories,
    allProducts,
    loading,
  } = pageData;

  // =======================================================
  // Loading
  // =======================================================

  if (loading) {

    return (
      <div
        className="min-h-screen pt-24 px-4"
        style={{
          backgroundColor:
            darkMode
              ? "#000"
              : "#fff",
        }}
      >

        <HomeSkeleton
          darkMode={darkMode}
        />

      </div>
    );

  }

  // =======================================================
  // Render
  // =======================================================

  return (

    <div
      className="min-h-screen pt-20 md:pt-24 transition-colors duration-500"
      dir={
        isRTL
          ? "rtl"
          : "ltr"
      }
      style={{
        backgroundColor:
          darkMode
            ? "#000"
            : "#fff",

        color:
          darkMode
            ? "#fff"
            : "#000",
      }}
    >

      <div className="container mx-auto px-4 py-10 space-y-10">

        {/* =================================================
            HERO
        ================================================= */}

        {hero?.isActive && (

          <div
            onClick={() =>
              navigate("/products")
            }
            className={`relative h-[320px] md:h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer group border ${
              darkMode
                ? "border-red-700 bg-black"
                : "border-zinc-200 bg-white"
            }`}
          >

            {/* =================================================
                Hero Media
            ================================================= */}

            <HeroMedia
              media={
                Array.isArray(
                  hero.media
                )
                  ? hero.media
                  : []
              }
              darkMode={
                darkMode
              }
            />

            {/* =================================================
                Hero Text
            ================================================= */}

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-5 pointer-events-none">

              <h1 className="text-3xl md:text-7xl font-black uppercase mb-3">

                {isRTL
                  ? hero.titleAr
                  : hero.titleEn}

              </h1>

              <p className="text-sm md:text-xl opacity-90 max-w-2xl uppercase">

                {isRTL
                  ? hero.subtitleAr
                  : hero.subtitleEn}

              </p>

              {/* =================================================
                  Shop Button
              ================================================= */}

              <button
                type="button"
                onClick={(e) => {

                  e.stopPropagation();

                  navigate(
                    "/products"
                  );

                }}
                className="
                  pointer-events-auto
                  mt-6
                  px-3
                  py-3
                  font-black
                  rounded-xl
                  shadow-lg
                  transition-all
                  duration-300
                  hover:scale-110
                  active:scale-95
                  animate-bounce
                  bg-white
                  text-black
                  dark:bg-black
                  dark:text-white
                  hover:bg-red-700
                "
              >

                <span className="inline-flex items-center gap-2">

                  {isRTL
                    ? "تسوق المنتجات الآن"
                    : "Shop All Products"}

                </span>

              </button>

            </div>

          </div>

        )}

        {/* =================================================
            COLLECTION
        ================================================= */}

        {allProducts.length > 0 && (

          <section className="flex flex-col items-center text-center">

            <h2 className="text-2xl md:text-4xl font-black uppercase mb-4">

              {isRTL
                ? "اكتشف مجموعتنا"
                : "Explore Collection"}

            </h2>

            <div className="w-full flex justify-center">

              <MarqueeScroller
                products={
                  allProducts
                }
                darkMode={
                  darkMode
                }
              />

            </div>

            <motion.button
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.96,
              }}
              onClick={() =>
                navigate(
                  "/products"
                )
              }
              className={`mt-5 px-10 py-4 rounded-full font-black uppercase hover:bg-red-700 ${
                darkMode
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
            >

              {isRTL
                ? "كل المنتجات"
                : "Shop All"}

            </motion.button>

          </section>

        )}

        {/* =================================================
            CATEGORIES
        ================================================= */}

        {categories.length > 0 && (

          <section>

            <h2 className="text-3xl md:text-6xl font-black uppercase text-center mb-8">

              {isRTL
                ? "الأقسام"
                : "Categories"}

            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

              {categories.map(
                (cat, index) => {

                  const isLastOdd =
                    categories.length %
                      2 !==
                      0 &&
                    index ===
                      categories.length -
                        1;

                  return (

                    <div
                      key={cat._id}
                      onClick={() =>
                        navigate(
                          `/products/category/${
                            cat.id ||
                            cat._id
                          }`
                        )
                      }
                      className={`relative h-36 sm:h-52 md:h-64 rounded-[2.5rem] overflow-hidden cursor-pointer group ${
                        isLastOdd
                          ? "col-span-2 md:col-span-1"
                          : ""
                      }`}
                    >

                      <img
                        src={optimizeImage(
                          cat.image?.url,
                          500
                        )}
                        alt={
                          cat.name
                        }
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

                }
              )}

            </div>

          </section>

        )}

        {/* =================================================
            FEATURED PRODUCTS
        ================================================= */}

        {featured.length > 0 && (

          <section>

            <h2 className="text-2xl md:text-5xl font-black uppercase mb-8">

              {isRTL
                ? "منتجات مميزة"
                : "Featured Products"}

            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {featured.map(
                (item) => (

                  <Suspense
                    key={
                      item._id
                    }
                    fallback={

                      <div
                        className={`h-72 rounded-3xl animate-pulse ${
                          darkMode
                            ? "bg-zinc-900"
                            : "bg-zinc-100"
                        }`}
                      />

                    }
                  >

                    <ProductCard
                      product={
                        item
                      }
                    />

                  </Suspense>

                )
              )}

            </div>

          </section>

        )}

      </div>

    </div>

  );
}