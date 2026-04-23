/* eslint-disable no-unused-vars */

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import api from "../api/axiosInstance";

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
          setAnnouncements(res.data.filter((a) => a.active));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnnouncements();
  }, []);


  const marqueeItems = useMemo(() => {
    if (!announcements.length) return [];
    return Array(25).fill(announcements).flat();
  }, [announcements]);

  // ✅ بعد الـ hooks
  if (!announcements.length) return null;

  return (
    <div
      className={`w-full overflow-hidden  transition-colors duration-300 backdrop-blur-md ${
        darkMode
          ? "bg-red-600 border-white shadow-sm"
          : "bg-red-600 border-gray-200 shadow-sm"
      }`}
      style={{ height: "36px", display: "flex", alignItems: "center" }}
    >
      <motion.div
        className="flex whitespace-nowrap items-center"
     animate={{
  x: isRTL ? ["0%", "10%"] : ["0%", "-10%"]
}}
       transition={{
  duration: 50,
  ease: "linear",
  repeat: Infinity,
}}
      >
        {marqueeItems.map((a, index) => (
          <div key={index} className="flex items-center">
            <span
              className={`mx-10 font-black text-[10px] uppercase italic ${
                darkMode ? "text-black" : "text-white"
              }`}
            >
              {a.text}
            </span>
            <div className={`w-1 h-1 rotate-45 ${darkMode ? "bg-black" : "bg-white"}`} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}