/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FiCopy, FiCheck, FiPlus, FiTruck, FiTag, FiZap } from "react-icons/fi";

const CouponCard = ({ discount, darkMode, language, onProductClick, onAddToCart }) => {
  const [copied, setCopied] = useState(false);
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
    <div className={`relative w-full border-[3px] rounded-[2.5rem] p-6 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(134,254,5,0.2)] 
      ${darkMode ? "bg-zinc-900 border-[#86FE05]/50" : "bg-white border-black"}`}>
      
      {/* Header Section */}
      <div className="mb-6 flex flex-col items-center">
        <div className={`mb-3 p-3 rounded-2xl ${darkMode ? "bg-[#86FE05] text-black" : "bg-black text-[#86FE05]"}`}>
          {discount.discountType === "free_shipping" ? <FiTruck size={24} /> : <FiZap size={24} />}
        </div>
        <h3 className={`text-2xl font-black italic uppercase leading-tight text-center ${darkMode ? "text-[#86FE05]" : "text-black"}`}>
          {getDiscountTitle()}
        </h3>
        
        {/* وصف تفصيلي صغير */}
        <p className="text-[10px] mt-2 font-bold opacity-60 uppercase tracking-widest text-center">
          {discount.discountType === "free_shipping" 
            ? (isRTL ? `للطلبات فوق ${discount.minOrderAmount} ج.م` : `On orders above ${discount.minOrderAmount} EGP`)
            : (isRTL ? "كود الخصم الحصري لفيسترو" : "Exclusive Vestro Promo Code")}
        </p>
      </div>

      {/* المنتجات المشمولة - تصميم "رايق" بصور */}
      <div className={`space-y-3 mb-6 border-t-2 border-dashed py-4 ${darkMode ? "border-zinc-800" : "border-zinc-200"}`}>
        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-3 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
          {discount.appliesToAll 
            ? (isRTL ? "✨ يشمل جميع المنتجات" : "✨ Applied to all items")
            : (isRTL ? "📦 المنتجات المشمولة" : "📦 Included Items")}
        </p>

        {!discount.appliesToAll && discount.applicableProducts?.length > 0 && (
          <div className="grid gap-2">
            {discount.applicableProducts.map((product) => (
              <div key={product._id} className={`flex items-center justify-between p-2 rounded-2xl border transition-all hover:border-[#86FE05] ${darkMode ? "bg-black/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                <div 
                  className="flex items-center gap-3 cursor-pointer group flex-1"
                  onClick={() => onProductClick(product)}
                >
                  <img src={product.images?.[0]?.url || product.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-black/10" />
                  <span className="text-[11px] font-black uppercase truncate max-w-[120px] group-hover:text-[#86FE05]">
                    {product.name}
                  </span>
                </div>
                <button 
                  onClick={() => onAddToCart(product)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase transition-all active:scale-90
                    ${darkMode ? "bg-[#86FE05] text-black" : "bg-black text-[#86FE05]"}`}
                >
                  <FiPlus /> {isRTL ? "أضف" : "Add"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo Code Area */}
      <div className={`mb-4 p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 ${darkMode ? "bg-black/50 border-zinc-800" : "bg-zinc-100 border-zinc-300"}`}>
        <span className="text-[8px] font-black opacity-40 uppercase">{isRTL ? "استخدم الكود" : "USE CODE"}</span>
        <span className={`text-lg font-black tracking-tighter ${darkMode ? "text-white" : "text-black"}`}>{discount.code}</span>
      </div>

      {/* Main Action Button */}
      <button 
        onClick={() => copyToClipboard(discount.code)} 
        className={`w-full py-4 rounded-2xl font-black text-sm transition-all border-[3px] flex items-center justify-center gap-2 uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          ${copied 
            ? "bg-green-500 border-black text-black" 
            : darkMode 
              ? "bg-[#86FE05] border-black text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none" 
              : "bg-black border-black text-[#86FE05] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`}
      >
        {copied ? <FiCheck strokeWidth={4} /> : <FiCopy strokeWidth={4} />}
        {copied ? (isRTL ? "تم النسخ" : "COPIED!") : (isRTL ? "نسخ " : "COPY")}
      </button>

      {/* Ticket Notches (دوائر التذكرة الجانبية) */}
      <div className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-[3px] ${darkMode ? "bg-[#0a0a0a] border-[#86FE05]/50" : "bg-white border-black"}`} />
      <div className={`absolute -right-[18px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-[3px] ${darkMode ? "bg-[#0a0a0a] border-[#86FE05]/50" : "bg-white border-black"}`} />
    </div>
  );
};

export default CouponCard;