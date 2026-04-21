/* eslint-disable no-unused-vars */
import React from 'react';
import { X, Zap, CheckCircle2, TrendingDown, Eye, ArrowRight, ArrowLeft } from 'lucide-react'; // ضفت أيقونات سهم للجمال
import { useNavigate } from 'react-router-dom';

const BundleDetailsModal = ({ bundle, isOpen, onClose, onClaim, isAr, darkMode }) => { // 👈 ضفنا onClaim هنا
  const navigate = useNavigate();
  if (!isOpen) return null;

  const savings = bundle.originalPrice - bundle.bundlePrice;

  const handleProductClick = (productId) => {
    window.open(`/product/${productId}`, '_blank');
  };

  return (
   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
  <div className={`relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl transition-all 
    ${darkMode 
      ? 'bg-[#0F0F0F] text-white border border-white/10' 
      : 'bg-white text-black border border-black/10'}`}>

    {/* Header */}
    <div className={`p-6 flex justify-between items-center border-b 
      ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
      
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center 
          ${darkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
          <Zap size={16} />
        </div>

        <span className="font-black italic uppercase text-[18px] tracking-widest">
          {isAr ? "تحليل الصفقة" : "Deal Analysis"}
        </span>
      </div>

      <button 
        onClick={onClose} 
        className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all opacity-60 hover:opacity-100"
      >
        <X size={20} />
      </button>
    </div>

    <div className="p-8">
      <h2 className="text-2xl font-black italic uppercase mb-2 tracking-tighter">
        {isAr ? "ليه العرض ده لقطة؟" : "Why is this a steal?"}
      </h2>

      <p className="text-[15px] font-bold uppercase mb-8 leading-relaxed opacity-70">
        {isAr 
          ? `أنت هتمتلك ${bundle.items.length} قطع مختارة بعناية بتوفير حقيقي!` 
          : `You're getting ${bundle.items.length} curated pieces with real savings!`}
      </p>

      {/* Breakdown */}
      <div className="space-y-4 mb-8">
        {bundle.items.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => handleProductClick(item.product._id)}
            className={`flex justify-between items-center group cursor-pointer p-3 rounded-2xl transition-all 
              ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`relative w-12 h-12 rounded-xl overflow-hidden 
                ${darkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border`}>
                
                <img 
                  src={item.product.images?.[0]?.url} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt="" 
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <Eye size={14} className="text-white" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[15px] font-black uppercase truncate max-w-[150px] group-hover:opacity-70 transition">
                  {item.product.name}
                </span>
                <span className="text-[12px] opacity-40 uppercase font-bold tracking-tighter">
                  {isAr ? "اضغط لعرض التفاصيل" : "Click for details"}
                </span>
              </div>
            </div>

            <span className="text-[14px] font-black italic">
              {item.product.salePrice || item.product.price} EGP
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden 
        ${darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.03] border-black/10'}`}>

        <div className="flex justify-between items-center mb-2 opacity-60 font-bold text-[15px] uppercase">
          <span>{isAr ? "مجموع القطع منفردة" : "Individual Items Total"}</span>
          <span className="line-through">{bundle.originalPrice} EGP</span>
        </div>

        <div className="flex justify-between items-center mb-4 font-black text-xl">
          <span className="italic uppercase tracking-tighter">
            {isAr ? "سعر الباقة الآن" : "Bundle Price Now"}
          </span>
          <span className="italic">{bundle.bundlePrice} EGP</span>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/10 dark:border-white/10 text-sm font-black uppercase">
          <span>
            {isAr ? `وفرت ${savings} ج.م` : `You saved ${savings} EGP`}
          </span>
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="p-6">
      <button 
        onClick={onClaim}
        className={`w-full py-5 rounded-2xl font-black uppercase text-[18px] tracking-[0.2em] transition-all shadow-lg 
          ${darkMode 
            ? 'bg-white text-black hover:scale-[1.02] active:scale-95' 
            : 'bg-black text-white hover:scale-[1.02] active:scale-95'}`}
      >
        {isAr ? "استفيد بالعرض الآن" : "Claim This Deal"}
      </button>
    </div>
  </div>
</div>
  );
};

export default BundleDetailsModal;