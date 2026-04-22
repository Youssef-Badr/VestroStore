import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { ShoppingBag, Zap, ChevronLeft } from "lucide-react";

const getColorCode = (colorName) => {
  if (!colorName) return "transparent";

  // تنظيف النص من الهمزات والمسافات والحروف الزيادة عشان الدقة
  const normalize = (text) => 
    text.toLowerCase()
        .trim()
        .replace(/[أإآ]/g, 'ا') // تحويل كل أنواع الألف لألف عادية
        .replace(/ة/g, 'ه');   // تحويل التاء المربوطة لـ هاء

  const colors = {
     // --- الأبيض والأسود ---
  "أبيض": "#FFFFFF", "ابيض": "#FFFFFF", "وايت": "#FFFFFF", "white": "#FFFFFF", "اوف وايت": "#FAF9F6", "أوف وايت": "#FAF9F6", "off-white": "#FAF9F6",
  "أسود": "#121212", "اسود": "#121212", "بلاك": "#121212", "black": "#121212", "فحمي": "#374151", "charcoal": "#374151",

  // --- الرماديات ---
  "رمادي": "#6b7280", "رصاصي": "#6b7280", "جراي": "#6b7280", "gray": "#6b7280", "grey": "#6b7280",
  "فضي": "#d1d5db", "سيلفر": "#d1d5db", "silver": "#d1d5db",

  // --- الأحمر والنبيتي ---
  "أحمر": "#e11d48", "احمر": "#e11d48", "red": "#e11d48",
  "نبيتي": "#7f1d1d", "مارون": "#7f1d1d", "maroon": "#7f1d1d", "بورجوندي": "#800020",
  "طوبي": "#991b1b", "brick": "#991b1b",

  // --- الأزرق والكحلي ---
  "أزرق": "#2563eb", "ازرق": "#2563eb", "blue": "#2563eb",
  "كحلي": "#1e3a8a", "نيفي": "#1e3a8a", "navy": "#1e3a8a",
  "سماوي": "#0ea5e9", "لبني": "#7dd3fc", "sky blue": "#7dd3fc",
  "بترولي": "#005F69", "petrol": "#005F69",

  // --- الأخضر والزيتي ---
  "أخضر": "#16a34a", "اخضر": "#16a34a", "green": "#16a34a",
  "زيتي": "#3f6212", "زيتوني": "#3f6212", "olive": "#3f6212",
  "فسفوري": "#86FE05", "فوسفوري": "#86FE05", "neon": "#86FE05",
  "منت": "#a7f3d0", "مينت": "#a7f3d0", "mint": "#a7f3d0",

  // --- الأصفر والبرتقالي ---
  "أصفر": "#facc15", "اصفر": "#facc15", "yellow": "#facc15",
  "برتقالي": "#ea580c", "أورنج": "#ea580c", "اورنج": "#ea580c", "orange": "#ea580c",
  "مستردة": "#ca8a04", "خردلي": "#ca8a04", "mustard": "#ca8a04",
  "ذهبي": "#d4af37", "جولد": "#d4af37", "gold": "#d4af37",

  // --- البنيات والبيج ---
  "بني": "#451a03", "brown": "#451a03", "شوكلت": "#451a03",
  "بيج": "#f5f5dc", "beige": "#f5f5dc",
  "كريمي": "#fffdd0", "cream": "#fffdd0",
  "هافان": "#92400e", "جملي": "#b45309", "camel": "#b45309",
  "كافيه": "#6F4E37", "خاكي": "#bdb76b", "khaki": "#bdb76b",

  // --- الموف والوردي ---
  "بنفسجي": "#7c3aed", "موف": "#7c3aed", "purple": "#7c3aed",
  "أرجواني": "#7c3aed", "ارجواني": "#7c3aed",
  "وردي": "#db2777", "بينك": "#db2777", "pink": "#db2777",
  "بمبي": "#ff69b4", "فوشيا": "#ff00ff", "fuchsia": "#ff00ff",
  "سيمون": "#FF8C69", "salmon": "#FF8C69",

  // --- ألوان الموضة (Trendy) ---
  "فيروزي": "#06b6d4", "تركواز": "#06b6d4", "turquoise": "#06b6d4",
  "تيفاني": "#0ABAB5", "tiffany": "#0ABAB5",
  "ليموني": "#bef264", "lime": "#bef264"
  };

  const normalizedInput = normalize(colorName);
  
  // لو المدخل كود لون (Hex) زي #000 سيبه زي ما هو، غير كدة دور في القائمة
  return colors[normalizedInput] || colorName;
};

