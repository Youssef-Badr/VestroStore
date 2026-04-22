// /* eslint-disable no-unused-vars */
// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiX, FiCheckCircle } from "react-icons/fi";
// import { useCart } from "../contexts/CartContext"; // عدل الباث لو مختلف
// import api from "../api/axiosInstance";
// const colorMap = {
//      // --- الأبيض والأسود ---
//   "أبيض": "#FFFFFF", "ابيض": "#FFFFFF", "وايت": "#FFFFFF", "white": "#FFFFFF", "اوف وايت": "#FAF9F6", "أوف وايت": "#FAF9F6", "off-white": "#FAF9F6",
//   "أسود": "#121212", "اسود": "#121212","اسود مضلع" : "#121212" , "أسود مضلع" : "#121212", "بلاك": "#121212", "black": "#121212", "فحمي": "#374151", "charcoal": "#374151",

//   // --- الرماديات ---
//   "رمادي": "#6b7280", "رصاصي": "#6b7280", "جراي": "#6b7280", "gray": "#6b7280", "grey": "#6b7280",
//   "فضي": "#d1d5db", "سيلفر": "#d1d5db", "silver": "#d1d5db" ,"داكن": "#4b5563", "غامق": "#4b5563", "dark": "#4b5563" , "فراني": "#9ca3af", "فاتح": "#9ca3af", "light": "#9ca3af",

//   // --- الأحمر والنبيتي ---
//   "أحمر": "#e11d48", "احمر": "#e11d48", "red": "#e11d48",
//   "نبيتي": "#7f1d1d", "مارون": "#7f1d1d", "maroon": "#7f1d1d", "بورجوندي": "#800020",
//   "طوبي": "#991b1b", "brick": "#991b1b",

//   // --- الأزرق والكحلي ---
//   "أزرق": "#2563eb", "ازرق": "#2563eb", "blue": "#2563eb",
//   "كحلي": "#1e3a8a", "نيفي": "#1e3a8a", "navy": "#1e3a8a",
//   "سماوي": "#0ea5e9", "لبني": "#7dd3fc", "sky blue": "#7dd3fc",
//   "بترولي": "#005F69", "petrol": "#005F69",

//   // --- الأخضر والزيتي ---
//   "أخضر": "#16a34a", "اخضر": "#16a34a", "green": "#16a34a",
//   "زيتي": "#3f6212", "زيتوني": "#3f6212", "olive": "#3f6212",
//   "فسفوري": "#86FE05", "فوسفوري": "#86FE05", "neon": "#86FE05",
//   "منت": "#a7f3d0", "مينت": "#a7f3d0", "mint": "#a7f3d0",

//   // --- الأصفر والبرتقالي ---
//   "أصفر": "#facc15", "اصفر": "#facc15", "yellow": "#facc15",
//   "برتقالي": "#ea580c", "أورنج": "#ea580c", "اورنج": "#ea580c", "orange": "#ea580c",
//   "مستردة": "#ca8a04", "خردلي": "#ca8a04", "mustard": "#ca8a04",
//   "ذهبي": "#d4af37", "جولد": "#d4af37", "gold": "#d4af37",

//   // --- البنيات والبيج ---
//   "بني": "#451a03", "brown": "#451a03", "شوكلت": "#451a03",
//   "بيج": "#f5f5dc", "beige": "#f5f5dc",
//   "كريمي": "#fffdd0", "cream": "#fffdd0",
//   "هافان": "#92400e", "جملي": "#b45309", "camel": "#b45309",
//   "كافيه": "#6F4E37", "خاكي": "#bdb76b", "khaki": "#bdb76b",

//   // --- الموف والوردي ---
//   "بنفسجي": "#7c3aed", "موف": "#7c3aed", "purple": "#7c3aed",
//   "أرجواني": "#7c3aed", "ارجواني": "#7c3aed",
//   "وردي": "#db2777", "بينك": "#db2777", "pink": "#db2777",
//   "بمبي": "#ff69b4", "فوشيا": "#ff00ff", "fuchsia": "#ff00ff",
//   "سيمون": "#FF8C69", "salmon": "#FF8C69",

//   // --- ألوان الموضة (Trendy) ---
//   "فيروزي": "#06b6d4", "تركواز": "#06b6d4", "turquoise": "#06b6d4",
//   "تيفاني": "#0ABAB5", "tiffany": "#0ABAB5",
//   "ليموني": "#bef264", "lime": "#bef264"
//   };

// const ProductQuickView = ({ product, isOpen, onClose, darkMode, language }) => {
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [fullProduct, setFullProduct] = useState(null);
//   const { addToCart } = useCart();

//   const isRTL = language === "ar";

//   // ✅ Fetch full product when modal opens
//   useEffect(() => {
//     if (!product?._id || !isOpen) return;

//     const fetchFullProduct = async () => {
//       try {
//         const res = await api.get(`/products/${product._id}`);
//         console.log("🔥 FULL PRODUCT:", res.data);
//         setFullProduct(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching full product:", err);
//       }
//     };

//     fetchFullProduct();
//   }, [product, isOpen]);

//   // ✅ Extract sizes & colors safely
//   const { sizes, colors } = useMemo(() => {
//     if (!fullProduct?.options) {
//       console.log("❌ No options found");
//       return { sizes: [], colors: [] };
//     }

//     console.log("🔥 OPTIONS:", fullProduct.options);

//     const sizeOption = fullProduct.options.find(
//       (opt) => opt.name.toLowerCase() === "size"
//     );

//     const colorOption = fullProduct.options.find(
//       (opt) => opt.name.toLowerCase() === "color"
//     );

//     return {
//       sizes: sizeOption?.values || [],
//       colors: colorOption?.values || [],
//     };
//   }, [fullProduct]);

//   const handleAddToCart = () => {
//   if (!selectedSize || !selectedColor) {
//     alert(isRTL ? "اختار المقاس واللون الأول" : "Select size & color first");
//     return;
//   }

//   // 🔥 نجيب الـ variant الصح
//   const selectedVariant = fullProduct?.variants?.find(
//     (v) =>
//       v.options?.Size === selectedSize &&
//       v.options?.Color === selectedColor
//   );

//   if (!selectedVariant) {
//     alert("Variant not found");
//     return;
//   }

//   // ✅ استدعاء الكارت الحقيقي
//   addToCart(fullProduct, selectedVariant, 1);

//   onClose();
// };

// const getColorImage = (color) => {
//   const variant = product.variants?.find(
//     (v) => v.options?.Color === color
//   );

//   return variant?.images?.[0]?.url || product.images?.[0]?.url;
// };

//   if (!product) return null;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pt-10">
          
//           {/* Overlay */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="absolute inset-0 bg-black/80 backdrop-blur-md"
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             className={`relative w-full max-w-md rounded-[2rem] p-6 ${
//               darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
//             }`}
//           >
//             {/* Close */}
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4"
//             >
//               <FiX size={20} />
//             </button>

//             <h3 className="text-xl font-bold mb-4 text-center">
//               {fullProduct?.name || product.name}
//             </h3>
//             <div className="text-center mb-4">
//   <p className="text-lg font-bold text-black dark:text-white">
//     {fullProduct?.price || product.price}{" "}
//     <span className="text-s opacity-60">
//       {isRTL ? "ج.م" : "EGP"}
//     </span>
//   </p>
// </div>

//             {/* Sizes */}
//             <div className="mb-4">
//               <p className="text-xs mb-2">
//                 {isRTL ? "المقاس" : "Size"}
//               </p>

//               <div className="flex gap-2 flex-wrap">
//                 {sizes.length > 0 ? (
//                   sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`px-3 py-1 border rounded ${
//                         selectedSize === size
//                           ? "bg-[#86FE05] text-black"
//                           : ""
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))
//                 ) : (
//                   <p className="text-gray-400 text-sm">
//                     No sizes found
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Colors */}
//             <div className="mb-6">
//               <p className="text-xs mb-2">
//                 {isRTL ? "اللون" : "Color"}
//               </p>

//          <div className="flex gap-4 flex-wrap">
//   {colors.length > 0 ? (
//     colors.map((color) => {

//       // 👇 هات أول variant مطابق للون ده
//       const variant = product.variants?.find(
//         (v) => v.options?.Color === color
//       );

//       // 👇 صورة اللون من الـ backend
//       const colorImage =
//         variant?.images?.[0]?.url ||
//         product.images?.[0]?.url; // fallback

//       return (
//         <div
//           key={color}
//           onClick={() => setSelectedColor(color)}
//           className="flex flex-col items-center cursor-pointer group"
//         >

//           {/* 🔥 الدائرة فيها صورة اللون */}
//           <div
//             className={`w-11 h-11 rounded-full border-4 overflow-hidden transition-all flex items-center justify-center
//               ${
//                 selectedColor === color
//                   ? "border-[#86FE05] scale-110 shadow-lg"
//                   : "border-transparent group-hover:scale-105"
//               }`}
//           >
//             <img
//               src={colorImage}
//               alt={color}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* اسم اللون */}
//           <span
//             className={`text-xs mt-2 font-bold transition-all
//               ${
//                 selectedColor === color
//                   ? "text-[#86FE05]"
//                   : "text-gray-400 group-hover:text-white"
//               }`}
//           >
//             {color}
//           </span>

