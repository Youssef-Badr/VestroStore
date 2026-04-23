/* eslint-disable no-unused-vars */
import { useState, useEffect,useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import api from "../../src/api/axiosInstance";
import { useTheme } from "../contexts/ThemeContext";
import OrderSummary from "./../components/OrderSummary";
import { ChevronLeft, MapPin, Phone, User, Mail, CreditCard, Banknote, Tag, Home } from "lucide-react";

const CheckoutPage = () => {
  const { cart, clearCart, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === "ar";
const { darkMode } = useTheme();
  const [citiesList, setCitiesList] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [selectedCityObj, setSelectedCityObj] = useState(null);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [discountError, setDiscountError] = useState(""); // لمسح رسائل الخطأ
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
const [nameError, setNameError] = useState("");
const [cityError, setCityError] = useState("");
const [districtError, setDistrictError] = useState("");
const shippingSectionRef = useRef(null); // عشان السكرول
const [baseShippingCost, setBaseShippingCost] = useState(0);  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    city: "",
    district: "",
    bostaDistrictId: "",
    address: "",
    paymentMethod: "cash",
    discountCode: "",
    buildingNumber: "",
    floor: "",
    apartment: "",
  });

  const [discountInfo, setDiscountInfo] = useState(null);
  const trackInitiateCheckout = (cart) => {
  if (!window.fbq) return;

  let totalValue = 0;

  const contents = cart.map((item) => {
    if (item.isBundle) {
      totalValue += item.price * item.qty;

      return {
        id: item.bundle,
        quantity: item.qty,
        item_price: item.price,
        content_type: "bundle",
      };
    }

    totalValue += item.price * item.qty;

    return {
      id: item.variantId,
      quantity: item.qty,
      item_price: item.price,
      content_type: "product",
    };
  });

  window.fbq("track", "InitiateCheckout", {
    content_type: "product",
    currency: "EGP",
    value: totalValue,
    contents,
    num_items: cart.reduce((sum, i) => sum + i.qty, 0),
  });
};

  // 🌍 جلب المدن عند التحميل
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get("/delivery-charges/public");
        setCitiesList(res.data);
      } catch (error) {
        console.error(error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل المدن" : "Failed to load cities");
      }
    };
    fetchCities();
  }, [isRTL]);

  // 🎁 جلب الكوبونات النشطة فقط (بناءً على التعديل الجديد في الـ Backend)
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await api.get("/discounts/active");
        setAvailableDiscounts(res.data);
      } catch (error) {
        console.error("Error fetching discounts", error);
      }
    };
    fetchDiscounts();
  }, []);

  // 👇👇 هنا تحطها
useEffect(() => {
  if (cart?.length) {
    trackInitiateCheckout(cart);
  }
}, [cart]);


const normalizePhone = (value) => {
  if (!value) return value;

  return value
    // عربي
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    // فارسي
    .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    // حذف أي حاجة مش رقم
    .replace(/\s+/g, "")
    .replace(/[^0-9]/g, "");
};

 // 🔄 معالجة التغييرات في الحقول
