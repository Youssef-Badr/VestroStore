/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useCart } from '../../src/contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext'; // تأكد من المسار الصحيح للثيم
 const colorMap = {
     // --- الأبيض والأسود ---
  "أبيض": "#FFFFFF", "ابيض": "#FFFFFF", "وايت": "#FFFFFF", "white": "#FFFFFF", "اوف وايت": "#FAF9F6", "أوف وايت": "#FAF9F6", "off-white": "#FAF9F6",
  "أسود": "#121212", "اسود": "#121212", "بلاك": "#121212", "black": "#121212", "فحمي": "#374151", "charcoal": "#374151",

  // --- الرماديات ---
  "رمادي": "#6b7280", "رصاصي": "#6b7280", "جراي": "#6b7280", "gray": "#6b7280", "grey": "#6b7280",
  "فضي": "#d1d5db", "سيلفر": "#d1d5db", "silver": "#d1d5db",

  // --- الأحمر والنبيتي ---
  "أحمر": "#e11d48", "احمر": "#e11d48", "red": "#e11d48",
  "نبيتي": "#7f1d1d", "مارون": "#7f1d1d", "maroon": "#7f1d1d", "بورجوندي": "#800020",
  "طوبي": "#991b1b", "brick": "#991b1b",

  // --- الأزرق والكحلي ---
  "أزرق": "#2563eb", "ازرق": "#2563eb", "blue": "#2563eb",
  "كحلي": "#1e3a8a", "نيفي": "#1e3a8a", "navy": "#1e3a8a",
  "سماوي": "#0ea5e9", "لبني": "#7dd3fc", "sky blue": "#7dd3fc",
  "بترولي": "#005F69", "petrol": "#005F69",

  // --- الأخضر والزيتي ---
  "أخضر": "#16a34a", "اخضر": "#16a34a", "green": "#16a34a",
  "زيتي": "#3f6212", "زيتوني": "#3f6212", "olive": "#3f6212",
  "فسفوري": "#86FE05", "فوسفوري": "#86FE05", "neon": "#86FE05",
  "منت": "#a7f3d0", "مينت": "#a7f3d0", "mint": "#a7f3d0",

  // --- الأصفر والبرتقالي ---
  "أصفر": "#facc15", "اصفر": "#facc15", "yellow": "#facc15",
  "برتقالي": "#ea580c", "أورنج": "#ea580c", "اورنج": "#ea580c", "orange": "#ea580c",
  "مستردة": "#ca8a04", "خردلي": "#ca8a04", "mustard": "#ca8a04",
  "ذهبي": "#d4af37", "جولد": "#d4af37", "gold": "#d4af37",

  // --- البنيات والبيج ---
  "بني": "#451a03", "brown": "#451a03", "شوكلت": "#451a03",
  "بيج": "#f5f5dc", "beige": "#f5f5dc",
  "كريمي": "#fffdd0", "cream": "#fffdd0",
  "هافان": "#92400e", "جملي": "#b45309", "camel": "#b45309",
  "كافيه": "#6F4E37", "خاكي": "#bdb76b", "khaki": "#bdb76b",

  // --- الموف والوردي ---
  "بنفسجي": "#7c3aed", "موف": "#7c3aed", "purple": "#7c3aed",
  "أرجواني": "#7c3aed", "ارجواني": "#7c3aed",
  "وردي": "#db2777", "بينك": "#db2777", "pink": "#db2777",
  "بمبي": "#ff69b4", "فوشيا": "#ff00ff", "fuchsia": "#ff00ff",
  "سيمون": "#FF8C69", "salmon": "#FF8C69",

  // --- ألوان الموضة (Trendy) ---
  "فيروزي": "#06b6d4", "تركواز": "#06b6d4", "turquoise": "#06b6d4",
  "تيفاني": "#0ABAB5", "tiffany": "#0ABAB5",
  "ليموني": "#bef264", "lime": "#bef264"
  };
