// ThankYou.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

import { useTheme } from "../contexts/ThemeContext";
import { useEffect, useState, useRef } from "react";
import api from "../../src/api/axiosInstance";
import { MoveLeft, MoveRight, CheckCircle, Package, MessageCircle, Home, MapPin, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";

const ThankYou = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const { orderId } = useParams();
  const isRTL = language === "ar";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
const hasTrackedPurchase = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // تم إزالة شرط التوكن هنا ليتمكن الـ Guest من رؤية طلبه
        const { data } = await api.get(`/orders/public/${orderId}`);
        setOrder(data.order || data);
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error(isRTL ? "عذراً، لم نتمكن من العثور على هذا الطلب" : "Order not found");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId, isRTL]);


useEffect(() => {
  if (!order || hasTrackedPurchase.current) return;

  hasTrackedPurchase.current = true;

  const eventId = order._id;

  const subtotal =
    order?.orderItems?.reduce(
      (acc, item) =>
        acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    ) || 0;

  const shipping = Number(order?.shippingFee) || 0;
  const discount = order?.discount?.amount || 0;
  const total = subtotal + shipping - discount;

  if (window.fbq) {
    window.fbq("track", "Purchase",
      {
        value: Number(order.totalPrice || total), // 🔥 خليه من الباك أفضل
        currency: "EGP",
        contents: order.orderItems.map((item) => ({
          id: item.product || item.bundle,
          quantity: item.quantity,
          item_price: item.price,
        })),
        content_type: "product",
      },
      {
        eventID: eventId, // 🔥 مهم جدًا
      }
    );
  }
}, [order]);
  const subtotal = order?.orderItems?.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0
  ) || 0;

  const shipping = Number(order?.shippingFee) || 0;
  const discount = order?.discount?.amount || 0;
  const total = subtotal + shipping - discount;

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="w-12 h-12 border-4 border-red-800 border-t-red-700 rounded-full animate-spin mb-4"></div>
        <p className="font-black       uppercase            text-[10px]">Loading Success...</p>
      </div>
    );
  }

  if (!order) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
       <p>{isRTL ? "الطلب غير موجود" : "Order not found"}</p>
       <button onClick={() => navigate("/")} className="px-6 py-2 bg-red-700 text-black font-bold rounded-full text-xs">HOME</button>
    </div>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen pt-24 pb-12 px-4 transition-colors duration-500 ${darkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="flex justify-between items-center m-8">
            <button 
              onClick={() => navigate("/")} 
              className={`flex items-center gap-2 uppercase text-[14px] font-black           transition-all ${darkMode ? 'text-gray-500 hover:text-red-700' : 'text-gray-400 hover:text-black'}`}
            >
              {isRTL ? <MoveRight size={18} /> : <MoveLeft size={18} />}
              {isRTL ? "الرئيسية" : "Back to Home"}
            </button>
            {/* <span className="text-[10px] font-black opacity-30            ">SUCCESS_PAGE_V2</span> */}
        </div>

        {/* Hero Success Card */}
        <div className={`relative overflow-hidden mb-8 p-8 rounded-[40px] border transition-all ${darkMode ? 'bg-[#0A0A0A] border-white/5 shadow-2xl ' : 'bg-white border-gray-100 shadow-xl'}`}>
          {/* Decorative Gradient Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-800 blur-[100px] -z-10 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-start">
            <div className="w-20 h-20 bg-red-700 rounded-3xl flex items-center justify-center rotate-3  shrink-0">
              <CheckCircle size={40} className="text-black stroke-[3px]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black       uppercase             mb-2">
                {isRTL ? "تم بنجاح!" : "Order Placed!"}
              </h1>
              <p className="text-[11px] font-bold opacity-60 uppercase          ">
                {/* {isRTL ? "رقم الطلب الخاص بك:" : "Your tracking ID:"}  */}
                {/* <span className="text-[#86FE05] ml-2">#{order._id.slice(-8).toUpperCase()}</span> */}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-6">
            
           {/* Products List */}
<div className={`rounded-[35px] border p-6 md:p-8 ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
  <h2 className="text-[18px] font-black       uppercase mb-6 flex items-center gap-3           text-black dark:text-white">
    <Package size={18} /> {isRTL ? "محتويات الحقيبة" : "Bag Contents"}
  </h2>
  <div className="space-y-8">
    {order.orderItems.map((item) => (
      <div key={item._id} className="flex flex-col gap-4 border-b border-white/5 pb-6 last:border-0 group">
        
        {/* معلومات المنتج الأساسية أو الباندل */}
        <div className="flex gap-5 items-center">
          <div className="relative overflow-hidden rounded-2xl w-20 h-20 shrink-0 border border-white/10 bg-white/5">
            <img src={item.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-black text-[15px] uppercase truncate ">
                {item.isBundle ? (isRTL ? "عرض خاص: " + item.name : "Bundle: " + item.name) : item.name}
              </h3>
              <span className="text-[15px] font-black text-black dark:text-white whitespace-nowrap">
                {item.price} <span className="text-[9px]">EGP</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              {item.isBundle ? (
                <span className="text-[13px]  text-red-700 px-2 py-1 rounded-md font-black uppercase           ">
                  {isRTL ? "عرض توفيري" : "SAVE BUNDLE"}
                </span>
              ) : (
                <p className="text-[10px] opacity-40 font-bold uppercase           ">
                  {item.size} — {item.color}
                </p>
              )}
              <span className="text-[10px] font-black opacity-60      ">QTY: {item.quantity}</span>
            </div>
          </div>
        </div>

        {/* لو العنصر ده باندل، هنعرض المنتجات اللي جواه */}
       {/* لو العنصر ده باندل، هنعرض المنتجات اللي جواه وتوفير السعر */}
{item.isBundle && item.bundleItems && (
  <div className={`mt-2 p-5 rounded-[25px] ${darkMode ? 'bg-white/[0.03]' : 'bg-gray-50'} border border-white/5`}>
    <p className="text-[8px] font-black uppercase opacity-30 mb-4          ">
      {isRTL ? "تفاصيل محتويات العرض:" : "Bundle Contents & Savings:"}
    </p>
    
    {/* قائمة المنتجات داخل الباندل */}
    <div className="space-y-3 mb-5">
      {item.bundleItems.map((subItem, idx) => (
        <div key={idx} className="flex items-center justify-between group/sub">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/5 shrink-0 bg-black/10">
              <img src={subItem.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase leading-tight">{subItem.name}</span>
              <span className="text-[9px] opacity-50 uppercase font-bold">{subItem.size} / {subItem.color}</span>
            </div>
          </div>
          {/* سعر القطعة الأصلي */}
          <span className="text-[10px] font-bold opacity-40      ">
            {subItem.price} EGP
          </span>
        </div>
      ))}
    </div>

    {/* ملخص توفير الباندل */}
    <div className={`pt-4 border-t ${darkMode ? 'border-white/5' : 'border-black/5'} flex flex-col gap-1`}>
      <div className="flex justify-between items-center text-[10px] font-bold opacity-50">
        <span>{isRTL ? "إجمالي السعر الأصلي:" : "Original Total:"}</span>
        <span className="line-through">
           {(item.bundleItems.reduce((sum, sub) => sum + sub.price, 0)) * item.quantity} EGP
        </span>
      </div>
      <div className="flex justify-between items-center text-[12px] font-black">
        <span className="text-red-700 uppercase             text-[15px]">
          {isRTL ? "سعر العرض الحالي:" : "Final Bundle Price:"}
        </span>
        <span className="text-red-700       animate-pulse text-[15px]">
          {item.price * item.quantity} EGP
        </span>
      </div>
    </div>
  </div>
)}

      </div>
    ))}
  </div>
</div>

            {/* Delivery Details */}
            <div className={`rounded-[35px] border p-6 ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
               <h2 className="text-[13px] font-black       uppercase mb-4 flex items-center gap-3           text-black dark:text-white">
                 <MapPin size={18}/> {isRTL ? "وجهة التوصيل" : "Delivery Destination"}
               </h2>
               <div className="flex flex-col gap-1 text-[12px] font-bold uppercase leading-relaxed">
                 <span className="text-black dark:text-white">{order.guestInfo?.name}</span>
                 <span className="opacity-70">{order.guestInfo?.phone}</span>
                 <span className="opacity-70">{order.shippingAddress?.cityName}, {order.shippingAddress?.districtName}</span>
               </div>
            </div>
          </div>

          {/* Checkout Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`rounded-[40px] p-8 border sticky top-24 transition-all overflow-hidden ${darkMode ? 'bg-white text-black border-transparent shadow-2xl shadow-red-800' : 'bg-black text-white border-white/10 shadow-xl'}`}>
              
              <h3 className="text-[15px] font-black uppercase           mb-8">{isRTL ? "ملخص الدفع" : "Payment Summary"}</h3>
              
              <div className="space-y-4 font-bold text-[13px]">
                <div className="flex justify-between items-center opacity">
                  <span className="uppercase            text-[15px]">{isRTL ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="font-black      ">{subtotal} EGP</span>
                </div>
                <div className="flex justify-between items-center ">
                  <span className="uppercase            text-[15px]">{isRTL ? "رسوم الشحن" : "Shipping"}</span>
                  <span className="font-black      ">+{shipping} EGP</span>
                </div>
                {discount > 0 && (
                  <div className={`flex justify-between items-center ${darkMode ? 'text-red-600' : 'text-red-400'}`}>
                    <span className="uppercase            text-[9px]">{isRTL ? "الخصم" : "Discount"}</span>
                    <span className="font-black      ">-{Math.round(discount)} EGP</span>
                  </div>
                )}
                
                <div className={`border-t-2 pt-6 mt-6 flex justify-between items-end font-black ${darkMode ? 'border-black/10' : 'border-white/10'}`}>
                  <div>
                      <p className="text-[15px] uppercase           opacity mb-1">{isRTL ? "الإجمالي النهائي" : "Total Amount"}</p>
                      <p className="text-[11px] uppercase font-black px-2 py-1 bg-black/5 rounded-md inline-block">{order.paymentMethod}</p>
                  </div>
                  <span className="text-4xl             leading-none font-black      ">{Math.round(total)}<span className="text-sm ml-1">EGP</span></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-3">
               <a 
                href="https://wa.me/201060850472" 
                target="_blank" 
                rel="noreferrer"
                className={`flex items-center justify-center gap-3 py-5 rounded-[25px] text-[15px] font-black uppercase           transition-all border ${darkMode ? 'bg-white border-white/5 text-black hover:bg-[#57a107] hover:text-black' : 'bg-black border-gray-200 text-white hover:bg-[#57a107] hover:text-white'}`}
               >
                 <MessageCircle size={18}/> {isRTL ? "  يمكنك التحدث إلي الدعم متي شئت" : "Contact Support"}
               </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ThankYou;
