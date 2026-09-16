// import { useEffect, useState } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiX,
//   FiGift,
//   FiCopy,
//   FiCheck,
//   FiArrowLeft,
//   FiClock,
//   FiShoppingBag,
//   FiTruck,
// } from "react-icons/fi";

// import api from "../../src/api/axiosInstance";


// function OffersWelcomeModal({
//   isOpen,
//   onClose,
//   darkMode,
//   language,
// }) {

//   // ==========================================
//   // States
//   // ==========================================

//   const [discounts, setDiscounts] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");

//   const [selectedDiscount, setSelectedDiscount] = useState(null);

//   const [copiedCode, setCopiedCode] = useState(false);


//   // ==========================================
//   // Language
//   // ==========================================

//   const isArabic = language === "ar";


//   // ==========================================
//   // Fetch Active Offers
//   // ==========================================

//   useEffect(() => {

//     if (!isOpen) return;

//     const fetchOffers = async () => {

//       try {

//         setLoading(true);

//         setError("");

//         setSelectedDiscount(null);

//         setCopiedCode(false);


//         // ======================================
//         // Try session cache first
//         // ======================================

//         const cachedOffers = sessionStorage.getItem(
//           "activeDiscounts"
//         );


//         if (cachedOffers) {

//           try {

//             const parsedOffers = JSON.parse(cachedOffers);

//             if (Array.isArray(parsedOffers)) {

//               setDiscounts(parsedOffers);

//               setLoading(false);

//               return;

//             }

//           // eslint-disable-next-line no-unused-vars
//           } catch (cacheError) {

//             sessionStorage.removeItem(
//               "activeDiscounts"
//             );

//           }

//         }


//         // ======================================
//         // Get offers from backend
//         // ======================================

//         const response = await api.get(
//           "/discounts/active"
//         );


//         const offers = Array.isArray(response.data)
//           ? response.data
//           : [];


//         setDiscounts(offers);


//         // ======================================
//         // Cache active offers
//         // ======================================

//         sessionStorage.setItem(
//           "activeDiscounts",
//           JSON.stringify(offers)
//         );

//       } catch (err) {

//         console.error(
//           "Failed to fetch active offers:",
//           err
//         );

//         setError(
//           isArabic
//             ? "حدث خطأ أثناء تحميل العروض"
//             : "Failed to load offers"
//         );

//       } finally {

//         setLoading(false);

//       }

//     };


//     fetchOffers();

//   }, [isOpen, isArabic]);


//   // ==========================================
//   // Copy Coupon
//   // ==========================================

//   const handleCopyCode = async (code) => {

//     try {

//       await navigator.clipboard.writeText(code);

//       setCopiedCode(true);


//       setTimeout(() => {

//         setCopiedCode(false);

//       }, 2000);

//     } catch (err) {

//       console.error(
//         "Failed to copy coupon:",
//         err
//       );

//     }

//   };


//   // ==========================================
//   // Format Discount
//   // ==========================================

//   const getDiscountTitle = (discount) => {

//     if (!discount) return "";


//     switch (discount.discountType) {

//       case "percentage":

//         return isArabic
//           ? `خصم ${discount.percentage || 0}%`
//           : `${discount.percentage || 0}% OFF`;


//       case "bogo":

//         return isArabic
//           ? `اشتري ${discount.buyQuantity || 1} واحصل على ${discount.getQuantity || 1} مجانًا`
//           : `Buy ${discount.buyQuantity || 1} Get ${discount.getQuantity || 1} FREE`;


//       case "bogo_discount":

//         return isArabic
//           ? `اشتري ${discount.buyQuantity || 1} واحصل على ${discount.getQuantity || 1} بخصم ${discount.getDiscount || 0}%`
//           : `Buy ${discount.buyQuantity || 1} Get ${discount.getQuantity || 1} at ${discount.getDiscount || 0}% OFF`;


//       case "free_shipping":

//         return isArabic
//           ? "شحن مجاني"
//           : "FREE SHIPPING";


//       default:

//         return isArabic
//           ? "عرض خاص"
//           : "Special Offer";

//     }

//   };


//   // ==========================================
//   // Offer Description
//   // ==========================================

//   const getOfferDescription = (discount) => {

//     if (!discount) return "";


//     if (discount.displayMessage) {

//       return isArabic
//         ? discount.displayMessage.ar
//         : discount.displayMessage.en;

//     }


//     switch (discount.discountType) {

//       case "percentage":

//         return isArabic
//           ? `استمتع بخصم ${discount.percentage || 0}% على مشترياتك`
//           : `Enjoy ${discount.percentage || 0}% off your purchase`;


//       case "bogo":

//         return isArabic
//           ? "اشتري واستمتع بمنتج مجاني"
//           : "Buy and get a product for free";


//       case "bogo_discount":

//         return isArabic
//           ? "اشتري الآن واحصل على خصم إضافي"
//           : "Buy now and get an additional discount";


//       case "free_shipping":

