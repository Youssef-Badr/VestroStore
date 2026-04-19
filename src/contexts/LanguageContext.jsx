/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // 🔥 غيرنا القيمة الابتدائية هنا من "en" لـ "ar"
  // وضفنا منطق بسيط عشان يسحب اللغة من الـ localStorage لو العميل زار الموقع قبل كدة
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("vestro_lang") || "ar"; 
  });

  // كل ما اللغة تتغير، بنحفظها في المتصفح
  useEffect(() => {
    localStorage.setItem("vestro_lang", language);
    // اختياري: تغيير اتجاه الصفحة بالكامل (RTL/LTR) تلقائياً
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);