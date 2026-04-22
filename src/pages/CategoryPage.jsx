/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import api from "../../src/api/axiosInstance";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const CategoryPage = () => {
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const isRTL = language === "ar";

  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, catRes] = await Promise.all([
          api.get(`/products/category/${categoryId}`),
          api.get(`/categories/${categoryId}`)
        ]);

        if (!mounted) return;

        setProducts(productsRes.data);
        setCategoryData(catRes.data);
      } catch (err) {
        console.error("❌ Error fetching category page:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [categoryId]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-black" : "bg-white"}`}>
        <div className="w-12 h-12 border-4 border-red-700 border-t-red-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-28 pb-20 transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 relative">
        
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#DC2626", color: "#000" }}
          onClick={() => navigate(-1)}
          className={`absolute top-0 ${
            isRTL ? "right-4" : "left-4"
          } w-12 h-12 flex items-center justify-center rounded-full border border-zinc-800 transition-all`}
        >
          {isRTL ? <ArrowRight /> : <ArrowLeft />}
        </motion.button>

        {/* Header Section */}
        <header className="text-center mb-16 mt-6">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-black dark:text-white font-black text-3xl tracking-[0.3em] uppercase mb-2 block"
          >
            {isRTL ? "قسم" : "Collection"}
          </motion.span>
          <h1 className="text-5xl md:text-6xl font-black  uppercase tracking-tighter">
            {categoryData?.name || (isRTL ? "القسم" : "Category")}
          </h1>
        </header>

        {/* Content Section */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          /* --- START: Enhanced Empty State --- */
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 px-6 text-center"
          >
            <div className={`mb-8 p-8 rounded-full ${darkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
              <ShoppingBag size={64} className="opacity-20" />
            </div>

            <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">
              {isRTL ? "قريباً في فسترو" : "Dropping Soon at Vestro"}
            </h3>
            
            <p className={`max-w-md text-sm leading-relaxed mb-10 opacity-60 font-medium ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
              {isRTL 
                ? "هذا القسم فارغ حالياً، لكننا نجهز لك تشكيلة استثنائية ستغير قواعد اللعبة. ابقَ متيقظاً!" 
                : "This collection is currently empty, but we're crafting an exceptional drop that will redefine the game. Stay tuned!"}
            </p>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-red-70 text-black px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:shadow-red-700 transition-all"
            >
              {isRTL ? "استكشف المجموعات الأخرى" : "Explore Other Drops"}
            </motion.button>
          </motion.div>
          /* --- END: Enhanced Empty State --- */
        )}
      </div>
    </div>
  );
};

export default React.memo(CategoryPage);