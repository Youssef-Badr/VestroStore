/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { Package, Clock, ShoppingBag, CheckCircle, CreditCard, ArrowUpRight, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const isRTL = language === "ar";
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const completed = orders.filter(o => o.status === "Delivered").length;
    return { totalSpent, completed, total: orders.length };
  }, [orders]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(isRTL ? "يجب تسجيل الدخول أولاً" : "Please login first", { toastId: "login-error" });
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        toast.error(isRTL ? "فشل تحميل البيانات" : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate, isRTL]);

  const getStatusStyle = (status) => {
    const styles = {
  Placed: "text-blue-400 border-blue-400/20 bg-blue-400/5",

  Confirmed: "text-indigo-400 border-indigo-400/20 bg-indigo-400/5",

  Processing: "text-yellow-500 border-yellow-500/20 bg-yellow-500/5",

  Shipped: "text-[#65bc08] border-[#65bc08]/20 bg-[#65bc08]/5",

  Out_for_Delivery: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",

  Delivered: "text-green-500 border-green-500/20 bg-green-500/5",

  Cancelled: "text-red-500 border-red-500/20 bg-red-500/5",

  On_Hold: "text-gray-400 border-gray-400/20 bg-gray-400/5",

  Returned: "text-purple-400 border-purple-400/20 bg-purple-400/5",

  Exchange_Requested: "text-pink-400 border-pink-400/20 bg-pink-400/5",

  Failed_Attempt: "text-red-400 border-red-400/20 bg-red-400/5",

  Pending_Payment: "text-orange-500 border-orange-500/20 bg-orange-500/5",

  Paid: "text-blue-500 border-blue-500/20 bg-blue-500/5",
};
    return styles[status] || "text-gray-400 border-gray-400/20 bg-gray-400/5";
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="relative mb-4">
          <div className={`w-12 h-12 md:w-16 md:h-16 border-2 rounded-full ${darkMode ? 'border-[#86FE05]/10' : 'border-gray-100'}`}></div>
          <div className="absolute top-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-[#86FE05] rounded-full animate-spin"></div>
        </div>
        <p className="text-[#65bc08] font-black tracking-widest text-[10px] uppercase animate-pulse">Vestro Orders</p>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen pt-24 md:pt-36 pb-20 px-4 md:px-8 transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header --- */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b pb-8 ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#63b808] flex items-center justify-center rounded-2xl md:rounded-[24px] rotate-2 shadow-lg">
              <ShoppingBag size={28} className="text-black -rotate-2" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                {isRTL ? "طلباتي" : "My Orders"}
              </h1>
              <p className={`font-bold mt-2 text-[15px] uppercase tracking-[0.2em] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {isRTL ? "تتبع وإدارة مشترياتك" : "Track and manage your history"}
              </p>
            </div>
          </div>
        </div>

        {/* --- Stats --- */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10">
          <StatCard icon={<Package size={18} />} label={isRTL ? "العدد" : "Count"} value={stats.total} color="#86FE05" darkMode={darkMode} />
          <StatCard icon={<CheckCircle size={18} />} label={isRTL ? "مكتمل" : "Done"} value={stats.completed} color="#10b981" darkMode={darkMode} />
          <StatCard icon={<CreditCard size={18} />} label={isRTL ? "إجمالي" : "Total"} value={`${stats.totalSpent} EGP`} color={darkMode ? "#fff" : "#000"} darkMode={darkMode} />
        </div>

        {/* --- Orders List --- */}
        {orders.length === 0 ? (
          <div className={`text-center py-24 border-2 border-dashed rounded-[40px] px-4 ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-200 bg-white shadow-sm'}`}>
            <Package size={50} className={`mx-auto mb-6 ${darkMode ? 'text-gray-800' : 'text-gray-200'}`} />
            <h2 className="text-xl md:text-2xl font-black mb-2 uppercase italic">{isRTL ? "السجل فارغ" : "Empty Vault"}</h2>
            <Link to="/products" className="mt-6 inline-flex items-center gap-3 bg-[#65bc08] text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:scale-105 transition-all shadow-xl shadow-[#86FE05]/20">
              {isRTL ? "تسوق الآن" : "Go Shopping"} <ArrowUpRight size={16}/>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const { day, time } = formatDate(order.createdAt);
              return (
                <div key={order._id} className={`group relative rounded-[32px] overflow-hidden border transition-all duration-500 ${darkMode ? 'bg-[#080808] border-white/5 hover:border-[#86FE05]/40 shadow-2xl' : 'bg-white border-gray-100 hover:border-black/20 shadow-md shadow-gray-200'}`}>
                  <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6 md:gap-10">
                    
                    {/* Status & Date */}
                    <div className="flex flex-row lg:flex-col justify-between items-center lg:items-start lg:min-w-[160px]">
                      <div className="space-y-2">
                        <span className={`block w-fit text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                        {/* <h3 className={`font-mono font-bold text-xs tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          #{order._id.slice(-8).toUpperCase()}
                        </h3> */}
                      </div>
                      <div className={`text-end lg:text-start lg:mt-4 space-y-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <p className="text-[10px] font-bold flex items-center lg:justify-start justify-end gap-2 uppercase tracking-tighter">
                          <Calendar size={12} className="text-black dar:text-white"/> {day}
                        </p>
                        <p className="text-[10px] font-bold flex items-center lg:justify-start justify-end gap-2 uppercase tracking-tighter">
                          <Clock size={12} className="text-black dar:text-white"/> {time}
                        </p>
                      </div>
                    </div>

                    {/* Product Images (Scrollable) */}
                    <div className="flex items-center -space-x-3 md:-space-x-5 rtl:space-x-reverse overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="relative shrink-0 transition-transform group-hover:translate-x-1">
                          <img 
                            src={item.image || item.product?.image} 
                            className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[28px] object-cover border-4 shadow-2xl ${darkMode ? 'border-[#080808]' : 'border-white'}`}
                            alt="item"
                          />
                          {(item.qty > 1 || item.quantity > 1) && (
                            <span className="absolute -top-2 -right-2 bg-[#86FE05] text-black text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-black z-10 shadow-lg">
                              {item.qty || item.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Summary & View Button */}
                    <div className={`lg:ml-auto rtl:lg:mr-auto flex flex-row items-center justify-between lg:justify-end w-full lg:w-auto gap-8 pt-6 lg:pt-0 border-t lg:border-0 ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                      <div className="text-left rtl:text-right">
                        <p className={`text-[8px] font-black uppercase tracking-widest italic mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Final Invoice</p>
                        <p className="text-2xl md:text-3xl font-black text-black dark:text-white tracking-tighter">
                          {order.totalPrice} <span className={`text-xs ${darkMode ? 'text-white' : 'text-black'}`}>EGP</span>
                        </p>
                      </div>
                      
                      <Link 
                        to={`/thankyou/${order._id}`}
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[24px] flex items-center justify-center transition-all ${darkMode ? 'bg-white/5 text-[#86FE05] hover:bg-[#86FE05] hover:text-black shadow-lg shadow-black' : 'bg-gray-100 text-black hover:bg-black hover:text-white shadow-sm'}`}
                      >
                        {isRTL ? <ChevronLeft size={24}/> : <ChevronRight size={24}/>}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, darkMode }) => (
  <div className={`p-4 md:p-6 rounded-[24px] md:rounded-[32px] flex flex-col sm:flex-row items-center gap-3 md:gap-5 flex-1 border transition-all ${darkMode ? 'bg-[#080808] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${darkMode ? 'bg-white/[0.03]' : 'bg-gray-50'}`} style={{ color }}>
      {icon}
    </div>
    <div className="min-w-0 text-center sm:text-start">
      <p className={`text-[7px] md:text-[10px] font-black uppercase tracking-[0.1em] mb-1 italic ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{label}</p>
      <p className="text-sm md:text-xl font-black truncate tracking-tighter">{value}</p>
    </div>
  </div>
);

export default OrdersPage;