const handleChange = async (e) => {
  const { name, value } = e.target;

  if (name === "city") {
    setFormData((prev) => ({
      ...prev,
      city: value,
      district: "",
      bostaDistrictId: "",
    }));

    const cityData = citiesList.find((c) => c._id === value);

    if (cityData) {
      // =========================
      // 🔥 الشحن الأساسي الحقيقي
      // =========================
      setShippingCost(cityData.charge);
      setBaseShippingCost(cityData.charge);

      // =========================
      // 🔥 reset أي خصم شحن
      // =========================
      setDiscountInfo(null);
      setIsDiscountApplied(false);

      setSelectedCityObj(cityData);

      try {
        const res = await api.get(
          `/districts/${cityData.bostaCityId}`
        );
        setDistricts(res.data);
      } catch (err) {
        setDistricts([]);
        toast.error(
          isRTL
            ? "تعذر تحميل الأحياء"
            : "Could not load districts"
        );
      }
    } else {
      setShippingCost(0);
      setBaseShippingCost(0);
      setSelectedCityObj(null);
      setDistricts([]);
    }

    return;
  }

  if (name === "district") {
    const selected = districts.find(
      (d) => String(d.bostaDistrictId) === String(value)
    );

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        district: selected.nameAr,
        bostaDistrictId: String(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        district: "",
        bostaDistrictId: "",
      }));
    }

    return;
  }

  if (name === "phone" || name === "secondaryPhone") {
    setFormData((prev) => ({
      ...prev,
      [name]: normalizePhone(value).slice(0, 11),
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

const validateDiscount = async (codeToValidate, isCheckout = true) => {
  const code = codeToValidate || formData.discountCode;
  setDiscountError("");

  if (!code || code.trim() === "") {
    setDiscountInfo(null);
    setIsDiscountApplied(false);
    setShippingCost(baseShippingCost); // 🔥 reset
    return false;
  }

  try {
    const res = await api.post("/discounts/validate", {
      code: code.trim(),
      orderItems: cart.map((item) => ({
        product: item.product || item._id,
        quantity: item.qty || item.quantity,
      })),
      shippingPrice: baseShippingCost, // 🔥 ابعت الأصل مش المتغير
    });

    // ❌ لو الكود غير صالح
    if (!res.data.valid) {
      setDiscountInfo(null);
      setIsDiscountApplied(false);
      setShippingCost(baseShippingCost);
      return false;
    }

    // =========================
    // ✅ SUCCESS CASE
    // =========================
    setDiscountInfo(res.data);
    setIsDiscountApplied(true);
    setDiscountError("");

    // 🔥 أهم جزء: reset الأول
    setShippingCost(baseShippingCost);

    // لو فيه شحن مجاني
    if (res.data.freeShippingApplied) {
      setShippingCost(0);
    }

    toast.success(
      isRTL ? "تم تطبيق الخصم بنجاح! 🔥" : "Discount applied! 🔥",
      {
        style: {
          borderRadius: "20px",
          background: "#0A0A0A",
          color: "#ffffff",
          border: "1px solid #dc2626",
        },
      }
    );

    if (showDiscountModal) setShowDiscountModal(false);

    return true;

  } catch (err) {
    const msg =
      err.response?.data?.message ||
      (isRTL ? "⚠️ كود غير صالح" : "⚠️ Invalid code");

    setDiscountInfo(null);
    setIsDiscountApplied(false);
    setShippingCost(baseShippingCost); // 🔥 reset مهم جداً
    setDiscountError(msg);

    toast.error(msg, {
      style: {
        borderRadius: "20px",
        background: "#fff",
        color: "#ff0000",
        fontWeight: "bold",
      },
    });

    return false;
  }
};

const scrollToError = () => {
  // بنستنى لحظة عشان الـ React يلحق يضيف كلاسات الخطأ للـ DOM
  setTimeout(() => {
    // بندور على أول حقل فيه كلاس الخطأ (عدل الكلاسات دي حسب اللي بتستخدمه)
    const errorElement = document.querySelector('.text-red-500, .border-red-500, [aria-invalid="true"]');
    
    if (errorElement) {
      // بنجيب مكان العنصر بالنسبة للصفحة
      const yOffset = -150; // مسافة أمان عشان الـ Header (غير الرقم ده حسب طول الهيدر عندك)
      const y = errorElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }, 150); // زودنا الوقت شوية لـ 150ms للتأكيد
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (cart.length === 0) {
      toast.error(isRTL ? "عربة التسوق فارغة ❌" : "Your cart empty ❌");
      setLoading(false);
      return;
    }

    const nameParts = formData.name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setNameError(isRTL ? "الاسم يجب أن يكون ثنائياً" : "Name must be at least two words");
      setLoading(false);
      scrollToError();
      return;
    }

    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      toast.error(isRTL ? "⚠️ رقم الهاتف غير صالح" : "⚠️ Invalid phone number");
      setLoading(false);
      scrollToError();
      return;
    }

    if (formData.secondaryPhone && !phoneRegex.test(formData.secondaryPhone)) {
      toast.error(isRTL ? "رقم الهاتف الإضافي غير صحيح" : "Invalid secondary phone number");
      setLoading(false);
      scrollToError();
      return;
    }

    if (!formData.city || !formData.bostaDistrictId || !formData.address) {
      toast.error(isRTL ? "⚠️ الرجاء إدخال البيانات الأساسية" : "⚠️ Please provide City, District and Address");
      setLoading(false);
      scrollToError();
      return;
    }

    let hasError = false;

  if (!formData.city) {
    setCityError(isRTL ? "من فضلك اختر المحافظة" : "Please select a city");
    hasError = true;
  }

  if (!formData.bostaDistrictId) {
    setDistrictError(isRTL ? "من فضلك اختر الحي" : "Please select a district");
    hasError = true;
  }

  if (hasError) {
    // السكرول اللي بيطلع العميل لمكان المشكلة
    shippingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

    // =========================
    // ORDER ITEMS
    // =========================
    const orderItems = cart.map((item) => {
      const actualId = item.bundle || item.product || item._id || item.id;

      return item.isBundle
        ? {
            bundle: actualId,
            isBundle: true,
            quantity: item.qty,
            bundleItems: item.bundleItems.map((bi) => ({
              product: bi.productId || bi.product || bi._id,
              variantId: bi.variantId,
              name: bi.name,
              size: bi.size,
              color: bi.color,
            })),
          }
        : {
            product: actualId,
            variantId: item.variantId,
            quantity: item.qty,
            color: item.color,
            size: item.size,
            price: item.price,
          };
    });

    const token = localStorage.getItem("token");

    const commonData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      secondaryPhone: formData.secondaryPhone,

      shippingAddress: {
        city: formData.city,
        cityName: selectedCityObj
          ? isRTL
            ? selectedCityObj.cityAr
            : selectedCityObj.cityEn
          : "",
        district: formData.district,
        address: formData.address,
        buildingNumber: formData.buildingNumber,
        floor: formData.floor,
        apartment: formData.apartment,
        country: "Egypt",
        bostaCityId: selectedCityObj?.bostaCityId || "",
        bostaDistrictId: formData.bostaDistrictId,
      },

      paymentMethod: formData.paymentMethod,
      orderItems,
      discountCode: discountInfo?.valid ? formData.discountCode : null,
      buildingNumber: formData.buildingNumber,
      floor: formData.floor,
      apartment: formData.apartment,
    };

    let res;

    if (formData.paymentMethod === "card") {
      res = await api.post("/orders", commonData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.paymentURL) {
        clearCart();
        window.location.href = res.data.paymentURL;
      }
    } else {
      const payload = new FormData();

      Object.keys(commonData).forEach((key) => {
        if (key === "shippingAddress" || key === "orderItems") {
          payload.append(key, JSON.stringify(commonData[key]));
        } else if (commonData[key]) {
          payload.append(key, commonData[key]);
        }
      });

      res = await api.post("/orders", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      clearCart();
      toast.success(isRTL ? "🎉 تم تسجيل طلبك بنجاح" : "🎉 Order placed successfully");
      navigate(`/thankyou/${res.data._id || res.data.order?._id}`);
    }

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        (isRTL ? "⚠️ حصل خطأ أثناء الإرسال" : "⚠️ Something went wrong")
    );
    scrollToError();
  } finally {
    setLoading(false);
  }
};

const isFreeShipping = shippingCost === 0 && discountInfo?.freeShippingApplied;

const cartTotal = cart.reduce(
  (acc, item) => acc + item.price * item.qty,
  0
);

// خصم المنتجات فقط (بدون الشحن)
const totalDiscountAmount = Math.round(
  isFreeShipping ? 0 : (discountInfo?.discountAmount || 0)
);

// الشحن
const effectiveShippingCost = isFreeShipping ? 0 : shippingCost;

// الإجمالي النهائي
const totalWithDiscount = Math.round(
  cartTotal + effectiveShippingCost - totalDiscountAmount
);


return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500 pb-20">
      
      <OrderSummary 
        cart={cart} 
        isRTL={isRTL} 
        removeFromCart={removeFromCart} 
        updateQty={(id, qty) => {
          updateQty(id, qty);
          // إعادة التحقق من الخصم تلقائياً عند تغيير الكمية لضمان صحة الحسابات
          if (discountInfo) validateDiscount(formData.discountCode);
        }} 
        clearCart={clearCart} 
        navigate={navigate} 
      />

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-8 mt-4">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 🔝 Sticky Header */}
          <div className="sticky top-[64px] sm:top-[70px] z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5 px-4 py-3 mb-6 -mx-4 sm:-mx-6">
            <div className="max-w-2xl mx-auto flex items-center justify-between relative min-h-[40px]">
              <button 
                type="button"
                onClick={() => navigate(-1)} 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors z-10"
              >
                <ChevronLeft size={24} className={`${isRTL ? 'rotate-180' : ''} text-slate-900 dark:text-red-700`} />
              </button>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="text-base sm:text-lg font-black uppercase    text-slate-900 dark:text-white pointer-events-auto">
                  {isRTL ? "إتمام الطلب" : "Checkout"}
                </h1>
              </div>
              <div className="w-10"></div>
            </div>
          </div>

          {/* 📍 Section 1: Personal Info */}
          <section className="space-y-4">
            <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase  px-1">
              {isRTL ? "المعلومات الشخصية" : "Personal Information"}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2"> {/* حاوية للمدخل والرسالة */}
  <div className="relative group">
    <User 
      size={18} 
      className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 ${nameError ? 'text-red-500' : 'text-slate-400'} group-focus-within:text-red-700 transition-colors`} 
    />
    <input
      type="text" 
      name="name" 
      required 
      value={formData.name} 
      onChange={(e) => {
        handleChange(e);
        if (nameError) setNameError(""); // مسح الخطأ بمجرد ما يبدأ يصحح
      }}
      onBlur={(e) => {
        // التأكد إن فيه مسافة بين كلمتين على الأقل
        const value = e.target.value.trim();
        const parts = value.split(/\s+/); // تقسيم النص بناءً على المسافات
        if (value && parts.length < 2) {
          setNameError(isRTL ? "يرجى إدخال الاسم ثنائياً على الأقل" : "Please enter at least two names");
        } else {
          setNameError("");
        }
      }}
      placeholder={isRTL ? "الاسم بالكامل" : "Full Name"}
      className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border ${nameError ? 'border-red-500' : 'border-transparent dark:border-white/5'} rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-bold text-slate-900 dark:text-white`}
    />
  </div>
  
  {/* رسالة الخطأ */}
  {nameError && (
    <p className={`text-[11px] font-bold text-red-500 ${isRTL ? 'pr-4' : 'pl-4'} animate-pulse`}>
      {nameError}
    </p>
  )}
</div>
              
      {/* 📱 رقم الهاتف الأساسي */}
<div className="relative group">
  <Phone 
    size={18} 
    className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700 transition-colors`} 
  />
  <input
    type="tel" 
    name="phone" 
    required 
    value={formData.phone} 
    onChange={handleChange}
    placeholder={isRTL ? "رقم الهاتف" : "Phone Number"}
    className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-black  text-slate-900 dark:text-white`}
  />