//         return isArabic
//           ? "احصل على شحن مجاني"
//           : "Enjoy free shipping";


//       default:

//         return isArabic
//           ? "استفد من هذا العرض المميز"
//           : "Take advantage of this special offer";

//     }

//   };


//   // ==========================================
//   // Minimum Order
//   // ==========================================

//   const getMinimumOrderText = (discount) => {

//     if (!discount?.minOrderAmount) {
//       return "";
//     }


//     return isArabic

//       ? `الحد الأدنى للطلب ${discount.minOrderAmount} جنيه`

//       : `Minimum order: EGP ${discount.minOrderAmount}`;

//   };


//   // ==========================================
//   // Applicable Products
//   // ==========================================

//   const getApplicableProductsText = (discount) => {

//     if (discount?.appliesToAll) {

//       return isArabic
//         ? "العرض متاح على جميع المنتجات"
//         : "Available on all products";

//     }


//     if (
//       discount?.applicableProducts &&
//       discount.applicableProducts.length > 0
//     ) {

//       return isArabic
//         ? `متاح على ${discount.applicableProducts.length} منتج`
//         : `Available on ${discount.applicableProducts.length} products`;

//     }


//     return "";

//   };


//   // ==========================================
//   // Remaining Uses
//   // ==========================================

//   const getRemainingUsesText = (discount) => {

//     if (
//       discount?.remainingUses === null ||
//       discount?.remainingUses === undefined
//     ) {

//       return "";

//     }


//     if (discount.remainingUses <= 0) {

//       return "";

//     }


//     return isArabic

//       ? `متبقي ${discount.remainingUses} استخدام`

//       : `${discount.remainingUses} uses remaining`;

//   };


//   // ==========================================
//   // Expiration
//   // ==========================================

//   const getExpirationText = (discount) => {

//     if (!discount?.expiresAt) {
//       return "";
//     }


//     try {

//       const date = new Date(discount.expiresAt);


//       return isArabic

//         ? `ينتهي في ${date.toLocaleDateString(
//             "ar-EG",
//             {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             }
//           )}`

//         : `Expires ${date.toLocaleDateString(
//             "en-US",
//             {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             }
//           )}`;

//     } catch {

//       return "";

//     }

//   };


//   // ==========================================
//   // Open Details
//   // ==========================================

//   const handleShowDetails = (discount) => {

//     setCopiedCode(false);

//     setSelectedDiscount(discount);

//   };


//   // ==========================================
//   // Back To Offers
//   // ==========================================

//   const handleBackToOffers = () => {

//     setSelectedDiscount(null);

//     setCopiedCode(false);

//   };


//   // ==========================================
//   // Close Modal
//   // ==========================================

//   const handleClose = () => {

//     setSelectedDiscount(null);

//     setCopiedCode(false);

//     onClose();

//   };


//   // ==========================================
//   // Prevent Render
//   // ==========================================

//   if (!isOpen) {
//     return null;
//   }


//   // ==========================================
//   // Render
//   // ==========================================

//   return (

//     <AnimatePresence>

//       {isOpen && (

//         <motion.div

//           initial={{ opacity: 0 }}

//           animate={{ opacity: 1 }}

//           exit={{ opacity: 0 }}

//           className="fixed inset-0 z-[9990] flex items-center justify-center p-6"

//         >

//           {/* ====================================
//               Background Overlay
//           ==================================== */}

//           <motion.div

//             initial={{ opacity: 0 }}

//             animate={{ opacity: 1 }}

//             exit={{ opacity: 0 }}

//             onClick={handleClose}

//             className="absolute inset-0 bg-black/70 backdrop-blur-sm"

//           />


//           {/* ====================================
//               Modal
//           ==================================== */}

//           <motion.div

//             initial={{
//               opacity: 0,
//               scale: 0.9,
//               y: 30,
//             }}

//             animate={{
//               opacity: 1,
//               scale: 1,
//               y: 0,
//             }}

//             exit={{
//               opacity: 0,
//               scale: 0.9,
//               y: 30,
//             }}

//             transition={{
//               duration: 0.25,
//             }}

//             className={`relative z-[9991] w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl border ${
//               darkMode
//                 ? "bg-gray-900 border-gray-700 text-white"
//                 : "bg-white border-gray-200 text-gray-900"
//             }`}

//           >

//             {/* ==================================
//                 Header
//             ================================== */}

//             <div
//               className={`relative px-4 py-4 ${
//                 darkMode
//                   ? "bg-gray-800"
//                   : "bg-gray-100"
//               }`}
//             >

//               {/* Close */}

//               <button

//                 onClick={handleClose}

//                 className={`absolute top-4 ${
//                   isArabic
//                     ? "left-4"
//                     : "right-4"
//                 } w-10 h-10 rounded-full flex items-center justify-center transition ${
//                   darkMode
//                     ? "bg-gray-700 hover:bg-gray-600 text-white"
//                     : "bg-white hover:bg-gray-200 text-gray-700"
//                 }`}

//               >

//                 <FiX size={22} />

//               </button>


