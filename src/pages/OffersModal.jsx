/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiGift } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // أضفنا الـ Navigate
import api from "../../src/api/axiosInstance";
import CouponCard from "./CouponCard";
import ProductQuickView from "./../components/ProductQuickView";

const OffersModal = ({ isOpen, onClose, darkMode, language }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const navigate = useNavigate();
  const isRTL = language === "ar";
const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const fetchDiscounts = async () => {
        try {
          setLoading(true);
          const res = await api.get("/discounts/active");
          setDiscounts(res.data);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
      };
      fetchDiscounts();
    }
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ x: isRTL ? "-100%" : "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: isRTL ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className={`fixed top-0 ${isRTL ? "left-0" : "right-0"} h-full w-full max-w-md z-[90] shadow-2xl p-8 overflow-y-auto ${darkMode ? "bg-[#0a0a0a] text-white" : "bg-white text-black"}`}
            >
              <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2 pt-24">
                <h2 className="text-3xl font-black       uppercase tracking-tighter flex items-center gap-2">
                  <FiGift className="text-red-800" /> {isRTL ? "عروض حصرية" : "Exclusive"}
                </h2>
<button
  onClick={onClose}
  className="fixed top-25 left-10 z-[999] p-2 bg-black/60 dark:bg-white dark:text-black text-white  hover:text-black hover:bg-red-800 rounded-full transition-all backdrop-blur-md"
>
  <FiX size={24} />
</button>              </div>

<motion.button
  onClick={() => setShowInfo(true)}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  className={`
    group w-full flex items-center justify-between 
    px-5 py-4 rounded-2xl mb-4
    border transition-all duration-300 shadow-md
    ${darkMode 
      ? "bg-[#86FE05]/5 border-white hover:bg-red-700 hover:text-black" 
      : "bg-black text-white border-black hover:bg-red-700 hover:text-black"}
  `}
>
  {/* النص */}
  <div className="flex items-center gap-3">
    <FiGift className="text-xl group-hover:scale-110 transition-transform" />
    <span className="text-sm md:text-base font-black tracking-wide ">
      {isRTL ? "ازاي تستفيد من العروض وتوفر فلوسك؟" : "How to save more with offers?"}
    </span>
  </div>

  {/* سهم */}
  <span className="text-lg group-hover:translate-x-1 transition-transform">
    →
  </span>
</motion.button>


              <div className="space-y-8">
                {loading ? (
<div className="text-red-800 font-bold animate-pulse text-center mt-20 uppercase tracking-widest">
  {isRTL ? "جارٍ تحميل العروض..." : "Loading Deals..."}
</div>                ) : discounts.map((d) => (
                  <CouponCard 
                    key={d._id} 
                    discount={d} 
                    darkMode={darkMode} 
                    language={language}
                    // لما يضغط على اسم المنتج يروح لتفاصيله
                    onProductClick={(prod) => {
                      onClose(); // قفل الموديل
                      navigate(`/product/${prod._id}`);
                    }} 
                    // لما يضغط على زرار أضف يفتح بوب أب المقاسات
                    onAddToCart={(prod) => setSelectedProduct(prod)} 
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
<AnimatePresence>
  {showInfo && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowInfo(false)}
        className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
      />

   {/* Modal */}
<div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">

  <motion.div
    initial={{ scale: 0.9, opacity: 0, y: 30 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.9, opacity: 0, y: 30 }}
    transition={{ duration: 0.25 }}
    className={`relative w-full max-w-xs max-h-[65vh] overflow-y-auto rounded-[1.4rem] p-4 shadow-xl border ${
      darkMode
        ? "bg-[#0a0a0a] text-white border-white/10"
        : "bg-white text-black border-black/10"
    }`}
  >

    {/* Close */}
    <button
      onClick={() => setShowInfo(false)}
      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full 
                 bg-black/5 dark:bg-white/5 hover:scale-110 transition opacity-80"
    >
      <FiX size={16} />
    </button>

    {/* Title */}
    <h3 className="text-base font-black text-center mb-3">
      {isRTL ? "وفر فلوسك 💸" : "Save Money 💸"}
    </h3>

    <div className="space-y-3 text-center text-xs md:text-sm opacity-90 leading-5">

      <p className="font-bold text-sm">
        {isRTL ? "🔥 عروض جامدة مستنياك" : "🔥 Hot deals waiting for you"}
      </p>

      <p>
        {isRTL
          ? "اختار منتجاتك واستغل أقوى خصم متاح دلوقتي"
          : "Pick your items & grab the best discount now"}
      </p>

      {/* نفس النص بتاعك بدون تغيير */}
      <div className={`p-2 rounded-lg text-[11px] border ${
        darkMode
          ? "bg-white/5 border-white/10"
          : "bg-black/5 border-black/10"
      }`}>
       {isRTL
  ? "📍 الخصم بيتطبق في صفحة الدفع (Checkout), تقدر تشوف المنتجات المطبق عليها العروض وتضيفها للسله وتنسخ الكود لتطبيقه في صفحة الدفع"
  : "📍 The discount is applied at checkout, you can see the products that have offers, add them to the cart, and copy the code to apply it at checkout"}
      </div>

      <p className="font-bold text-sm">
        {isRTL
          ? "⚠️ خصم واحد لكل طلب"
          : "⚠️ One code per order"}
      </p>

      <p className="text-xs opacity-70">
        {isRTL
          ? "💡 تقدر تغير منتجاتك في السلة علشان توصل لأقوى عرض متاح"
          : "💡 Adjust cart for max savings"}
      </p>

    </div>

    {/* CTA */}
    <button
      onClick={() => setShowInfo(false)}
      className={`mt-4 w-full py-2 rounded-lg font-bold text-xs transition-all hover:bg-red-800 ${
        darkMode
          ? "bg-white text-black"
          : "bg-black text-white"
      } hover:scale-[1.02] active:scale-95`}
    >
      {isRTL ? "تمام 👍" : "Got it 👍"}
    </button>

  </motion.div>
</div>
    </>
  )}
</AnimatePresence>

      <ProductQuickView 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        darkMode={darkMode} 
        language={language} 
      />
    </>
  );
};

export default OffersModal;