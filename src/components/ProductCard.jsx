/* eslint-disable no-unused-vars */
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { ShoppingBag, Zap, ChevronLeft } from "lucide-react";
import { createPortal } from "react-dom";

const getColorImage = (url) => {
  if (!url?.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    "/upload/w_80,h_80,c_fill,f_auto,q_auto/"
  );
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
      .map((opt) => opt.name)
      .filter((name) => ["Color", "Size", "اللون", "المقاس"].includes(name));
  }, [product.options]);

  const allImages = useMemo(() => {
    let images = [...(product.images || [])];
    if (product.variants) {
      product.variants.forEach((v) => {
        if (v.images) images = [...images, ...v.images];
      });
    }
    return Array.from(new Set(images.map((img) => img.url))).map((url) =>
      images.find((img) => img.url === url),
    );
  }, [product.images, product.variants]);

  const productId = product._id || product.id;
  const defaultImageUrl =
    "https://via.placeholder.com/600x800?text=Vestro+Product";
    

  const isSoldOut = useMemo(() => {
    if (!product.variants || product.variants.length === 0)
      return product.countInStock <= 0;
    return product.variants.every((v) => v.stock <= 0);
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
      const foundOption = product.options.find((o) => o.name === currentKey);
      return foundOption ? foundOption.values : [];
    }
    const filteredVariants = product.variants.filter((v) => {
      return Object.entries(selectedFilters).every(
        ([key, val]) => v.options[key] === val,
      );
    });
    return [
      ...new Set(filteredVariants.map((v) => v.options[currentKey])),
    ].filter(Boolean);
  }, [currentStep, selectedFilters, product, optionKeys]);

  const handleSelectVariant = useCallback(
    (variant) => {
      if (variant.stock > 0) {
        addToCart(product, variant, 1);
        const wasDirect = isDirectBuy;
        resetSelector();
        setIsDirectBuy(false);
        if (wasDirect) {
          navigate("/checkout");
        } else {
          toast.success(isRTL ? "تمت الإضافة للسلة" : "Added to Bag", {
            position: "bottom-center",
            autoClose: 1500,
            theme: "dark",
          });
        }
      }
    },
    [addToCart, isRTL, product, isDirectBuy, navigate, resetSelector],
  );

 
