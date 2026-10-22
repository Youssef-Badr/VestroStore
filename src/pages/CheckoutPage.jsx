// /* eslint-disable no-unused-vars */
// import { useState, useEffect,useRef } from "react";
// import Select from "react-select";
// import { useCart } from "../contexts/CartContext";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../contexts/LanguageContext";
// import api from "../../src/api/axiosInstance";
// import { useTheme } from "../contexts/ThemeContext";
// import OrderSummary from "./../components/OrderSummary";
// import { ChevronLeft, MapPin, Phone, User, Mail, CreditCard, Banknote, Tag, Home } from "lucide-react";
// import { getMetaCookies } from "../utils/metaCookies";
// const CheckoutPage = () => {
//   const { cart, clearCart, updateQty, removeFromCart } = useCart();
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const isRTL = language === "ar";
// const { darkMode } = useTheme();
//   const [citiesList, setCitiesList] = useState([]);
//   const [shippingCost, setShippingCost] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [instaPayProof, setInstaPayProof] = useState(null);
//   const [districts, setDistricts] = useState([]);
//   const [selectedCityObj, setSelectedCityObj] = useState(null);
//   const [availableDiscounts, setAvailableDiscounts] = useState([]);
//   const [showDiscountModal, setShowDiscountModal] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [discountError, setDiscountError] = useState(""); // لمسح رسائل الخطأ
//   const [isDiscountApplied, setIsDiscountApplied] = useState(false);
//   const [nameError, setNameError] = useState("");
//   const [cityError, setCityError] = useState("");
//   const [districtError, setDistrictError] = useState("");
//   const nameRef = useRef(null);
//   const cityRef = useRef(null);
// const districtRef = useRef(null);
// const addressRef = useRef(null);
// const shippingSectionRef = useRef(null); // عشان السكرول
// const [baseShippingCost, setBaseShippingCost] = useState(0); 
 
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     secondaryPhone: "",
//     marketingConsent: true,
//     city: "",
//     district: "",
//     bostaDistrictId: "",
//     address: "",
//     paymentMethod: "cash",
//     discountCode: "",
//     buildingNumber: "",
//     floor: "",
//     apartment: "",
//   });

//   const [discountInfo, setDiscountInfo] = useState(null);
//   const cityOptions = citiesList.map(c => ({
//   value: c._id,
//   label: isRTL ? c.cityAr : c.cityEn
// }));

// const districtOptions = districts.map(d => ({
//   value: d.bostaDistrictId,
//   label: isRTL ? d.nameAr : (d.nameEn || d.nameAr)
// }));
// const customSelectStyles = (isRTL, hasError) => ({
//   control: (base, state) => ({
//     ...base,
//     backgroundColor: "transparent", // زي input
//     border: hasError
//       ? "1px solid #ef4444"
//       : "1px solid transparent",
//     borderRadius: "1.5rem",
//     minHeight: "56px",
//     boxShadow: "none",
//     padding: "0 4px",
//     direction: isRTL ? "rtl" : "ltr",

//     "&:hover": {
//       border: hasError
//         ? "1px solid #ef4444"
//         : "1px solid transparent",
//     },
//   }),

//   valueContainer: (base) => ({
//     ...base,
//     padding: isRTL ? "0 16px 0 12px" : "0 12px 0 16px",
//   }),

//   input: (base) => ({
//     ...base,
//     color: "inherit", // نفس لون النص
//     fontWeight: "bold",
//   }),

//   placeholder: (base) => ({
//     ...base,
//     color: "#9ca3af", // زي input placeholder
//     fontWeight: "bold",
//   }),

//   singleValue: (base) => ({
//     ...base,
//     color: "inherit",
//     fontWeight: "bold",
//   }),

//  menu: (base) => ({
//   ...base,
//  backgroundColor: darkMode ? "#111111" : "white",  borderRadius: "1rem",
//   overflow: "hidden",
//   zIndex: 9999,
//   boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
// }),
// menuList: (base) => ({
//   ...base,
//   maxHeight: "600px", // 🔥 كان صغير → بقى كبير
//   padding: "6px",
// }),

//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isFocused
//     ? (darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9")
//     : (darkMode ? "#111111" : "white"),
//     color:  darkMode ? "white" : "#111111",  borderRadius: "1rem",
//     fontWeight: "bold",
//     cursor: "pointer",
//     textAlign: isRTL ? "right" : "left",
//   }),

//   dropdownIndicator: (base) => ({
//     ...base,
//     color: "#9ca3af",
//   }),

//   indicatorSeparator: () => ({
//     display: "none",
//   }),
// });

//   const normalizePhone = (value) => {
//   if (!value) return value;

//   return value
//     // عربي
//     .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
//     // فارسي
//     .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
//     // حذف أي حاجة مش رقم
//     .replace(/\s+/g, "")
//     .replace(/[^0-9]/g, "");
// };



//  const tenHoursInMs = 15 * 60 * 30000;
//   const timeBlock = Math.floor(Date.now() / tenHoursInMs);
//   const normalizedPhone = normalizePhone(formData.phone); 
  
//   const eventId = `init-${normalizedPhone}-${timeBlock}`;
//   const trackInitiateCheckout = (cart) => {
//   if (!window.fbq) return;

//   let totalValue = 0;

//   const contents = cart.map((item) => {
//     const id = item.isBundle
//       ? item.bundleItems?.map(i => i.variantId) // لو bundle
//       : item.variantId;

//     totalValue += (Number(item.price) || 0) * (Number(item.qty) || 0);

//     return {
//       id: item.variantId, // ✅ دا المهم (مش product ولا bundle)
//       quantity: item.qty,
//       item_price: item.price,
//     };
//   });

//   const contentIds = cart.flatMap(item =>
//     item.isBundle
//       ? item.bundleItems.map(i => i.variantId)
//       : [item.variantId]
//   );

//   const nameParts = (formData.name || "").trim().split(/\s+/);
//   const firstName = nameParts[0] || "";
//   const lastName =
//     nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

//   window.fbq(
//     "track",
//     "InitiateCheckout",
//     {
//       content_type: "product",
//       currency: "EGP",
//       value: totalValue,

//       content_ids: contentIds, // ✅ أهم سطر هنا

//       contents,

//       num_items: cart.reduce((sum, i) => sum + i.qty, 0),
//     },
//     {
//       eventID: eventId, // ✅ لازم يبقى هنا
//       em: formData.email?.trim().toLowerCase() || undefined,
//       ph: normalizedPhone || undefined,
//       fn: firstName.toLowerCase(),
//       ln: lastName.toLowerCase(),
//       ct: formData.cityName || undefined,
//       country: "eg",
//       external_id: normalizedPhone,
//     }
//   );
// };
// //   const trackInitiateCheckout = (cart) => {
// //     if (!window.fbq) return;

// //     let totalValue = 0;
// //     const contents = cart.map((item) => {
// //       totalValue += (Number(item.price) || 0) * (Number(item.qty) || 0);
// //       return {
// //         id: item.isBundle ? item.bundle : item.variantId,
// //         quantity: item.qty,
// //         item_price: item.price,
// //       };
// //     });

// //     // 1. تقسيم الاسم لضمان جودة المطابقة
// //     const nameParts = (formData.name || "").trim().split(/\s+/);
// //     const firstName = nameParts[0] || "";
// //     const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

// //     window.fbq("track", "InitiateCheckout", {
// //       content_type: "product",
// //       currency: "EGP",
// //       value: totalValue,
// //       contents,
// //       num_items: cart.reduce((sum, i) => sum + i.qty, 0),
// //     }, {
// //       // 2. 🔥 إضافة بيانات العميل هنا هي اللي هتشيل التحذير
// //       eventID: eventId,
// //      em: formData.email?.trim().toLowerCase() || undefined,     // البريد الإلكتروني
// //       ph: normalizedPhone || undefined,    // رقم الهاتف
// //      fn: firstName.toLowerCase(),
// // ln: lastName.toLowerCase(),                     // اسم العائلة
// //       ct: formData.cityName || undefined, // المدينة (لو متوفرة في الفورم)
// //       country: "eg",                       // الدولة
// //       external_id: normalizedPhone         // معرف خارجي لربط أقوى
// //     });
// //   };

 

//   // 🌍 جلب المدن عند التحميل
//   useEffect(() => {
//     const fetchCities = async () => {
//       try {
//         const res = await api.get("/delivery-charges/public");
//         setCitiesList(res.data);
//       } catch (error) {
//         console.error(error);
//         toast.error(isRTL ? "حدث خطأ أثناء تحميل المدن" : "Failed to load cities");
//       }
//     };
//     fetchCities();
//   }, [isRTL]);

//   // 🎁 جلب الكوبونات النشطة فقط (بناءً على التعديل الجديد في الـ Backend)
//   useEffect(() => {
//     const fetchDiscounts = async () => {
//       try {
//         const res = await api.get("/discounts/active");
//         setAvailableDiscounts(res.data);
//       } catch (error) {
//         console.error("Error fetching discounts", error);
//       }
//     };
//     fetchDiscounts();
//   }, []);

//   // 👇👇 هنا تحطها
// useEffect(() => {
//   if (cart?.length) {
//     trackInitiateCheckout(cart);
//   }
// // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [cart]);




//  // 🔄 معالجة التغييرات في الحقول
// const handleChange = async (e) => {
//   const { name, value } = e.target;

  

//   if (name === "phone" || name === "secondaryPhone") {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: normalizePhone(value).slice(0, 11),
//     }));
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }
// };
// const handleCityChange = async (selected) => {
//   const value = selected?.value || "";

//   setFormData((prev) => ({
//     ...prev,
//     city: value,
//     district: "",
//     bostaDistrictId: "",
//   }));

//   const cityData = citiesList.find((c) => c._id === value);

//   if (cityData) {
//     setShippingCost(cityData.charge);
//     setBaseShippingCost(cityData.charge);

//     setDiscountInfo(null);
//     setIsDiscountApplied(false);

//     setSelectedCityObj(cityData);

//     try {
//       const res = await api.get(`/districts/${cityData.bostaCityId}`);
//       setDistricts(res.data);
//     } catch (err) {
//       setDistricts([]);
//       toast.error(
//         isRTL ? "تعذر تحميل الأحياء" : "Could not load districts"
//       );
//     }
//   } else {
//     setShippingCost(0);
//     setBaseShippingCost(0);
//     setSelectedCityObj(null);
//     setDistricts([]);
//   }

//   if (cityError) setCityError("");
// };

// const handleDistrictChange = (selected) => {
//   const value = selected?.value || "";

//   const selectedDistrict = districts.find(
//     (d) => String(d.bostaDistrictId) === String(value)
//   );

//   if (selectedDistrict) {
//     setFormData((prev) => ({
//       ...prev,
//       district: selectedDistrict.nameAr,
//       bostaDistrictId: value,
//     }));
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       district: "",
//       bostaDistrictId: "",
//     }));
//   }

