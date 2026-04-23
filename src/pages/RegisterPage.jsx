import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function RegisterPage() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "", // الحقل ده أساسي للباك إند عندك
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. التحقق من تطابق كلمتي المرور (Front-end validation)
    if (formData.password !== formData.confirmPassword) {
      return toast.error(isRTL ? "كلمات السر غير متطابقة!" : "Passwords do not match!");
    }

    // 2. التحقق من قوة كلمة المرور بنفس الـ Regex اللي في الباك إند
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    if (!strongPassword.test(formData.password)) {
      return toast.error(isRTL ? "كلمة السر ضعيفة جداً!" : "Password is too weak!");
    }

    setLoading(true);
    try {
      // ✅ التعديل الجوهري: نبعت الـ formData كاملة لأن الباك إند بيعمل Check على confirmPassword
      const response = await axios.post("/clients/register", formData);
      
      // حفظ التوكن والبيانات لو الباك إند رجعهم بعد الريجستير مباشرة
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("client", JSON.stringify(response.data.client));
      }

      toast.success(isRTL ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!");
      
      // التوجيه للرئيسية لو سجل دخول تلقائي أو للوجن
      setTimeout(() => {
        window.location.href = "/"; 
      }, 2000);

    } catch (err) {
      // إظهار رسالة الخطأ الحقيقية اللي جاية من الكنترولر (Validator)
      const errorMsg = err.response?.data?.message || (isRTL ? "فشل إنشاء الحساب" : "Registration failed");
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `w-full bg-transparent border ${darkMode ? 'border-white/10 text-white' : 'border-black/10 text-black'} p-4 rounded-2xl focus:border-[#86FE05] outline-none transition-all font-bold ${isRTL ? 'pr-12' : 'pl-12'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center pt-24 pb-12 px-4 ${darkMode ? 'bg-black' : 'bg-gray-50'}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`max-w-lg w-full p-8 rounded-[2.5rem] border ${darkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 -rotate-3 ">
            <UserPlus size={30} className="text-black" />
          </div>
          <h1 className="text-3xl font-black uppercase       tracking-tighter">
            {isRTL ? "إنشاء" : "Create"} <span className="text-red-600">{isRTL ? "حساب" : "Account"}</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={18} />
              <input type="text" placeholder={isRTL ? "الاسم الأول" : "First Name"} className={inputStyle} required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div className="relative">
              <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={18} />
              <input type="text" placeholder={isRTL ? "الاسم الأخير" : "Last Name"} className={inputStyle} required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>

          <div className="relative">
            <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={18} />
            <input type="email" placeholder={isRTL ? "البريد الإلكتروني" : "Email"} className={inputStyle} required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="relative">
            <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={18} />
            <input type="password" placeholder={isRTL ? "كلمة المرور" : "Password"} className={inputStyle} required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="relative">
            <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500`} size={18} />
            <input type="password" placeholder={isRTL ? "تأكيد كلمة المرور" : "Confirm Password"} className={inputStyle} required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full bg-red-600 text-black font-black py-5 rounded-2xl uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ">
            {loading ? <Loader2 className="animate-spin" /> : (
              <> {isRTL ? "انضم إلينا" : "Join VESTRO"} <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} /> </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 font-bold text-sm">
          {isRTL ? "لديك حساب بالفعل؟" : "Already have an account?"} {" "}
          <Link to="/login" className="text-red-700 hover:underline">{isRTL ? "سجل دخول" : "Login"}</Link>
        </p>
      </div>
    </div>
  );
}