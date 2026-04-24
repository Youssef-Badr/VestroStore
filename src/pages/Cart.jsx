


/* eslint-disable no-unused-vars */
import React, { useMemo, useCallback, memo } from "react";
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

/* =========================
   Helpers
========================= */

const getOptimizedImage = (url, width = 500) => {
  if (!url) return "";
  if (!url.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},dpr_auto/`
  );
};

/* =========================
   Cart Item Card
========================= */

const CartItem = memo(function CartItem({
  item,
  isRTL,
  darkMode,
  onQty,
  onRemove,
}) {
  const itemId = item.isBundle ? item.uniqueId : item.variantId;

  const cardBg = darkMode
    ? "bg-[#0A0A0A] border-white/5"
    : "bg-white border-gray-200";

  return (
    <div
      className={`${cardBg} border p-4 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:border-red-700`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-[1.5rem] w-32 h-44 flex-shrink-0 bg-gray-100 dark:bg-[#111] shadow-inner border border-white/5">
        {item.isBundle ? (
          <div
            className={`grid h-full w-full gap-[1px] bg-gray-200 dark:bg-gray-800 ${
              item.bundleItems.length === 2 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {item.bundleItems.slice(0, 4).map((bItem, index) => (
              <img
                key={index}
                src={getOptimizedImage(bItem.image, 300)}
                loading="lazy"
                decoding="async"
                alt=""
                className="w-full h-full object-cover"
              />
            ))}

            {item.bundleItems.length > 4 && (
              <div className="absolute bottom-0 right-0 bg-black/80 text-red-700 text-[10px] font-black w-1/2 h-1/2 flex items-center justify-center">
                +{item.bundleItems.length - 4}
              </div>
            )}
          </div>
        ) : (
          <img
            src={getOptimizedImage(item.image, 500)}
            loading="lazy"
            decoding="async"
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}

        {item.isBundle && (
          <div className="absolute top-2 left-2 bg-red-700 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase">
            Bundle
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between w-full text-center sm:text-start">
        <div className="space-y-3">
          <h3 className="text-xl font-black uppercase leading-none">
            {item.name}
          </h3>

          {item.isBundle ? (
            <div className="space-y-1">
              {item.bundleItems.map((bItem, i) => (
                <p
                  key={i}
                  className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400"
                >
                  {bItem.name}:{" "}
                  <span className="text-black dark:text-white">
                    {bItem.color}
                  </span>{" "}
                  /{" "}
                  <span className="text-black dark:text-white">
                    {bItem.size}
                  </span>
                </p>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-black uppercase px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg">
                {isRTL ? "المقاس" : "SIZE"}: {item.size || "N/A"}
              </span>

              <span className="text-[10px] font-black uppercase px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg">
                {isRTL ? "اللون" : "COLOR"}: {item.color || "N/A"}
              </span>
            </div>
          )}
        </div>

        <p className="text-2xl font-black mt-4">
          {item.price.toLocaleString()}
          <span className="text-[10px] ml-1 opacity-50 uppercase">EGP</span>
        </p>
      </div>

      {/* Controls */}
      <div className="flex sm:flex-col items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
        <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-2xl p-1">
          <button
            onClick={() => onQty(item, item.qty - 1)}
            disabled={item.qty === 1}
            className="p-2 rounded-xl disabled:opacity-20 active:scale-90"
          >
            <Minus size={16} />
          </button>

          <span className="w-10 text-center font-black text-xl tabular-nums">
            {item.qty}
          </span>

          <button
            onClick={() => onQty(item, item.qty + 1)}
            className="p-2 rounded-xl hover:bg-red-700 hover:text-white active:scale-90"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={() => onRemove(item)}
          className="p-4 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
});

/* =========================
   Main Page
========================= */

const CartPage = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const { language } = useLanguage();
  const { darkMode } = useTheme();

  const isRTL = language === "ar";

  const translations = useMemo(
    () => ({
      cartTitle: isRTL ? "حقيبة التسوق" : "Shopping Bag",
      emptyCart: isRTL ? "حقيبتك فارغة حالياً" : "Your bag is empty",
      total: isRTL ? "الإجمالي" : "Total",
      checkout: isRTL ? "إتمام الطلب" : "Checkout Now",
      clearCart: isRTL ? "مسح السلة" : "Clear Cart",
      continueShopping: isRTL ? "واصل التسوق" : "Continue Shopping",
      itemDeleted: isRTL ? "تم الحذف" : "Removed!",
      quantityUpdated: isRTL ? "تم التحديث" : "Updated",
      cartCleared: isRTL ? "السلة فارغة الآن" : "Cart Cleared",
    }),
    [isRTL]
  );

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart]
  );

  const totalQty = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty, 0),
    [cart]
  );

  const handleUpdateQty = useCallback(
    (item, newQty) => {
      if (newQty < 1) return;

      const id = item.isBundle ? item.uniqueId : item.variantId;
      updateQty(id, newQty);

      toast.info(translations.quantityUpdated, {
        position: "bottom-right",
        autoClose: 800,
      });
    },
    [updateQty, translations]
  );

  const handleRemove = useCallback(
    (item) => {
      const id = item.isBundle ? item.uniqueId : item.variantId;
      removeFromCart(id);
      toast.error(translations.itemDeleted);
    },
    [removeFromCart, translations]
  );

  const handleClearCart = useCallback(() => {
    clearCart();
    toast.success(translations.cartCleared);
  }, [clearCart, translations]);

  const containerBg = darkMode ? "bg-black text-white" : "bg-gray-50 text-black";
  const cardBg = darkMode
    ? "bg-[#0A0A0A] border-white/5"
    : "bg-white border-gray-200";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen pt-32 pb-20 transition-all duration-300 ${containerBg}`}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-white/5 pb-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
              {translations.cartTitle}
            </h1>

            <p className="text-sm font-bold opacity-50 mt-2">
              {cart.length} {isRTL ? "منتجات في سلتك" : "Items in your bag"}
            </p>
          </div>

          <Link
            to="/products"
            className="flex items-center gap-2 font-black uppercase opacity-60 hover:opacity-100"
          >
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {translations.continueShopping}
          </Link>
        </div>

        {/* Empty */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-[3rem] border border-dashed border-white/10 bg-white/5">
            <ShoppingBag size={80} className="opacity-20 mb-6" />

            <p className="text-xl font-black uppercase opacity-40 mb-8">
              {translations.emptyCart}
            </p>

            <Link
              to="/products"
              className="px-10 py-4 rounded-2xl bg-red-700 text-white font-black uppercase"
            >
              {translations.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const itemId = item.isBundle
                  ? item.uniqueId
                  : item.variantId;

                return (
                  <CartItem
                    key={itemId}
                    item={item}
                    darkMode={darkMode}
                    isRTL={isRTL}
                    onQty={handleUpdateQty}
                    onRemove={handleRemove}
                  />
                );
              })}
            </div>

            {/* Sidebar */}
            <div>
              <div
                className={`${cardBg} border p-10 rounded-[2.5rem] sticky top-32`}
              >
                <h2 className="text-xl font-black uppercase mb-10 border-b border-white/5 pb-6">
                  {isRTL ? "ملخص الحساب" : "Checkout"}
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-sm font-bold opacity-50">
                    <span>{isRTL ? "القطع" : "Items"}</span>
                    <span>{totalQty}</span>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-white/5">
                    <span className="text-lg font-black uppercase">
                      {translations.total}
                    </span>

                    <div className="text-right">
                      <span className="text-3xl font-black">
                        {cartTotal.toLocaleString()}
                      </span>
                      <span className="block text-xs opacity-50 uppercase">
                        EGP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className="w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black uppercase bg-red-700 text-white"
                  >
                    <Zap size={18} fill="currentColor" />
                    {translations.checkout}
                  </Link>

                  <button
                    onClick={handleClearCart}
                    className="w-full py-4 font-black uppercase hover:text-red-500 transition-all"
                  >
                    {translations.clearCart}
                  </button>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 flex flex-col items-center gap-4 opacity-30">
                  <div className="flex gap-4">
                    <CreditCard size={20} />
                    <CreditCard size={20} />
                    <CreditCard size={20} />
                  </div>

                  <p className="text-[10px] font-bold uppercase">
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