//   if (districtError) setDistrictError("");
// };

// const validateDiscount = async (codeToValidate, isCheckout = true) => {
//   const code = codeToValidate || formData.discountCode;
//   setDiscountError("");

//   if (!code || code.trim() === "") {
//     setDiscountInfo(null);
//     setIsDiscountApplied(false);
//     setShippingCost(baseShippingCost); // 🔥 reset
//     return false;
//   }

//   try {
//    const res = await api.post("/discounts/validate", {
//   code: code.trim(),

//   cartItems: cart.map((item) => ({
//     productId: item.product || item._id,
//     quantity: item.qty || item.quantity,
//     price: Number(item.price) || 0,
//   })),

//   subtotal: cart.reduce(
//     (total, item) =>
//       total + (Number(item.price) || 0) * (Number(item.qty) || Number(item.quantity) || 0),
//     0
//   ),

//   shippingPrice: baseShippingCost,
// });
//     // ❌ لو الكود غير صالح
//     if (!res.data.valid) {
//       setDiscountInfo(null);
//       setIsDiscountApplied(false);
//       setShippingCost(baseShippingCost);
//       return false;
//     }
// // =========================
// // ✅ SUCCESS CASE
// // =========================
// const activeDiscount = availableDiscounts.find(
//   (discount) => discount.code?.toUpperCase() === (res.data.discount?.code || code.trim()).toUpperCase()
// );

// setDiscountInfo({
//   ...res.data,
//   ...res.data.discount,
//   ...activeDiscount,
//   discountCode: res.data.discount?.code || code.trim(),
//   discountAmount: Number(res.data.discountAmount) || 0,
//   freeShippingApplied: res.data.discount?.freeShipping === true,
// });

// setIsDiscountApplied(true);
// setDiscountError("");

// // 🔥 أهم جزء: reset الأول
// setShippingCost(baseShippingCost);

// // لو فيه شحن مجاني
// if (res.data.discount?.freeShipping === true) {
//   setShippingCost(0);
// }

//     toast.success(
//       isRTL ? "تم تطبيق الخصم بنجاح! 🔥" : "Discount applied! 🔥",
//       {
//         style: {
//           borderRadius: "20px",
//           background: "#0A0A0A",
//           color: "#ffffff",
//           border: "1px solid #dc2626",
//         },
//       }
//     );

//     if (showDiscountModal) setShowDiscountModal(false);

//     return true;

//   } catch (err) {
//     const msg =
//       err.response?.data?.message ||
//       (isRTL ? "⚠️ كود غير صالح" : "⚠️ Invalid code");

//     setDiscountInfo(null);
//     setIsDiscountApplied(false);
//     setShippingCost(baseShippingCost); // 🔥 reset مهم جداً
//     setDiscountError(msg);

//     toast.error(msg, {
//       style: {
//         borderRadius: "20px",
//         background: "#fff",
//         color: "#ff0000",
//         fontWeight: "bold",
//       },
//     });

//     return false;
//   }
// };

// // const scrollToError = () => {
// //   // بنستنى لحظة عشان الـ React يلحق يضيف كلاسات الخطأ للـ DOM
// //   setTimeout(() => {
// //     // بندور على أول حقل فيه كلاس الخطأ (عدل الكلاسات دي حسب اللي بتستخدمه)
// //     const errorElement = document.querySelector('.text-red-500, .border-red-500, [aria-invalid="true"]');
    
// //     if (errorElement) {
// //       // بنجيب مكان العنصر بالنسبة للصفحة
// //       const yOffset = -150; // مسافة أمان عشان الـ Header (غير الرقم ده حسب طول الهيدر عندك)
// //       const y = errorElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

// //       window.scrollTo({
// //         top: y,
// //         behavior: 'smooth'
// //       });
// //     }
// //   }, 150); // زودنا الوقت شوية لـ 150ms للتأكيد
// // };
// const scrollToRef = (ref) => {
//   setTimeout(() => {
//     ref.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//   }, 100);
// };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//    if (loading) return; // 🔥 منع الضغط المتكرر
//   setLoading(true);

//   // تصفير الأخطاء السابقة
//   setNameError("");
//   setCityError("");
//   setDistrictError("");

//   const { fbp, fbc } = getMetaCookies();
  
//   try {
//     // 0. تشيك عربة التسوق
//     if (cart.length === 0) {
//       toast.error(isRTL ? "عربة التسوق فارغة ❌" : "Your cart empty ❌");
//       setLoading(false);
//       return;
//     }

//     if (formData.paymentMethod === "instapay" && !instaPayProof) {
//       toast.error(isRTL ? "ارفع صورة إثبات تحويل إنستا باي" : "Please upload your InstaPay payment screenshot");
//       setLoading(false);
//       return;
//     }

//     let hasValidationError = false;
//     let firstErrorRef = null;

//     // 1️⃣ فحص الاسم
//     const nameParts = formData.name ? formData.name.trim().split(/\s+/) : [];
//     if (!formData.name || !formData.name.trim() || nameParts.length < 2) {
//       setNameError(isRTL ? "الاسم يجب أن يكون ثنائياً" : "Name must be at least two words");
//       hasValidationError = true;
//       if (!firstErrorRef) firstErrorRef = nameRef; // 🎯 حجز أول خطأ للاسم
//     }

//     // 2️⃣ فحص رقم الهاتف الأساسي
//     const phoneRegex = /^(010|011|012|015)\d{8}$/;
//     if (!formData.phone || !phoneRegex.test(formData.phone)) {
//       toast.error(isRTL ? "⚠️ رقم الهاتف غير صالح" : "⚠️ Invalid phone number");
//       hasValidationError = true;
//     }

//     // 3️⃣ فحص الهاتف الإضافي
//     if (formData.secondaryPhone && !phoneRegex.test(formData.secondaryPhone)) {
//       toast.error(isRTL ? "رقم الهاتف الإضافي غير صحيح" : "Invalid secondary phone number");
//       hasValidationError = true;
//     }

//     // 4️⃣ فحص المحافظة/المدينة
//     if (!formData.city) {
//       setCityError(isRTL ? "من فضلك اختر المحافظة" : "Please select a city");
//       toast.error(isRTL ? "⚠️ الرجاء اختيار المحافظة" : "⚠️ Please select a city");
//       hasValidationError = true;
//       if (!firstErrorRef) firstErrorRef = shippingSectionRef;
//     }

//     // 5️⃣ فحص الحي / المنطقة (لن يظهر أو يفحص إلا إذا تم اختيار المحافظة أولاً)
//     if (formData.city && !formData.bostaDistrictId) {
//       setDistrictError(isRTL ? "من فضلك اختر الحي" : "Please select a district");
//       toast.error(isRTL ? "⚠️ الرجاء اختيار الحي أو المنطقة" : "⚠️ Please select a district");
//       hasValidationError = true;
//       if (!firstErrorRef) firstErrorRef = shippingSectionRef;
//     }

//     // 6️⃣ فحص العنوان بالتفصيل
//     if (!formData.address || !formData.address.trim()) {
//       toast.error(isRTL ? "⚠️ الرجاء إدخال العنوان بالتفصيل" : "⚠️ Please enter detailed address");
//       hasValidationError = true;
//       if (!firstErrorRef) firstErrorRef = shippingSectionRef;
//     }

//     // 🚨 إيقاف الفورم وعمل سكرول في حالة وجود أي خطأ
//     if (hasValidationError) {
//       if (firstErrorRef && firstErrorRef.current) {
//         setTimeout(() => {
//           firstErrorRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "center",
//           });

//           setTimeout(() => {
//             firstErrorRef.current
//               ?.querySelector("input, .react-select__input")
//               ?.focus?.();
//           }, 250);
//         }, 50);
//       }

//       setLoading(false);
//       return; 
//     }

//     // =========================================================
//     // إرسال البيانات للـ API (باقي الكود السليم الخاص بك)
//     // =========================================================
//     const orderItems = cart.map((item) => {
//       const actualId = item.bundle || item.product || item._id || item.id;
//       return item.isBundle
//         ? {
//             bundle: actualId,
//             isBundle: true,
//             quantity: item.qty,
//             bundleItems: item.bundleItems.map((bi) => ({
//               product: bi.productId || bi.product || bi._id,
//               variantId: bi.variantId,
//               name: bi.name,
//               size: bi.size,
//               color: bi.color,
//             })),
//           }
//         : {
//             product: actualId,
//             variantId: item.variantId,
//             quantity: item.qty,
//             color: item.color,
//             size: item.size,
//             price: item.price,
//           };
//     });

//     const token = localStorage.getItem("token");
//     const commonData = {
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       marketingConsent: formData.marketingConsent,
//       secondaryPhone: formData.secondaryPhone,
//       fbp,
//       fbc,
//       shippingAddress: {
//         city: formData.city,
//         cityName: selectedCityObj
//           ? isRTL
//             ? selectedCityObj.cityAr
//             : selectedCityObj.cityEn
//           : "",
//         district: formData.district,
//         address: formData.address,
//         buildingNumber: formData.buildingNumber,
//         floor: formData.floor,
//         apartment: formData.apartment,
//         country: "Egypt",
//         bostaCityId: selectedCityObj?.bostaCityId || "",
//         bostaDistrictId: formData.bostaDistrictId,
//       },
//       paymentMethod: formData.paymentMethod,
//       orderItems,
//       discountCode: discountInfo?.valid ? formData.discountCode : null,
//       buildingNumber: formData.buildingNumber,
//       floor: formData.floor,
//       apartment: formData.apartment,
//       eventId
//     };

//     let res;
//     if (formData.paymentMethod === "card") {
//       res = await api.post("/orders", commonData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.paymentURL) {
//         clearCart();
//         window.location.href = res.data.paymentURL;
//       }
//     } else {
//       const payload = new FormData();
//       Object.keys(commonData).forEach((key) => {
//         if (key === "shippingAddress" || key === "orderItems") {
//           payload.append(key, JSON.stringify(commonData[key]));
//         } else if (commonData[key]) {
//           payload.append(key, commonData[key]);
//         }
//       });

//       if (formData.paymentMethod === "instapay" && instaPayProof) {
//         payload.append("proofImage", instaPayProof);
//       }

//       res = await api.post("/orders", payload, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       clearCart();
//       toast.success(isRTL ? "🎉 تم تسجيل طلبك بنجاح" : "🎉 Order placed successfully");
//       navigate(`/thankyou/${res.data._id || res.data.order?._id}`);
//     }

//   } catch (error) {
//     console.error("🔥 ERROR:", error);
//     toast.error(
//       error.response?.data?.message ||
//       (isRTL ? "⚠️ حصل خطأ أثناء الإرسال" : "⚠️ Something went wrong")
//     );
//   } finally {
//     setLoading(false);
//   }
// };

// const isFreeShipping = shippingCost === 0 && discountInfo?.freeShippingApplied;