function ProductCard({ product }) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false); 
  const cardRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedFilters, setSelectedFilters] = useState({}); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // ✅ ترتيب صحيح: استخراج المفاتيح المسموح بها (لون ومقاس فقط)
  const optionKeys = useMemo(() => {
    return (product.options || [])
      .map(opt => opt.name)
      .filter(name => ["Color", "Size", "اللون", "المقاس"].includes(name));
  }, [product.options]);

  const allImages = useMemo(() => {
    let images = [...(product.images || [])];
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.images) images = [...images, ...v.images];
      });
    }
    return Array.from(new Set(images.map(img => img.url)))
      .map(url => images.find(img => img.url === url));
  }, [product.images, product.variants]);

  const productId = product._id || product.id;
  const defaultImageUrl = "https://via.placeholder.com/600x800?text=Vestro+Product";

  const isSoldOut = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return product.countInStock <= 0;
    return product.variants.every(v => v.stock <= 0);
  }, [product]);

  const resetSelector = useCallback(() => {
    setShowVariantSelector(false);
    setCurrentStep(0);
    setSelectedFilters({});
  }, []);

  const availableOptionsForStep = useMemo(() => {
    if (!product.variants || optionKeys.length === 0) return [];
    const currentKey = optionKeys[currentStep];
    if (currentStep === 0) {
      const foundOption = product.options.find(o => o.name === currentKey);
      return foundOption ? foundOption.values : [];
    }
    const filteredVariants = product.variants.filter(v => {
      return Object.entries(selectedFilters).every(([key, val]) => v.options[key] === val);
    });
    return [...new Set(filteredVariants.map(v => v.options[currentKey]))].filter(Boolean);
  }, [currentStep, selectedFilters, product, optionKeys]);

  const handleSelectVariant = useCallback((variant) => {
    if (variant.stock > 0) {
      addToCart(product, variant, 1);
      const wasDirect = isDirectBuy; 
      resetSelector();
      setIsDirectBuy(false);
      if (wasDirect) {
        navigate("/checkout");
      } else {
        toast.success(isRTL ? "تمت الإضافة للسلة" : "Added to Bag", {
          position: "bottom-center", autoClose: 1500, theme: "dark",
        });
      }
    }
  }, [addToCart, isRTL, product, isDirectBuy, navigate, resetSelector]);

  const handleStepClick = (val) => {
    const currentKey = optionKeys[currentStep];
    const newFilters = { ...selectedFilters, [currentKey]: val };
    if (currentStep < optionKeys.length - 1) {
      setSelectedFilters(newFilters);
      setCurrentStep(currentStep + 1);
    } else {
      const finalVariant = product.variants.find(variant => 
        Object.entries(newFilters).every(([key, value]) => variant.options[key] === value)
      );
      if (finalVariant) handleSelectVariant(finalVariant);
      else {
        toast.error(isRTL ? "غير متوفر" : "Not available");
        resetSelector();
      }
    }
  };

 useEffect(() => {
  if (!isHovering || allImages.length <= 1) return;

  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }, 1500);

  return () => clearInterval(interval);
}, [isHovering, allImages.length]);

