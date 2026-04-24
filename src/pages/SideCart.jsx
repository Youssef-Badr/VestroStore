// /* eslint-disable no-unused-vars */
// import { motion, AnimatePresence } from "framer-motion";
// import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
// import { useCart } from "../contexts/CartContext";
// import { useLanguage } from "../contexts/LanguageContext";
// import { useTheme } from "../contexts/ThemeContext";
// import { Link } from "react-router-dom";

// export default function SideCart() {
//   const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty } = useCart();
//   const { language } = useLanguage();
//   const { darkMode } = useTheme();
//   const isRTL = language === "ar";

//   const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
//   const getId = (item) => (item.isBundle ? item.uniqueId : item.variantId);

//   return (
//     <AnimatePresence>
//       {isCartOpen && (
//         <>
//           {/* Overlay */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setIsCartOpen(false)}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
//           />

//           {/* Drawer */}
//           <motion.div
//             initial={{ x: isRTL ? "100%" : "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: isRTL ? "100%" : "-100%" }}
//             transition={{ type: "spring", damping: 25, stiffness: 200 }}
//             className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} h-full w-[85%] max-w-md z-[1000]
//               flex flex-col shadow-2xl overflow-hidden
//               ${darkMode ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
//             dir={isRTL ? "rtl" : "ltr"}
//           >

//             {/* HEADER */}
//             <div className="p-5 border-b border-zinc-800/10 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <ShoppingBag size={22} />
//                 <h2 className="text-lg font-black uppercase">
//                   {isRTL ? "السلة" : "Cart"}
//                 </h2>
//               </div>

//               <button
//                 onClick={() => setIsCartOpen(false)}
//                 className="p-2 rounded-full hover:bg-zinc-500/10"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* BODY */}
//             <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">

//               {cart.length === 0 ? (
//                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
//                   <ShoppingBag size={50} className="opacity-20" />
//                   <p className="text-sm text-zinc-500 font-bold">
//                     {isRTL ? "السلة فارغة" : "Cart is empty"}
//                   </p>

//                   <Link
//                     to="/products"
//                     onClick={() => setIsCartOpen(false)}
//                     className="text-xs font-bold border-b border-red-700"
//                   >
//                     {isRTL ? "ابدأ التسوق" : "Start Shopping"}
//                   </Link>
//                 </div>
//               ) : (
//                 cart.map((item) => {
//                   const itemId = getId(item);

//                   return (
//                     <div
//                       key={itemId}
//                       className="flex gap-3 border-b border-zinc-500/10 pb-4"
//                     >

//                       {/* IMAGE */}
//                       <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800/10">
//                         {item.isBundle ? (
//                           <div className="grid grid-cols-2 gap-[2px] h-full w-full">
//                             {item.bundleItems.slice(0, 4).map((b, i) => (
//                               <img
//                                 key={i}
//                                 src={b.image}
//                                 className="w-full h-full object-cover"
//                               />
//                             ))}
//                           </div>
//                         ) : (
//                           <img
//                             src={item.image}
//                             className="w-full h-full object-cover"
//                           />
//                         )}
//                       </div>

//                       {/* DETAILS */}
//                       <div className="flex-1 min-w-0 flex flex-col justify-between">

//                         <div className="space-y-1">
//                           <h3 className="text-sm font-bold break-words">
//                             {item.name}
//                           </h3>

//                           {item.isBundle ? (
//                             <div className="space-y-0.5">
//                               {item.bundleItems.map((b, i) => (
//                                 <p
//                                   key={i}
//                                   className="text-[10px] text-zinc-500 break-words"
//                                 >
//                                   • {b.name} ({b.size})
//                                 </p>
//                               ))}
//                             </div>
//                           ) : (
//                             <p className="text-xs text-zinc-500">
//                               {item.color} / {item.size}
//                             </p>
//                           )}
//                         </div>

//                         {/* ACTIONS */}
//                         <div className="flex items-center justify-between mt-2">

//                           {/* qty */}
//                           <div className="flex items-center border rounded-md overflow-hidden">
//                             <button
//                               onClick={() => updateQty(itemId, item.qty - 1)}
//                               disabled={item.qty <= 1}
//                               className="px-2 py-1 disabled:opacity-30"
//                             >
//                               <Minus size={12} />
//                             </button>

//                             <span className="px-2 text-xs font-bold">
//                               {item.qty}
//                             </span>

//                             <button
//                               onClick={() => updateQty(itemId, item.qty + 1)}
//                               className="px-2 py-1"
//                             >
//                               <Plus size={12} />
//                             </button>
//                           </div>

//                           {/* price */}
//                           <span className="text-sm font-black">
//                             {item.price.toLocaleString()} EGP
//                           </span>
//                         </div>

//                       </div>

//                       {/* DELETE */}
//                       <button
//                         onClick={() => removeFromCart(itemId)}
//                         className="text-red-500 self-start p-1"
//                       >
//                         <Trash2 size={16} />
//                       </button>

