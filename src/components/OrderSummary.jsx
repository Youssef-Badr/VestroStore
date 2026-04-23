import React, { useState } from 'react';
import { ChevronDown, Package, Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({ cart, isRTL, removeFromCart, updateQty, cartTotal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  if (!cart || cart.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 mb-6 mt-28 animate-in fade-in zoom-in duration-500">
        <div className={`flex flex-col items-center justify-center py-16 px-6 rounded-[2.5rem] border-2 border-dashed transition-all ${
          darkMode ? "border-white/10 bg-white/[0.02] text-white" : "border-slate-200 bg-slate-50/50 text-slate-900"
        }`}>
          <div className={`w-24 h-24 mb-6 flex items-center justify-center rounded-full transition-colors ${
            darkMode ? "bg-white/5 shadow-inner" : "bg-white shadow-sm"
          }`}>
            <ShoppingBag size={48} className={darkMode ? "text-red-800" : "text-slate-300"} />
          </div>
          <h3 className="text-xl font-black uppercase       mb-2                 ">
            {isRTL ? "سلتك فارغة تماماً" : "Your cart is empty"}
          </h3>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 max-w-[280px] text-center leading-relaxed">
            {isRTL ? "لم يتم العثور على أي منتجات، ابدأ باكتشاف أحدث صيحات الموضة الآن!" : "No products found in your cart. Start discovering our latest trends now!"}
          </p>
          <button
            onClick={() => navigate("/products")}
            className={`group relative flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase                        transition-all hover:scale-105 active:scale-95 shadow-xl ${
              darkMode ? "bg-red-700 text-black " : "bg-black text-white shadow-black/20"
            }`}
          >
            <span>{isRTL ? "اذهب لصفحة التسوق" : "Go to Shopping"}</span>
            <div className="transition-transform group-hover:translate-x-1">
              {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 mb-6 mt-24 transition-all duration-500">
      <div className={`overflow-hidden rounded-[2.5rem] border-2 transition-all duration-500 ${
        darkMode ? "bg-[#0A0A0A] border-white/5 shadow-2xl shadow-black" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"
      }`}>
        
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-6 py-5 transition-colors ${
            darkMode ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl flex items-center justify-center transition-colors ${
              darkMode ? "bg-white text-black" : "bg-black text-white"
            }`}>
              <Package size={20} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h3 className={`text-[13px] font-black uppercase                        ${darkMode ? "text-white" : "text-slate-900"}`}>
                {isRTL ? "ملخص الطلب" : "Order Summary"}
              </h3>
              <p className="text-[10px] font-bold text-red-600 uppercase                  mt-0.5">
                {cart.length} {isRTL ? "منتجات" : "Items"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-lg font-black text-red-600 dark:text-white ">
                {cartTotal?.toLocaleString()} <span className="text-[10px] ms-1">{isRTL ? "ج.م" : "EGP"}</span>
             </span>
             <ChevronDown className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""} ${darkMode ? "text-white/20" : "text-slate-300"}`} />
          </div>
        </button>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className={`p-4 space-y-3 border-t transition-colors ${
            darkMode ? "border-white/5 bg-white/[0.01]" : "border-slate-50 bg-slate-50/30"
          }`}>
            
            {cart.map((item) => {
              const itemId = item.isBundle ? item.uniqueId : item.variantId;
              
              return (
                <div 
                  key={itemId} 
                  className={`flex gap-4 p-4 rounded-[1.8rem] border transition-all duration-300 ${
                    darkMode ? "bg-[#111] border-white/5 hover:border-red-800" : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {/* الصور */}
                  <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-black/10 flex">
                    {item.isBundle ? (
                      <div className="flex w-full h-full">
                         {item.bundleItems?.slice(0, 2).map((bi, i) => (
                           <img key={i} src={bi.image} className={`w-1/2 h-full object-cover ${i === 0 && item.bundleItems.length > 1 ? (isRTL ? "border-l" : "border-r") + " border-white/10" : "w-full"}`} alt="" />
                         ))}
                      </div>
                    ) : (
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    )}
                    {item.isBundle && (
                      <div className="absolute top-0 inset-x-0 bg-white dark:bg-black dark:text-white text-black text-[10px] font-black py-0.5 text-center uppercase       shadow-sm">
                        Bundle
                      </div>
                    )}
                  </div>

                  {/* تفاصيل المنتج المحدثة */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-[12px] font-black uppercase       truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                        {item.name}
                      </h4>
                      <button 
                        type="button"
                        onClick={() => removeFromCart(itemId)}
                        className="text-red-500/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* ✅ عرض المقاس واللون جنب الاسم لكل قطعة ✅ */}
                    <div className="flex flex-col gap-1.5 mt-1">
                      {item.isBundle ? (
                        item.bundleItems?.map((bi, idx) => (
                          <div key={idx} className="flex items-center gap-2 overflow-hidden">
                            <span className={`text-[9px] font-black uppercase       truncate shrink ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                              {bi.name} :
                            </span>
                            <div className="flex gap-1 shrink-0">
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${darkMode ? "bg-white/5 text-white border border-white/5" : "bg-slate-100 text-black border border-slate-200"}`}>
                                {bi.color}
                              </span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${darkMode ? "bg-white/5 text-white border border-white/5" : "bg-black text-white"}`}>
                                {bi.size}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex gap-2 mt-1">
                           <span className={`text-[9px] font-bold uppercase                  px-2 py-0.5 rounded ${darkMode ? "bg-white/5 text-white" : "bg-slate-100 text-slate-600"}`}>
                            {item.color}
                          </span>
                          <span className={`text-[9px] font-bold uppercase                  px-2 py-0.5 rounded ${darkMode ? "bg-white/5 text-white" : "bg-black text-white"}`}>
                            {item.size}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* السعر والتحكم */}
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="text-sm font-black text-black dark:text-white      ">
                        {(item.price * item.qty).toLocaleString()} <span className="text-[9px] ms-1">{isRTL ? "ج.م" : "EGP"}</span>
                      </span>

                      <div className={`flex items-center gap-2 p-1 rounded-lg border ${darkMode ? "bg-black border-white/10" : "bg-slate-50 border-slate-200"}`}>
                        <button 
                          type="button"
                          onClick={() => updateQty(itemId, item.qty - 1)}
                          className={`w-5 h-5 flex items-center justify-center rounded transition-all ${item.qty <= 1 ? "opacity-10" : "hover:bg-red-700 hover:text-black dark:text-white"}`}
                          disabled={item.qty <= 1}
                        >
                          <Minus size={10} strokeWidth={3} />
                        </button>
                        <span className={`text-[10px] font-black w-4 text-center ${darkMode ? "text-white" : "text-slate-900"}`}>
                          {item.qty}
                        </span>
                        <button 
                          type="button"
                          onClick={() => updateQty(itemId, item.qty + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded transition-all hover:bg-red-700 hover:text-black dark:text-white"
                        >
                          <Plus size={10} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;