</div>

{/* 📱 رقم الهاتف الإضافي (اختياري) */}
<div className="relative group">
  <Phone 
    size={18} 
    className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700 transition-colors`} 
  />
  <input
    type="tel" 
    name="secondaryPhone" 
    value={formData.secondaryPhone || ''} 
    onChange={handleChange}
    placeholder={isRTL ? "رقم هاتف إضافي (اختياري)" : "Secondary Phone (Optional)"}
    className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-black  text-slate-900 dark:text-white`}
  />
</div>


              <div className="relative group">
                <Mail size={18} className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700 transition-colors`} />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder={isRTL ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-bold text-slate-900 dark:text-white`}
                />
              </div>
            </div>
          </section>

       {/* 🚚 Section 2: Shipping */}
<section ref={shippingSectionRef} className="space-y-4">
  <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase px-1">
    {isRTL ? "عنوان الشحن" : "Shipping Address"}
  </h2>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* 🏙️ المحافظة */}
    <div className="space-y-2">
      <select
        name="city" 
        value={formData.city} 
        onChange={(e) => {
          handleChange(e);
          if (cityError) setCityError(""); // مسح الخطأ عند الاختيار
        }} 
        required
        className={`w-full p-4 bg-slate-50 dark:bg-[#111111] border ${cityError ? 'border-red-500' : 'border-transparent dark:border-white/5'} rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-bold text-slate-900 dark:text-white appearance-none`}
      >
        <option value="">{isRTL ? "المحافظة" : "Select City"}</option>
        {citiesList.map((c) => (
          <option key={c._id} value={c._id}>{isRTL ? c.cityAr : c.cityEn}</option>
        ))}
      </select>
      {cityError && (
        <p className={`text-[11px] font-bold text-red-500 ${isRTL ? 'pr-4' : 'pl-4'} animate-pulse`}>
          {cityError}
        </p>
      )}
    </div>

    {/* 🏘️ الحي / المنطقة */}
    <div className="space-y-2">
      <select
        name="district" 
        value={formData.bostaDistrictId} 
        onChange={(e) => {
          handleChange(e);
          if (districtError) setDistrictError(""); // مسح الخطأ عند الاختيار
        }} 
        required
        className={`w-full p-4 bg-slate-50 dark:bg-[#111111] border ${districtError ? 'border-red-500' : 'border-transparent dark:border-white/5'} rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-bold text-slate-900 dark:text-white appearance-none`}
      >
        <option value="">{isRTL ? "الحي / المنطقة" : "Select District"}</option>
        {districts.map((d) => (
          <option key={d._id} value={d.bostaDistrictId}>{isRTL ? d.nameAr : (d.nameEn || d.nameAr)}</option>
        ))}
      </select>
      {districtError && (
        <p className={`text-[11px] font-bold text-red-500 ${isRTL ? 'pr-4' : 'pl-4'} animate-pulse`}>
          {districtError}
        </p>
      )}
    </div>
  </div>

  {/* 📍 العنوان بالتفصيل */}
  <div className="relative group">
    <MapPin size={18} className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700`} />
    <input
      type="text" 
      name="address" 
      required 
      value={formData.address} 
      onChange={handleChange}
      autoComplete="new-address"
      placeholder={isRTL ? "العنوان بالتفصيل (اسم الشارع / علامة مميزة)" : "Detailed Address"}
      className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-bold text-slate-900 dark:text-white`}
    />
  </div>

  {/* 🏢 تفاصيل السكن */}
  <div className="grid grid-cols-3 gap-3">
    <input type="text" name="buildingNumber" placeholder={isRTL ? "عمارة" : "Bldg"} value={formData.buildingNumber} onChange={handleChange} className="p-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-2xl outline-none text-center font-black text-slate-900 dark:text-white focus:border-red-700" />
    <input type="text" name="floor" placeholder={isRTL ? "دور" : "Floor"} value={formData.floor} onChange={handleChange} className="p-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-2xl outline-none text-center font-black text-slate-900 dark:text-white focus:border-red-700" />
    <input type="text" name="apartment" placeholder={isRTL ? "شقة" : "Apt"} value={formData.apartment} onChange={handleChange} className="p-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-2xl outline-none text-center font-black text-slate-900 dark:text-white focus:border-red-700" />
  </div>
