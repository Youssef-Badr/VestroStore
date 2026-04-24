 
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useCart } from '../../src/contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext'; // تأكد من المسار الصحيح للثيم
 const getThumb = (url, size = 60) => {
  if (!url?.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`
  );
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
  getThumb(
    variants?.find(v => v.images?.[0]?.url)?.images?.[0]?.url ||
    item.product.images?.[0]?.url,
    80
  )
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


