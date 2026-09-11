import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiGift,
  FiCopy,
  FiCheck,
  FiArrowLeft,
  FiClock,
  FiShoppingBag,
  FiTruck,
  FiTag,
} from "react-icons/fi";

import api from "../../src/api/axiosInstance";

function OffersWelcomeModal({
  isOpen,
  onClose,
  darkMode,
  language,
}) {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

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
        setSelectedDiscount(null);
        setCopiedCode(false);

        // Use existing session cache
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

        const response = await api.get("/discounts/active");

        const offers = Array.isArray(response.data)
          ? response.data
          : [];

        setDiscounts(offers);

        sessionStorage.setItem(
          "activeDiscounts",
          JSON.stringify(offers)
        );
      } catch (err) {
        console.error("Failed to fetch active offers:", err);

        setError(
          isArabic
            ? "تعذر تحميل العروض حاليًا."
            : "Unable to load offers right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [isOpen, isArabic]);

  // ==========================================
  // Copy Coupon
  // ==========================================

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(true);

      setTimeout(() => {
        setCopiedCode(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy coupon:", err);
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
  // Short Description
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
    if (!discount?.minOrderAmount) return "";

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
    if (!discount?.expiresAt) return "";

    try {
      const date = new Date(discount.expiresAt);

      return isArabic
        ? `ينتهي ${date.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}`
        : `Ends ${date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}`;
    } catch {
      return "";
    }
  };

  // ==========================================
  // Handlers
  // ==========================================

  const handleShowDetails = (discount) => {
    setCopiedCode(false);
    setSelectedDiscount(discount);
  };

  const handleBackToOffers = () => {
    setSelectedDiscount(null);
    setCopiedCode(false);
  };

  const handleClose = () => {
    setSelectedDiscount(null);
    setCopiedCode(false);
    onClose();
  };

  // ==========================================
  // Don't Render
  // ==========================================

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4"
        >
          {/* ==================================
              Overlay
          ================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[5px]"
          />

          {/* ==================================
              Modal
          ================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 18,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: 18,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
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
              {/* Close Button */}

              <button
                onClick={handleClose}
                aria-label={isArabic ? "إغلاق" : "Close"}
                className={`absolute top-4 ${
                  isArabic ? "left-4" : "right-4"
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
                  <FiTag size={21} />
                </div>

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
                    {selectedDiscount
                      ? isArabic
                        ? "تفاصيل العرض"
                        : "Offer Details"
                      : isArabic
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
                    {selectedDiscount
                      ? isArabic
                        ? "استخدم الكود واستمتع بالعرض."
                        : "Use your code and enjoy the offer."
                      : isArabic
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
                    className="w-8 h-8 border-[3px] border-gray-300 dark:border-white/10 border-t-black dark:border-t-white rounded-full"
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
                <div className="text-center py-10">
                  <div className="text-3xl mb-3">×</div>

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
                  DETAILS
              ================================= */}

              {!loading &&
                !error &&
                selectedDiscount && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: isArabic ? 15 : -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                  >
                    {/* Back */}

                    <button
                      onClick={handleBackToOffers}
                      className={`flex items-center gap-2 mb-4 text-xs font-semibold transition ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      <FiArrowLeft
                        size={15}
                        className={
                          isArabic ? "rotate-180" : ""
                        }
                      />

                      {isArabic
                        ? "العودة للعروض"
                        : "Back to offers"}
                    </button>

                    {/* Details Card */}

                    <div
                      className={`rounded-xl border p-4 ${
                        darkMode
                          ? "bg-white/[0.03] border-white/10"
                          : "bg-gray-50 border-black/5"
                      }`}
                    >
                      {/* Offer Header */}

                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            darkMode
                              ? "bg-white text-black"
                              : "bg-black text-white"
                          }`}
                        >
                          <FiGift size={22} />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold">
                            {getDiscountTitle(
                              selectedDiscount
                            )}
                          </h3>

                          <p
                            className={`text-xs mt-1 ${
                              darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {getOfferDescription(
                              selectedDiscount
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Info */}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {getMinimumOrderText(
                          selectedDiscount
                        ) && (
                          <div
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                              darkMode
                                ? "bg-white/5 text-gray-300"
                                : "bg-white text-gray-600"
                            }`}
                          >
                            <FiShoppingBag size={14} />

                            <span>
                              {getMinimumOrderText(
                                selectedDiscount
                              )}
                            </span>
                          </div>
                        )}

                        {getApplicableProductsText(
                          selectedDiscount
                        ) && (
                          <div
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                              darkMode
                                ? "bg-white/5 text-gray-300"
                                : "bg-white text-gray-600"
                            }`}
                          >
                            <FiShoppingBag size={14} />

                            <span>
                              {getApplicableProductsText(
                                selectedDiscount
                              )}
                            </span>
                          </div>
                        )}

                        {getRemainingUsesText(
                          selectedDiscount
                        ) && (
                          <div
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                              darkMode
                                ? "bg-white/5 text-gray-300"
                                : "bg-white text-gray-600"
                            }`}
                          >
                            <FiGift size={14} />

                            <span>
                              {getRemainingUsesText(
                                selectedDiscount
                              )}
                            </span>
                          </div>
                        )}

                        {getExpirationText(
                          selectedDiscount
                        ) && (
                          <div
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                              darkMode
                                ? "bg-white/5 text-gray-300"
                                : "bg-white text-gray-600"
                            }`}
                          >
                            <FiClock size={14} />

                            <span>
                              {getExpirationText(
                                selectedDiscount
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Coupon */}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold">
                            {isArabic
                              ? "كود الخصم"
                              : "Coupon code"}
                          </span>

                          {selectedDiscount.freeShipping ||
                          selectedDiscount.discountType ===
                            "free_shipping" ? (
                            <span className="flex items-center gap-1 text-[10px] font-medium">
                              <FiTruck size={12} />

                              {isArabic
                                ? "شحن مجاني"
                                : "Free shipping"}
                            </span>
                          ) : null}
                        </div>

                        <div
                          className={`flex items-center gap-2 rounded-xl p-1.5 border ${
                            darkMode
                              ? "bg-black border-white/10"
                              : "bg-white border-black/10"
                          }`}
                        >
                          <div className="flex-1 px-3 py-2 text-center font-mono font-bold text-base tracking-[0.12em] truncate">
                            {selectedDiscount.code}
                          </div>

                          <button
                            onClick={() =>
                              handleCopyCode(
                                selectedDiscount.code
                              )
                            }
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                              darkMode
                                ? "bg-white text-black hover:bg-gray-200"
                                : "bg-black text-white hover:bg-gray-800"
                            }`}
                          >
                            {copiedCode ? (
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
                      </div>
                    </div>
                  </motion.div>
                )}

              {/* =================================
                  OFFERS LIST
              ================================= */}

              {!loading &&
                !error &&
                !selectedDiscount &&
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
                          className={`rounded-xl border p-3.5 ${
                            darkMode
                              ? "bg-white/[0.03] border-white/10"
                              : "bg-white border-black/5"
                          } hover:shadow-md transition-shadow`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Icon */}

                            <div
                              className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                darkMode
                                  ? "bg-white text-black"
                                  : "bg-black text-white"
                              }`}
                            >
                              <FiTag size={19} />
                            </div>

                            {/* Text */}

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base font-bold truncate">
                                {getDiscountTitle(
                                  discount
                                )}
                              </h3>

                              <p
                                className={`text-[11px] mt-1 truncate ${
                                  darkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {getOfferDescription(
                                  discount
                                )}
                              </p>

                              {getMinimumOrderText(
                                discount
                              ) && (
                                <p
                                  className={`text-[10px] mt-1 ${
                                    darkMode
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {getMinimumOrderText(
                                    discount
                                  )}
                                </p>
                              )}
                            </div>

                            {/* Details Button */}

                            <button
                              onClick={() =>
                                handleShowDetails(
                                  discount
                                )
                              }
                              className={`flex-shrink-0 px-3 py-2 rounded-lg text-[11px] font-semibold transition ${
                                darkMode
                                  ? "bg-white text-black hover:bg-gray-200"
                                  : "bg-black text-white hover:bg-gray-800"
                              }`}
                            >
                              {isArabic
                                ? "التفاصيل"
                                : "Details"}
                            </button>
                          </div>

                          {/* Coupon Preview */}

                          <div
                            className={`mt-3 flex items-center justify-between gap-2 px-3 py-2 rounded-lg ${
                              darkMode
                                ? "bg-black/50"
                                : "bg-gray-50"
                            }`}
                          >
                            <span
                              className={`text-[10px] uppercase tracking-wider ${
                                darkMode
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {isArabic
                                ? "الكود"
                                : "CODE"}
                            </span>

                            <span className="font-mono text-xs font-bold tracking-wider">
                              {discount.code}
                            </span>
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
                !selectedDiscount &&
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
              !selectedDiscount &&
              discounts.length > 0 && (
                <div
                  className={`px-4 py-3 border-t text-center text-[10px] ${
                    darkMode
                      ? "border-white/10 text-gray-500"
                      : "border-black/5 text-gray-400"
                  }`}
                >
                  {isArabic
                    ? "العروض متاحة لفترة محدودة."
                    : "Offers are available for a limited time."}
                </div>
              )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OffersWelcomeModal;
 