</section>

          {/* 🏷️ Discount Section */}
          <section className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase ">
                {isRTL ? "كود الخصم" : "Discount Code"}
              </h2>
              <button
  type="button"
  onClick={() => setShowDiscountModal(true)}
  className="text-[15px] font-black text-black dark:text-white uppercase  underline decoration-2 decoration-red-800 underline-offset-4 hover:decoration-red-600 transition-all"
>
  ✨ {isRTL ? "استكشف العروض" : "View Offers"}
</button>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Tag size={18} className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700`} />
               <input
  type="text"
  name="discountCode"
  value={formData.discountCode}
  onChange={(e) => {
    setFormData(p => ({
      ...p,
      discountCode: e.target.value.toUpperCase()
    }));

    // 🔥 مهم جدًا: reset الحالة عند أي تغيير
    setIsDiscountApplied(false);
    setDiscountInfo(null);
    setDiscountError("");
  }}
  placeholder={isRTL ? "أدخل الكود هنا" : "Enter Code"}
  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-black text-slate-900 dark:text-red-700 uppercase`}
/>
              </div>
             <button
  type="button"
  onClick={async () => {
    const result = await validateDiscount(formData.discountCode);

    // 🔥 هنا بنفترض إن النجاح بيرجع true أو success
    if (result?.success || result === true) {
      setIsDiscountApplied(true);
      setDiscountError(""); 
    }
  }}
  disabled={isDiscountApplied}
  className={`px-6 rounded-[1.5rem] font-black uppercase text-xs transition-all ${
    isDiscountApplied
      ? "bg-red-600 text-white cursor-not-allowed"
      : "bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-red-700 dark:hover:bg-red-700"
  }`}