// const cartTotal = cart.reduce(
//   (acc, item) => acc + item.price * item.qty,
//   0
// );

// // خصم المنتجات فقط (بدون الشحن)
// const totalDiscountAmount = Math.round(
//   isFreeShipping ? 0 : (discountInfo?.discountAmount || 0)
// );

// // الشحن
// const effectiveShippingCost = isFreeShipping ? 0 : shippingCost;

// // الإجمالي النهائي
// const totalWithDiscount = Math.round(
//   cartTotal + effectiveShippingCost - totalDiscountAmount
// );


// return (
//     <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500 pb-20">
      
//       <OrderSummary 
//         cart={cart} 
//         isRTL={isRTL} 
//         removeFromCart={removeFromCart} 
//         updateQty={(id, qty) => {
//           updateQty(id, qty);
//           // إعادة التحقق من الخصم تلقائياً عند تغيير الكمية لضمان صحة الحسابات
//           if (discountInfo) validateDiscount(formData.discountCode);
//         }} 
//         clearCart={clearCart} 
//         navigate={navigate} 
//       />

//       <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-8 mt-4">
        
//         <form onSubmit={handleSubmit} className="space-y-6">
          
//           {/* 🔝 Sticky Header */}
//           <div className="sticky top-[64px] sm:top-[70px] z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5 px-4 py-3 mb-6 -mx-4 sm:-mx-6">
//             <div className="max-w-2xl mx-auto flex items-center justify-between relative min-h-[40px]">
//               <button 
//                 type="button"
//                 onClick={() => navigate(-1)} 
//                 className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors z-10"
//               >
//                 <ChevronLeft size={24} className={`${isRTL ? 'rotate-180' : ''} text-slate-900 dark:text-red-700`} />
//               </button>

//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <h1 className="text-base sm:text-lg font-black uppercase    text-slate-900 dark:text-white pointer-events-auto">
//                   {isRTL ? "إتمام الطلب" : "Checkout"}
//                 </h1>
//               </div>
//               <div className="w-10"></div>
//             </div>
//           </div>

//           {/* 📍 Section 1: Personal Info */}
//           <section className="space-y-4">
//             <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase  px-1">
//               {isRTL ? "المعلومات الشخصية" : "Personal Information"}
//             </h2>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2"> {/* حاوية للمدخل والرسالة */}
//   <div className="relative group " ref={nameRef}> 
//     <User 
//       size={18} 
//       className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 ${nameError ? 'text-red-500' : 'text-slate-400'} group-focus-within:text-red-700 transition-colors`} 
//     />
//     <input
//       type="text" 
//       name="name" 
//       required 
//       value={formData.name} 
//       onChange={(e) => {
//         handleChange(e);
//         if (nameError) setNameError(""); // مسح الخطأ بمجرد ما يبدأ يصحح
//       }}
//       onBlur={(e) => {
//         // التأكد إن فيه مسافة بين كلمتين على الأقل
//         const value = e.target.value.trim();
//         const parts = value.split(/\s+/); // تقسيم النص بناءً على المسافات
//         if (value && parts.length < 2) {
//           setNameError(isRTL ? "يرجى إدخال الاسم ثنائياً على الأقل" : "Please enter at least two names");
//         } else {
//           setNameError("");
//         }
//       }}
//       placeholder={isRTL ? "الاسم بالكامل" : "Full Name"}
//       className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border ${nameError ? 'border-red-500' : 'border-transparent dark:border-white/5'} rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-bold text-slate-900 dark:text-white`}
//     />
//   </div>
  
//   {/* رسالة الخطأ */}
//   {nameError && (
//     <p className={`text-[11px] font-bold text-red-500 ${isRTL ? 'pr-4' : 'pl-4'} animate-pulse`}>
//       {nameError}
//     </p>
//   )}
// </div>
              
//       {/* 📱 رقم الهاتف الأساسي */}
// <div className="relative group">
//   <Phone 
//     size={18} 
//     className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700 transition-colors`} 
//   />
//   <input
//     type="tel" 
//     name="phone" 
//     required 
//     value={formData.phone} 
//     onChange={handleChange}
//     placeholder={isRTL ? "رقم الهاتف" : "Phone Number"}
//     className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-black  text-slate-900 dark:text-white`}
//   />
// </div>

// {/* 📱 رقم الهاتف الإضافي (اختياري) */}
// <div className="relative group">
//   <Phone 
//     size={18} 
//     className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700 transition-colors`} 
//   />
//   <input
//     type="tel" 
//     name="secondaryPhone" 
//     value={formData.secondaryPhone || ''} 
//     onChange={handleChange}
//     placeholder={isRTL ? "رقم هاتف إضافي (اختياري)" : "Secondary Phone (Optional)"}
//     className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-black  text-slate-900 dark:text-white`}
//   />
// </div>


//               <div className="relative group">
//                 <Mail size={18} className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700 transition-colors`} />
//                 <input
//                   type="email" name="email" value={formData.email} onChange={handleChange}
//                   placeholder={isRTL ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
//                   className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-bold text-slate-900 dark:text-white`}
//                 />
//               </div>
//             </div>
//           </section>

//        {/* 🚚 Section 2: Shipping */}
// <section ref={shippingSectionRef} className="space-y-4">
//   <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase px-1">
//     {isRTL ? "عنوان الشحن" : "Shipping Address"}
//   </h2>
  
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//     {/* 🏙️ المحافظة */}
//     <div className="space-y-2" ref={cityRef}>
// <Select
//   options={citiesList.map(c => ({
//     value: c._id,
//     label: isRTL ? c.cityAr : c.cityEn
//   }))}

//   value={
//     citiesList
//       .map(c => ({
//         value: c._id,
//         label: isRTL ? c.cityAr : c.cityEn
//       }))
//       .find(opt => opt.value === formData.city) || null
//   }

//   onChange={handleCityChange}
//   placeholder={isRTL ? "ابحث عن المحافظة..." : "Search city..."}

//   styles={customSelectStyles(isRTL, !!cityError)}
//   isRtl={isRTL}
//   isClearable

//   className={`w-full py-1 bg-slate-50 dark:bg-[#111111] 
//   border ${cityError ? 'border-red-500' : 'border-transparent dark:border-white/5'} 
//   rounded-[1.5rem] focus-within:border-red-700 
//   font-bold text-slate-900 dark:text-white`}
// />
//  {cityError && <p className="text-red-500"></p>}
//     </div>

//     {/* 🏘️ الحي / المنطقة */}
//     <div className="space-y-2" ref={districtRef}>

//     <Select
//   options={districts.map(d => ({
//     value: d.bostaDistrictId,
//     label: isRTL ? d.nameAr : (d.nameEn || d.nameAr)
//   }))}

//   value={
//     districts
//       .map(d => ({
//         value: d.bostaDistrictId,
//         label: isRTL ? d.nameAr : (d.nameEn || d.nameAr)
//       }))
//       .find(opt => opt.value === formData.bostaDistrictId) || null
//   }

//   onChange={handleDistrictChange}
// isClearable
//   placeholder={isRTL ? " ابحث عن المنطقة..." : "Search district..."}

//   styles={customSelectStyles(isRTL, !!districtError)}
//   isRtl={isRTL}
//   isDisabled={!formData.city}

//   className={`w-full py-1 bg-slate-50 dark:bg-[#111111] 
//   border ${districtError ? 'border-red-500' : 'border-transparent dark:border-white/5'} 
//   rounded-[1.5rem] focus-within:border-red-700 
//   font-bold text-slate-900 dark:text-white`}
// />

//     </div>
//   </div>

//   {/* 📍 العنوان بالتفصيل */}
//   <div className="relative group" ref={addressRef}>
//     <MapPin size={18} className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700`} />
//     <input
//       type="text" 
//       name="address" 
//       required 
//       value={formData.address} 
//       onChange={handleChange}
//       autoComplete="new-address"
//       placeholder={isRTL ? "العنوان بالتفصيل (اسم الشارع / علامة مميزة)" : "Detailed Address"}
//       className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-bold text-slate-900 dark:text-white`}
//     />
//   </div>

//   {/* 🏢 تفاصيل السكن */}
//   <div className="grid grid-cols-3 gap-3">
//     <input type="text" name="buildingNumber" placeholder={isRTL ? "عمارة" : "Bldg"} value={formData.buildingNumber} onChange={handleChange} className="p-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-2xl outline-none text-center font-black text-slate-900 dark:text-white focus:border-red-700" />
//     <input type="text" name="floor" placeholder={isRTL ? "دور" : "Floor"} value={formData.floor} onChange={handleChange} className="p-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-2xl outline-none text-center font-black text-slate-900 dark:text-white focus:border-red-700" />
//     <input type="text" name="apartment" placeholder={isRTL ? "شقة" : "Apt"} value={formData.apartment} onChange={handleChange} className="p-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-2xl outline-none text-center font-black text-slate-900 dark:text-white focus:border-red-700" />
//   </div>
// </section>

//           {/* 🏷️ Discount Section */}
//           <section className="space-y-3">
//             <div className="flex justify-between items-center px-1">
//               <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase ">
//                 {isRTL ? "كود الخصم" : "Discount Code"}
//               </h2>
//               <button
//   type="button"
//   onClick={() => setShowDiscountModal(true)}
//   className="text-[15px] font-black text-black dark:text-white uppercase  underline decoration-2 decoration-red-800 underline-offset-4 hover:decoration-red-600 transition-all"
// >
//   ✨ {isRTL ? "استكشف العروض" : "View Offers"}
// </button>
//             </div>
            
//             <div className="flex gap-2">
//               <div className="relative flex-1 group">
//                 <Tag size={18} className={`${isRTL ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-700`} />
//                <input
//   type="text"
//   name="discountCode"
//   value={formData.discountCode}
//   onChange={(e) => {
//     setFormData(p => ({
//       ...p,
//       discountCode: e.target.value.toUpperCase()
//     }));

//     // 🔥 مهم جدًا: reset الحالة عند أي تغيير
//     setIsDiscountApplied(false);
//     setDiscountInfo(null);
//     setDiscountError("");
//   }}
//   placeholder={isRTL ? "أدخل الكود هنا" : "Enter Code"}
//   className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-slate-50 dark:bg-[#111111] border border-transparent dark:border-white/5 rounded-[1.5rem] focus:border-red-700 outline-none transition-all font-black text-slate-900 dark:text-red-700 uppercase`}
// />
//               </div>
//              <button
//   type="button"
//   onClick={async () => {
//     const result = await validateDiscount(formData.discountCode);

