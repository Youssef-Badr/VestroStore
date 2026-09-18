
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
            const parsedOffers = JSON.parse(cachedOffers);

            if (Array.isArray(parsedOffers)) {
              setDiscounts(parsedOffers);
              setLoading(false);
              return;
            }
          } catch {
            sessionStorage.removeItem("activeDiscounts");
          }
        }

        // ======================================
        // Get offers from backend
        // ======================================

        const response = await api.get("/discounts/active");

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

      setCopiedCode(code);

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
      const date = new Date(discount.expiresAt);

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
            className={`relative z-[9991] w-full max-w-lg max-h-[88vh] overflow-hidden rounded-3xl shadow-2xl border ${
              darkMode
                ? "bg-[#0d0d0d] border-white/10 text-white"
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

                  <h2 className="text-base sm:text-lg font-bold mt-0.5">
                    {isArabic
                      ? "عروض خاصة لك"
                      : "Special offers for you"}
                  </h2>

                  <p
                    className={`text-[10px] mt-0.5 ${
                      darkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {isArabic
                      ? "استفد من العرض قبل انتهائه"
                      : "Grab your offer before it ends"}
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================
                Content
            ================================== */}

            <div className="overflow-y-auto max-h-[70vh] p-4 sm:p-5">
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
                  <div className="space-y-4">
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
                          className={`relative overflow-hidden rounded-2xl border ${
                            darkMode
                              ? "bg-white/[0.03] border-white/10"
                              : "bg-white border-black/5"
                          } shadow-sm hover:shadow-lg transition-all`}
                        >
                          {/* =================================
                              Optional Offer Image
                          ================================= */}

                          {discount.image?.url && (
                            <div className="relative w-full overflow-hidden">
                              <img
                                src={discount.image.url}
                                alt={
                                  getDiscountTitle(
                                    discount
                                  )
                                }
                                className="w-full h-44 sm:h-52 object-cover"
                                loading="lazy"
                              />

                              {/* Small overlay */}

                              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold tracking-wide">
                                  VESTRO
                                </span>

                                <span className="px-2.5 py-1 rounded-full bg-white/90 text-black text-[9px] font-bold">
                                  {isArabic
                                    ? "عرض خاص"
                                    : "SPECIAL OFFER"}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* =================================
                              Offer Content
                          ================================= */}

                          <div className="p-4 sm:p-5">
                            {/* Offer Title */}

                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  darkMode
                                    ? "bg-white text-black"
                                    : "bg-black text-white"
                                }`}
                              >
                                <FiGift size={18} />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm sm:text-base font-bold leading-6">
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
                              </div>
                            </div>

                            {/* =================================
                                Coupon Code
                            ================================= */}

                            <div className="mt-4">
                              <div
                                className={`text-[9px] font-bold uppercase tracking-[0.18em] mb-2 ${
                                  darkMode
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {isArabic
                                  ? "كود الخصم"
                                  : "COUPON CODE"}
                              </div>

                              <div className="flex items-stretch gap-2">
                                {/* Code */}

                                <div
                                  className={`flex-1 min-w-0 px-3 py-3 rounded-xl font-mono text-xs sm:text-sm font-black tracking-[0.12em] text-center truncate border ${
                                    darkMode
                                      ? "bg-black border-white/10 text-white"
                                      : "bg-gray-50 border-black/5 text-gray-900"
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
                                  className={`flex-shrink-0 min-w-[76px] flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-[11px] font-bold transition-all active:scale-95 ${
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
                                      <FiCheck
                                        size={14}
                                      />

                                      {isArabic
                                        ? "تم النسخ"
                                        : "Copied"}
                                    </>
                                  ) : (
                                    <>
                                      <FiCopy
                                        size={14}
                                      />

                                      {isArabic
                                        ? "نسخ"
                                        : "Copy"}
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* =================================
                                Simple Offer Details
                            ================================= */}

                            <div
                              className={`mt-4 pt-4 border-t ${
                                darkMode
                                  ? "border-white/10"
                                  : "border-black/5"
                              }`}
                            >
                              <div className="flex flex-wrap gap-2">
                                {/* Minimum Order */}

                                {getMinimumOrderText(
                                  discount
                                ) && (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                                      darkMode
                                        ? "bg-white/5 text-gray-400"
                                        : "bg-gray-50 text-gray-500"
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

                                {/* Applicable Products */}

                                {getApplicableProductsText(
                                  discount
                                ) && (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                                      darkMode
                                        ? "bg-white/5 text-gray-400"
                                        : "bg-gray-50 text-gray-500"
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

                                {/* Remaining Uses */}

                                {getRemainingUsesText(
                                  discount
                                ) && (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                                      darkMode
                                        ? "bg-white/5 text-gray-400"
                                        : "bg-gray-50 text-gray-500"
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

                                {/* Expiration */}

                                {getExpirationText(
                                  discount
                                ) && (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                                      darkMode
                                        ? "bg-white/5 text-gray-400"
                                        : "bg-gray-50 text-gray-500"
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

                                {/* Free Shipping */}

                                {(discount.freeShipping ||
                                  discount.discountType ===
                                    "free_shipping") && (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                                      darkMode
                                        ? "bg-white/5 text-gray-400"
                                        : "bg-gray-50 text-gray-500"
                                    }`}
                                  >
                                    <FiTruck
                                      size={11}
                                    />

                                    {isArabic
                                      ? "شحن مجاني"
                                      : "Free shipping"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
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
 


// --------------------------------





// import { useEffect, useState } from "react";
// // eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from "framer-motion";

// import {
//   FiX,
//   FiGift,
//   FiCopy,
//   FiCheck,
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

//   const [copiedCode, setCopiedCode] = useState(null);


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

//         setCopiedCode(null);


//         // ======================================
//         // Try session cache first
//         // ======================================

//         const cachedOffers = sessionStorage.getItem(
//           "activeDiscounts"
//         );


//         if (cachedOffers) {

//           try {

//             const parsedOffers = JSON.parse(
//               cachedOffers
//             );


//             if (Array.isArray(parsedOffers)) {

//               setDiscounts(parsedOffers);

//               setLoading(false);

//               return;

//             }

//           } catch {

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
//   // Copy Coupon + Close Modal
//   // ==========================================

//   const handleCopyCode = async (code) => {

//     try {

//       await navigator.clipboard.writeText(code);


//       // Show copied state
//       setCopiedCode(code);


//       // Close after short feedback
//       setTimeout(() => {

//         onClose();

//         setCopiedCode(null);

//       }, 700);


//     } catch (err) {

//       console.error(
//         "Failed to copy coupon:",
//         err
//       );

//     }

//   };


//   // ==========================================
//   // Discount Title
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

//           ? `اشترِ ${discount.buyQuantity || 1} واحصل على ${discount.getQuantity || 1} مجانًا`

//           : `BUY ${discount.buyQuantity || 1} · GET ${discount.getQuantity || 1} FREE`;


//       case "bogo_discount":

//         return isArabic

//           ? `اشترِ ${discount.buyQuantity || 1} واحصل على ${discount.getQuantity || 1} بخصم ${discount.getDiscount || 0}%`

//           : `BUY ${discount.buyQuantity || 1} · GET ${discount.getQuantity || 1} ${discount.getDiscount || 0}% OFF`;


//       case "free_shipping":

//         return isArabic

//           ? "شحن مجاني"

//           : "FREE SHIPPING";


//       default:

//         return isArabic

//           ? "عرض مميز"

//           : "SPECIAL OFFER";

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

//           ? `خصم ${discount.percentage || 0}% لفترة محدودة.`

//           : `${discount.percentage || 0}% off for a limited time.`;


//       case "bogo":

//         return isArabic

//           ? "احصل على قيمة أكبر مع هذا العرض."

//           : "Get more value with this offer.";


//       case "bogo_discount":

//         return isArabic

//           ? "عرض مميز بخصم إضافي."

//           : "A special offer with extra savings.";


//       case "free_shipping":

//         return isArabic

//           ? "احصل على شحن مجاني مع هذا العرض."

//           : "Enjoy free shipping with this offer.";


//       default:

//         return isArabic

//           ? "استفد من هذا العرض قبل انتهائه."

//           : "Take advantage of this offer before it ends.";

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

//       ? `الحد الأدنى ${discount.minOrderAmount} جنيه`

//       : `Minimum order EGP ${discount.minOrderAmount}`;

//   };


//   // ==========================================
//   // Applicable Products
//   // ==========================================

//   const getApplicableProductsText = (discount) => {

//     if (discount?.appliesToAll) {

//       return isArabic

//         ? "متاح على جميع المنتجات"

//         : "Available on all products";

//     }


//     if (
//       discount?.applicableProducts &&
//       discount.applicableProducts.length > 0
//     ) {

//       return isArabic

//         ? `متاح على ${discount.applicableProducts.length} منتجات`

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
//       discount?.remainingUses === undefined ||
//       discount.remainingUses <= 0
//     ) {

//       return "";

//     }


//     return isArabic

//       ? `${discount.remainingUses} استخدام متاح`

//       : `${discount.remainingUses} uses available`;

//   };


//   // ==========================================
//   // Expiration
//   // ==========================================

//   const getExpirationText = (discount) => {

//     if (!discount?.expiresAt) {

//       return "";

//     }


//     try {

//       const date = new Date(
//         discount.expiresAt
//       );


//       return isArabic

//         ? `ينتهي ${date.toLocaleDateString(
//             "ar-EG",
//             {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             }
//           )}`

//         : `Ends ${date.toLocaleDateString(
//             "en-US",
//             {
//               year: "numeric",
//               month: "short",
//               day: "numeric",
//             }
//           )}`;

//     } catch {

//       return "";

//     }

//   };


//   // ==========================================
//   // Close Modal
//   // ==========================================

//   const handleClose = () => {

//     setCopiedCode(null);

//     onClose();

//   };


//   // ==========================================
//   // Don't Render
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

//           initial={{
//             opacity: 0,
//           }}

//           animate={{
//             opacity: 1,
//           }}

//           exit={{
//             opacity: 0,
//           }}

//           className="fixed inset-0 z-[9990] flex items-center justify-center p-4"

//         >

//           {/* ==================================
//               Overlay
//           ================================== */}

//           <motion.div

//             initial={{
//               opacity: 0,
//             }}

//             animate={{
//               opacity: 1,
//             }}

//             exit={{
//               opacity: 0,
//             }}

//             onClick={handleClose}

//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"

//           />


//           {/* ==================================
//               Modal
//           ================================== */}

//           <motion.div

//             initial={{
//               opacity: 0,
//               scale: 0.94,
//               y: 20,
//             }}

//             animate={{
//               opacity: 1,
//               scale: 1,
//               y: 0,
//             }}

//             exit={{
//               opacity: 0,
//               scale: 0.94,
//               y: 20,
//             }}

//             transition={{
//               duration: 0.25,
//             }}

//             dir={isArabic ? "rtl" : "ltr"}

//             className={`relative z-[9991] w-full max-w-lg max-h-[82vh] overflow-hidden rounded-2xl shadow-2xl border ${
//               darkMode
//                 ? "bg-[#111111] border-white/10 text-white"
//                 : "bg-white border-black/10 text-gray-900"
//             }`}

//           >

//             {/* ==================================
//                 Header
//             ================================== */}

//             <div
//               className={`relative px-5 py-5 border-b ${
//                 darkMode
//                   ? "border-white/10"
//                   : "border-black/5"
//               }`}
//             >

//               {/* Close */}

//               <button

//                 onClick={handleClose}

//                 aria-label={
//                   isArabic
//                     ? "إغلاق"
//                     : "Close"
//                 }

//                 className={`absolute top-4 ${
//                   isArabic
//                     ? "left-4"
//                     : "right-4"
//                 } w-8 h-8 rounded-full flex items-center justify-center transition ${
//                   darkMode
//                     ? "bg-white/5 hover:bg-white/10 text-gray-300"
//                     : "bg-gray-100 hover:bg-gray-200 text-gray-600"
//                 }`}

//               >

//                 <FiX size={18} />

//               </button>


//               <div className="flex items-center gap-3">

//                 {/* Icon */}

//                 <div
//                   className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
//                     darkMode
//                       ? "bg-white text-black"
//                       : "bg-black text-white"
//                   }`}
//                 >

//                   <FiGift size={21} />

//                 </div>


//                 {/* Header Text */}

//                 <div className="min-w-0">

//                   <div
//                     className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
//                       darkMode
//                         ? "text-gray-500"
//                         : "text-gray-400"
//                     }`}
//                   >

//                     VESTRO

//                   </div>


//                 </div>

//               </div>

//             </div>


//             {/* ==================================
//                 Content
//             ================================== */}

//             <div className="overflow-y-auto max-h-[62vh] p-4 sm:p-5">

//               {/* =================================
//                   Loading
//               ================================= */}

//               {loading && (

//                 <div className="flex flex-col items-center justify-center py-12">

//                   <motion.div

//                     animate={{
//                       rotate: 360,
//                     }}

//                     transition={{
//                       duration: 0.8,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}

//                     className="w-9 h-9 border-[3px] border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full"

//                   />

//                   <p
//                     className={`mt-3 text-xs ${
//                       darkMode
//                         ? "text-gray-400"
//                         : "text-gray-500"
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

//                 <div className="py-10 text-center">

//                   <div className="text-3xl mb-3">
//                     😔
//                   </div>


//                   <h3 className="text-base font-semibold mb-1">

//                     {isArabic
//                       ? "تعذر تحميل العروض"
//                       : "Offers unavailable"}

//                   </h3>


//                   <p
//                     className={`text-xs ${
//                       darkMode
//                         ? "text-gray-500"
//                         : "text-gray-500"
//                     }`}
//                   >

//                     {error}

//                   </p>

//                 </div>

//               )}


//               {/* =================================
//                   OFFERS LIST
//               ================================= */}

//               {!loading &&
//                 !error &&
//                 discounts.length > 0 && (

//                   <div className="space-y-3">

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
//                             y: 12,
//                           }}

//                           animate={{
//                             opacity: 1,
//                             y: 0,
//                           }}

//                           transition={{
//                             delay: index * 0.05,
//                           }}

//                           className={`relative overflow-hidden rounded-xl border p-4 ${
//                             darkMode
//                               ? "bg-white/[0.03] border-white/10"
//                               : "bg-white border-black/5"
//                           } shadow-sm hover:shadow-md transition-shadow`}

//                         >

//                           {/* =================================
//                               Offer Main Content
//                           ================================= */}

//                           <div className="flex items-start gap-3">

//                             {/* Icon */}

//                             <div
//                               className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                                 darkMode
//                                   ? "bg-white text-black"
//                                   : "bg-black text-white"
//                               }`}
//                             >

//                               <FiGift size={20} />

//                             </div>


//                             {/* Text */}

//                             <div className="flex-1 min-w-0">

//                               <h3 className="text-sm sm:text-base font-bold">

//                                 {getDiscountTitle(
//                                   discount
//                                 )}

//                               </h3>


//                               <p
//                                 className={`mt-1 text-[11px] leading-5 ${
//                                   darkMode
//                                     ? "text-gray-400"
//                                     : "text-gray-500"
//                                 }`}
//                               >

//                                 {getOfferDescription(
//                                   discount
//                                 )}

//                               </p>


//                               {/* Extra Info */}

//                               <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">

//                                 {getMinimumOrderText(
//                                   discount
//                                 ) && (

//                                   <span
//                                     className={`flex items-center gap-1 text-[10px] ${
//                                       darkMode
//                                         ? "text-gray-500"
//                                         : "text-gray-400"
//                                     }`}
//                                   >

//                                     <FiShoppingBag
//                                       size={11}
//                                     />

//                                     {getMinimumOrderText(
//                                       discount
//                                     )}

//                                   </span>

//                                 )}


//                                 {getApplicableProductsText(
//                                   discount
//                                 ) && (

//                                   <span
//                                     className={`flex items-center gap-1 text-[10px] ${
//                                       darkMode
//                                         ? "text-gray-500"
//                                         : "text-gray-400"
//                                     }`}
//                                   >

//                                     <FiShoppingBag
//                                       size={11}
//                                     />

//                                     {getApplicableProductsText(
//                                       discount
//                                     )}

//                                   </span>

//                                 )}


//                                 {getRemainingUsesText(
//                                   discount
//                                 ) && (

//                                   <span
//                                     className={`flex items-center gap-1 text-[10px] ${
//                                       darkMode
//                                         ? "text-gray-500"
//                                         : "text-gray-400"
//                                     }`}
//                                   >

//                                     <FiGift
//                                       size={11}
//                                     />

//                                     {getRemainingUsesText(
//                                       discount
//                                     )}

//                                   </span>

//                                 )}


//                                 {getExpirationText(
//                                   discount
//                                 ) && (

//                                   <span
//                                     className={`flex items-center gap-1 text-[10px] ${
//                                       darkMode
//                                         ? "text-gray-500"
//                                         : "text-gray-400"
//                                     }`}
//                                   >

//                                     <FiClock
//                                       size={11}
//                                     />

//                                     {getExpirationText(
//                                       discount
//                                     )}

//                                   </span>

//                                 )}

//                               </div>

//                             </div>

//                           </div>


//                           {/* =================================
//                               Coupon + Copy Button
//                           ================================= */}

//                           <div
//                             className={`mt-3 pt-3 border-t flex items-center gap-2 ${
//                               darkMode
//                                 ? "border-white/10"
//                                 : "border-black/5"
//                             }`}
//                           >

//                             {/* Coupon Code */}

//                             <div
//                               className={`flex-1 min-w-0 px-3 py-2 rounded-lg font-mono text-xs font-bold tracking-wider text-center truncate ${
//                                 darkMode
//                                   ? "bg-black text-gray-200"
//                                   : "bg-gray-100 text-gray-800"
//                               }`}
//                             >

//                               {discount.code}

//                             </div>


//                             {/* Copy */}

//                             <button

//                               onClick={() =>
//                                 handleCopyCode(
//                                   discount.code
//                                 )
//                               }

//                               disabled={
//                                 copiedCode ===
//                                 discount.code
//                               }

//                               className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition ${
//                                 copiedCode ===
//                                 discount.code

//                                   ? "bg-green-600 text-white"

//                                   : darkMode
//                                   ? "bg-white text-black hover:bg-gray-200"
//                                   : "bg-black text-white hover:bg-gray-800"
//                               }`}

//                             >

//                               {copiedCode ===
//                               discount.code ? (

//                                 <>

//                                   <FiCheck size={14} />

//                                   {isArabic
//                                     ? "تم النسخ"
//                                     : "Copied"}

//                                 </>

//                               ) : (

//                                 <>

//                                   <FiCopy size={14} />

//                                   {isArabic
//                                     ? "نسخ"
//                                     : "Copy"}

//                                 </>

//                               )}

//                             </button>

//                           </div>


//                           {/* Free Shipping */}

//                           {(discount.freeShipping ||
//                             discount.discountType ===
//                               "free_shipping") && (

//                             <div
//                               className={`mt-2 flex items-center justify-center gap-1 text-[10px] font-medium ${
//                                 darkMode
//                                   ? "text-gray-400"
//                                   : "text-gray-500"
//                               }`}
//                             >

//                               <FiTruck size={12} />

//                               {isArabic
//                                 ? "يشمل شحن مجاني"
//                                 : "Includes free shipping"}

//                             </div>

//                           )}

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
//                 discounts.length === 0 && (

//                   <motion.div

//                     initial={{
//                       opacity: 0,
//                       y: 10,
//                     }}

//                     animate={{
//                       opacity: 1,
//                       y: 0,
//                     }}

//                     className="text-center py-8"

//                   >

//                     <motion.div

//                       animate={{
//                         y: [0, -5, 0],
//                       }}

//                       transition={{
//                         duration: 2.5,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                       }}

//                       className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
//                         darkMode
//                           ? "bg-white text-black"
//                           : "bg-black text-white"
//                       }`}
//                     >

//                       <FiGift size={28} />

//                     </motion.div>


//                     <div
//                       className={`text-[10px] font-semibold tracking-[0.2em] uppercase mb-2 ${
//                         darkMode
//                           ? "text-gray-500"
//                           : "text-gray-400"
//                       }`}
//                     >

//                       VESTRO

//                     </div>


//                     <h3 className="text-xl font-bold mb-2">

//                       {isArabic
//                         ? "عروض جديدة قريبًا"
//                         : "New offers coming soon"}

//                     </h3>


//                     <p
//                       className={`max-w-sm mx-auto text-xs leading-6 ${
//                         darkMode
//                           ? "text-gray-400"
//                           : "text-gray-500"
//                       }`}
//                     >

//                       {isArabic
//                         ? "تابعنا للحصول على أحدث الخصومات والعروض الحصرية."
//                         : "Stay tuned for the latest deals and exclusive savings."}

//                     </p>

//                   </motion.div>

//                 )}

//             </div>


//             {/* ==================================
//                 Footer
//             ================================== */}

//             {!loading &&
//               !error &&
//               discounts.length > 0 && (

//                 <div
//                   className={`px-4 py-3 border-t text-center text-[10px] ${
//                     darkMode
//                       ? "border-white/10 text-gray-500"
//                       : "border-black/5 text-gray-400"
//                   }`}
//                 >

//                   {isArabic
//                     ? "انسخ الكود واستخدمه عند إتمام طلبك."
//                     : "Copy your code and use it at checkout."}

//                 </div>

//               )}

//           </motion.div>

//         </motion.div>

//       )}

//     </AnimatePresence>

//   );

// }


// export default OffersWelcomeModal;
