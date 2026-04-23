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