//               <div className="flex flex-col items-center text-center">

//                 <motion.div

//                   initial={{
//                     scale: 0,
//                     rotate: -20,
//                   }}

//                   animate={{
//                     scale: 1,
//                     rotate: 0,
//                   }}

//                   transition={{
//                     type: "spring",
//                     stiffness: 200,
//                   }}

//                   className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-4 shadow-lg"
//                 >

//                   <FiGift size={30} />

//                 </motion.div>


//                 <h2 className="text-lg md:text-3xl font-bold">

//                   {selectedDiscount

//                     ? (
//                       isArabic
//                         ? "تفاصيل العرض"
//                         : "Offer Details"
//                     )

//                     : (
//                       isArabic
//                         ? "عروض فيسترو الحصرية 🎁"
//                         : "Exclusive Vestro Offers 🎁"
//                     )

//                   }

//                 </h2>


//                 <p
//                   className={`mt-2 text-sm md:text-base ${
//                     darkMode
//                       ? "text-gray-300"
//                       : "text-gray-600"
//                   }`}
//                 >

//                   {selectedDiscount

//                     ? (
//                       isArabic
//                         ? "استخدم الكود واستمتع بعرضك الآن"
//                         : "Use the coupon code and enjoy your offer"
//                     )

//                     : (
//                       isArabic
//                         ? "اكتشف أحدث العروض والكوبونات المتاحة لك"
//                         : "Discover our latest offers and available coupons"
//                     )

//                   }

//                 </p>

//               </div>

//             </div>


//             {/* ==================================
//                 Content
//             ================================== */}

//             <div className="overflow-y-auto max-h-[65vh] p-5 md:p-6">

//               {/* =================================
//                   Loading
//               ================================= */}

//               {loading && (

//                 <div className="flex flex-col items-center justify-center py-16">

//                   <motion.div

//                     animate={{
//                       rotate: 360,
//                     }}

//                     transition={{
//                       duration: 1,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}

//                     className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full"
//                   />

//                   <p
//                     className={`mt-4 ${
//                       darkMode
//                         ? "text-gray-300"
//                         : "text-gray-600"
//                     }`}
//                   >

//                     {isArabic
//                       ? "جاري تحميل العروض..."
//                       : "Loading offers..."}

//                   </p>

//                 </div>

//               )}


//               {/* =================================
//                   Error
//               ================================= */}

//               {!loading && error && (

//                 <div className="py-12 text-center">

//                   <div className="text-5xl mb-4">
//                     😔
//                   </div>

//                   <h3 className="text-xl font-bold mb-2">

//                     {isArabic
//                       ? "عذرًا"
//                       : "Sorry"}

//                   </h3>

//                   <p
//                     className={
//                       darkMode
//                         ? "text-gray-400"
//                         : "text-gray-600"
//                     }
//                   >

//                     {error}

//                   </p>

//                 </div>

//               )}


//               {/* =================================
//                   DETAILS
//               ================================= */}

//               {!loading &&
//                 !error &&
//                 selectedDiscount && (

//                   <motion.div

//                     initial={{
//                       opacity: 0,
//                       x: isArabic ? 30 : -30,
//                     }}

//                     animate={{
//                       opacity: 1,
//                       x: 0,
//                     }}

//                   >

//                     {/* Back */}

//                     <button

//                       onClick={handleBackToOffers}

//                       className={`flex items-center gap-2 mb-5 font-medium transition ${
//                         darkMode
//                           ? "text-gray-300 hover:text-white"
//                           : "text-gray-700 hover:text-black"
//                       }`}

//                     >

//                       <FiArrowLeft
//                         className={
//                           isArabic
//                             ? "rotate-180"
//                             : ""
//                         }
//                       />

//                       {isArabic
//                         ? "العودة للعروض"
//                         : "Back to offers"}

//                     </button>


//                     {/* Main Offer Card */}

//                     <div
//                       className={`rounded-2xl border p-6 ${
//                         darkMode
//                           ? "bg-gray-800 border-gray-700"
//                           : "bg-gray-50 border-gray-200"
//                       }`}
//                     >

//                       {/* Gift Icon */}

//                       <div className="flex justify-center mb-5">

//                         <div className="w-20 h-20 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">

//                           <FiGift size={36} />

//                         </div>

//                       </div>


//                       {/* Title */}

//                       <h3 className="text-2xl font-bold text-center mb-3">

//                         {getDiscountTitle(
//                           selectedDiscount
//                         )}

//                       </h3>


//                       {/* Description */}

//                       <p
//                         className={`text-center mb-6 ${
//                           darkMode
//                             ? "text-gray-300"
//                             : "text-gray-600"
//                         }`}
//                       >

//                         {getOfferDescription(
//                           selectedDiscount
//                         )}

//                       </p>


//                       {/* Info */}

//                       <div className="space-y-3 mb-6">

//                         {getMinimumOrderText(
//                           selectedDiscount
//                         ) && (

//                           <div className="flex items-center gap-3">