const BundleSelectionModal = ({ bundle, isOpen, onClose, isAr }) => {
  const { addBundleToCart } = useCart();
  const { darkMode } = useTheme();

  // قاموس الألوان الذكي (عربي وانجليزي) لضمان ظهور اللون الحقيقي في الدائرة
 

  const [selections, setSelections] = useState(() => 
    bundle.items.map(item => ({
      product: item.product?._id,
      name: item.product?.name,
      variantId: '',
      size: '',
      color: '',
      image: ''
    }))
  );

  if (!isOpen) return null;

  const handleSelectVariant = (index, variant, product) => {
    const newSelections = [...selections];
    newSelections[index] = {
      ...newSelections[index],
      variantId: variant?._id,
      size: variant.options.Size || '',
      color: variant.options.Color || '',
      image: variant.images?.[0]?.url || product.images?.[0]?.url
    };
    setSelections(newSelections);
  };

  const handleConfirm = () => {
    const allSelected = selections.every(s => s.variantId !== '');
    if (!allSelected) {
      alert(isAr ? 'برجاء اختيار المقاس واللون لكل المنتجات' : 'Please select size and color for all products');
      return;
    }
    addBundleToCart(bundle, selections, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" dir={isAr ? 'rtl' : 'ltr'}>
     <div className={`w-full max-w-xl rounded-2xl overflow-hidden max-h-[85vh] flex flex-col border 
  ${darkMode ? "bg-[#141414] border-white/10" : "bg-white border-gray-200"}`}>

  {/* Header */}
  <div className={`p-4 border-b flex justify-between items-center 
    ${darkMode ? "border-white/10" : "border-gray-200"}`}>

    <div>
      <h2 className={`text-lg font-bold ${
        darkMode ? "text-white" : "text-gray-900"
      }`}>
        {bundle?.name}
      </h2>

      <p className="text-xs text-gray-500 mt-1">
        {isAr ? 'اختار الباكدج' : 'Customize bundle'}
      </p>
    </div>

    <button 
      onClick={onClose} 
      className={`p-2 rounded-full ${
        darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <IoClose size={16} />
    </button>
  </div>

  {/* Products */}
  <div className="p-4 overflow-y-auto space-y-8 flex-1">

    {bundle.items.map((item, idx) => {
      const groupedVariants = item.product.variants.reduce((acc, v) => {
        const color = v.options.Color;
        if (!acc[color]) acc[color] = [];
        acc[color].push(v);
        return acc;
      }, {});

      return (
        <div key={idx}>
          
          {/* Product */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img 
                src={item.product.images?.[0]?.url} 
                className="w-14 h-16 rounded-lg object-cover border border-black/10 dark:border-white/10" 
              />
              <span className="absolute -top-1 -right-1 bg-red-700 text-white w-5 h-5 text-[10px] rounded-full flex items-center justify-center">
                {idx + 1}
              </span>
            </div>

            <h4 className={`text-sm font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              {item.product?.name}
            </h4>
          </div>

          {/* Variants */}
          <div className="space-y-5">
            {Object.entries(groupedVariants).map(([colorName, variants]) => (
              <div key={colorName}>

                {/* Color */}
                <div className="flex items-center gap-2 mb-2">

                  {/* 🔥 صورة داخل دايرة */}
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
                    <img
                      src={
                        variants?.find(v => v.images?.[0]?.url)?.images?.[0]?.url ||
                        item.product.images?.[0]?.url
                      }
                      className="w-full h-full object-cover"
                      alt={colorName}
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-medium">
                      {colorName}
                    </span>

                    <span className="text-[10px] text-gray-500">
                      From {Math.min(...variants.map(v => v.price))} EGP
                    </span>
                  </div>
                </div>

                {/* Sizes */}
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v._id}
                      disabled={v.stock <= 0}
                      onClick={() => handleSelectVariant(idx, v, item.product)}
                      className={`px-3 py-2 text-xs rounded-lg border ${
                        selections[idx].variantId === v._id
                          ? 'bg-red-700 text-white border-red-700'
                          : 'border-gray-300 text-gray-500'
                      } ${v.stock <= 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      {v.options.Size}

                      {v.stock <= 5 && v.stock > 0 && (
                        <span className="ml-1 text-[9px] opacity-60">
                          ({v.stock})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      );
    })}

  </div>

  {/* Footer */}
  <div className={`p-4 border-t flex justify-between items-center 
    ${darkMode ? "border-white/10" : "border-gray-200"}`}>

    <div>
      <span className="text-xs text-gray-500">
        {isAr ? 'السعر' : 'Total'}
      </span>

      <div className={`text-lg font-bold ${
        darkMode ? "text-white" : "text-black"
      }`}>
        {bundle.bundlePrice} EGP
      </div>
    </div>

    <button
      onClick={handleConfirm}
      className="px-5 py-3 bg-red-700 text-white rounded-lg text-sm font-bold hover:scale-[1.02] active:scale-95 transition"
    >
      {isAr ? 'تأكيد' : 'Confirm'}
    </button>

  </div>
</div>
    </div>
  );
};

export default BundleSelectionModal;