useEffect(() => {
  if (!allImages || allImages.length === 0) return;

  allImages.forEach((img) => {
    const image = new Image();
    image.src = img.url;
  });
}, [allImages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        resetSelector();
        setIsDirectBuy(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [resetSelector]);

  const handleNavigate = () => navigate(`/product/${productId}`);

  return (
    <div
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}

  // ✅ الموبايل الحقيقي
  onTouchStart={() => setIsHovering(true)}
  onTouchMove={() => setIsHovering(true)}
  // onTouchEnd={() => setIsHovering(false)}
  onTouchCancel={() => setIsHovering(false)}

  onClick={(e) => {
    e.stopPropagation();
    if (showVariantSelector) return;
    handleNavigate();
  }}
className="group relative flex flex-col w-full bg-transparent transition-all duration-500">

      <div className="relative w-full aspect-[3/4] rounded-[2.2rem] sm:rounded-[2.8rem] overflow-hidden bg-gray-100 dark:bg-[#0F0F0F] border border-slate-200/60 dark:border-white/5 group-hover:border-[#86FE05]/50 transition-all duration-500 shadow-sm group-hover:shadow-xl text-center">
        
      <div
  onClick={(e) => {
    e.stopPropagation();

    // ✅ لو في مودال مفتوح متعملش navigation
    if (showVariantSelector) return;

    handleNavigate();
  }}
 className="relative w-full h-full cursor-pointer overflow-hidden">
  
  {/* الصورة الحالية */}
  <img
    src={allImages[currentImageIndex]?.url || defaultImageUrl}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
  />

  {/* الصورة اللي بعدها */}
  {allImages.length > 1 && (
    <img
      src={allImages[(currentImageIndex + 1) % allImages.length]?.url}
      alt="next"
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
        isHovering ? "opacity-100" : "opacity-0"
      }`}
    />
  )}
</div>

        {/* ✅ بادجات الـ Sale */}
        {product.salePercentage > 0 && (
          <>
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-slate-900/90 dark:bg-white backdrop-blur-md border border-[#86FE05]/20 dark:border-slate-600 dark:text-slate-950 text-white text-[8px] sm:text-[11px] font-black px-1.5 py-1.5 rounded-full italic shadow-xl">
                -{product.salePercentage}%
              </div>
            </div>
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-slate-900/90 dark:bg-white backdrop-blur-md border border-[#86FE05]/20 dark:border-slate-600 dark:text-slate-950 text-white text-[8px] sm:text-[11px] font-black px-1 py-1.5 rounded-full italic shadow-xl uppercase tracking-wider">
                {isRTL ? "تخفيض" : "SALE"}
              </div>
            </div>
          </>
        )}

        {/* ✅ زرار الإضافة السريعة */}
        {!isSoldOut && (
          <button
            onClick={(e) => { e.stopPropagation();e.preventDefault(); setIsDirectBuy(false); setShowVariantSelector(true); }}
            className="absolute bottom-6 right-6 w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-black dark:text-white text-black rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10 hover:scale-110"
          >
            <ShoppingBag size={22} strokeWidth={2.5} />
          </button>
        )}

        {/* ✅ Gorilla Style Variant Selector Modal */}
{showVariantSelector && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
    
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      onClick={resetSelector} 
    />
    
    {/* Modal Content */}
    <div className="relative w-full max-w-md max-h-[90vh] overflow-hidden bg-white dark:bg-[#0A0A0A] rounded-[1.8rem] shadow-2xl flex flex-col animate-in zoom-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
        <div className="flex flex-col">
          <h4 className="text-lg md:text-xl font-[900] text-black dark:text-white uppercase italic tracking-tighter">
            {isRTL ? "تخصيص الطلب" : "Customize"}
          </h4>
          <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[180px]">
            {product.name}
          </p>
        </div>

        <button 
          onClick={resetSelector} 
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-black dark:text-white hover:rotate-90 transition-transform"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="p-5 overflow-y-auto">
        
        {/* Progress Bar */}
        <div className="flex gap-1 mb-5">
          {optionKeys.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                index <= currentStep 
                  ? "bg-[#86FE05]" 
                  : "bg-gray-100 dark:bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Option Title */}
        <div className="mb-4 flex justify-between items-center">
          <span className="text-[11px] font-black uppercase text-gray-400">
            {isRTL ? "اختر" : "Select"} {optionKeys[currentStep]}
          </span>

          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-[10px] font-bold text-black dark:text-[#86FE05] underline"
            >
              {isRTL ? "الرجوع" : "Go Back"}
            </button>
          )}
        </div>

        {/* Options */}
        <div className={`grid gap-3 ${
          optionKeys[currentStep] === "Color" || optionKeys[currentStep] === "اللون" 
            ? "grid-cols-2 sm:grid-cols-3" 
            : "grid-cols-3"
        }`}>
          {availableOptionsForStep.map((val, idx) => {
            const isColor = optionKeys[currentStep] === "Color" || optionKeys[currentStep] === "اللون";

            const isOptionAvailable = product.variants.some(v => {
              const matchesCurrent = v.options[optionKeys[currentStep]] === val;
              const matchesPrev = Object.entries(selectedFilters).every(([k, fv]) => v.options[k] === fv);
              return matchesCurrent && matchesPrev && v.stock > 0;
            });

            return (
              <button
                key={idx}
                disabled={!isOptionAvailable}
                onClick={() => handleStepClick(val)}
                className={`group relative flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                  isOptionAvailable 
                    ? "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-black dark:hover:border-[#86FE05]" 
                    : "opacity-40 cursor-not-allowed grayscale"
                }`}
              >
                {isColor ? (
                  <div className="flex items-center gap-2 w-full justify-center">
                    <span 
                      className="w-5 h-5 rounded-full border border-black/10 shadow-sm" 
                      style={{ backgroundColor: getColorCode(val) }} 
                    />
                    <span className="text-[10px] font-black uppercase italic truncate">{val}</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-black uppercase italic text-center">{val}</span>
                )}

                {!isOptionAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60">
                    <span className="text-[15px] font-black bg-red-600 text-white px-1 ml-20 rounded-sm">
                      {isRTL ? "نفذ" : "OUT"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 dark:bg-white/5">
        <button 
          onClick={resetSelector}
          className="w-full py-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          {isRTL ? "إلغاء العملية" : "Cancel Process"}
        </button>
      </div>
    </div>
  </div>
)}

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
<div className="bg-slate-900 dark:bg-black text-white dark:text-[#86FE05] border border-white/10 px-6 py-2 rounded-full text-[15px] bold font-black uppercase tracking-[0.3em] -rotate-12 shadow-2xl">
  {language === "ar" ? "نفذت الكمية" : "SOLD OUT"}
</div>          </div>
        )}
      </div>

      <div className="pt-5 px-1 flex flex-col items-center text-center gap-3">
        <h3 onClick={handleNavigate} className="text-[14px] sm:text-[16px] font-black uppercase tracking-tight text-black dark:text-white italic truncate max-w-full cursor-pointer hover:text-[#86FE05]">
          {product.name}
        </h3>
        
        <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"} justify-center`}>
          <div className="flex items-baseline gap-1">
            <span className="text-black dark:text- font-black text-3xl sm:text-4xl italic tracking-tighter leading-none">{product.price}</span>
            <span className="text-[10px] font-black uppercase text-black/50 dark:text-white/50 italic">{isRTL ? "ج.م" : "EGP"}</span>
          </div>

          {product.originalPrice > product.price && (
            <div className={`flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"} gap-3`}>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 rotate-[15deg]"></div>
              <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"} justify-center leading-tight`}>
                <span className="text-[9px] font-black bg-[#FF3B3B] text-white px-1.5 py-0.5 rounded-sm uppercase italic mb-1">-{product.salePercentage}%</span>
                <span className="text-sm font-bold italic text-slate-400 dark:text-white/20 line-through decoration-slate-400/50">{product.originalPrice}</span>
              </div>
            </div>
          )}
        </div>

        {!isSoldOut && (
          <button 
            onClick={(e) => { e.stopPropagation();e.preventDefault(); setIsDirectBuy(true); // 🔥 مهم جدًا: نخلي الفتح في tick منفصل
    setTimeout(() => {
      setShowVariantSelector(true);
    }, 0); }}
            className="w-full mt-2 bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-[1.2rem] text-[11px] font-black uppercase italic tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-white transition-all shadow-lg active:scale-95"
          >
            <Zap size={14} className="fill-current" />
            {isRTL ? "اشتري الآن" : "Buy Now"}
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(ProductCard);