import {
  AlertTriangle,
  RefreshCcw,
  ShieldCheck,
  Package,
  Clock3,
  BadgeCheck,
} from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";

export default function Policy() {
  const { language } = useLanguage();

  const isRTL = language === "ar";

  const items = [
    {
      icon: <RefreshCcw className="text-red-700" />,
      ar: "يمكن إرجاع أو استبدال المنتجات خلال 14 يوم من استلام الشحنة.",
      en: "Products can be returned or exchanged within 14 days of delivery.",
    },

    {
      icon: <ShieldCheck className="text-red-700" />,
      ar: "يجب إثبات التلف أو النقص أثناء وجود مندوب الشحن.",
      en: "Any damage or missing items must be reported during delivery.",
    },

    {
      icon: <AlertTriangle className="text-red-500" />,
      ar: "يتم دفع مصاريف الشحن فقط عند رفض الشحنة أثناء المعاينة.",
      en: "Shipping fees apply only if the shipment is rejected during inspection.",
      important: true,
    },

    {
      icon: <Package className="text-red-700" />,
      ar: "يجب أن يكون المنتج بحالته الأصلية مع التغليف الأصلي.",
      en: "Returned products must remain in original condition and packaging.",
    },

    {
      icon: <Clock3 className="text-red-700" />,
      ar: "قد تستغرق عملية الاستبدال أو الاسترجاع عدة أيام عمل.",
      en: "Return or exchange processing may take several business days.",
    },

    {
      icon: <BadgeCheck className="text-red-700" />,
      ar: "باستخدامك للموقع فأنت توافق على سياسات المتجر والشروط الخاصة بالخدمة.",
      en: "By using the website, you agree to the store policies and service terms.",
    },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4"
    >
      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black uppercase">
          {isRTL
            ? "سياسة الإرجاع والاستبدال"
            : "Return & Exchange Policy"}
        </h1>

        <p className="text-xs mt-3 opacity-60">
          {isRTL
            ? "يرجى قراءة السياسة بعناية"
            : "Please read the policy carefully"}
        </p>
      </div>

      {/* CARDS */}
      <div className="max-w-3xl mx-auto space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-4 rounded-2xl border ${
              item.important
                ? "border-red-500/40 bg-red-50 dark:bg-red-500/10"
                : "bg-gray-50 dark:bg-zinc-900"
            }`}
          >
            {item.icon}

            <p
              className={`text-sm leading-7 ${
                item.important
                  ? "font-bold text-red-600 dark:text-red-400"
                  : ""
              }`}
            >
              {isRTL ? item.ar : item.en}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}