/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import BundleCard from "./BundleCard";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

const ProductBundlesSection = ({ currentProductId }) => { // 🔥 استقبل الـ ID هنا
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const isAr = language === "ar";

  const [bundles, setBundles] = useState([]);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await api.get("/bundles");
        const raw = res.data.bundles || res.data;

       const filtered = raw.filter((bundle) => {
  // 1. التأكد أن الباندل نشط
  const isActive = bundle.isActive;
  
  // 2. هل المنتج الحالي موجود ضمن "المنتجات المرتبطة"؟
  const isRelated = bundle.relatedProduct?.some(rp => 
    (rp._id === currentProductId) || (rp === currentProductId)
  );

  // 3. هل المنتج الحالي هو جزء من "مكونات الباندل" نفسه؟
  const isInsideBundle = bundle.items?.some(item => 
    (item.product?._id === currentProductId) || (item.product === currentProductId)
  );

  // إظهار الباندل لو كان نشط وتحقق أي من الشرطين
  return isActive && (isRelated || isInsideBundle);
});
        setBundles(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    if (currentProductId) {
      fetchBundles();
    }
  }, [currentProductId]); // 🔥 خليه يشتغل لما الـ ID يتغير

  // لو مفيش باندلز ريليتد للمنتج ده، متظهرش السكشن خالص
  if (!bundles.length) return null;

  return (
    <div className="mt-20">
      {/* الـ Header وباقي الكود بتاعك زي ما هو */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-black">
            {isAr ? "عروض فيسترو 🔥" : "Vestro Offers 🔥"}
          </h2>
          <p className="text-sm text-gray-500">
            {isAr ? "عروض حصرية لهذا المنتج" : "Exclusive deals for this product"}
          </p>
        </div>
        <Link to="/bundles" className="text-sm font-bold px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black hover:text-white transition">
          {isAr ? "عرض الكل" : "View All"}
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {bundles.map((bundle) => (
          <div key={bundle._id} className="min-w-[280px]">
            <BundleCard bundle={bundle} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductBundlesSection;