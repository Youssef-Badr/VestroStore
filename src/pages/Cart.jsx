import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Zap,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const { language } = useLanguage();
  const { darkMode } = useTheme();

  const isRTL = language === "ar";
  const translations = {
    cartTitle: isRTL ? "حقيبة التسوق" : "Shopping Bag",
    emptyCart: isRTL ? "حقيبتك فارغة حالياً" : "Your bag is empty",
    total: isRTL ? "الإجمالي" : "Total",
    checkout: isRTL ? "إتمام الطلب" : "Checkout Now",
    clearCart: isRTL ? "مسح السلة" : "Clear Cart",
    continueShopping: isRTL ? "واصل التسوق" : "Continue Shopping",
    itemDeleted: isRTL ? "تم الحذف" : "Removed!",
    quantityUpdated: isRTL ? "تم التحديث" : "Updated",
    cartCleared: isRTL ? "السلة فارغة الآن" : "Cart Cleared",
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  

// const// تحديث الكمية
  const handleUpdateQty = (item, newQty) => {
    if (newQty < 1) return;
    // نرسل الـ uniqueId لو باكدج، أو الـ variantId لو منتج عادي
    const id = item.isBundle ? item.uniqueId : item.variantId;
    updateQty(id, newQty);
    
    toast.info(translations.quantityUpdated, {
      position: "bottom-right",
      autoClose: 1000,
    });
  };

  // حذف العنصر
  const handleRemove = (item) => {
    const id = item.isBundle ? item.uniqueId : item.variantId;
    removeFromCart(id);
    toast.error(translations.itemDeleted);
  };
  const handleClearCart = () => {
    clearCart();
    toast.success(translations.cartCleared);
  };

  const containerBg = darkMode ? "bg-black" : "bg-gray-50";
  const cardBg = darkMode
    ? "bg-[#0A0A0A] border-white/5"
    : "bg-white border-gray-200";
  const neonButton =
    "bg-black text-white dark:bg-white dark:text-black  hover:scale-[1.02]";

 return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen pt-32 pb-20 ${containerBg} ${darkMode ? "text-white" : "text-black"} transition-all duration-500`}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-white/5 pb-10">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl text-center font-black        uppercase leading-none">
              {translations.cartTitle}
              <span className="text-black dark:text-white">.</span>
            </h1>
            <p className="text-[15px] font-bold uppercase  opacity-40">
              {cart.length} {isRTL ? "منتجات في سلتك" : "Items in your bag"}
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-[15px] font-black uppercase opacity-60 hover:opacity-100 transition-all group"
          >
            {isRTL ? (
              <ArrowRight size={16} className="group-hover:translate-x-1" />
            ) : (
              <ArrowLeft size={16} className="group-hover:-translate-x-1" />
            )}
            {translations.continueShopping}
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-[3rem] border border-dashed border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="mb-8 opacity-20">
              <ShoppingBag size={80} strokeWidth={1} />
            </div>
            <p className="text-xl font-black uppercase   opacity-40 mb-10">
              {translations.emptyCart}
            </p>
            <Link
              to="/products"
              className={`px-12 py-5 rounded-2xl font-black uppercase text-xs  transition-all ${neonButton}`}
            >
              {translations.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                // تعريف المعرف لاستخدامه في الـ Key والدوال
                const itemId = item.isBundle ? item.uniqueId : item.variantId;

                return (
                  <div
                    key={itemId}
                    className={`${cardBg} border p-4 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-6 group transition-all duration-300 hover:border-red-700 `}
                  >
                    {/* 1. قسم الصورة (توزيع ديناميكي للباندل أو منتج عادي) */}
                    <div className="relative overflow-hidden rounded-[1.5rem] w-32 h-44 flex-shrink-0 bg-gray-100 dark:bg-[#111] shadow-inner border border-white/5">
                      {item.isBundle ? (
                        <div className={`grid h-full w-full gap-0.5 bg-gray-200 dark:bg-gray-800 
                          ${item.bundleItems.length === 2 ? "grid-cols-1" : "grid-cols-2"}`}>
                          
                          {item.bundleItems.slice(0, 4).map((bItem, index) => (
                            <div key={index} className="relative w-full h-full overflow-hidden border-[0.5px] border-black/5">
                              <img
                                src={bItem.image}
                                alt=""
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                          ))}

                          {/* عداد الصور الإضافية في حالة أكثر من 4 منتجات */}
                          {item.bundleItems.length > 4 && (
                            <div className="absolute bottom-0 right-0 bg-black/80 backdrop-blur-sm text-red-800 text-[10px] font-black w-1/2 h-1/2 flex items-center justify-center border-t border-l border-white/10">
                              +{item.bundleItems.length - 4}
                            </div>
                          )}
                        </div>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}

                      {/* شارة الباندل */}
                      {item.isBundle && (
                        <div className="absolute top-2 left-2 z-10 bg-red-700  text-[7px] font-black px-2 py-0.5 rounded-full uppercase  shadow-xl">
                          Bundle
                        </div>
                      )}
                    </div>

                    {/* 2. قسم التفاصيل (الاسم + المواصفات + السعر) */}
                    <div className="flex-1 flex flex-col justify-between h-full py-2 text-center sm:text-start w-full">
                      <div className="space-y-3">
                        {/* اسم المنتج */}
                        <h3 className="text-xl font-black uppercase      leading-none">
                          {item.name}
                        </h3>

                        {/* المواصفات الديناميكية */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          {item.isBundle ? (
                            <div className="flex flex-col gap-1.5 mt-1">
                              {item.bundleItems.map((bItem, i) => (
                                <div key={i} className="flex items-center gap-2 group/item">
                                  <span className="w-1 h-1 rounded-full bg-red-700 group-hover/item:scale-150 transition-transform"></span>
                                  <p className="text-[10px] font-bold uppercase  text-gray-500 dark:text-gray-400">
                                    {bItem.name}: <span className="text-gray-900 dark:text-white">{bItem.color}</span> / <span className="text-black dark:text-white">{bItem.size}</span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <span className="text-[10px] font-black uppercase px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 opacity-60">
                                {isRTL ? "المقاس" : "SIZE"}: {item.size || "N/A"}
                              </span>
                              <span className="text-[10px] font-black uppercase  px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 opacity-60">
                                {isRTL ? "اللون" : "COLOR"}: {item.color || "N/A"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* السعر */}
                      <p className="text-2xl font-black text-black dark:text-white  mt-4">
                        {item.price.toLocaleString()} 
                        <span className="text-[10px] not-      font-bold opacity-40 uppercase ml-1">EGP</span>
                      </p>
                    </div>

                    {/* 3. التحكم في الكمية والحذف */}
                    <div className="flex flex-row sm:flex-col items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
                      <div className="flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-1 shadow-inner">
                        <button
                          onClick={() => handleUpdateQty(item, item.qty - 1)}
                          disabled={item.qty === 1}
                          className="p-2 hover:bg-white/10 rounded-xl transition-all disabled:opacity-10 active:scale-90"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-black text-xl  tabular-nums">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item, item.qty + 1)}
                          className="p-2 hover:bg-red-700 hover:text-black rounded-xl transition-all active:scale-90"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemove(item)}
                        className="p-4 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group/trash"
                      >
                        <Trash2 size={22} className="group-hover/trash:scale-110" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div
                className={`${cardBg} border p-10 rounded-[2.5rem] sticky top-32 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]`}
              >
                <h2 className="text-xl font-black  uppercase  mb-10 border-b border-white/5 pb-6">
                  {isRTL ? "ملخص الحساب" : "Checkout"}
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-[15px] font-bold uppercase  opacity-40">
                    <span>{isRTL ? "القطع" : "Items"}</span>
                    <span>{cart.reduce((a, b) => a + b.qty, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <span className="text-lg font-black uppercase      ">
                      {translations.total}
                    </span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-black dark:text-white       leading-none">
                        {cartTotal.toLocaleString()}
                      </span>
                      <span className="block text-[13px] font-bold uppercase opacity-50">
                        EGP (Incl. Tax)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className={`w-full flex items-center bg-red-700 justify-center gap-3 py-6 rounded-[1.5rem] font-black uppercase text-xs  transition-all ${neonButton}`}
                  >
                    <Zap size={18} fill="currentColor" />{" "}
                    {translations.checkout}
                  </Link>

                  <button
                    onClick={handleClearCart}
                    className="w-full py-4 text-[15px] font-black uppercase  hover:opacity-100 hover:text-red-500 transition-all"
                  >
                    {translations.clearCart}
                  </button>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
                  <div className="flex gap-4 opacity-20 grayscale">
                    <CreditCard size={20} />
                    <div className="w-8 h-5 bg-white/20 rounded-sm"></div>
                    <div className="w-8 h-5 bg-white/20 rounded-sm"></div>
                  </div>
                  <p className="text-[8px] font-bold uppercase  opacity-30">
                    {isRTL ? "دفع آمن 100%" : "100% Secure Checkout"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;