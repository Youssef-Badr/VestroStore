/* eslint-disable no-unused-vars */
import React from 'react';
import { X, Zap, CheckCircle2, TrendingDown, Eye, ArrowRight, ArrowLeft } from 'lucide-react'; // ضفت أيقونات سهم للجمال
import { useNavigate } from 'react-router-dom';

const getImage = (url, size = 120) => {
  if (!url) return "";
  if (!url.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`
  );
};

const BundleDetailsModal = ({ bundle, isOpen, onClose, onClaim, isAr, darkMode }) => { // 👈 ضفنا onClaim هنا
  const navigate = useNavigate();
  if (!isOpen) return null;

  const savings = bundle.originalPrice - bundle.bundlePrice;

  const handleProductClick = (productId) => {
    window.open(`/product/${productId}`, '_blank');
  };

  return (
   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
 <div className={`relative w-full max-w-sm rounded-2xl overflow-hidden transition-all 
  ${darkMode 
    ? 'bg-[#0F0F0F] text-white border border-white/10' 
    : 'bg-white text-black border border-black/10'}`}>

  {/* Header */}
  <div className={`p-4 flex justify-between items-center border-b 
    ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
    
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center 
        ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <Zap size={14} />
      </div>

      <span className="font-bold text-sm">
        {isAr ? "تحليل الصفقة" : "Deal Analysis"}
      </span>
    </div>

    <button 
      onClick={onClose} 
      className="p-1.5 rounded-full opacity-70 hover:opacity-100"
    >
      <X size={16} />
    </button>
  </div>

  <div className="p-5">
    <h2 className="text-lg font-bold mb-2">
      {isAr ? "ليه العرض كويس؟" : "Why it's a good deal"}
    </h2>

    <p className="text-sm mb-6 opacity-70">
      {isAr 
        ? `هتاخد ${bundle.items.length} منتجات بتوفير حقيقي`
        : `Get ${bundle.items.length} products with savings`}
    </p>

    {/* Breakdown */}
    <div className="space-y-3 mb-6">
      {bundle.items.map((item, idx) => (
        <div 
          key={idx}
          onClick={() => handleProductClick(item.product._id)}
          className={`flex justify-between items-center cursor-pointer p-2 rounded-lg 
            ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg overflow-hidden border 
              ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
              
            <img 
  src={getImage(item.product.images?.[0]?.url, 300)}
  loading="lazy"
  decoding="async"
  alt={item.product.name || "product image"}
  className="w-full h-full object-cover"
/>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate max-w-[120px]">
                {item.product.name}
              </span>
              <span className="text-[11px] opacity-50">
                {isAr ? "عرض التفاصيل" : "View details"}
              </span>
            </div>
          </div>

          <span className="text-sm font-bold">
            {item.product.salePrice || item.product.price} EGP
          </span>
        </div>
      ))}
    </div>

    {/* Summary */}
    <div className={`p-4 rounded-xl border 
      ${darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.03] border-black/10'}`}>

      <div className="flex justify-between mb-1 text-sm opacity-60">
        <span>{isAr ? "السعر الأصلي" : "Original"}</span>
        <span className="line-through">{bundle.originalPrice} EGP</span>
      </div>

      <div className="flex justify-between font-bold text-base mb-2">
        <span>{isAr ? "سعر الباكدج" : "Bundle Price"}</span>
        <span className="text-red-600">{bundle.bundlePrice} EGP</span>
      </div>

      <div className="text-sm font-semibold">
        {isAr 
          ? `وفرت ${savings} ج.م`
          : `Saved ${savings} EGP`}
      </div>
    </div>
  </div>

  {/* CTA */}
  <div className="p-4">
    <button 
      onClick={onClaim}
      className="w-full py-3 rounded-xl text-sm font-bold bg-red-700 text-white hover:scale-[1.02] active:scale-95 transition"
    >
      {isAr ? "استفد باللعرض الآن" : "Claim Deal Now"}
    </button>
  </div>

</div>
</div>
  );
};

export default BundleDetailsModal;