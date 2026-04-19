/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import api from "../api/axiosInstance";


// ... نفس الـ imports

export default function AnnouncementBar() {
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const isRTL = language === "ar";

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get("/announcement/all"); 
        if (Array.isArray(res.data)) {
          const activeOnly = res.data.filter((a) => a.active === true);
          setAnnouncements(activeOnly);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  // السرعة: لو النص طويل أوي ممكن تزود الرقم ده (مثلاً 60) عشان ميبقاش سريع بزيادة
  const speed = 40; 

  // تكرار العناصر: 20 مرة كافية جداً لعمل حلقة وهمية مستمرة
  const marqueeItems = Array(25).fill(announcements).flat();

  return (
    <div 
      className={`w-full overflow-hidden border-b transition-colors duration-300 backdrop-blur-md ${
        darkMode 
          ? "bg-black/90 border-[#86FE05]/20 shadow-sm" 
          : "bg-white/90 border-gray-200 shadow-sm"
      }`}
      style={{ height: "36px", display: "flex", alignItems: "center" }}
    >
      <motion.div
        className="flex whitespace-nowrap items-center"
        // التعديل الجوهري هنا:
        animate={{ 
  x: ["0%", isRTL ? "50%" : "-50%"]
}}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
          // دي بتضمن إن الحركة متقفش وترجع تبدأ ببطء، بتخليها خبطة واحدة
          repeatType: "loop" 
        }}
      >
        {marqueeItems.map((a, index) => (
          <div key={index} className="flex items-center">
            <span className={`mx-10 font-black text-[10px] md:text-[11px] tracking-[0.15em] uppercase italic ${
                darkMode ? "text-[#86FE05]" : "text-black"
            }`}>
              {a.text}
            </span>
            {/* فاصل شيك بين الكلمات */}
            <div className={`w-1 h-1 rotate-45 ${darkMode ? "bg-white" : "bg-[#86FE05]"}`}></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}