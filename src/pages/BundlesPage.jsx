/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import BundleCard from '../components/BundleCard';
import BundleSelectionModal from '../components/BundleSelectionModal'; 
import { LayoutGrid, RefreshCcw } from 'lucide-react';
import api from '../api/axiosInstance'; 
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
// استيراد الـ Context الخاص بك
import { useLanguage } from "../../src/contexts/LanguageContext"; 
import { useTheme } from "../../src/contexts/ThemeContext";

const BundlesPage = () => {
  // استخدام الـ Hooks اللي انت بعتها بدل الـ Props
  const { language } = useLanguage();
  const { darkMode } = useTheme();
   const navigate = useNavigate();
  const isRTL = language === "ar";
  
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getBundles = async () => {
      try {
        setLoading(true);
        const res = await api.get("/bundles"); 

        if (!isMounted) return;

        const rawBundles = res.data.bundles || res.data;

        if (Array.isArray(rawBundles)) {
          // فلترة الباقات النشطة فقط
          const activeBundles = rawBundles.filter(b => b.isActive === true);
          setBundles(activeBundles);
        }
      } catch (err) {
        if (isMounted) console.error("Error fetching bundles:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getBundles();

    return () => { isMounted = false; };
  }, []);

  const handleBuyClick = (bundle) => {
    setSelectedBundle(bundle);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
      <RefreshCcw className="animate-spin text-black dark:text-red-800" size={40} />
    </div>
  );

  return (
    <div 
      className={`min-h-screen bg-[#FDFDFD] dark:bg-[#050505] pt-20 mt-10 pb-20 px-4 transition-colors duration-500 ${isRTL ? 'font-cairo' : ''}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto">

        <button
  onClick={() => navigate(-1)}
  className="group flex items-center gap-2 md:mt-7 px-4 py-2 rounded-full
             bg-black/5 dark:bg-white/5
             border border-black/10 dark:border-white/10
             hover:bg-black/10 dark:hover:bg-white/10
             hover:scale-[1.03]
             active:scale-95
             transition-all duration-300"
>
  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/60 dark:bg-black/40 group-hover:rotate-[-10deg] transition">
    <ArrowLeft
      size={16}
      className={isRTL ? "rotate-180" : ""}
    />
  </span>

  <span className="font-black uppercase  text-sm">
    {isRTL ? "رجوع" : "Back"}
  </span>
</button>
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mt-2 bg-black/5 dark:bg-white text-black dark:text-black px-6 py-2.5 rounded-full mb-5 text-[14px] font-black uppercase  border border-black/5 dark:border-[#86FE05]/20 shadow-sm"
          >
            <LayoutGrid size={10} />
            {isRTL ? 'عروض فيسترو الحصرية' : 'Vestro Limited Offers'}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xl md:text-7xl font-black text-black dark:text-white mb-3  uppercase"
          >
            {isRTL ? 'باقات توفير فسترو' : 'Vestro Savings Bundles'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm font-medium leading-relaxed px-4"
          >
            {isRTL 
              ? 'وفر أكتر لما تشتري باقاتنا المنسقة بعناية. خامات ممتازة وأسعار مفيش زيها.' 
              : 'Save more with our curated bundles. Premium quality at unbeatable prices.'}
          </motion.p>

          {/* Decorative Neon Line */}
          <div className="w-24 h-1.5 bg-black dark:bg-slate-200 mt-7 rounded-full " />
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <BundleCard 
                bundle={bundle} 
                isAr={isRTL} 
                darkMode={darkMode}
                onBuyNow={handleBuyClick}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Empty State */}
        {!loading && bundles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold text-xl uppercase ">
              {isRTL ? 'لا توجد عروض متاحة حالياً' : 'No Bundles Available Right Now'}
            </p>
          </div>
        )}
      </div>

      {/* Selection Modal */}
      {selectedBundle && (
        <BundleSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bundle={selectedBundle}
          isAr={isRTL}
        />
      )}

      <style jsx global>{`
        /* Vestro Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #000;
          border-radius: 20px;
        }
        .dark ::webkit-scrollbar-thumb {
          background: #86FE05;
        }

        /* Smooth Selection */
        ::selection {
          background: #86FE05;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default BundlesPage;

