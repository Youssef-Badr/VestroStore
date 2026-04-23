 
import { useState } from "react";
import { FiCopy, FiCheck, FiPlus, FiTruck, FiTag, FiZap } from "react-icons/fi";

const CouponCard = ({ discount, darkMode, language, onProductClick, onAddToCart }) => {
  const [copied, setCopied] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const isRTL = language === "ar";

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // وظيفة لتحديد النص الرئيسي للخصم (العنوان)
  const getDiscountTitle = () => {
    if (discount.discountType === "free_shipping") {
      return isRTL ? "شحن مجاني بالكامل" : "FREE SHIPPING";
    }
    if (discount.discountType === "percentage") {
      return isRTL ? `خصم ${discount.percentage}%` : `${discount.percentage}% OFF`;
    }
    if (discount.discountType === "bogo") {
      return isRTL
        ? `اشتري ${discount.buyQuantity} وخد ${discount.getQuantity} مجاناً`
        : `Buy ${discount.buyQuantity} Get ${discount.getQuantity} FREE`;
    }
    if (discount.discountType === "bogo_discount") {
      return isRTL
        ? `اشتري ${discount.buyQuantity} وخد ${discount.getQuantity} بخصم ${discount.getDiscount}%`
        : `Buy ${discount.buyQuantity} Get ${discount.getQuantity} ${discount.getDiscount}% OFF`;
    }
    return isRTL ? "عرض خاص" : "Special Offer";
  };

  return (
  
<>
<div className={`relative w-full border-[2px] rounded-[2.5rem] p-6 transition-all duration-300 
shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
${darkMode 
  ? "bg-black border-white/10 text-white shadow-none" 
  : "bg-white border-black text-black"
}`}>

  {/* Header */}
  <div className="mb-6 flex flex-col items-center">
    
    {/* Icon */}
    <div className={`mb-3 p-3 rounded-2xl 
      ${darkMode 
        ? "bg-white text-black" 
        : "bg-black text-white"}`}>
      {discount.discountType === "free_shipping" ? <FiTruck size={22} /> : <FiZap size={22} />}
    </div>

    {/* Title */}
    <h3 className="text-2xl font-black       uppercase text-center">
      {getDiscountTitle()}
    </h3>

    {/* Sub */}
    <p className="text-[10px] mt-2 font-bold opacity-50 uppercase  text-center">
      {discount.discountType === "free_shipping" 
        ? (isRTL ? `للطلبات فوق ${discount.minOrderAmount} ج.م` : `On orders above ${discount.minOrderAmount} EGP`)
        : (isRTL ? "كود خصم حصري" : "Exclusive Code")}
    </p>
  </div>

  {/* Products */}
<div className={`space-y-3 mb-6 border-t border-dashed pt-4 
  ${darkMode ? "border-white/10" : "border-black/20"}`}>

  {discount.appliesToAll ? (
    
    /* 🔥 حالة: جميع المنتجات */
    <div className={`text-center py-4 px-3 rounded-2xl border text-sm font-black uppercase 
      ${darkMode 
        ? "bg-white/5 border-white/10 text-white" 
        : "bg-black/5 border-black/10 text-black"}`}>
      
      {isRTL 
        ? "✨ هذا الخصم يشمل جميع المنتجات" 
        : "✨ This discount applies to ALL products"}
    </div>

  ) : (
    
    /* المنتجات المحددة */
    discount.applicableProducts?.length > 0 && (
      <div className="grid gap-2">
        {discount.applicableProducts.map((product) => (
          <div 
            key={product._id} 
            className={`flex items-center justify-between p-2 rounded-2xl border transition-all 
              ${darkMode 
                ? "bg-white/[0.03] border-white/10 hover:border-white/30" 
                : "bg-black/[0.03] border-black/10 hover:border-black"}`}
          >

            {/* Product Info */}
            <div 
              className="flex items-center gap-3 cursor-pointer group flex-1"
              onClick={() => onProductClick(product)}
            >
              <img 
                src={product.images?.[0]?.url || product.image} 
                className="w-10 h-10 rounded-xl object-cover border border-black/10" 
              />
              <span className="text-[11px] font-black uppercase truncate max-w-[100px] group-hover:opacity-70">
                {product.name}
              </span>
            </div>

            <div className="flex items-center gap-2"> 
              
            {/* Preview */}
<button
  onClick={(e) => {
    e.stopPropagation();
    setPreviewProduct(product);
    setCurrentImgIndex(0);
  }}
  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase transition-all active:scale-90
    ${darkMode 
      ? "bg-red-800 text-black hover:bg-red-600" 
      : "bg-red-800 text-white hover:bg-red-600 hover:text-black"
    }`}
>
  {isRTL ? "عرض الصور" : "View"}
</button>

              {/* Add Button */}
              <button 
                onClick={() => onAddToCart(product)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase transition-all active:scale-90
                  ${darkMode 
                    ? "bg-red-800 text-black hover:bg-red-600" 
                    : "bg-red-800 text-white hover:bg-red-600 hover:text-black"}`}
              >
                {isRTL ? "أضف للسلة" : "Add to cart"}
              </button>

            </div>

          </div>
        ))}
      </div>
    )
  )}

</div>

  {/* Code */}
  <div className={`mb-4 p-3 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-1
    ${darkMode 
      ? "bg-white/[0.03] border-white/10" 
      : "bg-black/[0.03] border-black/20"}`}>
      
    <span className="text-[8px] opacity-40 uppercase">
      {isRTL ? " الكود" : " CODE"}
    </span>

    <span className="text-lg font-black  text-red-800">
      {discount.code}
    </span>
  </div>

  {/* Copy Button */}
  <button 
    onClick={() => copyToClipboard(discount.code)} 
    className={`w-full py-4 rounded-2xl font-black text-sm transition-all border flex items-center justify-center gap-2 uppercase      
      ${copied 
        ? "bg-red-800 text-black border-transparent" 
        : darkMode 
          ? "bg-white text-black hover:bg-red-700" 
          : "bg-black text-white hover:bg-red-700 hover:text-black"}`}
  >
    {copied ? <FiCheck strokeWidth={3} /> : <FiCopy strokeWidth={3} />}
    {copied ? (isRTL ? "تم النسخ" : "COPIED") : (isRTL ? "نسخ" : "COPY")}
  </button>

  {/* Side Circles */}
  <div className={`absolute -left-[14px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border
    ${darkMode ? "bg-black border-white/20" : "bg-white border-black"}`} />

  <div className={`absolute -right-[14px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border
    ${darkMode ? "bg-black border-white/20" : "bg-white border-black"}`} />

</div>


{previewProduct && (
  <div
    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
    onClick={() => setPreviewProduct(null)}
  >
   {/* Close */}
<button
  onClick={(e) => {
    e.stopPropagation();
    setPreviewProduct(null);
  }}
  className="absolute top-24 right-6 w-10 h-10 flex items-center justify-center 
             rounded-full bg-slate-500 hover:bg-white/20 text-black 
             text-xl font-bold transition"
>
  ✕
</button>

    {/* Prev */}
    {previewProduct.images?.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImgIndex((prev) =>
            prev === 0
              ? previewProduct.images.length - 1
              : prev - 1
          );
        }}
        className="absolute left-6 text-slate-800 text-5xl"
      >
        ‹
      </button>
    )}

    {/* Image */}
    <img
      src={previewProduct.images?.[currentImgIndex]?.url}
      className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
      onClick={(e) => e.stopPropagation()}
    />

    {/* Next */}
    {previewProduct.images?.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImgIndex((prev) =>
            prev === previewProduct.images.length - 1
              ? 0
              : prev + 1
          );
        }}
        className="absolute right-6 text-slate-800 text-5xl"
      >
        ›
      </button>
    )}
  </div>
)}
</>

  );
};

export default CouponCard;