//     // 🔥 هنا بنفترض إن النجاح بيرجع true أو success
//     if (result?.success || result === true) {
//       setIsDiscountApplied(true);
//       setDiscountError(""); 
//     }
//   }}
//   disabled={isDiscountApplied}
//   className={`px-6 rounded-[1.5rem] font-black uppercase text-xs transition-all ${
//     isDiscountApplied
//       ? "bg-red-600 text-white cursor-not-allowed"
//       : "bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-red-700 dark:hover:bg-red-700"
//   }`}
// >
//   {isDiscountApplied
//     ? (isRTL ? "تم التفعيل" : "Applied")
//     : (isRTL ? "تفعيل" : "Apply")}
// </button>
//             </div>
//             {discountError && <p className="text-[10px] font-bold text-red-500 px-4">{discountError}</p>}
//           </section>

//       {/* 🎫 Offers Modal */}
// {showDiscountModal && (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">

//     <div className="bg-white dark:bg-[#0A0A0A] w-full max-w-md rounded-[3rem] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden relative">

//       {/* Modal Header */}
//       <div className="p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center">

//         <div>
//           <h3 className="text-xl font-black   uppercase text-black dark:text-white">
//             {isRTL ? "فيسترو أوفيرز" : "Vestro Offers"}
//           </h3>

//           <p className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase ">
//             {isRTL ? "وفر أكتر مع طلبك النهاردة" : "Save more on your order"}
//           </p>
//         </div>

//         {/* ❌ Close button (clean + red hover only) */}
//         <button
//           onClick={() => setShowDiscountModal(false)}
//           className="w-10 h-10 rounded-full 
//           bg-black/5 dark:bg-white/5 
//           flex items-center justify-center 
//           hover:bg-red-500 hover:text-white 
//           dark:hover:bg-red-500 dark:hover:text-white
//           transition-all"
//         >
//           ✕
//         </button>

//       </div>

//       {/* Content */}
//       <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">

//         {availableDiscounts.length > 0 ? (
//           availableDiscounts.map((disc) => {

//             const isFreeShipping = disc.discountType === 'free_shipping';
//             const isPercentage = disc.discountType === 'percentage';
//             const isBOGO = ['bogo', 'bogo_discount'].includes(disc.discountType);

//             return (
//               <div
//                 key={disc._id}
//                 className="relative group overflow-hidden rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 p-5 bg-black/[0.02] dark:bg-white/[0.03] hover:border-black dark:hover:border-white transition-all"
//               >

//                 {/* CODE + ACTION */}
//                 <div className="flex justify-between items-start mb-4">

//                   <div>
//                     <span className="text-2xl font-black   text-black dark:text-white uppercase ">
//                       {disc.code}
//                     </span>

//                     <div className="flex items-center gap-2 mt-1">
//                       <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>

//                       <span className="text-[10px] font-black uppercase text-black/50 dark:text-white/50 ">
//                         {isFreeShipping
//                           ? (isRTL ? "شحن مجاني" : "FREE SHIPPING")
//                           : isPercentage
//                             ? (isRTL ? `خصم ${disc.percentage}%` : `${disc.percentage}% OFF`)
//                             : "BOGO OFFER"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Copy Button */}
//                   <button
//                   type="button"
//                     onClick={() => {
//                       navigator.clipboard.writeText(disc.code);
//                       setFormData(prev => ({ ...prev, discountCode: disc.code }));
//                       validateDiscount(disc.code, false);
                      
//                     }}
//                     className="px-4 py-2 rounded-full text-[10px] font-black uppercase  
//                     bg-black text-white dark:bg-white dark:text-black
//                     hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white
//                     transition-all active:scale-95"
//                   >
//                     {isRTL ? "نسخ وتفعيل" : "Copy & Apply"}
//                   </button>

//                 </div>

//                 {/* Description */}
//                 <div className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 mb-4">

//                   <p className="text-xs font-bold text-black/70 dark:text-white/70 flex items-center gap-2">

//                     <span className="text-red-500">
//                       {isFreeShipping ? "🚚" : "🏷️"}
//                     </span>

//                     {isFreeShipping
//                       ? (isRTL
//                         ? `شحن مجاني للطلبات أكثر من ${disc.minOrderAmount} ج.م`
//                         : `Free Shipping on orders above ${disc.minOrderAmount} EGP`)
//                       : isPercentage
//                         ? (isRTL
//                           ? `خصم ${disc.percentage}% على مشترياتك`
//                           : `${disc.percentage}% Discount on your order`)
//                         : (isRTL
//                           ? `اشتري ${disc.buyQuantity} وخد ${disc.getQuantity}`
//                           : `Buy ${disc.buyQuantity} Get ${disc.getQuantity}`)}
//                   </p>

//                 </div>

//                 {/* Products */}
//                 <div className="pt-3 border-t border-black/10 dark:border-white/10">

//                   {disc.appliesToAll ? (
//                     <div className="flex items-center gap-2">
//                       <span className="text-red-500 text-sm">●</span>
//                       <span className="text-[10px] font-black uppercase   text-black dark:text-white">
//                         {isRTL ? "يشمل جميع منتجات المتجر" : "Applied to all products"}
//                       </span>
//                     </div>
//                   ) : (
//                     <div className="flex gap-2 overflow-x-auto pb-2">

//                       {disc.applicableProducts?.map((p) => (
//                         <a
//                           key={p._id}
//                           href={`/product/${p._id}`}
//                           className="flex items-center gap-2 p-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-black dark:hover:border-white transition-all"
//                         >
//                           <img
//                             src={p.images?.[0]?.url || p.image}
//                             className="w-8 h-8 rounded-lg object-cover"
//                           />
//                           <span className="text-[10px] font-bold max-w-[80px] truncate text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">
//                             {p.name}
//                           </span>
//                         </a>
//                       ))}

//                     </div>
//                   )}

//                 </div>

//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-10">
//             <p className="text-sm font-black uppercase text-black/40 dark:text-white/40">
//               {isRTL ? "لا توجد عروض حالياً" : "No Offers Available"}
//             </p>
//           </div>
//         )}

//       </div>
//     </div>
//   </div>
// )}

//        {/* 💳 Payment Method */}
// <section className="space-y-4">
//   <h2 className="text-[15px] font-black text-slate-900 dark:text-white uppercase  px-1">
//     {isRTL ? "طريقة الدفع" : "Payment Method"}
//   </h2>

//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//     {/* 💵 Cash */}
//     <div 
//       onClick={() => setFormData(p => ({...p, paymentMethod: 'cash'}))}
//       className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-3 
//       ${formData.paymentMethod === 'cash' 
//         ? 'border-red-700 bg-red-700/10' 
//         : 'border-transparent bg-slate-50 dark:bg-[#111111]'
//       }`}
//     >
//       <Banknote size={28} className={formData.paymentMethod === 'cash' ? 'text-red-700' : 'text-slate-400'} />

//       <span className={`text-[10px] font-black uppercase 
//         ${formData.paymentMethod === 'cash' 
//           ? 'text-slate-900 dark:text-white' 
//           : 'text-slate-400'
//         }`}
//       >
//         {isRTL ? "عند الاستلام" : "Cash on Delivery"}
//       </span>
//     </div>

//     <div
//       onClick={() => setFormData(p => ({ ...p, paymentMethod: "instapay" }))}
//       className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.paymentMethod === "instapay" ? "border-red-700 bg-red-700/10" : "border-transparent bg-slate-50 dark:bg-[#111111]"}`}
//     >
//       <CreditCard size={28} className={formData.paymentMethod === "instapay" ? "text-red-700" : "text-slate-400"} />
//       <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">InstaPay</span>
//       <span className="text-[10px] text-slate-500">{isRTL ? "تحويل فوري" : "Instant bank transfer"}</span>
//     </div>

//     {/* 💳 Card (Disabled) */}
//     <div
//       onClick={() => {
//         toast.info(
//           isRTL
//             ? "الدفع الإلكتروني قيد التحديث حالياً 🔧"
//             : "Online payment is currently unavailable 🔧"
//         );
//       }}
//       className="relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col items-center gap-3 
//                  border-dashed border-red-400 bg-slate-50 dark:bg-[#111111] opacity-70"
//     >
//       <CreditCard size={28} className="text-slate-400" />

//       <span className="text-[10px] font-black uppercase text-slate-400">
//         {isRTL ? "فيزا / ماستر" : "Card / Visa"}
//       </span>

//       {/* ⚠️ Badge */}
//       <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-[2px] rounded-full">
//         {isRTL ? " غير متاح حاليا للتحديث" : "OFF"}
//       </span>

//       {/* 🔒 Overlay hint */}
//       <span className="text-[9px] font-bold text-red-500 mt-1">
//         {isRTL ? "قيد التحديث" : "Coming soon"}
//       </span>
//     </div>

//   </div>

//   {formData.paymentMethod === "instapay" && (
//     <div className="rounded-2xl border border-red-700/30 bg-slate-50 dark:bg-[#111111] p-5 space-y-3">
//       <label htmlFor="instapay-proof" className="block text-sm font-bold text-slate-800 dark:text-white">
//         {isRTL ? "ارفع صورة إثبات الدفع (صورة واحدة)" : "Upload payment proof (one image)"}
//       </label>
//       <input
//         id="instapay-proof"
//         type="file"
//         accept="image/jpeg,image/png,image/webp"
//         onChange={(event) => setInstaPayProof(event.target.files?.[0] || null)}
//         className="sr-only"
//       />
//       {instaPayProof && <p className="text-xs text-emerald-600">{instaPayProof.name}</p>}
//     </div>
//   )}
// </section>

//          {/* 💎 Vestro Dynamic Discount Summary */}
// {discountInfo && (
//   <div className="rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] p-6 border-[3px] border-black dark:border-red-700 relative overflow-hidden ] ">
    
//     {/* Header: Title and Type */}
//     <div className="flex justify-between items-center mb-6">
//       <div className="bg-black text-white px-4 py-1 rounded-full text-xs font-black   uppercase">
//         {discountInfo.discountType === 'free_shipping' ? '🚚 FREE SHIPPING MODE' : '🔥 OFFER ACTIVE'}
//       </div>
//       <span className="text-black dark:text-white font-black text-xl  ">{discountInfo.discountCode}</span>
//     </div>

//     <p className="mb-5 text-sm font-bold text-slate-600 dark:text-slate-300">
//       {discountInfo.discountType === "percentage"
//         ? (isRTL
//             ? `خصم ${discountInfo.percentage}% على المنتجات المشمولة${discountInfo.maxDiscountAmount ? ` (بحد أقصى ${discountInfo.maxDiscountAmount} ج.م)` : ""}`
//             : `${discountInfo.percentage}% off eligible products${discountInfo.maxDiscountAmount ? ` (up to ${discountInfo.maxDiscountAmount} EGP)` : ""}`)
//         : discountInfo.discountType === "bogo"
//         ? (isRTL
//             ? `اشتري ${discountInfo.buyQuantity} واحصل على ${discountInfo.getQuantity} مجانًا`
//             : `Buy ${discountInfo.buyQuantity}, get ${discountInfo.getQuantity} free`)
//         : discountInfo.discountType === "bogo_discount"
//         ? (isRTL
//             ? `اشتري ${discountInfo.buyQuantity} واحصل على ${discountInfo.getQuantity} بخصم ${discountInfo.getDiscount}%`
//             : `Buy ${discountInfo.buyQuantity}, get ${discountInfo.getQuantity} at ${discountInfo.getDiscount}% off`)
//         : (isRTL ? "شحن مجاني" : "Free shipping")}
//     </p>