//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             {/* FOOTER */}
//             {cart.length > 0 && (
//               <div className="p-5 border-t border-zinc-800/10 space-y-3">

//                 <div className="flex justify-between">
//                   <span className="text-sm text-zinc-500">
//                     {isRTL ? "الإجمالي" : "Total"}
//                   </span>
//                   <span className="text-xl font-black">
//                     {totalPrice.toLocaleString()} EGP
//                   </span>
//                 </div>

//                 <Link
//                   to="/checkout"
//                   onClick={() => setIsCartOpen(false)}
//                   className="w-full bg-black text-white py-3 rounded-xl text-sm font-bold text-center block"
//                 >
//                   {isRTL ? "إتمام الطلب" : "Checkout"}
//                 </Link>

//               </div>
//             )}

//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }


// ------------------------------

/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import { useMemo, useCallback } from "react";

export default function SideCart() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQty,
  } = useCart();

  const { language } = useLanguage();
  const { darkMode } = useTheme();

  const isRTL = language === "ar";

  /* =========================
     ⚡ PERFORMANCE OPTIMIZED
  ========================= */

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cart]);

  const cartEmpty = cart.length === 0;

  const getId = useCallback(
    (item) => (item.isBundle ? item.uniqueId : item.variantId),
    []
  );

  const getImg = useCallback((img) => {
    if (!img) return "";
    return typeof img === "object"
      ? img.url?.replace("/upload/", "/upload/f_auto,q_auto,w_200/")
      : img;
  }, []);

  const handleRemove = useCallback(
    (id) => removeFromCart(id),
    [removeFromCart]
  );

  const handleQty = useCallback(
    (id, qty) => updateQty(id, Math.max(1, qty)),
    [updateQty]
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${
              isRTL ? "right-0" : "left-0"
            } h-full w-[85%] max-w-md z-[1000] flex flex-col shadow-2xl overflow-hidden ${
              darkMode ? "bg-zinc-950 text-white" : "bg-white text-black"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* HEADER */}
            <div className="p-5 border-b border-zinc-800/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} />
                <h2 className="text-lg font-black uppercase">
                  {isRTL ? "السلة" : "Cart"}
                </h2>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-500/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* EMPTY STATE */}
              {cartEmpty ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={50} className="opacity-20" />

                  <p className="text-sm text-zinc-500 font-bold">
                    {isRTL ? "السلة فارغة" : "Cart is empty"}
                  </p>

                  <Link
                    to="/products"
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs font-bold border-b border-red-700"
                  >
                    {isRTL ? "ابدأ التسوق" : "Start Shopping"}
                  </Link>
                </div>
              ) : (
                cart.map((item) => {
                  const itemId = getId(item);

                  return (
                    <div
                      key={itemId}
                      className="flex gap-3 border-b border-zinc-500/10 pb-4"
                    >
                      {/* IMAGE */}
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800/10 bg-zinc-100 dark:bg-zinc-900">
                        {item.isBundle ? (
                          <div className="grid grid-cols-2 gap-[2px] h-full w-full">
                            {item.bundleItems?.slice(0, 4).map((b, i) => (
                              <img
                                key={`${itemId}-${i}`}
                                src={getImg(b.image)}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ))}
                          </div>
                        ) : (
                          <img
                            src={getImg(item.image)}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            alt={item.name}
                          />
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold break-words">
                            {item.name}
                          </h3>

                          {item.isBundle ? (
                            <div className="space-y-0.5">
                              {item.bundleItems?.map((b, i) => (
                                <p
                                  key={`${itemId}-b-${i}`}
                                  className="text-[10px] text-zinc-500 break-words"
                                >
                                  • {b.name} ({b.size})
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-500">
                              {item.color} / {item.size}
                            </p>
                          )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center justify-between mt-2">
                          {/* qty */}
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <button
                              onClick={() =>
                                handleQty(itemId, item.qty - 1)
                              }
                              disabled={item.qty <= 1}
                              className="px-2 py-1 disabled:opacity-30"
                            >
                              <Minus size={12} />
                            </button>

                            <span className="px-2 text-xs font-bold">
                              {item.qty}
                            </span>

                            <button
                              onClick={() =>
                                handleQty(itemId, item.qty + 1)
                              }
                              className="px-2 py-1"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* price */}
                          <span className="text-sm font-black">
                            {item.price.toLocaleString()} EGP
                          </span>
                        </div>
                      </div>

                      {/* DELETE */}
                      <button
                        onClick={() => handleRemove(itemId)}
                        className="text-red-500 self-start p-1 hover:bg-red-500/10 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* FOOTER */}
            {!cartEmpty && (
              <div className="p-5 border-t border-zinc-800/10 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-500">
                    {isRTL ? "الإجمالي" : "Total"}
                  </span>
                  <span className="text-xl font-black">
                    {totalPrice.toLocaleString()} EGP
                  </span>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-black text-white py-3 rounded-xl text-sm font-bold text-center block"
                >
                  {isRTL ? "إتمام الطلب" : "Checkout"}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}