//                             <FiShoppingBag />

//                             <span>

//                               {getMinimumOrderText(
//                                 selectedDiscount
//                               )}

//                             </span>

//                           </div>

//                         )}


//                         {getApplicableProductsText(
//                           selectedDiscount
//                         ) && (

//                           <div className="flex items-center gap-3">

//                             <FiShoppingBag />

//                             <span>

//                               {getApplicableProductsText(
//                                 selectedDiscount
//                               )}

//                             </span>

//                           </div>

//                         )}


//                         {getRemainingUsesText(
//                           selectedDiscount
//                         ) && (

//                           <div className="flex items-center gap-3">

//                             <FiGift />

//                             <span>

//                               {getRemainingUsesText(
//                                 selectedDiscount
//                               )}

//                             </span>

//                           </div>

//                         )}


//                         {getExpirationText(
//                           selectedDiscount
//                         ) && (

//                           <div className="flex items-center gap-3">

//                             <FiClock />

//                             <span>

//                               {getExpirationText(
//                                 selectedDiscount
//                               )}

//                             </span>

//                           </div>

//                         )}

//                       </div>


//                       {/* =================================
//                           Coupon Code
//                       ================================= */}

//                       <div>

//                         <p className="font-semibold mb-2">

//                           {isArabic
//                             ? "كود الخصم"
//                             : "Coupon Code"}

//                         </p>


//                         <div
//                           className={`flex items-center gap-2 p-2 rounded-xl border-2 ${
//                             darkMode
//                               ? "border-gray-600 bg-gray-900"
//                               : "border-gray-300 bg-white"
//                           }`}
//                         >

//                           <div className="flex-1 px-3 font-mono font-bold text-lg tracking-wider text-center">

//                             {selectedDiscount.code}

//                           </div>


//                           <button

//                             onClick={() =>
//                               handleCopyCode(
//                                 selectedDiscount.code
//                               )
//                             }

//                             className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold transition hover:opacity-80"

//                           >

//                             {copiedCode ? (

//                               <>
//                                 <FiCheck />

//                                 {isArabic
//                                   ? "تم النسخ"
//                                   : "Copied"}

//                               </>

//                             ) : (

//                               <>
//                                 <FiCopy />

//                                 {isArabic
//                                   ? "نسخ"
//                                   : "Copy"}

//                               </>

//                             )}

//                           </button>

//                         </div>

//                       </div>


//                       {/* Shipping */}

//                       {(selectedDiscount.freeShipping ||
//                         selectedDiscount.discountType ===
//                           "free_shipping") && (

//                         <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium">

//                           <FiTruck />

//                           {isArabic
//                             ? "يشمل شحن مجاني"
//                             : "Includes free shipping"}

//                         </div>

//                       )}

//                     </div>

//                   </motion.div>

//                 )}


//               {/* =================================
//                   OFFERS LIST
//               ================================= */}

//               {!loading &&
//                 !error &&
//                 !selectedDiscount &&
//                 discounts.length > 0 && (

//                   <div className="space-y-4">

//                     {discounts.map(
//                       (discount, index) => (

//                         <motion.div

//                           key={
//                             discount._id ||
//                             discount.code ||
//                             index
//                           }

//                           initial={{
//                             opacity: 0,
//                             y: 20,
//                           }}

//                           animate={{
//                             opacity: 1,
//                             y: 0,
//                           }}

//                           transition={{
//                             delay: index * 0.08,
//                           }}

//                           className={`relative overflow-hidden rounded-2xl border p-5 ${
//                             darkMode
//                               ? "bg-gray-800 border-gray-700"
//                               : "bg-white border-gray-200"
//                           } shadow-sm hover:shadow-lg transition-shadow`}

//                         >

//                           {/* Top */}

//                           <div className="flex items-start gap-4">

//                             {/* Icon */}

//                             <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">

//                               <FiGift size={26} />

//                             </div>


//                             {/* Text */}

//                             <div className="flex-1 min-w-0">

//                               <h3 className="text-lg md:text-xl font-bold">

//                                 {getDiscountTitle(
//                                   discount
//                                 )}

//                               </h3>


//                               <p
//                                 className={`mt-1 text-sm ${
//                                   darkMode
//                                     ? "text-gray-400"
//                                     : "text-gray-600"
//                                 }`}
//                               >

//                                 {getOfferDescription(
//                                   discount
//                                 )}

//                               </p>


//                               {getMinimumOrderText(
//                                 discount
//                               ) && (

//                                 <p
//                                   className={`mt-2 text-xs ${
//                                     darkMode
//                                       ? "text-gray-500"
//                                       : "text-gray-500"
//                                   }`}
//                                 >

//                                   {getMinimumOrderText(
//                                     discount
//                                   )}

//                                 </p>

//                               )}

//                             </div>

//                           </div>


//                           {/* Bottom */}

//                           <div
//                             className={`mt-5 pt-4 border-t flex items-center gap-3 ${
//                               darkMode
//                                 ? "border-gray-700"
//                                 : "border-gray-200"
//                             }`}
//                           >

