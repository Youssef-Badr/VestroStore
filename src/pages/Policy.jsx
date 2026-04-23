import { AlertTriangle, RefreshCcw, ShieldCheck, Package } from "lucide-react";

export default function Policy() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 px-4">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black uppercase ">
          سياسة الإرجاع والاستبدال
        </h1>
        <p className="text-xs mt-3 opacity-60">
          Return & Exchange Policy
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-3xl mx-auto space-y-4">

        {/* 1 */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border bg-gray-50 dark:bg-zinc-900">
          <RefreshCcw className="text-red-700" />
          <p className="text-sm leading-6">
            يمكن إرجاع المنتجات خلال <b>14 يوم</b> من استلام الشحنة.
          </p>
        </div>

        {/* 2 */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border bg-gray-50 dark:bg-zinc-900">
          <ShieldCheck className="text-red-700" />
          <p className="text-sm leading-6">
            يجب إثبات التلف أو النقص أثناء تواجد المندوب.
          </p>
        </div>

        {/* 3 - Important */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-500/40 bg-red-50 dark:bg-red-500/10">
          <AlertTriangle className="text-red-500" />
          <p className="text-sm leading-6 font-bold text-red-600 dark:text-red-400">
             يتم دفع مصاريف الشحن فقط عند رفض الشحنة أثناء المعاينة.
          </p>
        </div>

        {/* 4 */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border bg-gray-50 dark:bg-zinc-900">
          <Package className="text-red-700" />
          <p className="text-sm leading-6">
            يجب أن يكون المنتج بحالته الأصلية وبغلافه الأصلي.
          </p>
        </div>

      </div>
    </div>
  );
}