//     {/* Items List */}
// <div className="space-y-3">
//   {cart.map((item, idx) => {
//     const itemProductId = String(item.product || item._id || item.productId || "");
//     const eligibleProductIds = (discountInfo?.applicableProducts || []).map((product) =>
//       String(product?._id || product)
//     );
//     const isApp = discountInfo?.appliesToAll || eligibleProductIds.includes(itemProductId);
//     const itemQty = Number(item.qty || item.quantity) || 0;
//     const qualifyingGiftQty = ["bogo", "bogo_discount"].includes(discountInfo.discountType)
//       ? Math.floor(itemQty / (Number(discountInfo.buyQuantity) || 1)) * (Number(discountInfo.getQuantity) || 0)
//       : 0;

//     let priceDisplay = (
//       <span className="text-sm font-black text-slate-900 dark:text-white">
//               {item.price * itemQty} EGP
//       </span>
//     );

//     if (isApp) {
//       if (discountInfo.discountType === "percentage") {
//         priceDisplay = (
//           <div className="flex flex-col items-end">
//             <span className="text-[10px] text-slate-500 font-bold">
//               {discountInfo.percentage}% {isRTL ? "خصم على المنتج" : "off this product"}
//             </span>
//           </div>
//         );
//       } else if (
//         ["bogo", "bogo_discount"].includes(discountInfo.discountType)
//       ) {
//         priceDisplay = (
//           <div className="flex flex-col items-end">
//             {qualifyingGiftQty > 0 ? (
//               <>
//                 <span className="text-[10px] text-red-500 font-black uppercase">
//                   {isRTL ? `عدد الهدايا/المخفضة: ${qualifyingGiftQty}` : `Gift/discounted units: ${qualifyingGiftQty}`}
//                 </span>
//                 <span className="text-sm font-black bg-emerald-500 dark:bg-red-700 text-white dark:text-black px-2 rounded-md">
//                   {discountInfo.discountType === "bogo"
//                     ? (isRTL ? "مجاني" : "FREE")
//                     : `${discountInfo.getDiscount}% ${isRTL ? "خصم" : "OFF"}`}
//                 </span>
//               </>
//             ) : (
//               <span className="text-[10px] text-slate-500 font-bold">
//                 {isRTL ? "ضمن المنتجات المشمولة" : "Eligible item"}
//               </span>
//             )}
//           </div>
//         );
//       }
//     }

//     return (
//       <div
//         key={idx}
//         className={`flex items-center justify-between p-4 rounded-2xl transition-all border
//           ${
//             isApp
//               ? "bg-white dark:bg-[#111111] border-emerald-500 dark:border-red-700 shadow-sm"
//               : "bg-slate-50 dark:bg-[#0A0A0A] border-transparent opacity-60"
//           }`}
//       >
//         {/* Left Side */}
//         <div className="flex items-center gap-4">
          
//           {/* Image */}
//           <div className="relative">
//             <img
//               src={item.image}
//               className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-white/10"
//               alt=""
//             />

//             {isApp && (
//               <div className="absolute -top-2 -left-2 bg-slate-900 dark:bg-black text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-emerald-500">
//                 {isRTL ? "مشمول" : "INCL"}
//               </div>
//             )}
//           </div>

//           {/* Info */}
//           <div className="flex flex-col">
//             <span className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">
//               {item.name}
//             </span>

//             <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400  ">
//               QTY: {item.qty || item.quantity}
//             </span>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="text-right">
//           {priceDisplay}
//         </div>
//       </div>
//     );
//   })}
// </div>

//     {/* Total Savings: الواجهة القوية */}
//     <div className="mt-8 p-5 bg-black rounded-[2rem] flex justify-between items-center border-2 ">
//       <div>
//         <p className="text-white text-[15px] font-black uppercase  mb-1">
//           {isRTL ? "إجمالي التوفير" : "TOTAL SAVINGS"}
//         </p>
//         <h3 className="text-white text-3xl font-black  ">
//           -{Math.round(discountInfo.discountAmount)} <span className="text-sm not-  uppercase">EGP</span>
//         </h3>
//       </div>
//       <div className="text-right">
//          {discountInfo.freeShippingApplied && (
//             <div className="flex flex-col items-end">
//                 <span className="bg-red-700 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase   mb-1">
//                    Free Delivery
//                 </span>
//                 <span className="text-white/50 text-[8px] font-bold uppercase">Applied to Order</span>
//             </div>
//          )}
//       </div>
//     </div>
//   </div>
// )}

//          {/* 💰 Order Summary Card */}
// <div className="bg-white dark:bg-black rounded-[2.5rem] p-8 text-slate-900 dark:text-white space-y-5 shadow-2xl relative border border-slate-100 dark:border-white/10 transition-all">

//   {/* Subtotal */}
//   <div className="flex justify-between items-center text-[15px] font-black uppercase ">
//     <span>{isRTL ? "قيمة المشتريات" : "Subtotal"}</span>
//     <span className="text-slate-900 dark:text-white">
//       {Math.round(cartTotal)} EGP
//     </span>
//   </div>

//   {/* Shipping */}
//   <div className="flex justify-between items-center text-[15px] font-black uppercase ">
//     <span>{isRTL ? "تكلفة الشحن" : "Shipping"}</span>

//     <span
//       className={
//         shippingCost === 0 && selectedCityObj
//           ? "text-emerald-600 dark:text-red-700 font-black  "
//           : "text-slate-900 dark:text-white"
//       }
//     >
//       {!selectedCityObj
//         ? isRTL
//           ? "بانتظار العنوان"
//           : "Waiting for address"
//         : shippingCost === 0
//         ? isRTL
//           ? "شحن مجاني 🎁"
//           : "FREE SHIPPING 🎁"
//         : `+${shippingCost} EGP`}
//     </span>
//   </div>

//   {/* Discount */}
//   {discountInfo && (
//     <div className="flex justify-between items-center text-[15px] font-black uppercase ">
//       <span>{isRTL ? "الخصم" : "Discount"}</span>
//       <span className="text-red-700 ">
//         -{Math.round(discountInfo.discountAmount)} EGP
//       </span>
//     </div>
//   )}

//   {/* Total */}
//   <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex justify-between items-end">
    
//     <div>
//       <span className="text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase mb-1 block">
//         {isRTL ? "المبلغ الإجمالي" : "Grand Total"}
//       </span>

//       <div className="text-4xl font-black   leading-none  text-red-600">
//         {totalWithDiscount}
//         <small className="text-xs not-  opacity-40 font-bold ml-1">
//           EGP
//         </small>
//       </div>
//     </div>

//     {/* Icon */}
//     <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
//       <Home size={20} className="text-red-600 opacity-60" />
//     </div>

//   </div>
// </div>
// <div className="rounded-[1.5rem] border border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#111111]">

//   <label className="flex items-start gap-3 cursor-pointer">

//     <input
//       type="checkbox"
//       checked={formData.marketingConsent}
//       onChange={(e) =>
//         setFormData((prev) => ({
//           ...prev,
//           marketingConsent: e.target.checked,
//         }))
//       }
//       className="mt-1 w-5 h-5 accent-red-700"
//     />

//     <div className="flex flex-col">

//       <span className="text-[13px] font-black text-slate-900 dark:text-white">
//         {isRTL
//           ? "أوافق على استقبال رسائل واتساب التسويقية من VESTRO"
//           : "I agree to receive WhatsApp marketing messages from Vestro"}
//       </span>

//       <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">
//         {isRTL
//           ? "يمكنك إلغاء الاشتراك في أي وقت"
//           : "You can unsubscribe at any time"}
//       </span>

//     </div>

//   </label>
// </div>
//           {/* 🚀 Submit Button */}
//           <button
//             type="submit" disabled={loading}
//             className={`w-full py-6 rounded-[2rem] font-black uppercase    transition-all shadow-2xl relative overflow-hidden group
//               ${loading ? 'bg-slate-800 cursor-wait' : 'bg-black text-white dark:text-black dark:bg-white hover:scale-[1.02] active:scale-95 '}
//             `}
//           >
//             {loading ? (
//               <div className="flex items-center justify-center gap-3">
//                 <div className="w-5 h-5 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
//                 {isRTL ? "جاري الحفظ..." : "Processing..."}
//               </div>
//             ) : (
//               <span className="relative z-10">{isRTL ? "تأكيد الأوردر الآن" : "Confirm Order Now"}</span>
//             )}
//             {!loading && <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:-translate-x-full transition-transform duration-700  "></div>}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;



