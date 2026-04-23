/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify"; // التعديل لـ toastify
import { User, Lock, Save, Loader2, Edit3, X, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function ProfilePage() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [profileData, setProfileData] = useState({ firstName: "", lastName: "", email: "" });
  const [passwordData, setPasswordData] = useState({ 
    oldPassword: "", 
    newPassword: "", 
    confirmNewPassword: "" 
  });

  // 1. جلب البيانات عند فتح الصفحة
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/clients/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData({ 
          firstName: data.client.firstName, 
          lastName: data.client.lastName, 
          email: data.client.email 
        });
      } catch (err) {
        toast.error(isRTL ? "فشل تحميل البيانات" : "Failed to load profile");
      }
    };
    fetchProfile();
  }, [isRTL]);

  // 2. دالة تحديث الاسم الأول والأخير
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put("/clients/update-profile", 
        { firstName: profileData.firstName, lastName: profileData.lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // تحديث البيانات في الـ LocalStorage عشان الناف بار يحس بالتغيير
      const existingClient = JSON.parse(localStorage.getItem("client"));
      localStorage.setItem("client", JSON.stringify({ ...existingClient, ...data.client }));

      toast.success(isRTL ? "تم تحديث البيانات بنجاح" : "Profile updated!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || (isRTL ? "فشل التحديث" : "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  // 3. دالة تغيير كلمة السر
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return toast.error(isRTL ? "كلمات السر الجديدة غير متطابقة" : "New passwords do not match");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/clients/change-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success(isRTL ? "تم تغيير كلمة السر بنجاح" : "Password updated!");
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || (isRTL ? "فشل تغيير كلمة السر" : "Failed to change password"));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `w-full bg-transparent border ${darkMode ? 'border-white/10 text-white' : 'border-black/10 text-black'} p-4 rounded-xl focus:border-[#B91C1C] outline-none transition-all font-bold`;
  const labelStyle = `block text-[10px] font-black uppercase mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`;

  return (
    <div className={`min-h-screen pt-32 pb-20 px-4 ${darkMode ? 'bg-black' : 'bg-gray-50'}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header Profile */}
        <div className={`p-8 rounded-[2.5rem] mb-8 border border-red-700 flex flex-col md:flex-row items-center justify-between gap-6 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white shadow-xl'}`}>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-red-700 rounded-3xl flex items-center justify-center ">
              <User size={48} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase       tracking-tighter">
                {profileData.firstName} <span className="text-red-700">{profileData.lastName}</span>
              </h1>
              <p className="text-gray-500 font-bold flex items-center gap-2 mt-1       tracking-tight"> {profileData.email}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-red-800 font-black uppercase text-xs hover:bg-red-800 hover:text-black transition-all"
          >
            <Edit3 size={16}/> {isEditing ? (isRTL ? "إلغاء" : "Cancel") : (isRTL ? "تعديل البيانات" : "Edit Profile")}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* قسم تعديل البيانات الشخصية */}
          <form onSubmit={handleUpdateProfile} className={`p-8 rounded-[2.5rem] border ${darkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3"> <Save size={20} className="text-red-700"/> {isRTL ? "المعلومات الشخصية" : "Personal Info"} </h2>
            <div className="space-y-4">
               <div>
                 <label className={labelStyle}>{isRTL ? "الاسم الأول" : "First Name"}</label>
                 <input type="text" className={inputStyle} value={profileData.firstName} disabled={!isEditing} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} required />
               </div>
               <div>
                 <label className={labelStyle}>{isRTL ? "الاسم الأخير" : "Last Name"}</label>
                 <input type="text" className={inputStyle} value={profileData.lastName} disabled={!isEditing} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} required />
               </div>
               {isEditing && (
                 <button disabled={loading} className="w-full bg-red-700 text-black font-black py-4 rounded-xl mt-4 uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_#86FE0533] flex items-center justify-center">
                   {loading ? <Loader2 className="animate-spin" /> : (isRTL ? "حفظ التغييرات" : "Save Changes")}
                 </button>
               )}
            </div>
          </form>

          {/* قسم الأمان */}
          <div className={`p-8 rounded-[2.5rem] border ${darkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
             <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3"> <Lock size={20} className="text-red-700"/> {isRTL ? "إعدادات الأمان" : "Security"} </h2>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-6">
                <div className="flex items-center gap-3 text-red-700 mb-2 font-black text-xs uppercase">
                  <ShieldCheck size={18}/> {isRTL ? "حماية الحساب" : "Account Protection"}
                </div>
                <p className="text-gray-500 text-xs font-bold leading-relaxed">
                  {isRTL ? "ننصح بتغيير كلمة المرور بشكل دوري للحفاظ على أمان حسابك." : "We recommend changing your password regularly to keep your account secure."}
                </p>
             </div>
             <button 
               onClick={() => setShowPasswordModal(true)}
               className="w-full border-2 border-red-700 text-red-700 font-black py-4 rounded-xl uppercase hover:bg-red-700 hover:text-black transition-all"
             >
               {isRTL ? "تغيير كلمة السر" : "Change Password"}
             </button>
          </div>
        </div>

        {/* --- Password Change Modal --- */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`w-full max-w-md p-8 rounded-[2.5rem] border border-red-800 relative ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
              <button onClick={() => setShowPasswordModal(false)} className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} text-gray-500 hover:text-red-800 transition-all`}>
                <X size={24}/>
              </button>
              
              <h2 className="text-2xl font-black uppercase       mb-8 flex items-center gap-3">
                <Lock className="text-red-700" /> {isRTL ? "تحديث الأمان" : "Update Security"}
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className={labelStyle}>{isRTL ? "كلمة السر القديمة" : "Old Password"}</label>
                  <input type="password" className={inputStyle} placeholder="••••••••" required onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} />
                </div>
                <div className="h-[1px] bg-white/5 my-2"></div>
                <div>
                  <label className={labelStyle}>{isRTL ? "كلمة السر الجديدة" : "New Password"}</label>
                  <input type="password" className={inputStyle} placeholder="••••••••" required onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                </div>
                <div>
                  <label className={labelStyle}>{isRTL ? "تأكيد كلمة السر" : "Confirm New Password"}</label>
                  <input type="password" className={inputStyle} placeholder="••••••••" required onChange={(e) => setPasswordData({...passwordData, confirmNewPassword: e.target.value})} />
                </div>

                <button disabled={loading} className="w-full bg-[#86FE05] text-black font-black py-5 rounded-2xl uppercase mt-4 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : (isRTL ? "حفظ الباسورد الجديد" : "Save New Password")}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}