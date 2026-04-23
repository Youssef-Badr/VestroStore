/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";

export default function SearchPage() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const location = useLocation();
  const navigate = useNavigate();

  // جلب كلمة البحث من الـ URL (مثلاً ?q=t-shirt)
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // نرسل كلمة البحث للباك إيند (الروت اللي راجعناه سوا)
        const res = await api.get(`/products/search?q=${searchTerm}`);
        setProducts(res.data.products);
        setTotalResults(res.data.total);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]); // يتم التحديث كلما تغيرت كلمة البحث في الـ URL

  return (
    <div 
      className={`min-h-screen pt-24 pb-14 transition-all duration-500 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        
        {/* رأس الصفحة - عرض كلمة البحث */}
        <div className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <h1 className="text-xl md:text-5xl font-black uppercase  mb-2 mt-3">
            {isRTL ? "نتائج البحث عن:" : "Search Results for:"} 
            <span className="text-red-700 ml-4    ">"{searchTerm}"</span>
          </h1>
          <p className="text-gray-500 font-medium">
            {isRTL ? `تم العثور على ${totalResults} منتج` : `Found ${totalResults} products`}
          </p>
        </div>

        {/* حالة التحميل */}
        {loading ? (
          <div className="flex justify-center items-center h-52">
            <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          // عرض المنتجات
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={product._id}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          // في حال عدم وجود نتائج
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-4">
              {isRTL ? "لم نجد أي منتج يطابق بحثك" : "No products match your search"}
            </h2>
            <button 
              onClick={() => navigate("/products")}
              className="px-8 py-3 bg-red-700 text-black font-black rounded-full hover:scale-105 transition-transform"
            >
              {isRTL ? "تصفح كل المنتجات" : "Browse All Products"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}