//         </div>
//       );
//     })
//   ) : (
//     <p className="text-gray-400 text-sm">No colors found</p>
//   )}
// </div>
//             </div>

//             {/* Button */}
//             <button
//               onClick={handleAddToCart}
//               className="w-full bg-[#86FE05] text-black py-3 rounded-xl flex items-center justify-center gap-2"
//             >
//               <FiCheckCircle />{" "}
//               {isRTL ? "إضافة للسلة" : "Add to Cart"}
//             </button>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ProductQuickView;



/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZap } from "react-icons/fi"; 
import { useCart } from "../contexts/CartContext"; 
import api from "../api/axiosInstance";

const ProductQuickView = ({ product, isOpen, onClose, darkMode, language }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [fullProduct, setFullProduct] = useState(null);
  const { addToCart } = useCart();
  const isRTL = language === "ar";

  useEffect(() => {
    if (!product?._id || !isOpen) return;
    const fetchFullProduct = async () => {
      try {
        const res = await api.get(`/products/${product._id}`);
        setFullProduct(res.data);
        setSelectedSize("");
        setSelectedColor("");
      } catch (err) {
        console.error("❌ Error fetching full product:", err);
      }
    };
    fetchFullProduct();
  }, [product, isOpen]);

  const { sizes, colors } = useMemo(() => {
    if (!fullProduct?.options) return { sizes: [], colors: [] };
    const sizeOption = fullProduct.options.find(opt => opt.name.toLowerCase() === "size");
    const colorOption = fullProduct.options.find(opt => opt.name.toLowerCase() === "color");
    return {
      sizes: sizeOption?.values || [],
      colors: colorOption?.values || [],
    };
  }, [fullProduct]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    const selectedVariant = fullProduct?.variants?.find(
      (v) => v.options?.Size === selectedSize && v.options?.Color === selectedColor
    );

    if (selectedVariant) {
      addToCart(fullProduct, selectedVariant, 1);
      onClose();
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 z-[160] ${
              darkMode ? "bg-[#0A0A0A] text-white" : "bg-white text-black"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[170] p-2 rounded-full bg-zinc-800/50 text-white hover:bg-red-800 hover:text-black transition-all"
            >
              <FiX size={20} />
            </button>

            <div className="p-8">
              {/* Product Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-2 leading-tight">
                  {fullProduct?.name || product.name}
                </h3>
                <p className="text-black dark:text-white text-xl font-black italic">
                  {fullProduct?.price || product.price} <span className="text-xs uppercase">{isRTL ? "ج.م" : "EGP"}</span>
                </p>
              </div>

              {/* Colors Grid */}
              <div className="mb-8">
                <p className="text-[15px] font-black uppercase  mb-4  text-center">
                  {isRTL ? "اختر اللون" : "Select Color"}
                </p>
                <div className="flex gap-4 flex-wrap justify-center">
                  {colors.map((color) => {
                    const variant = fullProduct?.variants?.find(v => v.options?.Color === color);
                    const colorImage = variant?.images?.[0]?.url || product.images?.[0]?.url;

                    return (
                      <div
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className={`w-14 h-14 rounded-full border-2 transition-all duration-300 overflow-hidden shadow-lg ${
                          selectedColor === color ? "border-red-800 scale-110 " : "border-white/5"
                        }`}>
                          <img src={colorImage} alt={color} className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-[13px] mt-2 font-black uppercase  ${selectedColor === color ? "text-black dark:text-white" : "text-zinc-500"}`}>
                          {color}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sizes Grid */}
              <div className="mb-10">
                <p className="text-[15px] font-black uppercase  mb-4  text-center">
                  {isRTL ? "المقاس" : "Size"}
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[60px] py-3 px-4 rounded-xl font-black text-xs transition-all border-2 ${
                        selectedSize === size
                          ? "bg-red-700 border-black text-black scale-105"
                          : "border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="w-full bg-white text-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
              >
                <FiZap className="fill-current" />
                <span className="font-[1000] uppercase italic tracking-widest text-sm border-1">
                  {isRTL ? "تأكيد وإضافة للسلة" : "Confirm & Add"}
                </span>
              </button>
            </div> {/* End of p-8 */}
          </motion.div> {/* End of motion.div Modal */}
        </div> /* End of absolute container */
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
