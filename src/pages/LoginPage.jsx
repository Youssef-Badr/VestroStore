import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify"; // التعديل: استخدام react-toastify
import { LogIn, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function LoginPage() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // نداء الراوت
      const { data } = await axios.post("/clients/login", formData);
      
      // حفظ البيانات في الـ LocalStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("client", JSON.stringify(data.client));

      // التعديل: استخدام toast الخاص بـ react-toastify
      toast.success(isRTL ? "تم تسجيل الدخول بنجاح" : `Welcome ${data.client.firstName} ,You are logged in successfully!`);
      
      // التوجيه للرئيسية وتحديث الحالة
      setTimeout(() => {
        window.location.href = "/"; 
      }, 1000);

    } catch (err) {
      // التعديل: التقاط رسالة الخطأ من السيرفر بشكل صحيح لـ toastify
      const errorMessage = err.response?.data?.message || (isRTL ? "فشل تسجيل الدخول" : "Login failed");
      toast.error(errorMessage);
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // تعديل الـ padding والـ icon position ليناسب الـ RTL و LTR
  const inputStyle = `w-full bg-transparent border ${darkMode ? 'border-white/10 text-white' : 'border-black/10 text-black'} p-4 rounded-2xl focus:border-[#B91C1C] outline-none transition-all font-bold ${isRTL ? 'pr-12' : 'pl-12'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-black' : 'bg-gray-50'}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`max-w-md w-full p-8 rounded-[2.5rem] border ${darkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 ">
            <LogIn size={30} className="text-black" />
          </div>
          <h1 className="text-3xl font-black uppercase      ">
            {isRTL ? "تسجيل" : "Client"} <span className="text-red-700">{isRTL ? "الدخول" : "Login"}</span>
          </h1>
          <p className="text-gray-500 font-bold mt-2 text-sm">{isRTL ? "ادخل لمتابعة تسوقك في VESTRO" : "Enter your details to continue"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            {/* ضبط مكان الأيقونة حسب اللغة */}
            <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={18} />
            <input 
              type="email" 
              placeholder={isRTL ? "البريد الإلكتروني" : "Email Address"} 
              className={inputStyle}
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={18} />
            <input 
              type="password" 
              placeholder={isRTL ? "كلمة المرور" : "Password"} 
              className={inputStyle}
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-red-700 text-black font-black py-5 rounded-2xl uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 "
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                {isRTL ? "دخول" : "Sign In"}
                <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
              </>
            )}
          </button>
        </form>

      <div className="mt-8 text-center border-t border-white/5 pt-6">
  <p className="text-gray-400 dark:text-gray-500 font-bold text-sm">
    {isRTL ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
    <Link
      to="/register"
      className="text-red-600 dark:text-red-500 hover:underline font-black"
    >
      {isRTL ? "إنشاء حساب جديد" : "Create one now"}
    </Link>
  </p>
</div>
      </div>
    </div>
  );
}