>
  {isDiscountApplied
    ? (isRTL ? "تم التفعيل" : "Applied")
    : (isRTL ? "تفعيل" : "Apply")}
</button>
            </div>
            {discountError && <p className="text-[10px] font-bold text-red-500 px-4">{discountError}</p>}
          </section>

      {/* 🎫 Offers Modal */}
{showDiscountModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">

    <div className="bg-white dark:bg-[#0A0A0A] w-full max-w-md rounded-[3rem] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden relative">

      {/* Modal Header */}
      <div className="p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center">

        <div>
          <h3 className="text-xl font-black   uppercase text-black dark:text-white">
            {isRTL ? "فيسترو أوفيرز" : "Vestro Offers"}
          </h3>

          <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase ">
            {isRTL ? "وفر أكتر مع طلبك النهاردة" : "Save more on your order"}
          </p>
        </div>

        {/* ❌ Close button (clean + red hover only) */}
        <button
          onClick={() => setShowDiscountModal(false)}
          className="w-10 h-10 rounded-full 
          bg-black/5 dark:bg-white/5 
          flex items-center justify-center 
          hover:bg-red-500 hover:text-white 
          dark:hover:bg-red-500 dark:hover:text-white
          transition-all"
        >
          ✕
        </button>

      </div>

      {/* Content */}
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">

        {availableDiscounts.length > 0 ? (
          availableDiscounts.map((disc) => {

            const isFreeShipping = disc.discountType === 'free_shipping';
            const isPercentage = disc.discountType === 'percentage';
            const isBOGO = ['bogo', 'bogo_discount'].includes(disc.discountType);

            return (
              <div
                key={disc._id}
                className="relative group overflow-hidden rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 p-5 bg-black/[0.02] dark:bg-white/[0.03] hover:border-black dark:hover:border-white transition-all"
              >

                {/* CODE + ACTION */}
                <div className="flex justify-between items-start mb-4">

                  <div>
                    <span className="text-2xl font-black   text-black dark:text-white uppercase ">
                      {disc.code}
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>

                      <span className="text-[10px] font-black uppercase text-black/50 dark:text-white/50 ">
                        {isFreeShipping
                          ? (isRTL ? "شحن مجاني" : "FREE SHIPPING")
                          : isPercentage
                            ? (isRTL ? `خصم ${disc.percentage}%` : `${disc.percentage}% OFF`)
                            : "BOGO OFFER"}
                      </span>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                  type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(disc.code);
                      setFormData(prev => ({ ...prev, discountCode: disc.code }));
                      validateDiscount(disc.code, false);
                      
                    }}
                    className="px-4 py-2 rounded-full text-[10px] font-black uppercase  
                    bg-black text-white dark:bg-white dark:text-black
                    hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white
                    transition-all active:scale-95"
                  >
                    {isRTL ? "نسخ وتفعيل" : "Copy & Apply"}
                  </button>

                </div>

                {/* Description */}
                <div className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 mb-4">

                  <p className="text-xs font-bold text-black/70 dark:text-white/70 flex items-center gap-2">

                    <span className="text-red-500">
                      {isFreeShipping ? "🚚" : "🏷️"}
                    </span>

                    {isFreeShipping
                      ? (isRTL
                        ? `شحن مجاني للطلبات أكثر من ${disc.minOrderAmount} ج.م`
                        : `Free Shipping on orders above ${disc.minOrderAmount} EGP`)
                      : isPercentage
                        ? (isRTL
                          ? `خصم ${disc.percentage}% على مشترياتك`
                          : `${disc.percentage}% Discount on your order`)
                        : (isRTL
                          ? `اشتري ${disc.buyQuantity} وخد ${disc.getQuantity}`
                          : `Buy ${disc.buyQuantity} Get ${disc.getQuantity}`)}
                  </p>

                </div>

                {/* Products */}
                <div className="pt-3 border-t border-black/10 dark:border-white/10">

                  {disc.appliesToAll ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-sm">●</span>
                      <span className="text-[10px] font-black uppercase   text-black dark:text-white">
                        {isRTL ? "يشمل جميع منتجات المتجر" : "Applied to all products"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto pb-2">

                      {disc.applicableProducts?.map((p) => (
                        <a
                          key={p._id}
                          href={`/product/${p._id}`}
                          className="flex items-center gap-2 p-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-black dark:hover:border-white transition-all"
                        >
                          <img
                            src={p.images?.[0]?.url || p.image}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="text-[10px] font-bold max-w-[80px] truncate text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">
                            {p.name}
                          </span>
                        </a>
                      ))}

                    </div>
                  )}

                </div>

              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-sm font-black uppercase text-black/40 dark:text-white/40">
              {isRTL ? "لا توجد عروض حالياً" : "No Offers Available"}
            </p>
          </div>
        )}

      </div>
    </div>
  </div>
)}

       {/* 💳 Payment Method */}
