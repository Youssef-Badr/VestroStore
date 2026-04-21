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
                <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                  <FiGift className="text-[#86FE05]" /> {isRTL ? "عروض حصرية" : "Exclusive"}
                </h2>
<button
  onClick={onClose}
  className="fixed top-25 left-10 z-[999] p-2 bg-black/60 dark:bg-white dark:text-black text-white hover:bg-slate-800 hover:text-black rounded-full transition-all backdrop-blur-md"
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
      ? "bg-[#86FE05]/5 border-[#86FE05]/20 hover:bg-[#6cc809] hover:text-black" 
      : "bg-black text-white border-black hover:bg-[#6cc809] hover:text-black"}
  `}
>
  {/* النص */}
  <div className="flex items-center gap-3">
    <FiGift className="text-xl group-hover:scale-110 transition-transform" />
    <span className="text-sm md:text-base font-black tracking-wide">
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
<div className="text-[#86FE05] font-bold animate-pulse text-center mt-20 uppercase tracking-widest">
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
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[2rem] p-5 md:p-6 shadow-2xl border ${
            darkMode
              ? "bg-[#0a0a0a] text-white border-white/10"
              : "bg-white text-black border-black/10"
          }`}
        >
          {/* Close */}
          <button
            onClick={() => setShowInfo(false)}
            className="absolute top-3 right-3 md:top-4 md:right-4 opacity-60 hover:opacity-100 transition"
          >
            <FiX size={20} />
          </button>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-black mb-4 text-center">
            {isRTL ? "ازاي تستفيد من العروض؟ 💸" : "How to Save More 💸"}
          </h3>

          <div className="space-y-4 text-sm md:text-base leading-7 text-center opacity-90">

            <p className="font-bold text-base md:text-lg">
              {isRTL
                ? "🔥 فرصتك توفر فلوسك بدأت من هنا!"
                : "🔥 Your chance to save starts here!"}
            </p>

            <p>
              {isRTL
                ? "في الصفحة دي هتلاقي كل العروض والخصومات المتاحة حالياً على منتجاتنا."
                : "Here you’ll find all the active discounts available on our products."}
            </p>

            <p>
              {isRTL
                ? "تقدر تختار المنتجات اللي تناسبك وتستغل أقوى عرض متاح ليك علشان تدفع أقل سعر ممكن."
                : "Pick the products you like and take advantage of the best deal to pay less."}
            </p>

            {/* Highlight Box (فسفوري خفيف جداً) */}
            <p className={`p-3 rounded-xl border ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-black/5 border-black/10"
            }`}>
              {isRTL
                ? "📍 استخدام كود الخصم بيكون في صفحة الدفع (Checkout) قبل ما تأكد الطلب."
                : "📍 Discount codes are applied at checkout before confirming your order."}
            </p>

            <p className="font-bold">
              {isRTL
                ? "⚠️ تقدر تستخدم كود خصم واحد بس لكل طلب."
                : "⚠️ Only ONE discount code can be used per order."}
            </p>

            <p>
              {isRTL
                ? "علشان كده اختار الكود الصح اللي يوفر لك أكبر خصم حسب مشترياتك."
                : "So choose wisely — pick the code that gives you the maximum savings."}
            </p>

            <p className="italic opacity-70">
              {isRTL
                ? "💡 نصيحة: ممكن تغير المنتجات في السلة علشان تستفيد بأكبر عرض ممكن."
                : "💡 Tip: Adjust your cart to unlock better discounts."}
            </p>

            {/* subtle accent */}
            <p className="font-bold text-base md:text-lg tracking-wide">
              {isRTL
                ? "💰 كل ما تختار بذكاء… كل ما توفر أكتر!"
                : "💰 The smarter you shop, the more you save!"}
            </p>

          </div>

          {/* CTA */}
          <button
            onClick={() => setShowInfo(false)}
            className={`mt-6 w-full py-3 rounded-xl font-bold transition-all ${
              darkMode
                ? "bg-white text-black hover:scale-[1.02] active:scale-95"
                : "bg-black text-white hover:scale-[1.02] active:scale-95"
            }`}
          >
            {isRTL ? "تمام فهمت" : "Got it"}
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