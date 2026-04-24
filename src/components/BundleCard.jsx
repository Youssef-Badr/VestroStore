import React, { useState } from 'react';
import { ShoppingBag, CreditCard, ChevronRight, Info } from 'lucide-react';
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import BundleSelectionModal from "./BundleSelectionModal";
import BundleDetailsModal from "./BundleDetailsModal";

const getThumb = (url, size = 300) => {
  if (!url?.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`
  );
};

const BundleCard = ({ bundle }) => {
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const isAr = language === "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState("add_to_cart");

  const discount = Math.round(((bundle.originalPrice - bundle.bundlePrice) / bundle.originalPrice) * 100);

  const handleAction = (mode) => {
    setSelectionMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (selectionMode === "buy_now") {
      setTimeout(() => navigate("/checkout"), 100);
    }
  };

const handleClaimFromDetails = () => {
  setIsDetailsOpen(false); // 1. اقفل مودال التحليل
  // 2. افتح مودال الاختيار (بما إننا عاوزينه Add to cart كإعداد افتراضي)
  setSelectionMode("add_to_cart"); 
  setIsModalOpen(true); 
};


  return (
    <>
      <div 
        className={`group relative rounded-[2.5rem] overflow-hidden transition-all duration-500 border ${
          darkMode 
            ? "bg-[#0A0A0A] border-white/5 hover:border-red-700 shadow-2xl shadow-black" 
            : "bg-white border-slate-100 hover:border-black/10 shadow-sm"
        }`}
        dir={isAr ? "rtl" : "ltr"}
      >
        
        {/* Badge الخصم - رجعناه لوحده فوق الصورة بشكل كلاسيك */}
        <div className={`absolute top-5 ${isAr ? "right-5" : "left-5"} z-20`}>
          <div className="  text-white bg-red-700 dark:text-black text-[15px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase   ">
            {isAr ? `وفر ${discount}%` : `Save ${discount}%`}
          </div>
        </div>

        {/* عرض الصور */}
        <div className={`relative h-72 flex overflow-hidden ${darkMode ? "bg-zinc-900" : "bg-slate-50"}`}>
          {bundle.items.map((item, index) => (
            <div key={index} className="relative flex-1 h-full transition-all duration-700 hover:flex-[2.5] border-r last:border-0 border-white/10 group/img">
              <img 
                src={getThumb(item?.product?.images?.[0]?.url, 400)}
                className="w-full h-full object-cover grayscale-[20%] group-hover/img:grayscale-0 transition-all duration-500"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
            </div>
          ))}
        </div>

        {/* تفاصيل العرض */}
        <div className="p-7">
          <div className="mb-6">
            {/* السطر ده هو اللي فيه التعديل: العنوان والتفاصيل في سطر واحد */}
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className={`text-xl font-black uppercase  leading-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                {bundle.name}<span className="text-red-800">.</span>
              </h3>
              
              <button 
                onClick={() => setIsDetailsOpen(true)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  darkMode 
                    ? "bg-white/5 border-white/10 text-gray-400 hover:text-red-800 hover:border-red-800 hover:bg-[#86FE05]/5" 
                    : "bg-black/5 border-black/5 text-gray-600 hover:text-black hover:border-black/20 hover:bg-black/5"
                }`}
              >
                <span className="text-[15px] font-black uppercase  whitespace-nowrap">
                  {isAr ? "تفاصيل العرض" : "Offer Details"}
                </span>
                <Info size={17} />
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-black dark:text-white   ">
                {bundle.bundlePrice.toLocaleString()} <span className="text-[10px] uppercase">{isAr ? 'ج.م' : 'EGP'}</span>
              </span>
              <span className="text-[14px] font-bold text-red-500 line-through opacity-60">
                {bundle.originalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleAction('add_to_cart')}
              className={`w-full py-4 rounded-2xl font-black text-[18px] uppercase  flex items-center justify-center gap-2 transition-all border bg-red-700 ${
                darkMode 
                  ? "border-white/10 text-black hover:bg-red-600 hover:text-black" 
                  : "border-black/10 text-white hover:bg-red-600 hover:text-white"
              }`}
            >
              <ShoppingBag size={16} />
              {isAr ? 'أضف للسلة' : 'Add to Cart'}
            </button>

            <button
              onClick={() => handleAction('buy_now')}
              className="w-full py-4 rounded-2xl font-black text-[16px] uppercase  flex items-center justify-center gap-2 transition-all bg-black text-white dark:text-black dark:bg-white hover:scale-[1.02] active:scale-95"
            >
              <CreditCard size={16} />
              {isAr ? 'اشتري الآن (دفع مباشر)' : 'Buy Now (Checkout)'}
              <ChevronRight size={14} className={isAr ? "rotate-180" : ""} />
            </button>
          </div>
        </div>
      </div>

      <BundleSelectionModal bundle={bundle} isOpen={isModalOpen} onClose={handleCloseModal} isAr={isAr} />
      
      <BundleDetailsModal 
        bundle={bundle} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        onClaim={handleClaimFromDetails} // 👈 نمرر الدالة هنا
        isAr={isAr} 
        darkMode={darkMode}
      />
    </>
  );
};

export default BundleCard;