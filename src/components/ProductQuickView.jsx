/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZap } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import api from "../api/axiosInstance";

const getImage = (url, size = 120) => {
  if (!url) return "";
  if (!url.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`
  );
};
const productCache = new Map();



const ProductQuickView = ({
  product,
  isOpen,
  onClose,
  darkMode,
  language,
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [fullProduct, setFullProduct] = useState(null);

  const mountedRef = useRef(false);

  const { addToCart } = useCart();
  const isRTL = language === "ar";

  /* ===============================
     OPEN FAST + CACHE + FETCH
  =============================== */
  useEffect(() => {
    mountedRef.current = true;

    if (!product?._id || !isOpen) return;

    setSelectedSize("");
    setSelectedColor("");

    // افتح فوراً ببيانات الكارد
    setFullProduct(product);

    // لو موجود في الكاش
    if (productCache.has(product._id)) {
      setFullProduct(productCache.get(product._id));
      return;
    }

    let cancelled = false;

    const fetchFullProduct = async () => {
      try {
        const res = await api.get(`/products/${product._id}`);

        if (cancelled || !mountedRef.current) return;

        productCache.set(product._id, res.data);
        setFullProduct(res.data);
      } catch (err) {
        console.error("❌ Error fetching full product:", err);
      }
    };

    fetchFullProduct();

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [product, isOpen]);

  /* ===============================
     OPTIONS MEMO
  =============================== */
  const { sizes, colors } = useMemo(() => {
    if (!fullProduct?.options)
      return { sizes: [], colors: [] };

    const sizeOption = fullProduct.options.find(
      (opt) => opt.name?.toLowerCase() === "size"
    );

    const colorOption = fullProduct.options.find(
      (opt) => opt.name?.toLowerCase() === "color"
    );

    return {
      sizes: sizeOption?.values || [],
      colors: colorOption?.values || [],
    };
  }, [fullProduct]);

  /* ===============================
     COLOR IMAGES PRELOAD
  =============================== */
  useEffect(() => {
    if (!isOpen || !colors.length || !fullProduct?.variants) return;

    colors.forEach((color) => {
      const variant = fullProduct.variants.find(
        (v) => v.options?.Color === color
      );

      const img = new Image();
      img.src = getImage(
        variant?.images?.[0]?.url ||
          product?.images?.[0]?.url,
        300
      );
    });
  }, [isOpen, colors, fullProduct, product]);

  /* ===============================
     ADD TO CART
  =============================== */
  const handleAddToCart = useCallback(() => {
    if (!selectedSize || !selectedColor) return;

    const selectedVariant = fullProduct?.variants?.find(
      (v) =>
        v.options?.Size === selectedSize &&
        v.options?.Color === selectedColor
    );

    if (selectedVariant) {
      addToCart(fullProduct, selectedVariant, 1);
      onClose();
    }
  }, [
    selectedSize,
    selectedColor,
    fullProduct,
    addToCart,
    onClose,
  ]);

  if (!product) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.22 }}
            className={`relative z-[160] w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 ${
              darkMode
                ? "bg-[#0A0A0A] text-white"
                : "bg-white text-black"
            }`}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[170] p-2 rounded-full bg-zinc-800/50 text-white hover:bg-red-700 hover:text-black transition-all"
            >
              <FiX size={20} />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-[1000] uppercase mb-2 leading-tight">
                  {fullProduct?.name || product?.name}
                </h3>

                <p className="text-xl font-black">
                  {fullProduct?.price || product?.price}{" "}
                  <span className="text-xs uppercase">
                    {isRTL ? "ج.م" : "EGP"}
                  </span>
                </p>
              </div>

              {/* Colors */}
              <div className="mb-8">
                <p className="text-[15px] font-black uppercase mb-4 text-center">
                  {isRTL ? "اختر اللون" : "Select Color"}
                </p>

                <div className="flex gap-4 flex-wrap justify-center">
                  {colors.map((color) => {
                    const variant =
                      fullProduct?.variants?.find(
                        (v) => v.options?.Color === color
                      );

                    const colorImage = getImage(
                      variant?.images?.[0]?.url ||
                        product?.images?.[0]?.url,
                      120
                    );

                    return (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedColor(color)
                        }
                        className="flex flex-col items-center group"
                      >
                        <div
                          className={`w-14 h-14 rounded-full border-2 overflow-hidden shadow-lg transition-all duration-200 ${
                            selectedColor === color
                              ? "border-red-700 scale-110"
                              : "border-white/10"
                          }`}
                        >
                          <img
                            src={getImage(colorImage, 200)}
                            alt={color}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <span
                          className={`text-[13px] mt-2 font-black uppercase ${
                            selectedColor === color
                              ? "text-black dark:text-white"
                              : "text-zinc-500"
                          }`}
                        >
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-10">
                <p className="text-[15px] font-black uppercase mb-4 text-center">
                  {isRTL ? "المقاس" : "Size"}
                </p>

                <div className="flex gap-2 flex-wrap justify-center">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(size)
                      }
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

              {/* Confirm */}
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedSize || !selectedColor
                }
                className="w-full bg-white text-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
              >
                <FiZap className="fill-current" />

                <span className="font-[1000] uppercase text-sm">
                  {isRTL
                    ? "تأكيد وإضافة للسلة"
                    : "Confirm & Add"}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;