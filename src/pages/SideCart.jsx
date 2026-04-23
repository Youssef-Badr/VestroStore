/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";

export default function SideCart() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty } = useCart();
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const isRTL = language === "ar";

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // دالة موحدة للتعامل مع تحديث الكمية والحذف بناءً على نوع المنتج
  const getId = (item) => (item.isBundle ? item.uniqueId : item.variantId);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* الخلفية المظلمة (Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed  inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />

          {/* جسم الكارت (Drawer) */}
          <motion.div
            initial={{ x: isRTL ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-[85%] sm:w-full max-w-md z-[1000] shadow-2xl flex flex-col
              ${darkMode ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-black dark:text-white" />
                <h2 className="text-xl font-black uppercase    ">
                  {isRTL ? "سلة التسوق" : "Your Cart"}
                </h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-500/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* محتويات السلة */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="p-6 bg-zinc-500/5 rounded-full">
                    <ShoppingBag size={60} className="text-zinc-500 opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
                      {isRTL ? "السلة فارغة حالياً" : "Your cart is empty"}
                    </p>
                    <Link
                      to="/products"
                      onClick={() => setIsCartOpen(false)}
                      className="flex items-center gap-2 text-black dark:text-white font-black uppercase     text-xs border-b-2 border-red-800 pb-1 hover:opacity-70 transition-all mx-auto w-fit"
                    >
                      {isRTL ? "اذهب للتسوق" : "Go Shopping"}
                      {isRTL ? <ArrowRight size={14} className="rotate-180" /> : <ArrowRight size={14} />}
                    </Link>
                  </div>
                </div>
              ) : (
                cart.map((item) => {
                  const itemId = getId(item);
                  return (
                    <div key={itemId} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2">
                      {/* 🖼️ قسم الصورة (باندل أو منتج عادي) */}
                      <div className="w-20 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-800/10 relative">
                        {item.isBundle ? (
                          <div className={`grid h-full w-full gap-0.5 ${item.bundleItems.length === 2 ? "grid-cols-1" : "grid-cols-2"}`}>
                            {item.bundleItems.slice(0, 4).map((bItem, index) => (
                              <img 
                                key={index} 
                                src={bItem.image} 
                                className="w-full h-full object-cover" 
                                alt="" 
                              />
                            ))}
                            {item.bundleItems.length > 4 && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-black text-black dark:text-white">
                                +{item.bundleItems.length - 4}
                              </div>
                            )}
                          </div>
                        ) : (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                        {item.isBundle && (
                          <div className="absolute top-1 left-1 bg-white text-black text-[6px] font-black px-1 rounded-sm uppercase z-10">
                            Bundle
                          </div>
                        )}
                      </div>

                      {/* 📝 التفاصيل */}
                     <div className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 min-w-0">
                        <h3 className="font-black text-sm uppercase leading-tight break-words whitespace-normal  w-40">{item.name}</h3>
                        
                        {item.isBundle ? (
                          <div className="space-y-0.5">
                             {item.bundleItems.map((b, i) => (
                               <p key={i} className="text-[9px] text-zinc-500 font-bold break-words whitespace-normal">
                                 • {b.name} ({b.size})
                               </p>
                             ))}
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-500 font-bold">
                            {item.color} / {item.size}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-zinc-800/10 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => updateQty(itemId, item.qty - 1)} 
                              disabled={item.qty <= 1}
                              className="p-1 px-2 hover:bg-red-700 hover:text-black transition-colors disabled:opacity-20"
                            >
                              <Minus size={12}/>
                            </button>
                            <span className="px-2 text-xs font-bold">{item.qty}</span>
                            <button 
                              onClick={() => updateQty(itemId, item.qty + 1)} 
                              className="p-1 px-2 hover:bg-red-700 hover:text-black transition-colors"
                            >
                              <Plus size={12}/>
                            </button>
                          </div>
                          <p className="font-black text-black dark:text-white  text-sm">{item.price.toLocaleString()} EGP</p>
                        </div>
                      </div>

                      {/* زر الحذف */}
                      <button 
                        onClick={() => removeFromCart(itemId)} 
                        className=" group-hover:opacity-100 text-red-500 transition-all self-start pt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-800/10 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-zinc-500">{isRTL ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="text-2xl font-black">{totalPrice.toLocaleString()} EGP</span>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-black text-white dark:text-black dark:bg-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-800 hover:scale-[1.02] active:scale-95 transition-all  uppercase text-sm tracking-widest"
                >
                  {isRTL ? "إتمام الطلب" : "Checkout Now"}
                  <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
                </Link>
                <Link 
                  to="/cart" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-[13px]  font-black uppercase tracking-widest text-zinc-500 hover:text-red-800 transition-colors"
                >
                  {isRTL ? "عرض السلة بالكامل" : "View Full Cart"}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}