import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Trash2,
  Mail,
  ShieldCheck,
  Clock3,
  UserX,
} from "lucide-react";

import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function DataDeletion() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();

  const isRTL = language === "ar";

  const steps = [
    {
      icon: <UserX className="text-red-700" />,
      ar: "حذف الحساب من الموقع",
      en: "Delete account from website",
      descAr:
        "يمكنك تسجيل الدخول ثم الانتقال إلى إعدادات الحساب والضغط على حذف الحساب.",
      descEn:
        "You can log in, go to account settings, and click Delete Account.",
    },

    {
      icon: <Mail className="text-red-700" />,
      ar: "طلب الحذف عبر البريد الإلكتروني",
      en: "Request deletion via email",
      descAr:
        "يمكنك إرسال طلب حذف البيانات أو إلغاء الرسائل التسويقية عبر البريد الإلكتروني الخاص بنا.",
      descEn:
        "You can request data deletion or opt out from marketing messages via our email.",
    },

    {
      icon: <Clock3 className="text-red-700" />,
      ar: "مدة تنفيذ الحذف",
      en: "Deletion processing time",
      descAr:
        "قد تستغرق عملية حذف البيانات من 7 إلى 30 يوم عمل حسب نوع البيانات المطلوبة.",
      descEn:
        "Data deletion may take between 7 and 30 business days depending on the requested data.",
    },

    {
      icon: <Trash2 className="text-red-700" />,
      ar: "البيانات التي يتم حذفها",
      en: "Deleted information",
      descAr:
        "يشمل ذلك الاسم، رقم الهاتف، البريد الإلكتروني، العنوان، والبيانات المرتبطة بالحساب والطلبات.",
      descEn:
        "This includes name, phone number, email, address, and account/order related information.",
    },

    {
      icon: <ShieldCheck className="text-red-700" />,
      ar: "الاحتفاظ ببعض البيانات",
      en: "Data retention",
      descAr:
        "قد يتم الاحتفاظ ببعض البيانات لفترة محدودة إذا كانت مطلوبة قانونيًا أو لأغراض محاسبية وأمنية.",
      descEn:
        "Some information may be retained temporarily if legally required or needed for accounting and security purposes.",
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

        {/* MAIN CARD */}
        <div
          className={`rounded-[2rem] p-6 md:p-10 space-y-8 backdrop-blur-xl border shadow-2xl mb-10 ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-black/5 border-black/10"
          }`}
        >
          {/* INTRO */}
          <p className="text-lg opacity-80 leading-8">
            {isRTL
              ? "نحن في VESTRO نحترم خصوصيتك وحقك الكامل في حذف بياناتك الشخصية أو إلغاء الاشتراك في الرسائل التسويقية في أي وقت."
              : "At VESTRO, we respect your privacy and your right to delete your personal data or opt out from marketing messages at any time."}
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
                <div className="flex items-start gap-3">
                  {step.icon}

                  <div>
                    <h3 className="font-black text-xl mb-2 text-red-700">
                      {isRTL ? step.ar : step.en}
                    </h3>

                    <p className="opacity-80 leading-7">
                      {isRTL ? step.descAr : step.descEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CONTACT */}
          <div className="text-center pt-6 border-t border-white/10">
            <p className="opacity-70">
              {isRTL
                ? "لأي طلب متعلق بحذف البيانات أو إلغاء الرسائل التسويقية تواصل معنا عبر:"
                : "For any request related to data deletion or marketing opt-out, contact us at:"}
            </p>

            <p className="text-red-600 font-bold mt-3 text-lg break-all">
              vestrosportswear@gmail.com
            </p>
          </div>

          {/* FOOTER */}
          <p className="text-sm opacity-50 text-center pt-4">
            {isRTL
              ? "باستخدامك للموقع فأنت توافق على سياسة الخصوصية وشروط استخدام الخدمة."
              : "By using the website, you agree to our Privacy Policy and Terms of Service."}
          </p>
        </div>
      </div>
    </div>
  );
}