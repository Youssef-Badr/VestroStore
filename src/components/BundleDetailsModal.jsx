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
      <div className={`relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl transition-all ${darkMode ? 'bg-[#0F0F0F] text-white border border-white/5' : 'bg-white text-black'}`}>
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#86FE05] rounded-full flex items-center justify-center animate-pulse">
              <Zap size={16} className="text-black" />
            </div>
            <span className="font-black italic uppercase text-[18px] tracking-widest">
              {isAr ? "تحليل الصفقة" : "Deal Analysis"}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400"><X size={20} /></button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-black italic uppercase mb-2 tracking-tighter">
            {isAr ? "ليه العرض ده لقطة؟" : "Why is this a steal?"}
          </h2>
          <p className="text-[15px] font-bold  uppercase mb-8 leading-relaxed">
            {isAr ? `أنت هتمتلك ${bundle.items.length} قطع مختارة بعناية بتوفير حقيقي!` : `You're getting ${bundle.items.length} curated pieces with real savings!`}
          </p>

          {/* Breakdown الحسبة */}
          <div className="space-y-4 mb-8">
            {bundle.items.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleProductClick(item.product._id)}
                className={`flex justify-between items-center group cursor-pointer p-2 rounded-2xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/5">
                    <img src={item.product.images?.[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <Eye size={14} className="text-[#86FE05]" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-black uppercase truncate max-w-[150px] group-hover:text-[#86FE05] transition-colors">
                      {item.product.name}
                    </span>
                    <span className="text-[14px] opacity-40 uppercase font-bold tracking-tighter">
                      {isAr ? "اضغط لعرض التفاصيل" : "Click for details"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[14px] font-black italic">{item.product.salePrice || item.product.price} EGP</span>
                   <div className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-[#77e105]" />
                      <span className="text-[11px] font-bold text-[#76e006] uppercase">Genuine</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* التوفير النهائي */}
          <div className={`p-6 rounded-3xl border relative overflow-hidden ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
               <TrendingDown size={80} className="text-[#86FE05]" />
            </div>

            <div className="flex justify-between items-center mb-2 opacity-60 font-bold text-[15px] uppercase">
              <span>{isAr ? "مجموع القطع منفردة" : "Individual Items Total"}</span>
              <span className="line-through">{bundle.originalPrice} EGP</span>
            </div>
            <div className="flex justify-between items-center mb-4 font-black text-xl">
              <span className="text-[#6dce06] italic uppercase tracking-tighter">{isAr ? "سعر الباقة الآن" : "Bundle Price Now"}</span>
              <div className="flex flex-col items-end">
                <span className="text-[#79e406] italic leading-none">{bundle.bundlePrice} EGP</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-white/5 text-[#70d108]">
              <TrendingDown size={20} className="animate-bounce" />
              <span className="text-[15px] font-black uppercase italic tracking-wider">
                {isAr ? `وفرت ${savings} ج.م في جيبك!` : `You saved ${savings} EGP!`}
              </span>
            </div>
          </div>
        </div>

        {/* زرار الأكشن المعدل */}
        <div className="p-6">
          <button 
            onClick={onClaim} // 👈 هنا الربط: لما يضغط، يشغل الدالة اللي بتبدل المودالات
            className={`w-full py-5 rounded-2xl font-black uppercase text-[18px] tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 ${
              darkMode 
              ? 'bg-[#86FE05] text-black hover:scale-[1.02] active:scale-95 shadow-[#86FE05]/20' 
              : 'bg-black text-white hover:bg-[#86FE05] hover:text-black hover:scale-[1.02]'
            }`}
          >
            {isAr ? "استفيد بالعرض الآن" : "Claim This Deal"}
            {isAr ? <ArrowLeft size={18}/> : <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BundleDetailsModal;