//                             {/* Code */}

//                             <div
//                               className={`flex-1 min-w-0 px-3 py-2 rounded-lg font-mono text-sm font-bold truncate ${
//                                 darkMode
//                                   ? "bg-gray-900 text-gray-200"
//                                   : "bg-gray-100 text-gray-800"
//                               }`}
//                             >

//                               {discount.code}

//                             </div>


//                             {/* Details */}

//                             <button

//                               onClick={() =>
//                                 handleShowDetails(
//                                   discount
//                                 )
//                               }

//                               className="flex-shrink-0 px-4 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-80 transition"

//                             >

//                               {isArabic
//                                 ? "تفاصيل العرض"
//                                 : "Offer Details"}

//                             </button>

//                           </div>

//                         </motion.div>

//                       )
//                     )}

//                   </div>

//                 )}


//               {/* =================================
//                   NO OFFERS
//               ================================= */}

//               {!loading &&
//                 !error &&
//                 !selectedDiscount &&
//                 discounts.length === 0 && (

//                   <motion.div

//                     initial={{
//                       opacity: 0,
//                       scale: 0.95,
//                     }}

//                     animate={{
//                       opacity: 1,
//                       scale: 1,
//                     }}

//                     className="text-center py-10"

//                   >

//                     {/* Gift */}

//                     <motion.div

//                       animate={{
//                         y: [0, -8, 0],
//                         rotate: [0, -4, 4, 0],
//                       }}

//                       transition={{
//                         duration: 3,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                       }}

//                       className="mx-auto w-20 h-20 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-6 shadow-xl"

//                     >

//                       <FiGift size={42} />

//                     </motion.div>


//                     <h3 className="text-lg md:text-3xl font-bold mb-3">

//                       {isArabic
//                         ? "انتظر عروض فيسترو الحصرية 🎁"
//                         : "Stay tuned for Vestro exclusive offers 🎁"}

//                     </h3>


//                     <p
//                       className={`max-w-md mx-auto leading-7 ${
//                         darkMode
//                           ? "text-gray-400"
//                           : "text-gray-600"
//                       }`}
//                     >

//                       {isArabic

//                         ? "لا توجد عروض متاحة حاليًا، لكن العروض الحصرية قادمة قريبًا. تابع فيسترو واستعد لأفضل المفاجآت!"

//                         : "There are no active offers right now, but exclusive deals are coming soon. Stay tuned for the best Vestro surprises!"}

//                     </p>


//                     <div className="mt-6 flex justify-center gap-2">

//                       <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />

//                       <span
//                         className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse"
//                         style={{
//                           animationDelay: "150ms",
//                         }}
//                       />

//                       <span
//                         className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse"
//                         style={{
//                           animationDelay: "300ms",
//                         }}
//                       />

//                     </div>

//                   </motion.div>

//                 )}

//             </div>


//             {/* ==================================
//                 Footer
//             ================================== */}

//             {!loading &&
//               !selectedDiscount &&
//               discounts.length > 0 && (

//                 <div
//                   className={`px-5 py-4 border-t text-center text-xs ${
//                     darkMode
//                       ? "border-gray-700 text-gray-500"
//                       : "border-gray-200 text-gray-500"
//                   }`}
//                 >

//                   {isArabic

//                     ? "استفد من عروض فيسترو قبل انتهائها ✨"

//                     : "Enjoy Vestro offers before they expire ✨"}

//                 </div>

//               )}

//           </motion.div>

//         </motion.div>

//       )}

//     </AnimatePresence>

//   );

// }


// export default OffersWelcomeModal;

// --------------------------------





