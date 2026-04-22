import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function Privacy() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const sections = [
    {
      ar: "جمع البيانات",
      en: "Data Collection",
      descAr:
        "نقوم بجمع بيانات مثل الاسم، رقم الهاتف، عنوان الشحن، والبريد الإلكتروني عند استخدام الموقع أو إجراء طلب.",
      descEn:
        "We collect data such as name, phone number, shipping address, and email when using the website or placing an order.",
    },
    {
      ar: "استخدام البيانات",
      en: "Data Usage",
      descAr:
        "تُستخدم البيانات لتنفيذ الطلبات، التواصل مع العملاء، وتحسين تجربة المستخدم.",
      descEn:
        "Data is used to process orders, communicate with customers, and improve user experience.",
    },
    {
      ar: "مشاركة البيانات",
      en: "Data Sharing",
      descAr:
        "لا نقوم ببيع أو مشاركة بياناتك إلا عند الضرورة (الشحن / الدفع).",
      descEn:
        "We do not sell or share your data except when necessary (shipping/payment).",
    },
    {
      ar: "حماية البيانات",
      en: "Data Protection",
      descAr:
        "نستخدم وسائل حماية مناسبة لضمان سرية معلومات المستخدمين.",
      descEn:
        "We apply appropriate measures to keep your data secure.",
    },
    {
      ar: "الكوكيز",
      en: "Cookies",
      descAr:
        "نستخدم الكوكيز لتحسين تجربة التصفح ويمكنك تعطيلها من المتصفح.",
      descEn:
        "Cookies are used to enhance browsing experience and can be disabled.",
    },
    {
      ar: "حقوق المستخدم",
      en: "User Rights",
      descAr:
        "يمكنك طلب تعديل أو حذف بياناتك في أي وقت.",
      descEn:
        "You can request to modify or delete your data anytime.",
    },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen pt-28 px-4 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-5xl  mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-8">
            {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>
          <div className="w-24 h-1 bg-red-700 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* CARD */}
        <div className={`rounded-[2rem] p-6 md:p-10  space-y-8 backdrop-blur-xl border shadow-2xl mb-10 ${
          darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
        }`}>

          <p className="text-lg opacity-80">
            {isRTL
              ? "نحن في VESTRO نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية."
              : "At VESTRO, we respect your privacy and are committed to protecting your personal data."}
          </p>

          {/* SECTIONS */}
          <div className="grid gap-6">
            {sections.map((sec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode
                    ? "border-white/10 hover:border-red-700"
                    : "border-black/10 hover:border-black"
                }`}
              >
                <h3 className="font-black text-xl mb-2 text-red-700">
                  {isRTL ? sec.ar : sec.en}
                </h3>
                <p className="opacity-80">
                  {isRTL ? sec.descAr : sec.descEn}
                </p>
              </motion.div>
            ))}
          </div>

          {/* FOOTER */}
          <p className="text-sm opacity-50 text-center pt-6 border-t border-white/10">
            {isRTL
              ? "نحتفظ بحق تعديل السياسة في أي وقت."
              : "We reserve the right to update this policy at any time."}
          </p>

        </div>

      </div>
    </div>
  );
}