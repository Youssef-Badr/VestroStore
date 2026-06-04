import {
  AlertTriangle,
  RefreshCcw,
  ShieldCheck,
  Package,
  Clock3,
  BadgeCheck,
  Wallet,
} from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";

export default function Policy() {
  const { language } = useLanguage();

  const isRTL = language === "ar";

  const items = [
  {
    icon: <RefreshCcw className="text-red-700" />,
    ar: "يمكن إرجاع أو استبدال المنتجات خلال 14 يومًا من تاريخ استلام الشحنة.",
    en: "Products may be returned or exchanged within 14 days from the delivery date.",
  },

  {
    icon: <ShieldCheck className="text-red-700" />,
    ar: "المعاينة مسموحة أثناء وجود مندوب الشحن للتحقق من الخامة والمقاس ومحتويات الشحنة.",
    en: "Inspection is allowed while the courier is present to verify the material, size, and package contents.",
  },

  {
    icon: <AlertTriangle className="text-red-500" />,
    ar: "من فضلك يُرجى فحص شحنتك بشكل كافٍ قبل انصراف مندوب الشحن.",
    en: "Please inspect your shipment carefully before the courier leaves.",
    important: true,
  },

  {
    icon: <Package className="text-red-700" />,
    ar: "يتم دفع مبلغ الشحن للمندوب عند رفض الشحنة أثناء المعاينة.",
    en: "Shipping fees must be paid to the courier if the shipment is refused during inspection.",
  },

  {
    icon: <ShieldCheck className="text-red-700" />,
    ar: "في حالة رفض الشحنة أثناء المعاينة بسبب جودة المنتج أو وجود محتويات خاطئة، تتحمل الشركة جميع المصاريف المترتبة على ذلك.",
    en: "If the shipment is refused during inspection due to a product quality issue or incorrect contents, the company will bear all related costs.",
  },

  {
    icon: <RefreshCcw className="text-red-700" />,
    ar: "عند طلب استرجاع المنتج بعد استلام الشحنة لأي سبب، يلتزم العميل بسداد مصاريف الشحن والاسترجاع.",
    en: "If a return is requested after receiving the shipment for any reason, the customer is responsible for shipping and return fees.",
  },

  {
    icon: <AlertTriangle className="text-red-500" />,
    ar: "في حالة الاسترجاع بسبب عيب جودة أو عيب في التقفيل أو التصنيع، تتحمل الشركة جميع المصاريف.",
    en: "If the return is due to a manufacturing, stitching, or finishing defect, the company will cover all related costs.",
    important: true,
  },

  {
    icon: <Wallet className="text-red-700" />,
    ar: "يتم رد قيمة الطلب المستحقة بعد خصم أي مصاريف مستحقة وفقًا لسبب الإرجاع.",
    en: "The refundable order amount will be paid after deducting any applicable fees based on the return reason.",
  },

  {
    icon: <Wallet className="text-red-700" />,
    ar: "يتم رد المبلغ عن طريق تحويل على محفظة إلكترونية أو InstaPay بعد وصول المنتج للمخزن وفحصه.",
    en: "Refunds are issued via Mobile Wallet or InstaPay after the product reaches our warehouse and passes inspection.",
  },

  {
    icon: <AlertTriangle className="text-red-500" />,
    ar: "لا يتم رد أي مبالغ للمنتجات التي يتبين أنها غُسلت أو استُخدمت بعد الاستلام.",
    en: "No refund will be issued for products found to have been washed or used after delivery.",
    important: true,
  },

  {
    icon: <Package className="text-red-700" />,
    ar: "إذا تم استرجاع منتج واتضح أنه مستخدم، يحق للعميل استلامه مرة أخرى ويتحمل العميل تكلفة إعادة الشحن بالكامل.",
    en: "If a returned product is found to be used, the customer may receive it back and will be responsible for all re-shipping costs.",
  },

  {
    icon: <Clock3 className="text-red-700" />,
    ar: "قد تستغرق عملية فحص المنتج والاسترجاع أو الاستبدال عدة أيام عمل.",
    en: "Product inspection, return, or exchange processing may take several business days.",
  },

  {
    icon: <Package className="text-red-700" />,
    ar: "يجب أن يكون المنتج بحالته الأصلية مع جميع الملحقات والتغليف الأصلي.",
    en: "Returned products must remain in their original condition with all accessories and original packaging.",
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