/* eslint-disable no-unused-vars */
import { useState, useEffect,useRef } from "react";
import Select from "react-select";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import api from "../../src/api/axiosInstance";
import { useTheme } from "../contexts/ThemeContext";
import OrderSummary from "./../components/OrderSummary";
import { ChevronLeft, MapPin, Phone, User, Mail, CreditCard, Banknote, Tag, Home } from "lucide-react";
import { getMetaCookies } from "../utils/metaCookies";
const CheckoutPage = () => {
  const { cart, clearCart, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === "ar";
const { darkMode } = useTheme();
  const [citiesList, setCitiesList] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [paymentProofs, setPaymentProofs] = useState({ instapay: null, vodafone_cash: null });
  const [showVodafoneCashNumber, setShowVodafoneCashNumber] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [selectedCityObj, setSelectedCityObj] = useState(null);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showMarketingConsentModal, setShowMarketingConsentModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [discountError, setDiscountError] = useState(""); // لمسح رسائل الخطأ
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [nameError, setNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const nameRef = useRef(null);
  const cityRef = useRef(null);
const districtRef = useRef(null);
const addressRef = useRef(null);
const shippingSectionRef = useRef(null); // عشان السكرول
const [baseShippingCost, setBaseShippingCost] = useState(0); 
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    marketingConsent: null,
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
  const cityOptions = citiesList.map(c => ({
  value: c._id,
  label: isRTL ? c.cityAr : c.cityEn
}));

const districtOptions = districts.map(d => ({
  value: d.bostaDistrictId,
  label: isRTL ? d.nameAr : (d.nameEn || d.nameAr)
}));
const customSelectStyles = (isRTL, hasError) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent", // زي input
    border: hasError
      ? "1px solid #ef4444"
      : "1px solid transparent",
    borderRadius: "1.5rem",
    minHeight: "56px",
    boxShadow: "none",
    padding: "0 4px",
    direction: isRTL ? "rtl" : "ltr",

    "&:hover": {
      border: hasError
        ? "1px solid #ef4444"
        : "1px solid transparent",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: isRTL ? "0 16px 0 12px" : "0 12px 0 16px",
  }),

  input: (base) => ({
    ...base,
    color: "inherit", // نفس لون النص
    fontWeight: "bold",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#9ca3af", // زي input placeholder
    fontWeight: "bold",
  }),

  singleValue: (base) => ({
    ...base,
    color: "inherit",
    fontWeight: "bold",
  }),

 menu: (base) => ({
  ...base,
 backgroundColor: darkMode ? "#111111" : "white",  borderRadius: "1rem",
  overflow: "hidden",
  zIndex: 9999,
  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
}),
menuList: (base) => ({
  ...base,
  maxHeight: "600px", // 🔥 كان صغير → بقى كبير
  padding: "6px",
}),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
    ? (darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9")
    : (darkMode ? "#111111" : "white"),
    color:  darkMode ? "white" : "#111111",  borderRadius: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: isRTL ? "right" : "left",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#9ca3af",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),
});

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



 const tenHoursInMs = 15 * 60 * 30000;
  const timeBlock = Math.floor(Date.now() / tenHoursInMs);
  const normalizedPhone = normalizePhone(formData.phone); 
  
  const eventId = `init-${normalizedPhone}-${timeBlock}`;
  const trackInitiateCheckout = (cart) => {
  if (!window.fbq) return;

  let totalValue = 0;

  const contents = cart.map((item) => {
    const id = item.isBundle
      ? item.bundleItems?.map(i => i.variantId) // لو bundle
      : item.variantId;

    totalValue += (Number(item.price) || 0) * (Number(item.qty) || 0);

    return {
      id: item.variantId, // ✅ دا المهم (مش product ولا bundle)
      quantity: item.qty,
      item_price: item.price,
    };
  });

  const contentIds = cart.flatMap(item =>
    item.isBundle
      ? item.bundleItems.map(i => i.variantId)
      : [item.variantId]
  );

  const nameParts = (formData.name || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName =
    nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

  window.fbq(
    "track",
    "InitiateCheckout",
    {
      content_type: "product",
      currency: "EGP",
      value: totalValue,

      content_ids: contentIds, // ✅ أهم سطر هنا

      contents,

      num_items: cart.reduce((sum, i) => sum + i.qty, 0),
    },
    {
      eventID: eventId, // ✅ لازم يبقى هنا
      em: formData.email?.trim().toLowerCase() || undefined,
      ph: normalizedPhone || undefined,
      fn: firstName.toLowerCase(),
      ln: lastName.toLowerCase(),
      ct: formData.cityName || undefined,
      country: "eg",
      external_id: normalizedPhone,
    }
  );
};
//   const trackInitiateCheckout = (cart) => {
//     if (!window.fbq) return;

//     let totalValue = 0;
//     const contents = cart.map((item) => {
//       totalValue += (Number(item.price) || 0) * (Number(item.qty) || 0);
//       return {
//         id: item.isBundle ? item.bundle : item.variantId,
//         quantity: item.qty,
//         item_price: item.price,
//       };
//     });

//     // 1. تقسيم الاسم لضمان جودة المطابقة
//     const nameParts = (formData.name || "").trim().split(/\s+/);
//     const firstName = nameParts[0] || "";
//     const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

//     window.fbq("track", "InitiateCheckout", {
//       content_type: "product",
//       currency: "EGP",
//       value: totalValue,
//       contents,
//       num_items: cart.reduce((sum, i) => sum + i.qty, 0),
//     }, {
//       // 2. 🔥 إضافة بيانات العميل هنا هي اللي هتشيل التحذير
//       eventID: eventId,
//      em: formData.email?.trim().toLowerCase() || undefined,     // البريد الإلكتروني
//       ph: normalizedPhone || undefined,    // رقم الهاتف
//      fn: firstName.toLowerCase(),
// ln: lastName.toLowerCase(),                     // اسم العائلة
//       ct: formData.cityName || undefined, // المدينة (لو متوفرة في الفورم)
//       country: "eg",                       // الدولة
//       external_id: normalizedPhone         // معرف خارجي لربط أقوى
//     });
//   };

 

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

  useEffect(() => {
    let isMounted = true;
    api.get("/payment-settings")
      .then((res) => {
        if (isMounted) setPaymentSettings(res.data);
      })
      .catch((error) => console.error("Error loading payment options", error));
    return () => { isMounted = false; };
  }, []);

  // 👇👇 هنا تحطها
useEffect(() => {
  if (cart?.length) {
    trackInitiateCheckout(cart);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [cart]);




 // 🔄 معالجة التغييرات في الحقول
const handleChange = async (e) => {
  const { name, value } = e.target;

  

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
const handleCityChange = async (selected) => {
  const value = selected?.value || "";

  setFormData((prev) => ({
    ...prev,
    city: value,
    district: "",
    bostaDistrictId: "",
  }));

  const cityData = citiesList.find((c) => c._id === value);

  if (cityData) {
    setShippingCost(cityData.charge);
    setBaseShippingCost(cityData.charge);

    setDiscountInfo(null);
    setIsDiscountApplied(false);

    setSelectedCityObj(cityData);

    try {
      const res = await api.get(`/districts/${cityData.bostaCityId}`);
      setDistricts(res.data);
    } catch (err) {
      setDistricts([]);
      toast.error(
        isRTL ? "تعذر تحميل الأحياء" : "Could not load districts"
      );
    }
  } else {
    setShippingCost(0);
    setBaseShippingCost(0);
    setSelectedCityObj(null);
    setDistricts([]);
  }

  if (cityError) setCityError("");
};

const handleDistrictChange = (selected) => {
  const value = selected?.value || "";

  const selectedDistrict = districts.find(
    (d) => String(d.bostaDistrictId) === String(value)
  );

  if (selectedDistrict) {
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict.nameAr,
      bostaDistrictId: value,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      district: "",
      bostaDistrictId: "",
    }));
  }

  if (districtError) setDistrictError("");
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

  cartItems: cart.map((item) => ({
    productId: item.product || item._id,
    quantity: item.qty || item.quantity,
    price: Number(item.price) || 0,
    isBundle: Boolean(item.isBundle || item.bundle || item.type === "bundle"),
    bundle: item.bundle || undefined,
    type: item.isBundle || item.bundle || item.type === "bundle" ? "bundle" : "product",
  })),

  subtotal: cart.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.qty) || Number(item.quantity) || 0),
    0
  ),

  shippingPrice: baseShippingCost,
});
    // ❌ لو الكود غير صالح
    if (!res.data.valid) {
      const reason = res.data.reason;
      const codeNotFound = ["not_found", "discount_not_found", "invalid_code"].includes(reason);
      const message = reason === "bundle_not_eligible"
        ? (isRTL
          ? "أنت تستفيد من عرض باندل، ولا يمكن تطبيق الخصم على عرض الباندل."
          : "Your cart includes a bundle offer. Discounts cannot be applied to bundle offers.")
        : codeNotFound
          ? (isRTL
            ? "كود الخصم غير موجود أو غير صالح. تأكد من كتابة الكود بشكل صحيح."
            : "This discount code was not found or is invalid. Check the code and try again.")
          : (res.data.message || (isRTL
            ? "تعذر تطبيق كود الخصم. تأكد من صلاحية الكود وشروطه."
            : "This discount code could not be applied. Check that it is valid and meets its conditions."));      setDiscountInfo(null);
      setIsDiscountApplied(false);
      setShippingCost(baseShippingCost);
      setDiscountError(message);
      toast.error(message);
      return false;
    }
// =========================
// ✅ SUCCESS CASE
// =========================
setDiscountInfo({
  ...res.data,
  ...res.data.discount,
  discountAmount: Number(res.data.discountAmount) || 0,
  discountCode: res.data.discount?.code || code.trim(),
  freeShippingApplied: res.data.freeShippingApplied === true,
});

setIsDiscountApplied(true);
setDiscountError("");

// 🔥 أهم جزء: reset الأول
setShippingCost(baseShippingCost);

