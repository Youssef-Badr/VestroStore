/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Terms() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const terms = [
    {
      ar: "توافر المنتجات",
      en: "Product Availability",
      descAr: "جميع الطلبات تخضع لتوافر المنتجات.",
      descEn: "All orders are subject to product availability.",
    },
    {
      ar: "الأسعار",
      en: "Pricing",
      descAr: "الأسعار قابلة للتغيير دون إشعار مسبق.",
      descEn: "Prices may change without prior notice.",
    },
    {
      ar: "الشحن",
      en: "Shipping",
      descAr: "مدة الشحن تختلف حسب الموقع.",
      descEn: "Delivery time varies by location.",
    },
    {
      ar: "الاسترجاع",
      en: "Returns",
      descAr: "استرجاع خلال 14 يوم بشرط الحالة الأصلية.",
      descEn: "Returns allowed within 14 days if unused.",
    },
    {
      ar: "الاستخدام",
      en: "Usage",
      descAr: "يجب استخدام الموقع بشكل قانوني.",
      descEn: "Website must be used legally.",
    },
    {
      ar: "الملكية",
      en: "Ownership",
      descAr: "جميع المحتويات ملك لـ VESTRO.",
      descEn: "All content belongs to VESTRO.",
    },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen pt-28 px-4 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 "
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-6">
            {isRTL ? "الشروط والأحكام" : "Terms & Conditions"}
          </h1>
          <div className="w-24 h-1 bg-red-700 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* CARD */}
        <div className={`rounded-[2rem] p-6 md:p-10 space-y-8 backdrop-blur-xl border shadow-2xl mb-10 ${
          darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
        }`}>

          <p className="text-lg opacity-80">
            {isRTL
              ? "باستخدامك لموقع VESTRO، فإنك توافق على الشروط التالية:"
              : "By using VESTRO, you agree to the following terms:"}
          </p>

          <div className="grid gap-6">
            {terms.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode
                    ? "border-white/10 hover:border-red-800"
                    : "border-black/10 hover:border-black"
                }`}
              >
                <h3 className="font-black text-xl mb-2 text-red-700">
                  {isRTL ? t.ar : t.en}
                </h3>
                <p className="opacity-80">
                  {isRTL ? t.descAr : t.descEn}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="text-sm opacity-50 text-center pt-6 border-t border-white/10">
            {isRTL
              ? "نحتفظ بحق تعديل الشروط في أي وقت."
              : "We reserve the right to update these terms at any time."}
          </p>

        </div>
      </div>
    </div>
  );
}