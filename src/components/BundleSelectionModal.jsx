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
      <div className={`w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border transition-colors duration-500 ${
        darkMode ? "bg-[#1A1A1A] border-white/10" : "bg-white border-slate-100"
      }`}>
        
        {/* Header */}
        <div className={`p-8 border-b flex justify-between items-center transition-colors ${
          darkMode ? "border-gray-800 bg-[#1A1A1A]" : "border-slate-100 bg-white"
        }`}>
          <div>
            <h2 className={`text-2xl font-black uppercase tracking-tight transition-colors ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              {bundle?.name}
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {isAr ? 'صمم باقتك على ذوقك' : 'Customize your bundle'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className={`p-3 transition-all duration-300 rounded-full hover:rotate-90 ${
              darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Products List */}
        <div className="p-8 overflow-y-auto space-y-12 flex-1 custom-scrollbar">
          {bundle.items.map((item, idx) => {
            const groupedVariants = item.product.variants.reduce((acc, v) => {
              const color = v.options.Color;
              if (!acc[color]) acc[color] = [];
              acc[color].push(v);
              return acc;
            }, {});

            return (
              <div key={idx} className="relative">
                {/* Product Info Row */}
                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <img 
                      src={item.product.images?.[0]?.url} 
                      alt="" 
                      className="w-20 h-24 rounded-2xl object-cover shadow-lg border dark:border-white/10" 
                    />
                    <span className="absolute -top-2 -right-2 bg-[#86FE05] text-black w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-md border-2 border-white dark:border-[#1A1A1A]">
                      {idx + 1}
                    </span>
                  </div>
                  <h4 className={`font-black text-lg uppercase italic ${
                    darkMode ? "text-gray-100" : "text-gray-800"
                  }`}>
                    {item.product?.name}
                  </h4>
                </div>

                {/* Colors & Sizes Area */}
                <div className="space-y-8 pl-2">
                  {Object.entries(groupedVariants).map(([colorName, variants]) => {
                    // تحديد اللون النهائي للدائرة
                    const finalColor = colorMap[colorName.toLowerCase().trim()] || variants[0].colorCode || '#555';
                    const isWhite = colorName.toLowerCase().trim() === 'أبيض' || colorName.toLowerCase().trim() === 'white';

                    return (
                      <div key={colorName} className="space-y-4">
                        {/* Color Selector Header */}
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 shadow-sm ${
                              isWhite ? 'border-gray-300' : 'border-white/20'
                            }`}
                            style={{ 
                              backgroundColor: finalColor,
                              boxShadow: !isWhite ? `0 0 10px ${finalColor}44` : 'none'
                            }} 
                          />
                          <span className={`text-[11px] font-black uppercase tracking-widest ${
                            darkMode ? 'text-[#86FE05]' : 'text-black'
                          }`}>
                            {colorName}
                          </span>
                        </div>

                        {/* Sizes Grid */}
                        <div className="flex flex-wrap gap-2">
                          {variants.map((v) => (
                            <button
                              key={v?._id}
                              disabled={v.stock <= 0}
                              onClick={() => handleSelectVariant(idx, v, item.product)}
                              className={`group relative px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold text-sm ${
                                selections[idx].variantId === v?._id
                                  ? 'border-[#86FE05] bg-[#86FE05] text-black shadow-[0_0_15px_rgba(134,254,5,0.3)]'
                                  : 'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                              } ${v.stock <= 0 ? 'opacity-20 cursor-not-allowed' : 'active:scale-90'}`}
                            >
                              {v.options.Size}
                              {v.stock <= 5 && v.stock > 0 && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse font-black shadow-lg">
                                  {v.stock}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-8 border-t flex items-center justify-between transition-colors ${
          darkMode ? "border-gray-800 bg-[#1A1A1A]" : "border-slate-100 bg-white"
        }`}>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">
              {isAr ? 'السعر النهائي' : 'Bundle Total'}
            </span>
            <div className={`text-3xl font-black transition-colors ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              {bundle.bundlePrice} <span className="text-sm font-medium opacity-60 ms-1">{isAr ? 'ج.م' : 'EGP'}</span>
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-tighter hover:scale-105 transition-all active:scale-95 shadow-xl ${
              darkMode 
                ? "bg-[#86FE05] text-black shadow-[#86FE05]/20" 
                : "bg-black text-white shadow-black/20"
            }`}
          >
            {isAr ? 'تأكيد الطلب' : 'Confirm Bundle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BundleSelectionModal;