// لو فيه شحن مجاني
if (res.data.discount?.freeShipping === true) {
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
    const validationData = err.response?.data || {};
    const reason = validationData.reason;
    const arabicValidationMessage = {
      invalid_code: "كود الخصم غير صالح أو غير مفعل.",
      no_applicable_products: "الخصم لا ينطبق على منتجات السلة. راجع المنتجات المشمولة بالعرض.",
      minimum_order: "قيمة الطلب أقل من الحد الأدنى المطلوب لهذا الخصم.",
    }[reason];
    const bundleMessage = reason === "bundle_not_eligible"
      ? (isRTL
        ? "أنت تستفيد من عرض باندل، ولا يمكن تطبيق الخصم على عرض الباندل."
        : "Your cart includes a bundle offer. Discounts cannot be applied to bundle offers.")
      : "";
    const arabicBogoMessage = reason === "bogo_quantity_not_met"
      ? `أضف ${Math.max(0, Number(validationData.requiredQuantity) - Number(validationData.eligibleQuantity))} قطعة من المنتجات المشمولة لتفعيل العرض.`
      : "";
    const msg =
      bundleMessage ||
      (isRTL && (arabicBogoMessage || arabicValidationMessage)) ||
      validationData.message ||
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

// const scrollToError = () => {
//   // بنستنى لحظة عشان الـ React يلحق يضيف كلاسات الخطأ للـ DOM
//   setTimeout(() => {
//     // بندور على أول حقل فيه كلاس الخطأ (عدل الكلاسات دي حسب اللي بتستخدمه)
//     const errorElement = document.querySelector('.text-red-500, .border-red-500, [aria-invalid="true"]');
    
//     if (errorElement) {
//       // بنجيب مكان العنصر بالنسبة للصفحة
//       const yOffset = -150; // مسافة أمان عشان الـ Header (غير الرقم ده حسب طول الهيدر عندك)
//       const y = errorElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

//       window.scrollTo({
//         top: y,
//         behavior: 'smooth'
//       });
//     }
//   }, 150); // زودنا الوقت شوية لـ 150ms للتأكيد
// };
const scrollToRef = (ref) => {
  setTimeout(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 100);
};


const handleSubmit = async (e, marketingConsentChoice = formData.marketingConsent) => {
  e?.preventDefault();
   if (loading) return; // 🔥 منع الضغط المتكرر
  setLoading(true);

  // تصفير الأخطاء السابقة
  setNameError("");
  setCityError("");
  setDistrictError("");

  const { fbp, fbc } = getMetaCookies();
  
  try {
    // 0. تشيك عربة التسوق
    if (cart.length === 0) {
      toast.error(isRTL ? "عربة التسوق فارغة ❌" : "Your cart empty ❌");
      setLoading(false);
      return;
    }

    if (["instapay", "vodafone_cash"].includes(formData.paymentMethod) && !paymentProofs[formData.paymentMethod]) {
      toast.error(isRTL ? "ارفع صورة إثبات التحويل لإتمام الطلب" : "Upload your transfer receipt to continue");
      setLoading(false);
      return;
    }

    let hasValidationError = false;
    let firstErrorRef = null;

    // 1️⃣ فحص الاسم
    const nameParts = formData.name ? formData.name.trim().split(/\s+/) : [];
    if (!formData.name || !formData.name.trim() || nameParts.length < 2) {
      setNameError(isRTL ? "الاسم يجب أن يكون ثنائياً" : "Name must be at least two words");
      hasValidationError = true;
      if (!firstErrorRef) firstErrorRef = nameRef; // 🎯 حجز أول خطأ للاسم
    }

    // 2️⃣ فحص رقم الهاتف الأساسي
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      toast.error(isRTL ? "⚠️ رقم الهاتف غير صالح" : "⚠️ Invalid phone number");
      hasValidationError = true;
    }

    // 3️⃣ فحص الهاتف الإضافي
    if (formData.secondaryPhone && !phoneRegex.test(formData.secondaryPhone)) {
      toast.error(isRTL ? "رقم الهاتف الإضافي غير صحيح" : "Invalid secondary phone number");
      hasValidationError = true;
    }

    // 4️⃣ فحص المحافظة/المدينة
    if (!formData.city) {
      setCityError(isRTL ? "من فضلك اختر المحافظة" : "Please select a city");
      toast.error(isRTL ? "⚠️ الرجاء اختيار المحافظة" : "⚠️ Please select a city");
      hasValidationError = true;
      if (!firstErrorRef) firstErrorRef = shippingSectionRef;
    }

    // 5️⃣ فحص الحي / المنطقة (لن يظهر أو يفحص إلا إذا تم اختيار المحافظة أولاً)
    if (formData.city && !formData.bostaDistrictId) {
      setDistrictError(isRTL ? "من فضلك اختر الحي" : "Please select a district");
      toast.error(isRTL ? "⚠️ الرجاء اختيار الحي أو المنطقة" : "⚠️ Please select a district");
      hasValidationError = true;
      if (!firstErrorRef) firstErrorRef = shippingSectionRef;
    }

    // 6️⃣ فحص العنوان بالتفصيل
    if (!formData.address || !formData.address.trim()) {
      toast.error(isRTL ? "⚠️ الرجاء إدخال العنوان بالتفصيل" : "⚠️ Please enter detailed address");
      hasValidationError = true;
      if (!firstErrorRef) firstErrorRef = shippingSectionRef;
    }

    // 🚨 إيقاف الفورم وعمل سكرول في حالة وجود أي خطأ
    if (hasValidationError) {
      if (firstErrorRef && firstErrorRef.current) {
        setTimeout(() => {
          firstErrorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          setTimeout(() => {
            firstErrorRef.current
              ?.querySelector("input, .react-select__input")
              ?.focus?.();
          }, 250);
        }, 50);
      }

      setLoading(false);
      return; 
    }

    if (marketingConsentChoice !== true && marketingConsentChoice !== false) {
      setShowMarketingConsentModal(true);
      setLoading(false);
      return;
    }

    // =========================================================
    // إرسال البيانات للـ API (باقي الكود السليم الخاص بك)
    // =========================================================
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
      marketingConsent: marketingConsentChoice,
      secondaryPhone: formData.secondaryPhone,
      fbp,
      fbc,
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
      eventId
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
        } else if (commonData[key] !== undefined && commonData[key] !== null) {
          payload.append(key, commonData[key]);
        }
      });

      const paymentProof = paymentProofs[formData.paymentMethod];
      if (paymentProof) payload.append("proofImage", paymentProof);

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
    console.error("🔥 ERROR:", error);
    toast.error(
      error.response?.data?.message ||
      (isRTL ? "⚠️ حصل خطأ أثناء الإرسال" : "⚠️ Something went wrong")
    );
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
  <div className="relative group " ref={nameRef}> 
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
    <div className="space-y-2" ref={cityRef}>
<Select
  options={citiesList.map(c => ({
    value: c._id,
    label: isRTL ? c.cityAr : c.cityEn
  }))}

  value={
    citiesList
      .map(c => ({
        value: c._id,
        label: isRTL ? c.cityAr : c.cityEn
      }))
      .find(opt => opt.value === formData.city) || null
  }

  onChange={handleCityChange}
  placeholder={isRTL ? "ابحث عن المحافظة..." : "Search city..."}

  styles={customSelectStyles(isRTL, !!cityError)}
  isRtl={isRTL}
  isClearable

  className={`w-full py-1 bg-slate-50 dark:bg-[#111111] 
  border ${cityError ? 'border-red-500' : 'border-transparent dark:border-white/5'} 
  rounded-[1.5rem] focus-within:border-red-700 
  font-bold text-slate-900 dark:text-white`}
/>
 {cityError && <p className="text-red-500"></p>}
    </div>

    {/* 🏘️ الحي / المنطقة */}
    <div className="space-y-2" ref={districtRef}>

    <Select
  options={districts.map(d => ({
    value: d.bostaDistrictId,
    label: isRTL ? d.nameAr : (d.nameEn || d.nameAr)
  }))}

  value={
    districts
      .map(d => ({
        value: d.bostaDistrictId,
        label: isRTL ? d.nameAr : (d.nameEn || d.nameAr)
      }))
      .find(opt => opt.value === formData.bostaDistrictId) || null
  }

  onChange={handleDistrictChange}
isClearable
  placeholder={isRTL ? " ابحث عن المنطقة..." : "Search district..."}

  styles={customSelectStyles(isRTL, !!districtError)}
  isRtl={isRTL}
  isDisabled={!formData.city}

  className={`w-full py-1 bg-slate-50 dark:bg-[#111111] 
  border ${districtError ? 'border-red-500' : 'border-transparent dark:border-white/5'} 
  rounded-[1.5rem] focus-within:border-red-700 
  font-bold text-slate-900 dark:text-white`}
