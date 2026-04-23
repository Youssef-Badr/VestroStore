/* eslint-disable no-undef */
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

  // const [visible, setVisible] = useState(false);
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
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
      }
    },
    {
      threshold: 0.1,
    }
  );

  const el = document.getElementById("footer-trigger");
  if (el) observer.observe(el);

  return () => observer.disconnect();
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

      <footer dir={isRTL ? "rtl" : "ltr"} className={`w-full border-t transition-all duration-300 ${
  darkMode
    ? "bg-black border-white/5 text-white"
    : "bg-white border-gray-200 text-black"
}`}>
        
        {/* Features Grid */}
        <div className={`border-b ${darkMode ? "border-white/5" : "border-gray-100"}`}>
          <div className="max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {t.features.map((f, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className="w-14 h-14 rounded-2xl  text-black dark:text-white flex items-center justify-center group-hover:bg-red-800 group-hover:text-black transition-all duration-500">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase tracking-tight">{f.title}</h4>
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
              <Link to="/" className="text-5xl font-black tracking-tighter    uppercase">
                VESTRO <span className="text-red-700"> STORE</span>
              </Link>
              <p className={`text-base leading-relaxed max-w-md ${darkMode ? "text-gray-300" : "text-black font-semibold"}`}>
                {t.aboutDesc}
              </p>
              
              <button onClick={() => setShowPolicyModal(true)} className="flex items-center gap-2 text-black dark:text-white text-xl font-black uppercase tracking-widest hover:scale-105 transition-transform bg-red-700 px-4 py-2 rounded-full">
                <FiInfo size={18} /> {isRTL ? "سياسات المتجر" : "Store Policies"}
              </button>

              <div className="flex gap-5">
                {[
                  { icon: <FaFacebookF />, link: "https://www.facebook.com/share/1E4b9xJXs2/?mibextid=wwXIfr", color: "hover:bg-red-700" },
                  { icon: <FaInstagram />, link: "https://www.instagram.com/vestroeg?igsh=MXZpaHVtcm05bjUyeQ%3D%3D&utm_source=qr", color: "hover:bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
                  { icon: <FaTiktok />, link: "https://www.tiktok.com/@stokecity58113?_r=1&_t=ZS-95FzIbdfEkm", color: "hover:bg-red-700" }
                ].map((social, i) => (
                  <a key={i} href={social.link} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${darkMode ? "border-white/10 bg-white/5" : "border-black bg-white"} ${social.color} hover:text-white hover:-translate-y-2`}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-8">
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-black dark:text-white   ">{isRTL ? "اكتشف المزيد" : "Explore"}</h3>
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
            ? "text-gray-400 hover:text-red-700"
            : "text-black hover:text-red-700"
        }`}
      >
        <span className="p-2.5 rounded-xl  group-hover:bg-red-700 group-hover:text-black transition-all">
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
                <h3 className="text-lg font-black uppercase  text-black dark:text-white   ">{isRTL ? "طرق الدفع" : "Payments"}</h3>
                <div className="flex flex-wrap gap-5 items-center">
                  <FaCcVisa size={40} className="text-[#1A1F71] bg-white rounded-sm" />
                  <FaCcMastercard size={40} className="text-[#EB001B] bg-white rounded-sm" />
                  <div className={`px-3 py-1.5 border-2 rounded-lg text-[10px] font-black ${darkMode ? "border-white text-white" : "border-black text-black"}`}>PAYMOB</div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 border-2 rounded-lg text-[10px] font-black ${darkMode ? "border-white text-white bg-[#86FE05]/5" : "border-black text-black bg-gray-50"}`}>
                    <MdOutlinePayments size={16} /> {isRTL ? "الدفع عند الاستلام" : "CASH ON DELIVERY"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-24 pt-10 border-t-2 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-widest ${darkMode ? "border-white/5 text-gray-500" : "border-gray-200 text-black"}`}>
            <p>{t.rights}</p>
            <div className="flex gap-8">
              <Link to="/privacy" className="hover:text-red-700 transition-colors">{isRTL ? "الخصوصية" : "Privacy"}</Link>
              <Link to="/terms" className="hover:text-red-700 transition-colors">{isRTL ? "الشروط" : "Terms"}</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`relative max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl border ${darkMode ? "bg-[#0a0a0a] border-white/10 text-white" : "bg-white border-black text-black"}`}>
            <button onClick={() => setShowPolicyModal(false)} className="absolute top-4 right-4 rtl:left-4 p-2 hover:bg-red-500 hover:text-white rounded-full transition-all"><FiX size={24}/></button>
            <h2 className="text-2xl font-black    mb-6 border-b-2 border-red-700 pb-2 inline-block uppercase">{isRTL ? "سياسة الإرجاع والاستبدال" : "Return Policy"}</h2>
            <div className={`space-y-4 text-sm leading-relaxed ${isRTL ? "text-right" : "text-left"} ${!darkMode && "font-medium"}`}>
              <p>• يمكن إرجاع المنتجات في غضون 14 يومًا من استلام الشحنة.</p>
              <p>• يجب إثبات التلف أو النقص أثناء تواجد المندوب.</p>
              <p className="bg-red-800 p-3 rounded-lg border-l-4 border-red-700">⚠️ يتم دفع مصاريف 65 ج.م فقط عند رفض الشحنة أثناء المعاينة.</p>
              <p>• يجب أن يكون المنتج بحالته الأصلية وبغلافه الأصلي.</p>
            </div>
          </div>
        </div>
      )}

    </>
  );
}