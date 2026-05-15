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
        "تُستخدم البيانات لتنفيذ الطلبات، التواصل مع العملاء، تحسين تجربة المستخدم، وإرسال التحديثات المتعلقة بالطلبات.",
      descEn:
        "Data is used to process orders, communicate with customers, improve user experience, and send order-related updates.",
    },

    {
      ar: "الرسائل التسويقية",
      en: "Marketing Messages",
      descAr:
        "عند موافقتك، قد نرسل لك رسائل تسويقية وعروض عبر واتساب أو وسائل التواصل المرتبطة بخدماتنا. يمكنك إلغاء الاشتراك في أي وقت.",
      descEn:
        "With your consent, we may send marketing messages and offers through WhatsApp or related communication channels. You may opt out at any time.",
    },

    {
      ar: "موافقة المستخدم",
      en: "User Consent",
      descAr:
        "لن يتم إرسال رسائل تسويقية إلا بعد موافقة المستخدم بشكل واضح أثناء استخدام الموقع أو التواصل معنا.",
      descEn:
        "Marketing messages are only sent after receiving clear user consent while using the website or communicating with us.",
    },

    {
      ar: "مشاركة البيانات",
      en: "Data Sharing",
      descAr:
        "لا نقوم ببيع أو مشاركة بياناتك مع أي طرف ثالث إلا عند الضرورة لتنفيذ خدمات الشحن أو الدفع.",
      descEn:
        "We do not sell or share your data with third parties except when necessary for shipping or payment services.",
    },

    {
      ar: "حماية البيانات",
      en: "Data Protection",
      descAr:
        "نستخدم وسائل حماية مناسبة للحفاظ على سرية وأمان بيانات المستخدمين.",
      descEn:
        "We apply appropriate security measures to protect user data and privacy.",
    },

    {
      ar: "الكوكيز",
      en: "Cookies",
      descAr:
        "نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل الأداء.",
      descEn:
        "Cookies are used to improve browsing experience and analyze website performance.",
    },

    {
      ar: "حقوق المستخدم",
      en: "User Rights",
      descAr:
        "يمكنك طلب تعديل أو حذف بياناتك أو إلغاء الاشتراك في الرسائل التسويقية في أي وقت.",
      descEn:
        "You may request to modify or delete your data or opt out from marketing messages at any time.",
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
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase mt-8">
            {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>

          <div className="w-24 h-1 bg-red-700 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* CONTENT */}
        <div
          className={`rounded-[2rem] p-6 md:p-10 space-y-8 backdrop-blur-xl border shadow-2xl mb-10 ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-black/5 border-black/10"
          }`}
        >
          <p className="text-lg opacity-80 leading-8">
            {isRTL
              ? "نحن في VESTRO نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية واستخدامها بطريقة آمنة ومتوافقة مع سياسات المنصات والخدمات المستخدمة."
              : "At VESTRO, we respect your privacy and are committed to protecting your personal data and using it securely in compliance with platform policies."}
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

                <p className="opacity-80 leading-7">
                  {isRTL ? sec.descAr : sec.descEn}
                </p>
              </motion.div>
            ))}
          </div>

          {/* FOOTER */}
          <p className="text-sm opacity-50 text-center pt-6 border-t border-white/10">
            {isRTL
              ? "نحتفظ بحق تعديل هذه السياسة في أي وقت بما يتوافق مع القوانين والسياسات المعمول بها."
              : "We reserve the right to update this policy at any time in compliance with applicable laws and platform policies."}
          </p>
        </div>
      </div>
    </div>
  );
}