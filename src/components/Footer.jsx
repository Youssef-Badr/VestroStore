/* eslint-disable no-unused-vars */
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaCcVisa, FaCcMastercard, FaShareAlt } from "react-icons/fa";
import { FiShoppingBag, FiGift, FiStar, FiTruck, FiShield, FiRefreshCw, FiInfo, FiX ,FiHome } from "react-icons/fi";
import { MdOutlinePayments } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const isRTL = language === "ar";

  const [visible, setVisible] = useState(false);
  const [showHub, setShowHub] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // === 1. مرجع لتحديد حدود الشاشة (مستحيل يخرج براها) ===
  const constraintsRef = useRef(null);

const [position, setPosition] = useState({
  x: window.innerWidth - 100, // يمين
  y: window.innerHeight - 150 // تحت
});

 const handleDragEnd = (event, info) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const margin = 20;
  const boxWidth = 80;
  const boxHeight = 80;

  // 📌 نحدد الحدود
  let newX = Math.max(margin, Math.min(info.point.x, screenWidth - boxWidth));
  let newY = Math.max(margin, Math.min(info.point.y, screenHeight - boxHeight));

  // 📌 Snap يمين أو شمال (زي iPhone)
  const snapX = newX > screenWidth / 2
    ? screenWidth - boxWidth - margin
    : margin;

  setPosition({
    x: snapX,
    y: newY
  });
};

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      if (scrollPos > document.body.offsetHeight - 600) setVisible(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = {
    features: [
      { title: isRTL ? "توصيل سريع" : "Fast Delivery", desc: isRTL ? "خلال 2-4 أيام عمل" : "2-4 business days", icon: <FiTruck size={28} /> },
      { title: isRTL ? "جودة عالية" : "Premium Quality", desc: isRTL ? "أفضل الخامات العصرية" : "Best modern materials", icon: <FiShield size={28} /> },
      { title: isRTL ? "معاينة وإرجاع" : "Inspect & Return", desc: isRTL ? "افحص طلبك عند الاستلام" : "Check upon delivery", icon: <FiRefreshCw size={28} /> }
    ],
    aboutDesc: isRTL ? "متجر متخصص في توفير مجموعة مميزة من الملابس العصرية الرياضية والكاجوال بجودة تنافسية." : "Specialized store providing a unique collection of modern sports and casual wear.",
    rights: isRTL ? "© 2026 فيسترو ستور. جميع الحقوق محفوظة." : "© 2026 VESTRO STORE. All Rights Reserved."
  };

  return (
    <>
      {/* --- حاوية الحدود (تغطي الشاشة بالكامل) --- */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[9998]" />

      <footer dir={isRTL ? "rtl" : "ltr"} className={`w-full border-t transition-all duration-1000 ${darkMode ? "bg-black border-white/5 text-white" : "bg-white border-gray-200 text-black"} ${visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        
        {/* Features Grid */}
        <div className={`border-b ${darkMode ? "border-white/5" : "border-gray-100"}`}>
          <div className="max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {t.features.map((f, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-[#86FE05]/10 text-[#86FE05] flex items-center justify-center group-hover:bg-[#86FE05] group-hover:text-black transition-all duration-500">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase italic tracking-tight">{f.title}</h4>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600 font-medium"}`}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            
            {/* Brand Info */}
            <div className="md:col-span-5 space-y-8">
              <Link to="/" className="text-5xl font-black tracking-tighter italic uppercase">
                VESTRO<span className="text-[#86FE05]">STORE</span>
              </Link>
              <p className={`text-base leading-relaxed max-w-md ${darkMode ? "text-gray-300" : "text-black font-semibold"}`}>
                {t.aboutDesc}
              </p>
              
              <button onClick={() => setShowPolicyModal(true)} className="flex items-center gap-2 text-[#5bae02] text-xl font-black uppercase tracking-widest hover:scale-105 transition-transform bg-[#86FE05]/10 px-4 py-2 rounded-full">
                <FiInfo size={18} /> {isRTL ? "سياسات المتجر" : "Store Policies"}
              </button>

              <div className="flex gap-5">
                {[
                  { icon: <FaFacebookF />, link: "https://www.facebook.com/share/1E4b9xJXs2/?mibextid=wwXIfr", color: "hover:bg-[#1877F2]" },
                  { icon: <FaInstagram />, link: "https://www.instagram.com/vestroeg?igsh=MXZpaHVtcm05bjUyeQ%3D%3D&utm_source=qr", color: "hover:bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
                  { icon: <FaTiktok />, link: "https://www.tiktok.com/@stokecity58113?_r=1&_t=ZS-95FzIbdfEkm", color: "hover:bg-black" }
                ].map((social, i) => (
                  <a key={i} href={social.link} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${darkMode ? "border-white/10 bg-white/5" : "border-black bg-white"} ${social.color} hover:text-white hover:-translate-y-2`}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#86FE05] italic">{isRTL ? "اكتشف المزيد" : "Explore"}</h3>
          <ul className="space-y-5">
  {[
    {
      name: isRTL ? "الرئيسية" : "Home",
      icon: <FiHome />,
      path: "/",
    },
    {
      name: isRTL ? "كل المنتجات" : "Shop All",
      icon: <FiShoppingBag />,
      path: "/products",
    },
    {
      name: isRTL ? "عروض فيسترو" : "Vestro Bundles",
      icon: <FiGift />,
      path: "/bundles",
    },
    
  ].map((item, i) => (
    <li key={i}>
      <Link
        to={item.path}
        className={`group flex items-center gap-4 text-base font-black transition-all ${
          darkMode
            ? "text-gray-400 hover:text-[#86FE05]"
            : "text-black hover:text-[#86FE05]"
        }`}
      >
        <span className="p-2.5 rounded-xl bg-[#86FE05]/5 group-hover:bg-[#86FE05] group-hover:text-black transition-all">
          {item.icon}
        </span>
        {item.name}
      </Link>
    </li>
  ))}
</ul>
            </div>

            {/* Payment */}
            <div className="md:col-span-4 space-y-10">
              <div className="space-y-5">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#86FE05] italic">{isRTL ? "طرق الدفع" : "Payments"}</h3>
                <div className="flex flex-wrap gap-5 items-center">
                  <FaCcVisa size={40} className="text-[#1A1F71] bg-white rounded-sm" />
                  <FaCcMastercard size={40} className="text-[#EB001B] bg-white rounded-sm" />
                  <div className={`px-3 py-1.5 border-2 rounded-lg text-[10px] font-black ${darkMode ? "border-[#86FE05] text-[#86FE05]" : "border-black text-black"}`}>PAYMOB</div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 border-2 rounded-lg text-[10px] font-black ${darkMode ? "border-[#86FE05] text-[#86FE05] bg-[#86FE05]/5" : "border-black text-black bg-gray-50"}`}>
                    <MdOutlinePayments size={16} /> {isRTL ? "الدفع عند الاستلام" : "CASH ON DELIVERY"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-24 pt-10 border-t-2 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest ${darkMode ? "border-white/5 text-gray-500" : "border-gray-200 text-black"}`}>
            <p>{t.rights}</p>
            <div className="flex gap-8">
              <Link to="/privacy" className="hover:text-[#86FE05] transition-colors">{isRTL ? "الخصوصية" : "Privacy"}</Link>
              <Link to="/terms" className="hover:text-[#86FE05] transition-colors">{isRTL ? "الشروط" : "Terms"}</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* --- MAGNETIC SOCIAL HUB (الزرار الجديد بحدود الشاشة) --- */}
      <motion.div
      drag
  dragConstraints={constraintsRef}
  dragElastic={0.1}
  dragMomentum={false}
  onDragEnd={handleDragEnd}
  animate={{ x: position.x, y: position.y }}
  transition={{ type: "spring", stiffness: 250, damping: 25 }}
  className="fixed z-[9999] touch-none pointer-events-auto"
  style={{ left: 0, top: 0 }} // 🔥 مهم
      >
        <div className="relative flex flex-col items-center top-12 right-7">
          {/* Social Icons Hub Menu */}
         <AnimatePresence>
  {showHub && (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 20 }}
      className={`absolute bottom-20 flex flex-col gap-3 p-3 rounded-[2rem] shadow-2xl border-2 ${
        darkMode ? "bg-zinc-900 border-[#86FE05]/30" : "bg-white border-gray-100"
      }`}
    >
      {/* WhatsApp Sales */}
      <a href="https://wa.me/201120587886" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg group relative">
        <FaWhatsapp size={22} />
        <span className={`absolute ${isRTL ? "right-14" : "left-14"} whitespace-nowrap bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none z-[100]`}>
          {isRTL ? "قسم المبيعات" : "Sales Dept"}
        </span>
      </a>
      
      {/* WhatsApp Support */}
      <a href="https://wa.me/201060850472" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg group relative">
        <FaWhatsapp size={22} />
        <span className={`absolute ${isRTL ? "right-14" : "left-14"} whitespace-nowrap bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none z-[100]`}>
          {isRTL ? "الدعم الفني" : "Technical Support"}
        </span>
      </a>
     <a
  href="https://www.instagram.com/vestroeg?igsh=MXZpaHVtcm05bjUyeQ%3D%3D&utm_source=qr"
  target="_blank"
  rel="noreferrer"
  className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg group relative"
>
  <FaInstagram size={22} />

  <span
    className={`absolute ${
      isRTL ? "right-14" : "left-14"
    } whitespace-nowrap bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none z-[100]`}
  >
    {isRTL ? "إنستجرام" : "Instagram"}
  </span>
</a>

      {/* Facebook Messenger - الزر الجديد */}
      <a href="https://www.tiktok.com/@stokecity58113?_r=1&_t=ZS-95FzIbdfEkm" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-b from-[#00B2FF] to-[#006AFF] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg group relative">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.9 1.18 5.4 3.12 7.15.16.14.25.35.25.56l-.02 2.22c-.01.45.47.76.87.56l2.48-1.25c.16-.08.35-.1.52-.05 1.13.33 2.33.51 3.58.51 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.31 12.87l-2.47-2.63-4.82 2.63c-.47.25-1.02-.27-.76-.74l2.63-4.82-2.63-2.63c-.39-.39-.11-1.05.44-.91l4.82 1.31 2.47 2.63 4.82-2.63c.47-.25 1.02.27.76.74l-2.63 4.82 2.63 2.63c.39.39.11 1.05-.44.91l-4.82-1.31z" />
        </svg>
        <span className={`absolute ${isRTL ? "right-14" : "left-14"} whitespace-nowrap bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none z-[100]`}>
          {isRTL ? "ماسينجر" : "Messenger"}
        </span>
      </a>

      {/* Instagram */}
      <a href="https://www.instagram.com/vestroeg?igsh=MXZpaHVtcm05bjUyeQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg group relative">
        <FaTiktok size={22} />
        <span className={`absolute ${isRTL ? "right-14" : "left-14"} whitespace-nowrap bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none z-[100]`}>
          {isRTL ? " تيك توك" : "Tiktok"}
        </span>
      </a>

      {/* Facebook */}
      <a href="https://www.facebook.com/share/1E4b9xJXs2/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg group relative">
        <FaFacebookF size={22} />
        <span className={`absolute ${isRTL ? "right-14" : "left-14"} whitespace-nowrap bg-black text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none z-[100]`}>
          {isRTL ? "فيسبوك" : "Facebook"}
        </span>
      </a>
    </motion.div>
  )}
</AnimatePresence>

          {/* Main Toggle Button */}
          <motion.button
            onClick={() => setShowHub(!showHub)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 ${showHub ? "bg-red-500 border-red-500/20 rotate-90" : "bg-[#86FE05] border-[#86FE05]/20"} text-black`}
          >
            {showHub ? <FiX size={30} /> : <FaShareAlt size={26} className="animate-pulse" />}
            
            {/* Notification Dot */}
            {!showHub && (
              <span className="absolute top-0 right-0 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-black text-[10px] text-[#86FE05] items-center justify-center font-bold italic">!</span>
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`relative max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl border ${darkMode ? "bg-[#0a0a0a] border-white/10 text-white" : "bg-white border-black text-black"}`}>
            <button onClick={() => setShowPolicyModal(false)} className="absolute top-4 right-4 rtl:left-4 p-2 hover:bg-red-500 hover:text-white rounded-full transition-all"><FiX size={24}/></button>
            <h2 className="text-2xl font-black italic mb-6 border-b-2 border-[#86FE05] pb-2 inline-block uppercase">{isRTL ? "سياسة الإرجاع والاستبدال" : "Return Policy"}</h2>
            <div className={`space-y-4 text-sm leading-relaxed ${isRTL ? "text-right" : "text-left"} ${!darkMode && "font-medium"}`}>
              <p>• يمكن إرجاع المنتجات في غضون 14 يومًا من استلام الشحنة.</p>
              <p>• يجب إثبات التلف أو النقص أثناء تواجد المندوب.</p>
              <p className="bg-[#86FE05]/10 p-3 rounded-lg border-l-4 border-[#86FE05]">⚠️ يتم دفع مصاريف 65 ج.م فقط عند رفض الشحنة أثناء المعاينة.</p>
              <p>• يجب أن يكون المنتج بحالته الأصلية وبغلافه الأصلي.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}