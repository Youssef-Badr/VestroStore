 
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { fbqTrack } from "../utils/fbq";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 📦 تحميل السلة من التخزين المحلي
  const [cart, setCart] = useState(() => {
    try {
      const storedData = localStorage.getItem("cart");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        return parsed.items || [];
      }
    } catch (e) {
      console.error("❌ Error loading cart from localStorage", e);
    }
    return [];
  });

  // 💾 حفظ السلة تلقائياً عند أي تغيير
  useEffect(() => {
    if (cart.length > 0) {
      const data = {
        items: cart,
        expiry: Date.now() + 24 * 60 * 60 * 1000,
      };
      localStorage.setItem("cart", JSON.stringify(data));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🎯 1. إضافة منتج عادي للسلة
  const addToCart = (product, selectedVariant, qty) => {
    if (!product || !selectedVariant) return;
    const size =
    selectedVariant.options?.Size ||
    selectedVariant.options?.get?.("Size");

  const color =
    selectedVariant.options?.Color ||
    selectedVariant.options?.get?.("Color");

  // ❌ منع الإضافة لو ناقص اختيار
  if (!size || !color) {
    toast.error("من فضلك اختر المقاس واللون");
    return;
  }

    const vId = selectedVariant._id || selectedVariant.id;
    const stockAvailable = selectedVariant.stock ?? 0;

    const existingItem = cart.find((item) => item.variantId === vId);
    const currentQtyInCart = existingItem ? existingItem.qty : 0;
    const newTotalQty = currentQtyInCart + Number(qty);

    if (newTotalQty > stockAvailable) {
      toast.error(`عذراً، المتاح ${stockAvailable} فقط.`, {
        toastId: `stock-error-${vId}`,
      });
      return;
    }

    setCart((prev) => {
      const existIndex = prev.findIndex((item) => item.variantId === vId);
      if (existIndex !== -1) {
        const updatedCart = [...prev];
        updatedCart[existIndex] = { ...updatedCart[existIndex], qty: newTotalQty };
        return updatedCart;
      } else {
        const newItem = {
          product: product._id || product.id,
          variantId: vId,
          name: product.name,
          price: selectedVariant.price || product.price,
          size: selectedVariant.options?.Size || selectedVariant.options?.get?.("Size") || "",
          color: selectedVariant.options?.Color || selectedVariant.options?.get?.("Color") || "",
          image: selectedVariant.images?.[0]?.url || product.images?.[0]?.url || "",
          qty: Number(qty),
          maxStock: stockAvailable,
          isBundle: false, // تمييز النوع
        };
        return [...prev, newItem];
      }
    });
  fbqTrack("track", "AddToCart", {
  content_ids: [product._id.toString()],

  content_name: product.name,

  content_type: "product",

  value: Number(selectedVariant?.price || product.price || 0),

  currency: "EGP",

  quantity: Number(qty || 1),

  contents: [
    {
      id: product._id.toString(), // ✅ مهم جدًا
      quantity: Number(qty || 1),
      item_price: Number(selectedVariant?.price || product.price || 0)
    }
  ]
});

    setIsCartOpen(true);
    toast.success("تم إضافة المنتج للسلة");
  };

  // 🎁 2. إضافة باكدج (Bundle) للسلة
  const addBundleToCart = (bundle, selections, qty = 1) => {
    if (!bundle || !selections) return;

    // توليد ID فريد بناءً على الاختيارات (عشان لو اختار نفس الباكدج بمقاسات تانية ينزل سطر جديد)
    const selectionKey = selections.map((s) => s.variantId).join("-");
    const uniqueId = `${bundle._id}-${selectionKey}`;

    setCart((prev) => {
      const existIndex = prev.findIndex((item) => item.uniqueId === uniqueId);

      if (existIndex !== -1) {
        const updatedCart = [...prev];
        updatedCart[existIndex] = {
          ...updatedCart[existIndex],
          qty: updatedCart[existIndex].qty + Number(qty),
        };
        return updatedCart;
      } else {
        const newBundleItem = {
  uniqueId: uniqueId,
  bundle: bundle._id,
  isBundle: true,
  name: bundle.name,
  // بدل ما ناخد صورة واحدة للباكدج، هنعتمد على صور المنتجات اللي جواها
  price: bundle.bundlePrice,
  qty: Number(qty),
  bundleItems: selections.map((sel) => ({
    product: sel.product,
    variantId: sel.variantId,
    name: sel.name,
    color: sel.color,
    size: sel.size,
    image: sel.image, // 👈 تأكد إن السطر ده موجود عشان ياخد صورة الـ Variant المختار
  })),
};
        return [...prev, newBundleItem];
      }
    });

fbqTrack("track", "AddToCart", {
  content_ids: bundle.items.map(i => i.product._id.toString()),

  content_name: bundle.name,

  content_type: "product_group", // ✅ مهم جدًا

  value: bundle.bundlePrice,

  currency: "EGP",

  quantity: qty,

  contents: bundle.items.map(item => ({
    id: item.product._id.toString(), // ✅ مهم تكون string
    quantity: 1,
    item_price: Number(item.product.price || 0)
  }))
});

    setIsCartOpen(true);
    toast.success(`تم إضافة ${bundle.name} للسلة`);
  };

  // 🗑️ 3. حذف منتج أو باكدج من السلة
  // const removeFromCart = (id) => {
  //   // نحذف بالـ uniqueId لو باكدج، وبالـ variantId لو منتج عادي
  //   setCart((prev) =>
  //     prev.filter((item) => (item.isBundle ? item.uniqueId !== id : item.variantId !== id))
  //   );
  // };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => {
        // لو باكدج هنقارن بالـ uniqueId، لو منتج عادي هنقارن بالـ variantId
        const itemId = item.isBundle ? item.uniqueId : item.variantId;
        return itemId !== id;
      })
    );
  };
  // 🔄 4. تحديث الكمية
  // const updateQty = (id, qty, stockFromServer) => {
  //   if (qty < 1) return;

  //   setCart((prev) =>
  //     prev.map((item) => {
  //       const isTarget = item.isBundle ? item.uniqueId === id : item.variantId === id;
  //       if (isTarget) {
  //         const limit = stockFromServer ?? item.maxStock ?? 999;
  //         if (Number(qty) > limit) {
  //           toast.warn(`المتاح ${limit} فقط`, { toastId: "limit" });
  //           return { ...item, qty: limit };
  //         }
  //         return { ...item, qty: Number(qty) };
  //       }
  //       return item;
  //     })
  //   );
  // };


  const updateQty = (id, qty, stockFromServer) => {
    if (qty < 1) return;

    setCart((prev) =>
      prev.map((item) => {
        const itemId = item.isBundle ? item.uniqueId : item.variantId;
        
        if (itemId === id) {
          // بالنسبة للباكدج، ممكن نضع ليميت عالي أو نحسب أقل مخزون في منتجاته (اختياري)
          // حالياً هنخلي الليميت هو المتاح من السيرفر أو الماكس ستوك المخزن
          const limit = stockFromServer ?? item.maxStock ?? 99; 

          if (Number(qty) > limit) {
            toast.warn(`عذراً، المتاح ${limit} فقط`, { toastId: "limit" });
            return { ...item, qty: limit };
          }
          return { ...item, qty: Number(qty) };
        }
        return item;
      })
    );
  };

  // 🧹 5. مسح السلة
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addBundleToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);