<section className="space-y-4">
  <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase  px-1">
    {isRTL ? "طريقة الدفع" : "Payment Method"}
  </h2>

  <div className="grid grid-cols-2 gap-4">

    {/* 💵 Cash */}
    <div 
      onClick={() => setFormData(p => ({...p, paymentMethod: 'cash'}))}
      className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-3 
      ${formData.paymentMethod === 'cash' 
        ? 'border-red-700 bg-red-700/10' 
        : 'border-transparent bg-slate-50 dark:bg-[#111111]'
      }`}
    >
      <Banknote size={28} className={formData.paymentMethod === 'cash' ? 'text-red-700' : 'text-slate-400'} />

      <span className={`text-[10px] font-black uppercase 
        ${formData.paymentMethod === 'cash' 
          ? 'text-slate-900 dark:text-white' 
          : 'text-slate-400'
        }`}
      >
        {isRTL ? "عند الاستلام" : "Cash on Delivery"}
      </span>
    </div>

    {/* 💳 Card (Disabled) */}
    <div
      onClick={() => {
        toast.info(
          isRTL
            ? "الدفع الإلكتروني قيد التحديث حالياً 🔧"
            : "Online payment is currently unavailable 🔧"
        );
      }}
      className="relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-3 
                 border-dashed border-red-400 bg-slate-50 dark:bg-[#111111] opacity-70"
    >
      <CreditCard size={28} className="text-slate-400" />

      <span className="text-[10px] font-black uppercase text-slate-400">
        {isRTL ? "فيزا / ماستر" : "Card / Visa"}
      </span>

      {/* ⚠️ Badge */}
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-[2px] rounded-full">
        {isRTL ? " غير متاح حاليا للتحديث" : "OFF"}
      </span>

      {/* 🔒 Overlay hint */}
      <span className="text-[9px] font-bold text-red-500 mt-1">
        {isRTL ? "قيد التحديث" : "Coming soon"}
      </span>
    </div>

  </div>
</section>

         {/* 💎 Vestro Dynamic Discount Summary */}
{discountInfo && (
  <div className="rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] p-6 border-[3px] border-black dark:border-red-700 relative overflow-hidden ] ">
    
    {/* Header: Title and Type */}
    <div className="flex justify-between items-center mb-6">
      <div className="bg-black text-white px-4 py-1 rounded-full text-xs font-black   uppercase">
        {discountInfo.discountType === 'free_shipping' ? '🚚 FREE SHIPPING MODE' : '🔥 OFFER ACTIVE'}
      </div>
      <span className="text-black dark:text-white font-black text-xl  ">{discountInfo.discountCode}</span>
    </div>

    {/* Items List */}
<div className="space-y-3">
  {cart.map((item, idx) => {
    const isApp =
      discountInfo?.appliesToAll ||
      discountInfo?.applicableProducts?.some(
        p => (p._id || p) === (item.product || item._id)
      );

    let priceDisplay = (
      <span className="text-sm font-black text-slate-900 dark:text-white">
        {item.price * item.qty || item.quantity} EGP
      </span>
    );

    if (isApp) {
      if (discountInfo.discountType === "percentage") {
        priceDisplay = (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 line-through font-bold">
              {item.price} EGP
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-red-700">
              {Math.round(
                item.price * (1 - discountInfo.percentage / 100)
              )}{" "}
              EGP
            </span>
          </div>
        );
      } else if (
        ["bogo", "bogo_discount"].includes(discountInfo.discountType)
      ) {
        priceDisplay = (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-red-500 font-black uppercase  ">
              Get Unit
            </span>
            <span className="text-sm font-black bg-emerald-500 dark:bg-red-700 text-white dark:text-black px-2 rounded-md ">
              FREE / DISCOUNTED
            </span>
          </div>
        );
      }
    }

    return (
      <div
        key={idx}
        className={`flex items-center justify-between p-4 rounded-2xl transition-all border
          ${
            isApp
              ? "bg-white dark:bg-[#111111] border-emerald-500 dark:border-red-700 shadow-sm"
              : "bg-slate-50 dark:bg-[#0A0A0A] border-transparent opacity-60"
          }`}
      >
        {/* Left Side */}
        <div className="flex items-center gap-4">
          
          {/* Image */}
          <div className="relative">
            <img
              src={item.image}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-white/10"
              alt=""
            />

            {isApp && (
              <div className="absolute -top-2 -left-2 bg-slate-900 dark:bg-black text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-emerald-500">
                {isRTL ? "مشمول" : "INCL"}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">
              {item.name}
            </span>

            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400  ">
              QTY: {item.qty || item.quantity}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="text-right">
          {priceDisplay}
        </div>
      </div>
    );
  })}
</div>

    {/* Total Savings: الواجهة القوية */}
    <div className="mt-8 p-5 bg-black rounded-[2rem] flex justify-between items-center border-2 ">
      <div>
        <p className="text-white text-[15px] font-black uppercase  mb-1">
          {isRTL ? "إجمالي التوفير" : "TOTAL SAVINGS"}
        </p>
        <h3 className="text-white text-3xl font-black  ">
          -{Math.round(discountInfo.discountAmount)} <span className="text-sm not-  uppercase">EGP</span>
        </h3>
      </div>
      <div className="text-right">
         {discountInfo.freeShippingApplied && (
            <div className="flex flex-col items-end">
                <span className="bg-red-700 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase   mb-1">
                   Free Delivery
                </span>
                <span className="text-white/50 text-[8px] font-bold uppercase">Applied to Order</span>
            </div>
         )}
      </div>
    </div>
  </div>
)}

         {/* 💰 Order Summary Card */}
<div className="bg-white dark:bg-black rounded-[2.5rem] p-8 text-slate-900 dark:text-white space-y-5 shadow-2xl relative border border-slate-100 dark:border-white/10 transition-all">

  {/* Subtotal */}
  <div className="flex justify-between items-center text-[15px] font-black uppercase ">
    <span>{isRTL ? "قيمة المشتريات" : "Subtotal"}</span>
    <span className="text-slate-900 dark:text-white">
      {Math.round(cartTotal)} EGP
    </span>
  </div>

  {/* Shipping */}
  <div className="flex justify-between items-center text-[15px] font-black uppercase ">
    <span>{isRTL ? "تكلفة الشحن" : "Shipping"}</span>

    <span
      className={
        shippingCost === 0 && selectedCityObj
          ? "text-emerald-600 dark:text-red-700 font-black  "
          : "text-slate-900 dark:text-white"
      }
    >
      {!selectedCityObj
        ? isRTL
          ? "بانتظار العنوان"
          : "Waiting for address"
        : shippingCost === 0
        ? isRTL
          ? "شحن مجاني 🎁"
          : "FREE SHIPPING 🎁"
        : `+${shippingCost} EGP`}
    </span>
  </div>

  {/* Discount */}
  {discountInfo && (
    <div className="flex justify-between items-center text-[15px] font-black uppercase ">
      <span>{isRTL ? "الخصم" : "Discount"}</span>
      <span className="text-red-700 ">
        -{Math.round(discountInfo.discountAmount)} EGP
      </span>
    </div>
  )}

  {/* Total */}
  <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-between items-end">
    
    <div>
      <span className="text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1 block">
        {isRTL ? "المبلغ الإجمالي" : "Grand Total"}
      </span>

      <div className="text-4xl font-black   leading-none  text-red-600">
        {totalWithDiscount}
        <small className="text-xs not-  opacity-40 font-bold ml-1">
          EGP
        </small>
      </div>
    </div>

    {/* Icon */}
    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
      <Home size={20} className="text-red-600 opacity-60" />
    </div>

  </div>
</div>

          {/* 🚀 Submit Button */}
          <button
            type="submit" disabled={loading}
            className={`w-full py-6 rounded-[2rem] font-black uppercase    transition-all shadow-2xl relative overflow-hidden group
              ${loading ? 'bg-slate-800 cursor-wait' : 'bg-black text-white dark:text-black dark:bg-white hover:scale-[1.02] active:scale-95 '}
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                {isRTL ? "جاري الحفظ..." : "Processing..."}
              </div>
            ) : (
              <span className="relative z-10">{isRTL ? "تأكيد الأوردر الآن" : "Confirm Order Now"}</span>
            )}
            {!loading && <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:-translate-x-full transition-transform duration-700  "></div>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;




