

/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo  } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import api from "../../src/api/axiosInstance";

const ProductSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="aspect-[3/4] bg-white/5 rounded-[1.5rem] sm:rounded-[2.5rem]"></div>
    <div className="h-3 bg-white/5 rounded-full w-1/2 mx-auto"></div>
    <div className="h-10 bg-white/5 rounded-xl sm:rounded-2xl w-full"></div>
  </div>
);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const isRTL = language === "ar";

  const t = useMemo(() => ({
    title: isRTL ? "المنتجات" : "Products",
    subtitle: isRTL ? "اكتشف تشكيلة فيسترو الفريدة" : "Discover the unique Vestro collection",
    error: isRTL ? "فشل تحميل البيانات" : "Failed to load products",
  }), [isRTL]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");

        if (!isMounted) return;

        const rawProducts = res.data.products || res.data;

        const processed = rawProducts.map((p) => {
          const discount = p.originalPrice > p.price
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0;

          return {
            ...p,
            discount,
            displayPrice: p.price,
            displayImage: p.images?.[0]?.url || ""
          };
        });

        setProducts(processed);
      } catch (err) {
        if (isMounted) setError(t.error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [t.error]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-[#86FE05] font-black      uppercase tracking-[0.2em] px-4 text-center">
      {error}
    </div>
  );

  return (
    <div className={`min-h-screen pt-24 pb-20 transition-colors duration-500 ${
      darkMode ? "bg-black text-white" : "bg-gray-50 text-black"
    }`} dir={isRTL ? "rtl" : "ltr"}>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-[1600px]">
       
  <button
  onClick={() => navigate(-1)}
  className="group flex items-center gap-2 mt-4 md:mt-7 px-4 py-2 rounded-full
             bg-black/5 dark:bg-white/5
             border border-black/10 dark:border-white/10
             hover:bg-black/10 dark:hover:bg-white/10
             hover:scale-[1.03]
             active:scale-95
             transition-all duration-300"
>
  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/60 dark:bg-black/40 group-hover:rotate-[-10deg] transition">
    <ArrowLeft
      size={16}
      className={isRTL ? "rotate-180" : ""}
    />
  </span>

  <span className="font-black uppercase tracking-wider text-sm">
    {isRTL ? "رجوع" : "Back"}
  </span>
</button>

        <header className="flex flex-col items-center mb-8 sm:mb-24 text-center">
        <h1 className=" sm:pt-12 md:pt-16 
               text-[8vw] sm:text-5xl md:text-6xl lg:text-7xl 
               font-black mt-2      tracking-tighter uppercase leading-[0.9] 
               mb-2 sm:mb-6 text-black dark:text-white">
  {t.title}
  <span className="text-black dark:text-white">.</span>
</h1>

          <div className="h-[2px] w-8 sm:w-16 bg-black dark:bg-white mb-1 sm:mb-6"></div>

          {/* <p className="text-[13px] sm:text-[20px] md:text-xl font-bold uppercase  opacity-40 max-w-[250px] sm:max-w-none leading-relaxed">
            {t.subtitle}
          </p> */}
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-8 sm:gap-y-20 lg:gap-x-12">
          {loading ? (
            [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            products.map((product) => (
              <div key={product._id} className="relative">
                
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
                    {/* <span className="bg-[#86FE05] text-black text-[8px] sm:text-[10px] font-black px-2 py-1 rounded-full      uppercase">
                      -{product.discount}%
                    </span> */}
                  </div>
                )}

                {/* 💥 الكارد هو اللي بيتحكم في كل حاجة */}
                <ProductCard product={product} />

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