const handleStepClick = (val) => {
  const currentKey = optionKeys[currentStep];
  
  // 1️⃣ تحديث الفلاتر المختارة فوراً
  setSelectedFilters((prev) => ({
    ...prev,
    [currentKey]: val,
  }));

  // 2️⃣ الانتقال للخطوة التالية فقط إذا لم نكن في الخطوة الأخيرة
  if (currentStep < optionKeys.length - 1) {
    setCurrentStep((prev) => prev + 1);
  } 
  // لو إحنا في الخطوة الأخيرة، مش هنغير الـ currentStep 
  // وبكده المقاس هيفضل ظاهر قدامه ومختار، ويقدر يدوس "تأكيد الطلب"
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
      image.src = img.url.replace("/upload/", "/upload/f_auto,q_auto,w_500/");
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
    
      onClick={(e) => {
        e.stopPropagation();
        if (showVariantSelector) return;
        handleNavigate();
      }}
      className="group relative flex flex-col w-full bg-transparent transition-all duration-500"
    >
      <div className="relative w-full aspect-[3/3.5] rounded-[2.2rem] sm:rounded-[2.8rem] overflow-hidden bg-gray-100 dark:bg-[#0F0F0F] border border-slate-200/60 dark:border-white/5 group-hover:border-black dark:group-hover:border-white transition-all duration-500 shadow-sm group-hover:shadow-xl text-center">
        <div
          
          className="relative w-full h-full cursor-pointer overflow-hidden"
        >
          {/* الصورة الحالية */}
          <img
  src={
    (allImages[currentImageIndex]?.url || defaultImageUrl)
      ?.replace("/upload/", "/upload/f_auto,q_auto,w_800/")
  }
  alt={product.name}
  loading="lazy"
  decoding="async"
  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100"
/>

       
        </div>

        {/* ✅ بادجات الـ Sale */}
        {product.salePercentage > 0 && (
          <>
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-red-700 dark:bg-white backdrop-blur-md border border-red-700  dark:text-slate-950 text-white text-[8px] sm:text-[11px] font-black px-1.5 py-1.5 rounded-full  ">
                -{product.salePercentage}%
              </div>
            </div>
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-red-700 dark:bg-white backdrop-blur-md border border-red-700  dark:text-slate-950 text-white text-[8px] sm:text-[11px] font-black px-1 py-1.5 rounded-full uppercase                 ">
                {isRTL ? "تخفيض" : "SALE"}
              </div>
            </div>
          </>
        )}

        {/* ✅ زرار الإضافة السريعة */}
        {!isSoldOut && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // e.preventDefault();
              setIsDirectBuy(false);
              setShowVariantSelector(true);
            }}
            className="absolute bottom-6 right-6 w-8 h-8 sm:w-14 sm:h-14 bg-red-700 dark:text-black text-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 z-10 hover:scale-110"
          >
            <ShoppingBag size={15} strokeWidth={2.5} />
          </button>
        )}

       {/* ✅ Gorilla Style Variant Selector Modal */}
{showVariantSelector && 
createPortal (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
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
          <h4 className="text-lg md:text-xl font-[900] text-red-600 uppercase                 ">
            {isRTL ? "تخصيص الطلب" : "Customize"}
          </h4>
          <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase                  truncate max-w-[180px]">
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
                  ? "bg-red-600"
                  : "bg-gray-100 dark:bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Option Title & Back Button */}
        <div className="mb-4 flex justify-between items-center">
          <span className="text-[11px] font-black uppercase text-red-600">
            {/* {isRTL ? "اختر" : "Select"}  */}
            {optionKeys[currentStep]}
          </span>

          {currentStep > 0 && (
            <button
              onClick={() => {
                // 🛠️ الحل: نمسح الفلتر الحالي والفلتر اللي راجعين له عشان يصفر الاختيار
                setSelectedFilters((prev) => {
                  const updated = { ...prev };
                  delete updated[optionKeys[currentStep]];     // مسح الحالي
                  delete updated[optionKeys[currentStep - 1]]; // مسح اللي قبله
                  return updated;
                });
                setCurrentStep(currentStep - 1);
              }}
              className="text-[14px] font-bold text-red-800 underline uppercase                 "
            >
              {isRTL ? "الرجوع" : "Go Back"}
            </button>
          )}
        </div>

        {/* Options Grid */}
<div className="grid grid-cols-2 gap-3">
          {availableOptionsForStep.map((val, idx) => {
            const currentOptionKey = optionKeys[currentStep];
            const isSelected = selectedFilters[currentOptionKey] === val;
            const isColor = currentOptionKey === "Color" || currentOptionKey === "اللون";

           const isOptionAvailable = product.variants.some(v => {
      const matchesCurrent = v.options[currentOptionKey] === val;
      const matchesPrev = optionKeys.slice(0, currentStep).every(key => v.options[key] === selectedFilters[key]);
      return matchesCurrent && matchesPrev && v.stock > 0;
    });


            // جلب بيانات اللون والسعر
            const colorVariant = product.variants.find(v => v.options.Color === val);
           const colorImage =
  getColorImage(colorVariant?.images?.[0]?.url) ||
  getColorImage(product.images?.[0]?.url);

            // حساب أقل سعر متاح لهذا الخيار
            const prices = product.variants
              .filter(v => v.options[currentOptionKey] === val)
              .map(v => v.price || product.price);
            const lowestPrice = prices.length > 0 ? Math.min(...prices) : product.price;

            return (
              <button
                key={idx}
                disabled={!isOptionAvailable}
              onClick={() => handleStepClick(val)}
        className={`group relative flex flex-col items-start gap-2 p-3 rounded-xl border-2 transition-all duration-300 ${
          isSelected
            ? "border-red-600 bg-red-50 dark:bg-red-900/20" // ✅ شكل الزرار لما يتم اختياره
            : isOptionAvailable
              ? "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-black"
              : "opacity-40 cursor-not-allowed grayscale"
        }`}
      >
                {/* TOP SECTION */}
                <div className="flex items-center gap-2">
                  {isColor ? (
                    <>
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-black/10 shadow-sm">
                        <img
                          src={colorImage}
                           loading="lazy"
  decoding="async"
                          className="w-full h-full object-cover"
                          alt={val}
                        />
                      </div>
                      <span className="text-[13px] font-black uppercase">{val}</span>
                    </>
                  ) : (
                    <span className="text-[13px] font-black uppercase">{val}</span>
                  )}
                </div>

                {/* PRICE INFO */}
                <span className="text-[9px] font-bold text-gray-500">
                  {lowestPrice} EGP
                </span>

                {/* OUT OF STOCK BADGE */}
                {!isOptionAvailable && (
                  <div className="absolute  left-12 top-12 flex items-center justify-center bg-white/5 dark:bg-black/60 rounded-xl">
                    <span className="text-[11px] font-black bg-red-600 text-white px-2 py-1  rounded-sm rotate-12">
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
<div className="p-4 bg-gray-50 dark:bg-white/5 flex gap-3">
  <button onClick={resetSelector} className="flex-1 py-3 text-[13px] font-black uppercase text-gray-500">
    {isRTL ? "إلغاء" : "Cancel"}
  </button>

  <button
    onClick={() => {
      // 1. نجيب الـ Variant اللي بيطابق كل الاختيارات
      const finalVariant = product.variants.find((v) =>
        optionKeys.every((key) => v.options[key] === selectedFilters[key])
      );

      if (finalVariant) {
        handleSelectVariant(finalVariant); // دي بتعمل addToCart وبتروح للكارت أو التشيك أوت
      } else {
        toast.error(isRTL ? "برجاء اختيار المقاس واللون" : "Please select color and size");
      }
    }}
    // ✅ الزرار مش هيتفعل (Disabled) غير لما كل الـ keys يكون ليها قيم مختارة
    disabled={!optionKeys.every(key => selectedFilters[key])}
    className={`flex-1 py-3 text-[14px] font-black uppercase rounded-xl transition-all ${
      optionKeys.every(key => selectedFilters[key])
        ? "bg-red-600 text-white hover:bg-red-700 shadow-lg active:scale-95"
        : "bg-gray-300 dark:bg-white/10 text-gray-500 cursor-not-allowed"
    }`}
  >
    {isRTL ? "تأكيد الطلب" : "Confirm Order"}
  </button>
</div>

    </div>
  </div>,
  document.body // 🔥 أهم سطر
)}

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-slate-900 dark:bg-black text-white dark:text-red-800 border border-white/10 px-6 py-2 rounded-full text-[15px] bold font-black uppercase                  -rotate-12">
              {language === "ar" ? "نفذت الكمية" : "SOLD OUT"}
            </div>{" "}
          </div>
        )}
      </div>

      <div className="pt-5 px-1 flex flex-col items-center text-center gap-3">
        <h3
          onClick={handleNavigate}
          className="text-[14px] sm:text-[16px] font-black uppercase  text-black dark:text-white      truncate max-w-full cursor-pointer hover:text-red-800"
        >
          {product.name}
        </h3>

        <div
          className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : "flex-row"} justify-center`}
        >
          <div className="flex items-baseline gap-1">
            <span className="text-black dark:text- font-black text-3xl sm:text-4xl                       leading-none">
              {product.price}
            </span>
            <span className="text-[10px] font-black uppercase text-black/50 dark:text-white/50 ">
              {isRTL ? "ج.م" : "EGP"}
            </span>
          </div>

          {product.originalPrice > product.price && (
            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"} gap-3`}
            >
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 rotate-[15deg]"></div>
              <div
                className={`flex flex-col ${isRTL ? "items-end" : "items-start"} justify-center leading-tight`}
              >
                <span className="text-[9px] font-black bg-[#FF3B3B] text-white px-1.5 py-0.5 rounded-sm uppercase      mb-1">
                  -{product.salePercentage}%
                </span>
                <span className="text-sm font-bold      text-slate-400 dark:text-white/20 line-through decoration-slate-400/50">
                  {product.originalPrice}
                </span>
              </div>
            </div>
          )}
        </div>

        {!isSoldOut && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
             setIsDirectBuy(true);
setShowVariantSelector(true);
            }}
            className="w-full mt-2 bg-black dark:bg-white text-white dark:text-black py-4 rounded-[1.2rem] text-[11px] font-black uppercase flex items-center justify-center gap-2 hover:bg-red-700 dark:hover:bg-red-700 transition-all shadow-lg active:scale-95"
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