/>

    </div>
  </div>

  {/* 📍 العنوان بالتفصيل */}
  <div className="relative group" ref={addressRef}>
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

  <div className="grid grid-cols-2 gap-2.5 sm:gap-4">

    {/* 💵 Cash */}
    <div 
      onClick={() => setFormData(p => ({...p, paymentMethod: 'cash'}))}
      className={`min-h-28 w-full rounded-2xl border-2 p-3 transition-all flex flex-col items-center justify-center gap-2 sm:min-h-36 sm:rounded-[2rem] sm:gap-3 sm:p-6 
      ${formData.paymentMethod === 'cash' 
        ? 'border-red-700 bg-red-700/10' 
        : 'border-transparent bg-slate-50 dark:bg-[#111111]'
      }`}
    >
      <Banknote size={28} className={`h-5 w-5 sm:h-7 sm:w-7 ${formData.paymentMethod === 'cash' ? 'text-red-700' : 'text-slate-400'}`} />

      <span className={`text-center text-[9px] font-black leading-tight uppercase sm:text-[10px] 
        ${formData.paymentMethod === 'cash' 
          ? 'text-slate-900 dark:text-white' 
          : 'text-slate-400'
        }`}
      >
        {isRTL ? "عند الاستلام" : "Cash on Delivery"}
      </span>
    </div>

    {paymentSettings?.instapayEnabled && (
      <button
        type="button"
        onClick={() => setFormData((p) => ({ ...p, paymentMethod: "instapay" }))}
        aria-pressed={formData.paymentMethod === "instapay"}
        className={`min-h-28 w-full rounded-2xl border-2 p-3 transition-all flex flex-col items-center justify-center gap-1.5 sm:min-h-36 sm:rounded-[2rem] sm:gap-3 sm:p-6 ${formData.paymentMethod === "instapay" ? "border-red-700 bg-red-700/10" : "border-transparent bg-slate-50 dark:bg-[#111111]"}`}
      >
        <CreditCard size={28} className={`h-5 w-5 sm:h-7 sm:w-7 ${formData.paymentMethod === "instapay" ? "text-red-700" : "text-slate-400"}`} />
        <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">InstaPay</span>
        <span className="text-[10px] text-slate-500">{isRTL ? "تحويل فوري" : "Instant transfer"}</span>
      </button>
    )}

    {paymentSettings?.vodafoneCashEnabled && (
      <button
        type="button"
        onClick={() => setFormData((p) => ({ ...p, paymentMethod: "vodafone_cash" }))}
        aria-pressed={formData.paymentMethod === "vodafone_cash"}
        className={`min-h-28 w-full rounded-2xl border-2 p-3 transition-all flex flex-col items-center justify-center gap-1.5 sm:min-h-36 sm:rounded-[2rem] sm:gap-3 sm:p-6 ${formData.paymentMethod === "vodafone_cash" ? "border-red-700 bg-red-700/10" : "border-transparent bg-slate-50 dark:bg-[#111111]"}`}
      >
        <Phone size={28} className={`h-5 w-5 sm:h-7 sm:w-7 ${formData.paymentMethod === "vodafone_cash" ? "text-red-700" : "text-slate-400"}`} />
        <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">{isRTL ? "\u0645\u062d\u0641\u0638\u0629 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629" : "E-Wallet"}</span>
        <span className="text-[10px] text-slate-500">{isRTL ? "محفظة إلكترونية" : "E-Wallet"}</span>
      </button>
    )}

    {/* 💳 Card (Disabled) */}
    <div
      onClick={() => {
        toast.info(
          isRTL
            ? "الدفع الإلكتروني قيد التحديث حالياً 🔧"
            : "Online payment is currently unavailable 🔧"
        );
      }}
      className="relative min-h-28 w-full rounded-2xl border-2 p-3 transition-all flex flex-col items-center justify-center gap-2 sm:min-h-36 sm:rounded-[2rem] sm:gap-3 sm:p-6 
                 border-dashed border-red-400 bg-slate-50 dark:bg-[#111111] opacity-70"
    >
      <CreditCard size={28} className="h-5 w-5 text-slate-400 sm:h-7 sm:w-7" />

      <span className="text-center text-[9px] font-black leading-tight uppercase text-slate-400 sm:text-[10px]">
        {isRTL ? "فيزا / ماستر" : "Card / Visa"}
      </span>

      {/* ⚠️ Badge */}
      <span className="absolute -top-2 right-2 rounded-full bg-red-600 px-2 py-[2px] text-[9px] font-black text-white sm:-right-2 sm:text-[10px]">
        {isRTL ? " غير متاح حاليا للتحديث" : "OFF"}
      </span>

      {/* 🔒 Overlay hint */}
      <span className="mt-0.5 text-[9px] font-bold text-red-500 sm:mt-1">
        {isRTL ? "قيد التحديث" : "Coming soon"}
      </span>
    </div>

  </div>

  {["instapay", "vodafone_cash"].includes(formData.paymentMethod) && (
    <div className="space-y-3 rounded-2xl border border-red-700/30 bg-slate-50 p-3 dark:bg-[#111111] sm:space-y-4 sm:p-5">
      <div className="space-y-2 text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-200 sm:text-sm">
        {formData.paymentMethod === "instapay" ? (
          <>
            <p>{isRTL ? "حوّل قيمة الطلب إلى حساب InstaPay من الرابط الرسمي:" : "Transfer your order total using the official InstaPay link:"}</p>
            <a
              href={paymentSettings?.instapayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-red-700 px-3 py-3 text-center text-xs font-extrabold leading-tight text-white shadow-md transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#111111] sm:px-5 sm:text-sm"
            >
              {isRTL ? "\u0627\u0636\u063a\u0637 \u0647\u0646\u0627 \u0644\u0641\u062a\u062d \u0627\u0646\u0633\u062a\u0627 \u0628\u0627\u064a \u0648\u0627\u0644\u062a\u062d\u0648\u064a\u0644" : "Click here to open InstaPay and transfer"}
            </a>
          </>
        ) : (
          <>
            <p>{isRTL ? "\u062d\u0648\u0651\u0644 \u0642\u064a\u0645\u0629 \u0627\u0644\u0637\u0644\u0628 \u0625\u0644\u0649 \u0627\u0644\u0645\u062d\u0641\u0638\u0629 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629:" : "Transfer your order total to this e-wallet number:"}</p>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-black/40 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3">
              <span className="col-span-2 text-center font-mono text-lg font-black tracking-widest text-red-700 sm:col-span-1 sm:text-left sm:text-xl" dir="ltr">
                {showVodafoneCashNumber
                  ? paymentSettings?.vodafoneCashNumber
                  : `••••••${String(paymentSettings?.vodafoneCashNumber || "").slice(-3)}`}
              </span>
              <button
                type="button"
                onClick={() => setShowVodafoneCashNumber((visible) => !visible)}
                className="rounded-lg border border-slate-300 px-2 py-2 text-[10px] font-bold dark:border-white/20 sm:px-3 sm:text-xs"
              >
                {showVodafoneCashNumber ? (isRTL ? "إخفاء الرقم" : "Hide number") : (isRTL ? "إظهار الرقم" : "Show number")}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(paymentSettings.vodafoneCashNumber);
                    toast.success(isRTL ? "تم نسخ الرقم" : "Number copied");
                  } catch {
                    toast.info(paymentSettings.vodafoneCashNumber);
                  }
                }}
                className="rounded-lg bg-red-700 px-2 py-2 text-[10px] font-bold text-white sm:px-3 sm:text-xs"
              >
                {isRTL ? "نسخ الرقم" : "Copy number"}
              </button>
            </div>
          </>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isRTL ? "بعد التحويل ارفع صورة واضحة للإيصال. لن يُعتمد الطلب قبل مراجعة التحويل." : "Upload a clear receipt after transferring. The order stays pending until the transfer is reviewed."}
        </p>
      </div>
      <label htmlFor={`${formData.paymentMethod}-proof`} className="block text-xs font-bold text-slate-800 dark:text-white sm:text-sm">
        {isRTL ? "إثبات التحويل (صورة واحدة، حتى 8 ميجابايت)" : "Transfer receipt (one image, up to 8 MB)"}
      </label>
      <input
        key={formData.paymentMethod}
        id={`${formData.paymentMethod}-proof`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0] || null;
          if (file && file.size > 8 * 1024 * 1024) {
            toast.error(isRTL ? "حجم الصورة يجب ألا يتجاوز 8 ميجابايت" : "The image must be 8 MB or smaller");
            event.target.value = "";
            setPaymentProofs((previous) => ({ ...previous, [formData.paymentMethod]: null }));
            return;
          }
          setPaymentProofs((previous) => ({ ...previous, [formData.paymentMethod]: file }));
        }}
        className="sr-only"
      />
      <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-black/40 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
        <label htmlFor={`${formData.paymentMethod}-proof`} className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-800 sm:px-4 sm:py-2.5 sm:text-sm">
          {isRTL ? "\u0627\u062e\u062a\u0627\u0631 \u0635\u0648\u0631\u0629" : "Choose image"}
        </label>
        <span className={`min-w-0 break-all text-center text-xs sm:text-left sm:text-sm ${paymentProofs[formData.paymentMethod] ? "font-semibold text-emerald-600" : "text-slate-500 dark:text-slate-400"}`}>
          {paymentProofs[formData.paymentMethod]?.name || (isRTL ? "\u0644\u0645 \u064a\u062a\u0645 \u0627\u062e\u062a\u064a\u0627\u0631 \u0635\u0648\u0631\u0629" : "No file selected")}
        </span>
      </div>
    </div>
  )}
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

    <p className="mb-5 text-sm font-bold text-slate-600 dark:text-slate-300">
      {discountInfo.discountType === "percentage"
        ? (isRTL
            ? `خصم ${discountInfo.percentage}% على المنتجات المشمولة${discountInfo.maxDiscountAmount ? ` بحد أقصى ${discountInfo.maxDiscountAmount} ج.م` : ""}`
            : `${discountInfo.percentage}% off eligible products${discountInfo.maxDiscountAmount ? ` (up to ${discountInfo.maxDiscountAmount} EGP)` : ""}`)
        : discountInfo.discountType === "bogo"
        ? (isRTL ? `اشتري ${discountInfo.buyQuantity} واحصل على ${discountInfo.getQuantity} مجانًا` : `Buy ${discountInfo.buyQuantity}, get ${discountInfo.getQuantity} free`)
        : discountInfo.discountType === "bogo_discount"
        ? (isRTL ? `اشتري ${discountInfo.buyQuantity} واحصل على ${discountInfo.getQuantity} بخصم ${discountInfo.getDiscount}%` : `Buy ${discountInfo.buyQuantity}, get ${discountInfo.getQuantity} at ${discountInfo.getDiscount}% off`)
        : (isRTL ? "شحن مجاني" : "Free shipping")}
    </p>

    {/* Items List */}
<div className="space-y-3">
  {cart.map((item, idx) => {
    const productId = String(item.product?._id || item.product || item._id || "");
    const isApp = discountInfo?.appliesToAll || (discountInfo?.applicableProducts || [])
      .some((product) => String(product?._id || product) === productId);
    const itemBreakdown = discountInfo?.itemBreakdown?.[idx];
    const discountedQuantity = Number(itemBreakdown?.discountedQuantity) || 0;

    let priceDisplay = (
      <span className="text-sm font-black text-slate-900 dark:text-white">
        {item.price * (item.qty || item.quantity)} EGP
      </span>
    );

    if (isApp) {
      if (discountInfo.discountType === "percentage") {
        priceDisplay = (
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-emerald-600 dark:text-red-700">
              {discountInfo.percentage}% {isRTL ? "خصم" : "OFF"}
            </span>
            <span className="text-[10px] text-slate-500">{isRTL ? `توفير ${Math.round(itemBreakdown?.discountAmount || 0)} ج.م` : `Save ${Math.round(itemBreakdown?.discountAmount || 0)} EGP`}</span>
          </div>
        );
      } else if (
        ["bogo", "bogo_discount"].includes(discountInfo.discountType)
      ) {
        priceDisplay = (
          <div className="flex flex-col items-end">
            {discountedQuantity > 0 ? (
              <>
                <span className="text-[10px] text-red-500 font-black uppercase">
                  {isRTL ? `${discountedQuantity} قطعة مشمولة` : `${discountedQuantity} qualifying unit(s)`}
                </span>
                <span className="text-sm font-black bg-emerald-500 dark:bg-red-700 text-white dark:text-black px-2 rounded-md">
                  {discountInfo.discountType === "bogo" ? (isRTL ? "مجاني" : "FREE") : `${discountInfo.getDiscount}% ${isRTL ? "خصم" : "OFF"}`}
                </span>
                <span className="text-[10px] text-slate-500">{isRTL ? `توفير ${Math.round(itemBreakdown?.discountAmount || 0)} ج.م` : `Save ${Math.round(itemBreakdown?.discountAmount || 0)} EGP`}</span>
              </>
            ) : (
              <span className="text-[10px] text-slate-500 font-bold">{isRTL ? "لا توجد قطعة هدية في هذا المنتج" : "No qualifying gift unit for this item"}</span>
            )}
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
<div className="hidden rounded-[1.5rem] border border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#111111]">

  <label className="flex items-start gap-3 cursor-pointer">

    <input
      type="checkbox"
      checked={formData.marketingConsent}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          marketingConsent: e.target.checked,
        }))
      }
      className="mt-1 w-5 h-5 accent-red-700"
    />

    <div className="flex flex-col">

      <span className="text-[13px] font-black text-slate-900 dark:text-white">
        {isRTL
          ? "أوافق على استقبال رسائل واتساب التسويقية من VESTRO"
          : "I agree to receive WhatsApp marketing messages from Vestro"}
      </span>

      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">
        {isRTL
          ? "يمكنك إلغاء الاشتراك في أي وقت"
          : "You can unsubscribe at any time"}
      </span>

    </div>

  </label>
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

        {showMarketingConsentModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" dir={isRTL ? "rtl" : "ltr"}>
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="marketing-consent-title"
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#151515] sm:p-8"
            >
              <h2 id="marketing-consent-title" className="text-xl font-black text-slate-900 dark:text-white">
                {isRTL ? "\u062a\u0641\u0636\u064a\u0644\u0627\u062a \u0631\u0633\u0627\u0626\u0644 \u0648\u0627\u062a\u0633\u0627\u0628" : "WhatsApp message preference"}
              </h2>
              <p className="mt-4 text-sm font-bold leading-7 text-slate-700 dark:text-slate-200">
                {isRTL
                  ? "\u0623\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0627\u0633\u062a\u0642\u0628\u0627\u0644 \u062c\u0645\u064a\u0639 \u0623\u0646\u0648\u0627\u0639 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u062a\u0633\u0648\u064a\u0642\u064a\u0629 \u0648\u062a\u062d\u062f\u064a\u062b\u0627\u062a \u0627\u0644\u0634\u062d\u0646 \u0645\u0646 VESTRO\u061f"
                  : "I agree to receive all types of marketing messages and shipping updates from VESTRO?"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {isRTL ? "\u064a\u0645\u0643\u0646\u0643 \u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643 \u0641\u064a \u0623\u064a \u0648\u0642\u062a" : "You can unsubscribe at any time."}
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((previous) => ({ ...previous, marketingConsent: true }));
                    setShowMarketingConsentModal(false);
                    handleSubmit(undefined, true);
                  }}
                  className="rounded-xl bg-red-700 px-4 py-3 font-black text-white transition hover:bg-red-800"
                >
                  {isRTL ? "\u0646\u0639\u0645" : "Yes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((previous) => ({ ...previous, marketingConsent: false }));
                    setShowMarketingConsentModal(false);
                    handleSubmit(undefined, false);
                  }}
                  className="rounded-xl border border-slate-300 px-4 py-3 font-black text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  {isRTL ? "\u0644\u0627" : "No"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;


