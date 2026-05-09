import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function DataDeletion() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const steps = [
    {
      ar: "حذف الحساب من الموقع",
      en: "Delete account from website",
      descAr: "قم بتسجيل الدخول ثم انتقل إلى إعدادات الحساب واضغط حذف الحساب.",
      descEn: "Log in, go to account settings, then click Delete Account.",
    },
    {
      ar: "طلب الحذف عبر البريد",
      en: "Request via email",
      descAr: "يمكنك إرسال طلب حذف بياناتك إلى البريد الإلكتروني الخاص بنا.",
      descEn: "You can request data deletion by emailing us.",
    },
    {
      ar: "مدة الحذف",
      en: "Deletion time",
      descAr: "سيتم حذف بياناتك خلال 7 إلى 30 يوم عمل.",
      descEn: "Your data will be deleted within 7 to 30 business days.",
    },
    {
      ar: "البيانات المحذوفة",
      en: "Deleted data",
      descAr: "يشمل ذلك الاسم، الهاتف، العنوان، والطلبات المرتبطة بحسابك.",
      descEn: "This includes name, phone, address, and all related orders.",
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
            {isRTL ? "حذف البيانات" : "Data Deletion"}
          </h1>

          <div className="w-24 h-1 bg-red-700 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* CARD */}
        <div className={`rounded-[2rem] p-6 md:p-10 space-y-8 backdrop-blur-xl border shadow-2xl mb-10 ${
          darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
        }`}>

          <p className="text-lg opacity-80">
            {isRTL
              ? "نحن في VESTRO نحترم حقك في حذف بياناتك في أي وقت."
              : "At VESTRO, we respect your right to delete your data at any time."}
          </p>

          {/* STEPS */}
          <div className="grid gap-6">
            {steps.map((step, i) => (
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
                  {isRTL ? step.ar : step.en}
                </h3>
                <p className="opacity-80">
                  {isRTL ? step.descAr : step.descEn}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CONTACT */}
          <div className="text-center pt-6 border-t border-white/10">
            <p className="opacity-70">
              {isRTL
                ? "لأي طلب حذف بيانات، تواصل معنا عبر:"
                : "For any data deletion request, contact us at:"}
            </p>

            <p className="text-red-600 font-bold mt-2">
              vestrosportswear@gmail.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}