import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import {
  FiX,
  FiGift,
  FiCopy,
  FiCheck,
  FiClock,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";

import api from "../../src/api/axiosInstance";


function OffersWelcomeModal({
  isOpen,
  onClose,
  darkMode,
  language,
}) {

  // ==========================================
  // States
  // ==========================================

  const [discounts, setDiscounts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [copiedCode, setCopiedCode] = useState(null);


  // ==========================================
  // Language
  // ==========================================

  const isArabic = language === "ar";


  // ==========================================
  // Fetch Active Offers
  // ==========================================

  useEffect(() => {

    if (!isOpen) return;


    const fetchOffers = async () => {

      try {

        setLoading(true);

        setError("");

        setCopiedCode(null);


        // ======================================
        // Try session cache first
        // ======================================

        const cachedOffers = sessionStorage.getItem(
          "activeDiscounts"
        );


        if (cachedOffers) {

          try {

            const parsedOffers = JSON.parse(
              cachedOffers
            );


            if (Array.isArray(parsedOffers)) {

              setDiscounts(parsedOffers);

              setLoading(false);

              return;

            }

          } catch {

            sessionStorage.removeItem(
              "activeDiscounts"
            );

          }

        }


        // ======================================
        // Get offers from backend
        // ======================================

        const response = await api.get(
          "/discounts/active"
        );


        const offers = Array.isArray(response.data)
          ? response.data
          : [];


        setDiscounts(offers);


        // ======================================
        // Cache active offers
        // ======================================

        sessionStorage.setItem(
          "activeDiscounts",
          JSON.stringify(offers)
        );

      } catch (err) {

        console.error(
          "Failed to fetch active offers:",
          err
        );


        setError(
          isArabic
            ? "حدث خطأ أثناء تحميل العروض"
            : "Failed to load offers"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchOffers();

  }, [isOpen, isArabic]);


  // ==========================================
  // Copy Coupon + Close Modal
  // ==========================================

  const handleCopyCode = async (code) => {

    try {

      await navigator.clipboard.writeText(code);


      // Show copied state
      setCopiedCode(code);


      // Close after short feedback
      setTimeout(() => {

        onClose();

        setCopiedCode(null);

      }, 700);


    } catch (err) {

      console.error(
        "Failed to copy coupon:",
        err
      );

    }

  };


  // ==========================================
  // Discount Title
  // ==========================================

  const getDiscountTitle = (discount) => {

    if (!discount) return "";


    switch (discount.discountType) {

      case "percentage":

        return isArabic

          ? `خصم ${discount.percentage || 0}%`

          : `${discount.percentage || 0}% OFF`;


      case "bogo":

        return isArabic

          ? `اشترِ ${discount.buyQuantity || 1} واحصل على ${discount.getQuantity || 1} مجانًا`

          : `BUY ${discount.buyQuantity || 1} · GET ${discount.getQuantity || 1} FREE`;


      case "bogo_discount":

        return isArabic

          ? `اشترِ ${discount.buyQuantity || 1} واحصل على ${discount.getQuantity || 1} بخصم ${discount.getDiscount || 0}%`

          : `BUY ${discount.buyQuantity || 1} · GET ${discount.getQuantity || 1} ${discount.getDiscount || 0}% OFF`;


      case "free_shipping":

        return isArabic

          ? "شحن مجاني"

          : "FREE SHIPPING";


      default:

        return isArabic

          ? "عرض مميز"

          : "SPECIAL OFFER";

    }

  };


  // ==========================================
  // Offer Description
  // ==========================================

  const getOfferDescription = (discount) => {

    if (!discount) return "";


    if (discount.displayMessage) {

      return isArabic

        ? discount.displayMessage.ar

        : discount.displayMessage.en;

    }


    switch (discount.discountType) {

      case "percentage":

        return isArabic

          ? `خصم ${discount.percentage || 0}% لفترة محدودة.`

          : `${discount.percentage || 0}% off for a limited time.`;


      case "bogo":

        return isArabic

          ? "احصل على قيمة أكبر مع هذا العرض."

          : "Get more value with this offer.";


      case "bogo_discount":

        return isArabic

          ? "عرض مميز بخصم إضافي."

          : "A special offer with extra savings.";


      case "free_shipping":

        return isArabic

          ? "احصل على شحن مجاني مع هذا العرض."

          : "Enjoy free shipping with this offer.";


      default:

        return isArabic

          ? "استفد من هذا العرض قبل انتهائه."

          : "Take advantage of this offer before it ends.";

    }

  };


  // ==========================================
  // Minimum Order
  // ==========================================

  const getMinimumOrderText = (discount) => {

    if (!discount?.minOrderAmount) {

      return "";

    }


    return isArabic

      ? `الحد الأدنى ${discount.minOrderAmount} جنيه`

      : `Minimum order EGP ${discount.minOrderAmount}`;

  };


  // ==========================================
  // Applicable Products
  // ==========================================

  const getApplicableProductsText = (discount) => {

    if (discount?.appliesToAll) {

      return isArabic

        ? "متاح على جميع المنتجات"

        : "Available on all products";

    }


    if (
      discount?.applicableProducts &&
      discount.applicableProducts.length > 0
    ) {

      return isArabic

        ? `متاح على ${discount.applicableProducts.length} منتجات`

        : `Available on ${discount.applicableProducts.length} products`;

    }


    return "";

  };


  // ==========================================
  // Remaining Uses
  // ==========================================

  const getRemainingUsesText = (discount) => {

    if (
      discount?.remainingUses === null ||
      discount?.remainingUses === undefined ||
      discount.remainingUses <= 0
    ) {

      return "";

    }


    return isArabic

      ? `${discount.remainingUses} استخدام متاح`

      : `${discount.remainingUses} uses available`;

  };


  // ==========================================
  // Expiration
  // ==========================================

  const getExpirationText = (discount) => {

    if (!discount?.expiresAt) {

      return "";

    }


    try {

      const date = new Date(
        discount.expiresAt
      );


      return isArabic

        ? `ينتهي ${date.toLocaleDateString(
            "ar-EG",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          )}`

        : `Ends ${date.toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          )}`;

    } catch {

      return "";

    }

  };


  // ==========================================
  // Close Modal
  // ==========================================

  const handleClose = () => {

    setCopiedCode(null);

    onClose();

  };


  // ==========================================
  // Don't Render
  // ==========================================

  if (!isOpen) {

    return null;

  }


  // ==========================================
  // Render
  // ==========================================

  return (

    <AnimatePresence>

      {isOpen && (

        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          exit={{
            opacity: 0,
          }}

          className="fixed inset-0 z-[9990] flex items-center justify-center p-4"

        >

          {/* ==================================
              Overlay
          ================================== */}

          <motion.div

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            exit={{
              opacity: 0,
            }}

            onClick={handleClose}

            className="absolute inset-0 bg-black/60 backdrop-blur-sm"

          />


          {/* ==================================
              Modal
          ================================== */}

          <motion.div

            initial={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}

            transition={{
              duration: 0.25,
            }}

            dir={isArabic ? "rtl" : "ltr"}

            className={`relative z-[9991] w-full max-w-lg max-h-[82vh] overflow-hidden rounded-2xl shadow-2xl border ${
              darkMode
                ? "bg-[#111111] border-white/10 text-white"
                : "bg-white border-black/10 text-gray-900"
            }`}

          >

            {/* ==================================
                Header
            ================================== */}

            <div
              className={`relative px-5 py-5 border-b ${
                darkMode
                  ? "border-white/10"
                  : "border-black/5"
              }`}
            >

              {/* Close */}

              <button

                onClick={handleClose}

                aria-label={
                  isArabic
                    ? "إغلاق"
                    : "Close"
                }

                className={`absolute top-4 ${
                  isArabic
                    ? "left-4"
                    : "right-4"
                } w-8 h-8 rounded-full flex items-center justify-center transition ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}

              >

                <FiX size={18} />

              </button>


              <div className="flex items-center gap-3">

                {/* Icon */}

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    darkMode
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >

                  <FiGift size={21} />

                </div>


                {/* Header Text */}

                <div className="min-w-0">

                  <div
                    className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      darkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >

                    VESTRO

                  </div>


                  <h2 className="text-lg sm:text-xl font-bold leading-tight">

                    {isArabic
                      ? "عروض حصرية"
                      : "Exclusive Offers"}

                  </h2>


                  <p
                    className={`text-xs mt-1 ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >

                    {isArabic
                      ? "خصومات مختارة لفترة محدودة."
                      : "Selected deals for a limited time."}

                  </p>

                </div>

              </div>

            </div>


            {/* ==================================
                Content
            ================================== */}

            <div className="overflow-y-auto max-h-[62vh] p-4 sm:p-5">

              {/* =================================
                  Loading
              ================================= */}

              {loading && (

                <div className="flex flex-col items-center justify-center py-12">

                  <motion.div

                    animate={{
                      rotate: 360,
                    }}

                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}

                    className="w-9 h-9 border-[3px] border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full"

                  />

                  <p
                    className={`mt-3 text-xs ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >

                    {isArabic
                      ? "جاري تحميل العروض..."
                      : "Loading offers..."}

                  </p>

                </div>

              )}


              {/* =================================
                  Error
              ================================= */}

              {!loading && error && (

                <div className="py-10 text-center">

                  <div className="text-3xl mb-3">
                    😔
                  </div>


                  <h3 className="text-base font-semibold mb-1">

                    {isArabic
                      ? "تعذر تحميل العروض"
                      : "Offers unavailable"}

                  </h3>


                  <p
                    className={`text-xs ${
                      darkMode
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >

                    {error}

                  </p>

                </div>

              )}


              {/* =================================
                  OFFERS LIST
              ================================= */}

              {!loading &&
                !error &&
                discounts.length > 0 && (

                  <div className="space-y-3">

                    {discounts.map(
                      (discount, index) => (

                        <motion.div

                          key={
                            discount._id ||
                            discount.code ||
                            index
                          }

                          initial={{
                            opacity: 0,
                            y: 12,
                          }}

                          animate={{
                            opacity: 1,
                            y: 0,
                          }}

                          transition={{
                            delay: index * 0.05,
                          }}

                          className={`relative overflow-hidden rounded-xl border p-4 ${
                            darkMode
                              ? "bg-white/[0.03] border-white/10"
                              : "bg-white border-black/5"
                          } shadow-sm hover:shadow-md transition-shadow`}

                        >

                          {/* =================================
                              Offer Main Content
                          ================================= */}

                          <div className="flex items-start gap-3">

                            {/* Icon */}

                            <div
                              className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                darkMode
                                  ? "bg-white text-black"
                                  : "bg-black text-white"
                              }`}
                            >

                              <FiGift size={20} />

                            </div>


                            {/* Text */}

                            <div className="flex-1 min-w-0">

                              <h3 className="text-sm sm:text-base font-bold">

                                {getDiscountTitle(
                                  discount
                                )}

                              </h3>


                              <p
                                className={`mt-1 text-[11px] leading-5 ${
                                  darkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >

                                {getOfferDescription(
                                  discount
                                )}

                              </p>


                              {/* Extra Info */}

                              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">

                                {getMinimumOrderText(
                                  discount
                                ) && (

                                  <span
                                    className={`flex items-center gap-1 text-[10px] ${
                                      darkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >

                                    <FiShoppingBag
                                      size={11}
                                    />

                                    {getMinimumOrderText(
                                      discount
                                    )}

                                  </span>

                                )}


                                {getApplicableProductsText(
                                  discount
                                ) && (

                                  <span
                                    className={`flex items-center gap-1 text-[10px] ${
                                      darkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >

                                    <FiShoppingBag
                                      size={11}
                                    />

                                    {getApplicableProductsText(
                                      discount
                                    )}

                                  </span>

                                )}


                                {getRemainingUsesText(
                                  discount
                                ) && (

                                  <span
                                    className={`flex items-center gap-1 text-[10px] ${
                                      darkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >

                                    <FiGift
                                      size={11}
                                    />

                                    {getRemainingUsesText(
                                      discount
                                    )}

                                  </span>

                                )}


                                {getExpirationText(
                                  discount
                                ) && (

                                  <span
                                    className={`flex items-center gap-1 text-[10px] ${
                                      darkMode
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >

                                    <FiClock
                                      size={11}
                                    />

                                    {getExpirationText(
                                      discount
                                    )}

                                  </span>

                                )}

                              </div>

                            </div>

                          </div>


                          {/* =================================
                              Coupon + Copy Button
                          ================================= */}

                          <div
                            className={`mt-3 pt-3 border-t flex items-center gap-2 ${
                              darkMode
                                ? "border-white/10"
                                : "border-black/5"
                            }`}
                          >

                            {/* Coupon Code */}

                            <div
                              className={`flex-1 min-w-0 px-3 py-2 rounded-lg font-mono text-xs font-bold tracking-wider text-center truncate ${
                                darkMode
                                  ? "bg-black text-gray-200"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >

                              {discount.code}

                            </div>


                            {/* Copy */}

                            <button

                              onClick={() =>
                                handleCopyCode(
                                  discount.code
                                )
                              }

                              disabled={
                                copiedCode ===
                                discount.code
                              }

                              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition ${
                                copiedCode ===
                                discount.code

                                  ? "bg-green-600 text-white"

                                  : darkMode
                                  ? "bg-white text-black hover:bg-gray-200"
                                  : "bg-black text-white hover:bg-gray-800"
                              }`}

                            >

                              {copiedCode ===
                              discount.code ? (

                                <>

                                  <FiCheck size={14} />

                                  {isArabic
                                    ? "تم النسخ"
                                    : "Copied"}

                                </>

                              ) : (

                                <>

                                  <FiCopy size={14} />

                                  {isArabic
                                    ? "نسخ"
                                    : "Copy"}

                                </>

                              )}

                            </button>

                          </div>


                          {/* Free Shipping */}

                          {(discount.freeShipping ||
                            discount.discountType ===
                              "free_shipping") && (

                            <div
                              className={`mt-2 flex items-center justify-center gap-1 text-[10px] font-medium ${
                                darkMode
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >

                              <FiTruck size={12} />

                              {isArabic
                                ? "يشمل شحن مجاني"
                                : "Includes free shipping"}

                            </div>

                          )}

                        </motion.div>

                      )
                    )}

                  </div>

                )}


              {/* =================================
                  NO OFFERS
              ================================= */}

              {!loading &&
                !error &&
                discounts.length === 0 && (

                  <motion.div

                    initial={{
                      opacity: 0,
                      y: 10,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    className="text-center py-8"

                  >

                    <motion.div

                      animate={{
                        y: [0, -5, 0],
                      }}

                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}

                      className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                        darkMode
                          ? "bg-white text-black"
                          : "bg-black text-white"
                      }`}
                    >

                      <FiGift size={28} />

                    </motion.div>


                    <div
                      className={`text-[10px] font-semibold tracking-[0.2em] uppercase mb-2 ${
                        darkMode
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >

                      VESTRO

                    </div>


                    <h3 className="text-xl font-bold mb-2">

                      {isArabic
                        ? "عروض جديدة قريبًا"
                        : "New offers coming soon"}

                    </h3>


                    <p
                      className={`max-w-sm mx-auto text-xs leading-6 ${
                        darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >

                      {isArabic
                        ? "تابعنا للحصول على أحدث الخصومات والعروض الحصرية."
                        : "Stay tuned for the latest deals and exclusive savings."}

                    </p>

                  </motion.div>

                )}

            </div>


            {/* ==================================
                Footer
            ================================== */}

            {!loading &&
              !error &&
              discounts.length > 0 && (

                <div
                  className={`px-4 py-3 border-t text-center text-[10px] ${
                    darkMode
                      ? "border-white/10 text-gray-500"
                      : "border-black/5 text-gray-400"
                  }`}
                >

                  {isArabic
                    ? "انسخ الكود واستخدمه عند إتمام طلبك."
                    : "Copy your code and use it at checkout."}

                </div>

              )}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}


export default OffersWelcomeModal;
