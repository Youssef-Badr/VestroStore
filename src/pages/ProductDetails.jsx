/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext, useRef ,useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
// ✅ تم إضافة Star
import {
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  X,
  Star,
  Ruler,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { CartContext } from "../contexts/CartContext";
import ProductCard from "../components/ProductCard";
import api from "../../src/api/axiosInstance";
import ProductBundlesSection from "../components/ProductBundlesSection";
import { toast } from "react-toastify"; // ✅ إضافة toast

export default function ProductDetails() {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const { search } = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);
  const [showSizeChart, setShowSizeChart] = useState(false);
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailsContainerRef = useRef(null); // ✅ هنا عرفنا الريف
const [selectedOptions, setSelectedOptions] = useState({ Color: "", Size: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
const [isExpanded, setIsExpanded] = useState(false);
  // ⭐️ حالة التقييمات
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [reviewerName, setReviewerName] = useState(""); // اسم المستخدم (الضيف)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const colorsContainerRef = useRef(null);
  // ⭐️ Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
const [touchEnd, setTouchEnd] = useState(null);
const [galleryIndex, setGalleryIndex] = useState(0);
const [hideArrows, setHideArrows] = useState(false);
const sizeSectionRef = useRef(null);
 const actionsRef = useRef(null);
const [isSticky, setIsSticky] = useState(false);
// 1. عداد المشاهدين (بيتغير كل كام ثانية)
const [viewers, setViewers] = useState(Math.floor(Math.random() * (45 - 12 + 1)) + 12);
// 2. عداد المبيعات (ثابت خلال الـ 24 ساعة بناءً على اليوم)
const [salesCount, setSalesCount] = useState(2);

useEffect(() => {
  const handleScroll = () => {
    if (!actionsRef.current) return;

    const rect = actionsRef.current.getBoundingClientRect();

    // يظهر لما الأزرار تختفي من الشاشة
    if (rect.top < -500) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);
const cartHasItems = cart && cart.length > 0;

// ⭐️ Meta Pixel ViewContent عند تحميل المنتج
useEffect(() => {
  if (product && window.trackFBEvent) {
    window.trackFBEvent("ViewContent", {
      content_ids: [product._id],
      content_name: product.name,
      content_type: "product",
      value: product.salePrice || product.originalPrice || 0,
      currency: "EGP",
    });
  }
}, [product]);

useEffect(() => {
    if (!product?._id) return;

    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next >= 10 && next <= 60 ? next : prev;
      });
    }, 5000);

    // حساب المبيعات اليومية بشكل ثابت لكل منتج
    const today = new Date().toISOString().slice(0, 10);
    const seed = today.split('-').join('') + product._id;
    const seedNum = parseInt(seed.slice(-4), 16) || 123; 
    
    // التعديل هنا: (رقم عشوائي بين 0 و 12) + 5 = (النتيجة بين 5 و 17 مبيعة)
    const pseudoRandomSales = Math.floor((seedNum % 13) + 5); 
    
    setSalesCount(pseudoRandomSales);

    return () => clearInterval(interval);
}, [product?._id]);

useEffect(() => {
  const fetchRelated = async () => {
    try {
      // ✅ استخدم id (الذي استخرجته من useParams) بدلاً من productId
      const { data } = await fetch(`/products/${id}/related`);
      setRelatedProducts(data);
    } catch (err) {
      console.error("Error fetching related products:", err);
      setRelatedProducts([]); 
    }
  };

  if (id) {
    fetchRelated();
  }
}, [id]); // ✅ تأكد أنها id

// تعريف المتغير اللي كان ناقص ومسبب الـ Error
const allProductImages = useMemo(() => {
  if (!product) return [];
  
  // تجميع الصور الأساسية
  const baseImages = product.images || [];
  
  // تجميع صور الألوان (Variants)
  const variantImages = product.variants?.flatMap(v => v.images || []) || [];
  
  // دمجهم كلهم
  const combined = [...baseImages, ...variantImages];
  
  // التأكد إن مفيش صورة متكررة بناءً على الـ URL
  return Array.from(new Map(combined.map(img => [img.url, img])).values());
}, [product]);

  const { language } = useLanguage();
  useTheme();
  const isRTL = language === "ar";

  const translations = {
    error: isRTL ? "⚠️ فشل تحميل المنتج." : "⚠️ Failed to load product.",
    loading: isRTL ? "⏳ جارِ التحميل..." : "⏳ Loading...",
    currency: isRTL ? "ج.م" : "EGP",
    noImage: isRTL ? "لا توجد صورة متاحة" : "No image available",
    colors: isRTL ? "الألوان" : "Colors",
    sizes: isRTL ? "المقاسات" : "Sizes",
    quantity: isRTL ? "الكمية" : "Quantity",
    outOfStock: isRTL ? "نفد" : "Out",
    lowStock: isRTL ? "قليل" : "Low",
    addToCart: isRTL ? "🛒 أضف إلى السلة" : "🛒 Add to Cart",
    selectSizeAlert: isRTL
      ? "برجاء اختيار المقاس أولاً!"
      : "Please select a size first!",
    quantityAlert: isRTL ? "لا يوجد سوى " : "Only ",
    itemsAvailable: isRTL ? " قطعة متاحة!" : " items available!",
    addToCartSuccess: isRTL
      ? "✅ تم إضافة المنتج إلى سلة التسوق: "
      : "✅ Added to cart: ",
   relatedProductsTitle: isRTL ? "عملاء اشتروا هذه المنتجات أيضاً" : "Customers also bought these products",
    // ⭐️ ترجمة التقييمات
    addReviewTitle: isRTL ? "أضف تقييمك" : "Add Your Review",
    reviewName: isRTL ? "اسمك" : "Your Name",
    reviewRating: isRTL ? "التقييم" : "Rating",
    reviewComment: isRTL ? "التعليق" : "Comment",
    submitReview: isRTL ? "إرسال التقييم" : "Submit Review",
    alreadyReviewed: isRTL
      ? "لقد قيمت هذا المنتج بالفعل."
      : "You have already reviewed this product.",
    reviewSuccess: isRTL
      ? "🎉 تم إضافة التقييم بنجاح!"
      : "🎉 Review added successfully!",
    reviewsSection: isRTL ? "تقييمات العملاء" : "Customer Reviews",
    noReviews: isRTL
      ? "لا توجد تقييمات لهذا المنتج بعد."
      : "No reviews yet for this product.",
    fillReviewAlert: isRTL
      ? "الرجاء تعبئة الاسم، التقييم، والتعليق."
      : "Please fill in name, rating, and comment.",
  };

  

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // ⭐️ دالة جلب التقييمات
   
  const fetchReviews = async (productId) => {
    try {
      // نفترض أن API /reviews/ يرجع قائمة التقييمات فقط
      const { data } = await api.get(`/products/${productId}/reviews`);
      return data.reviews || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  // ⭐️ دالة إرسال التقييمات
  const submitReviewHandler = async (e) => {
    e.preventDefault();

    if (!reviewerName || !newComment || newRating === 0) {
      toast.error(translations.fillReviewAlert);
      return;
    }

    setIsSubmittingReview(true);
    try {
      const { data } = await api.post(`/products/${id}/reviews`, {
        name: reviewerName,
        rating: newRating,
        comment: newComment,
      });

      // تحديث الواجهة بالبيانات المرجعة من السيرفر (والتي يجب أن تتضمن التقييم الجديد)
      setReviews(data.reviews);
      setHasReviewed(true);

      // تحديث بيانات المنتج الرئيسية لتعكس التقييم الجديد (كـ Rating و NumReviews)
      setProduct((prev) => ({
        ...prev,
        rating: data.rating,
        numReviews: data.numReviews,
      }));

      // حفظ الاسم في LocalStorage لمنع التكرار في باقي المنتجات (على الأقل لنفس المتصفح)
      localStorage.setItem("guestReviewerName", reviewerName);

      // مسح حقول الإدخال
      setNewComment("");
      setNewRating(0);
      toast.success(translations.reviewSuccess);
    } catch (error) {
      const message = error.response?.data?.message || "فشل إضافة التقييم.";
      toast.error(message);
      if (message.includes("already reviewed")) {
        setHasReviewed(true);
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

 
// 1. الجزء الخاص بجلب بيانات المنتج الأساسية (عدل الـ Effect الطويل ليصبح هكذا)
useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      setError("");
      setProduct(null);
      setSelectedImage("");
      setSelectedColorId(null);
      setSelectedSizeId(null);
      setSelectedQty(1);

      try {
        // جلب المنتج الأساسي
        const { data } = await api.get(`/products/${id}`);
        const prod = data?.product || data;
        if (!mounted) return;
        setProduct(prod);

       // ... بعد setProduct(prod) ...

const productVariations = prod.variants || prod.variations || [];

// 1. تحديد الـ Variation الابتدائي (إما من الرابط أو أول واحد متاح)
const normalize = (v) => v ? v.replace(/#/g, "").toLowerCase().trim() : "";
const params = new URLSearchParams(search);
const colorFromUrl = normalize(params.get("color"));

let initialVariation = null;
if (colorFromUrl && productVariations.length > 0) {
  initialVariation = productVariations.find(v => normalize(v.options?.Color) === colorFromUrl);
}

if (!initialVariation) {
  initialVariation = productVariations.find(v => v.stock > 0) || productVariations[0] || null;
}

// 2. تحديث الحالة (States) بالبيانات الابتدائية
if (initialVariation) {
  setSelectedColorId(initialVariation._id || null);
  setSelectedOptions({
    Color: initialVariation.options?.Color || "",
    Size: "" 
  });

  // 🔥 السطر الأهم: تحديد الصورة التي ستظهر فوراً
  // نأخذ صورة الـ Variant أولاً، وإذا لم توجد نأخذ الصورة الأساسية للمنتج
  const firstVariantImg = initialVariation.images?.[0]?.url;
  const firstProductImg = prod.images?.[0]?.url;
  
  setSelectedImage(firstVariantImg || firstProductImg || "");
} else {
  // في حالة عدم وجود Variations أصلاً، نظهر الصورة الأساسية للمنتج
  setSelectedImage(prod.images?.[0]?.url || "");
}

        // ❌ احذف كل الكود القديم الخاص بـ sameProductVariations و relatedByCategory من هنا ❌
        // لأننا سنستخدم الـ Effect المنفصل بالأسفل
        
      } catch (err) {
        console.error("Error in loadProduct:", err);
        if (mounted) setError("حدث خطأ أثناء تحميل المنتج");
      }
    }

    loadProduct();
    return () => { mounted = false; };
}, [id, search]);

useEffect(() => {
  if (!product?._id) return;

  fbq("track", "ViewContent", {
    content_ids: [product._id],
    content_name: product.name,
    content_type: "product",
    content_category: product.category?.map(c => c.name).join(", "),
    value: product.salePrice || product.originalPrice || product.price || 0,
    currency: "EGP",
    contents: product.variants?.slice(0, 3).map(v => ({
      id: product._id,
      quantity: v.stock || 1,
      item_price: v.price || product.price
    }))
  });
}, [product?._id]);

// 2. الـ Effect المنفصل والوحيد للمنتجات ذات الصلة (استخدم Axios بما أنك تستخدمه بالفعل)
useEffect(() => {
  const fetchRelated = async () => {
    try {
      // ✅ ننادي الباك إند اللي عملناه سوياً
      // نستخدم api.get (Axios) بدلاً من fetch لضمان ثبات المسارات
      const { data } = await api.get(`/products/${id}/related`);
      
      // هنا الداتا ستأتي عبارة عن المنتجات الأخرى في نفس الكاتيجوري 
      // بدون تكرار الألوان للمنتج الواحد (بناءً على كود الباك إند اللي كتبناه)
      setRelatedProducts(data);
    } catch (err) {
      console.error("Error fetching related products:", err);
      setRelatedProducts([]); 
    }
  };

  if (id) {
    fetchRelated();
  }
}, [id]);

  useEffect(() => {
    if (selectedSizeId && product) {
      const selectedVariation = product.variations?.find(
        (v) => v._id === selectedColorId
      );
      if (selectedVariation) {
        const size = selectedVariation.sizes.find(
          (s) => s._id === selectedSizeId
        );
        if (size && selectedQty > size.quantity) {
          setSelectedQty(size.quantity);
        }
      }
    }
  }, [selectedSizeId, selectedColorId, selectedQty, product]);


  const scrollToColor = (colorId) => {
    const container = colorsContainerRef.current;
    if (!container) return;

    const btn = container.querySelector(`[data-color-id='${colorId}']`);
    if (!btn) return;

    const scrollPos =
      btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;

    container.scrollTo({ left: scrollPos, behavior: "smooth" });
  };
  // 🟢 تعريف دالة التمرير للـ Thumbnails
const scrollToThumbnail = (imgUrl) => {
  const container = thumbnailsContainerRef.current;
  if (!container) return;

  // البحث عن زر الصورة باستخدام الـ data-img-url الذي وضعته أنت
  const selectedBtn = container.querySelector(
      `[data-img-url='${imgUrl}']`
  );

  if (selectedBtn) {
      // منطق تمرير العنصر ليظهر في منتصف الحاوية (مهم لتجربة المستخدم)
      const containerWidth = container.offsetWidth;
      const buttonLeft = selectedBtn.offsetLeft;
      const buttonWidth = selectedBtn.offsetWidth;
      
      // حساب موضع التمرير لمركز الزر
      const scrollPosition = 
          buttonLeft - containerWidth / 2 + buttonWidth / 2;

      container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
      });
  }
};

  // ✅ Scroll selected color into view when it’s selected automatically
  useEffect(() => {
    scrollToColor(selectedColorId);
  }, [selectedColorId]);

  if (error)
    return (
      <div className="container mx-auto p-4 text-red-600 dark:text-red-400 pt-20 text-center">
        {error}
      </div>
    );
  if (!product)
    return (
      <p className="container mx-auto p-4 text-gray-600 dark:text-gray-300 pt-20 text-center flex items-center justify-center gap-2">
        <Loader2 className="animate-spin" size={24} /> {translations.loading}
      </p>
    );

 if (!product.description) return null;

  // تحديد عدد الحروف المراد عرضها في الحالة المختصرة (مثلاً 150 حرف)
  // هذا يضمن تقريباً عرض 3-4 أسطر على معظم الشاشات دون أخذ مساحة كبيرة
  const startingPoint = 150; 
  const shouldShowReadMore = product.description.length > startingPoint;

 

  const handleAddToCart = () => {
  // 1. التحقق من اختيار اللون والمقاس أولاً
  if (!selectedOptions.Color || !selectedOptions.Size) {
    // إظهار الرسالة
    setToastMessage(isRTL ? "برجاء اختيار اللون والمقاس أولاً" : "Please select Color and Size first");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 800);

    // سكرول لمكان المقاسات للفت الانتباه
    sizeSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // إضافة أنيميشن بسيط لو متاح عندك في الـ CSS
    sizeSectionRef.current?.classList.add('animate-shake');
    setTimeout(() => sizeSectionRef.current?.classList.remove('animate-shake'), 500);
    return;
  }

  // 2. البحث عن الـ Variant المطابق للاختيارات
  const currentVariant = product.variants?.find(
    (v) => v.options.Color === selectedOptions.Color && v.options.Size === selectedOptions.Size
  );

  if (!currentVariant) {
    showToastMessage(isRTL ? "هذا الاختيار غير متوفر حالياً" : "This combination is not available");
    return;
  }

  // 3. التحقق من المخزون (Stock)
  if (currentVariant.stock === 0) {
    showToastMessage(isRTL ? "نفد من المخزن" : "Out of stock");
    return;
  }

  if (selectedQty > currentVariant.stock) {
    showToastMessage(
      (isRTL ? "الكمية المتاحة فقط: " : "Available quantity: ") + currentVariant.stock
    );
    return;
  }

  // 4. استدعاء الـ Context الجديد (بياخد المنتج والـ variant والكمية)
  // لاحظ هنا بعتنا currentVariant كامل عشان الـ Provider يولد منه الـ vId
  addToCart(product, currentVariant, selectedQty);

  
  // 6. رسالة النجاح
  showToastMessage(
    (isRTL ? "تمت الإضافة بنجاح: " : "Added successfully: ") +
    `${product.name} - ${selectedOptions.Color} - ${selectedOptions.Size} x${selectedQty}`
  );
};
 
  

 const handleThumbnailClick = (img) => {
  // 👇 1. هات index بتاع الصورة
  const index = allProductImages.findIndex(i => i.url === img.url);

  if (index !== -1) {
    setGalleryIndex(index); // 🔥 ده المهم
  }

  // 👇 2. خلي selectedImage sync برضه (اختياري بس حلو)
  setSelectedImage(img.url);

  // 👇 3. نفس logic اللون
  const colorMatch = product.variants?.find(v => 
    v.images?.some(variantImg => variantImg.url === img.url)
  );

  if (colorMatch && colorMatch.options?.Color) {
    setSelectedColorId(colorMatch._id || null);
    setSelectedOptions(prev => ({
      ...prev,
      Color: colorMatch.options.Color,
      Size: ""
    }));
    setSelectedQty(1);
  }
};

 const openLightbox = (img, imagesList = []) => {
  if (imagesList.length) {
    setLightboxImages(imagesList);
  }

  const targetUrl = img?.url || selectedImage;
  const index = imagesList.length
    ? imagesList.findIndex((i) => i.url === targetUrl)
    : lightboxImages.findIndex((i) => i.url === targetUrl);

  setLightboxIndex(index >= 0 ? index : 0);
  setIsLightboxOpen(true);
  setHideArrows(true)
};

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) =>
      prev === 0 ? lightboxImages.length - 1 : prev - 1
    );
  };


 const galleryImages = allProductImages || []; // مهم تستخدم نفس المصدر

const nextImage = () => {
  if (!galleryImages.length) return;

  const nextIndex = (galleryIndex + 1) % galleryImages.length;
  setGalleryIndex(nextIndex);

  const nextImg = galleryImages[nextIndex];

  // 👇 نفس اللي بيحصل لما تدوس thumbnail
  handleThumbnailClick(nextImg);
};

const prevImage = () => {
  if (!galleryImages.length) return;

  const prevIndex =
    galleryIndex === 0 ? galleryImages.length - 1 : galleryIndex - 1;

  setGalleryIndex(prevIndex);

  const prevImg = galleryImages[prevIndex];

  // 👇 نفس behavior
  handleThumbnailClick(prevImg);
};


const currentVariant = product.variants?.find(
  v => v.options.Color === selectedOptions.Color && v.options.Size === selectedOptions.Size
);

const isSoldOut = selectedOptions.Size && selectedOptions.Color 
  ? (currentVariant?.stock === 0) 
  : (product.countInStock === 0);

  // ⭐️ مكون عرض التقييم (لمساعدتك)
  const RatingStars = ({ value }) => {
    // التقريب لأقرب نصف نجمة للعرض
    const roundedValue = Math.round(value * 2) / 2;
    const fullStars = Math.floor(roundedValue);
    const emptyStars = 5 - Math.ceil(roundedValue);

    // دالة لتوليد النجوم الفارغة والممتلئة
    const renderStars = () => {
      const stars = [];
      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <Star
            key={`full-${i}`}
            size={16}
            fill="currentColor"
            className="text-yellow-500"
          />
        );
      }
      // إذا كان هناك نصف نجمة
      if (roundedValue % 1 !== 0) {
        stars.push(
          <Star
            key={`half`}
            size={16}
            fill="currentColor"
            className="text-yellow-500"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)" }}
          />
        );
      }
      for (let i = 0; i < emptyStars; i++) {
        stars.push(
          <Star
            key={`empty-${i}`}
            size={16}
            className="text-gray-300 dark:text-gray-600"
          />
        );
      }
      return stars;
    };

    return <div className="flex items-center gap-0.5">{renderStars()}</div>;
  };

  // ⭐️ مكون اختيار التقييم (لإدخال المستخدم)
  const RatingInput = ({ value, onChange, disabled }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Star
            key={starValue}
            size={28}
            fill={starValue <= value ? "currentColor" : "none"}
            className={`cursor-pointer transition-colors ${
              starValue <= value ? "text-yellow-500" : "text-gray-400"
            } ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-yellow-400"
            }`}
            onClick={() => !disabled && onChange(starValue)}
          />
        ))}
      </div>
    );
  };





  return (
    <div
  dir={isRTL ? "rtl" : "ltr"}
  className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white min-h-screen py-20 transition-colors duration-500"
>
  <div className="container mt-10 mx-auto px-4 pt-8 relative">
    {/* 🔙 Back Button - Fixed Position Style */}
    <button
      aria-labelledby="back-button"
      onClick={() => navigate(-1)}
      className="absolute top-0 left-4 md:left-8 p-3 rounded-full bg-slate-100 dark:bg-white/30 text-slate-900 dark:text-white  hover:scale-110 transition-all z-20 shadow-sm border border-transparent dark:border-white/10"
      aria-label="Go back"
    >
      <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
    </button>

    <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24">
     {/* 🖼️ Left Side: Image Gallery */}
<div className="md:w-1/2 flex flex-col items-center space-y-6">
  {/* الصورة الكبيرة المين */}
 <div className="relative w-full 
  aspect-[3/4] sm:aspect-[4/5] md:aspect-[4/5] 
  rounded-[1.5rem] md:rounded-[2rem] 
  overflow-hidden shadow-2xl bg-white dark:bg-[#0a0a0a] 
  border border-black/5 dark:border-white/5 group">
  
  {selectedImage ? (
    <img
      onClick={() =>
        openLightbox(
          { url: selectedImage },
          product.images
        )
      }
     src={galleryImages[galleryIndex]?.url || selectedImage}
      alt={product.name}
      /* object-top بتخلي التركيز على التيشرت أو الموديل من فوق في الشاشات الصغيرة */
      className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110 cursor-zoom-in"
    />
  ) : (
    <div className="flex items-center justify-center h-full text-slate-400">
      {translations.noImage}
    </div>
  )}
  
  {/* شارة الخصم - تصغير الحجم والـ Padding في الموبايل */}
  {product.salePercentage > 0 && (
    <div className="absolute 
      top-4 right-4 md:top-6 md:right-6 
      bg-white text-black 
      text-[10px] md:text-xs 
      font-black px-3 py-1.5 md:px-4 md:py-2 
      rounded-full uppercase       tracking-widest shadow-xl ring-2 ring-white/10">
      -{product.salePercentage}%
    </div>
  )}
  {/* Left Arrow */}
{!hideArrows && (
  <button
    onClick={prevImage}
    className="absolute left-2 top-1/2 -translate-y-1/2 
    w-12 h-12 rounded-full 
    bg-black/80 text-white 
    flex items-center justify-center 
    shadow-2xl z-[88]"
  >
    <ChevronLeft size={22} />
  </button>
)}

{/* Right Arrow */}
{!hideArrows && (
  <button
    onClick={nextImage}
    className="absolute right-2 top-1/2 -translate-y-1/2 
    w-12 h-12 rounded-full 
    bg-black/80 text-white 
    flex items-center justify-center 
    shadow-2xl z-[88] rotate-180"
  >
    <ChevronLeft size={22} />
  </button>
)}

</div>

  {/* 🎞️ معرض الصور المصغرة (Thumbnails) */}
  <div className="w-full">
    <div
      ref={thumbnailsContainerRef}
      className={`flex gap-3 overflow-x-auto p-2 no-scrollbar ${
        isRTL ? "flex-row-reverse justify-start" : "justify-start"
      }`}
    >
      {/* التعديل الجوهري: بنلف على allProductImages اللي جمعناها في الـ useMemo */}
      {allProductImages?.map((img) => {
        // بنعرف الصورة المختارة بمقارنة الرابط (URL)
        const isSelected = selectedImage === img.url;

        return (
          <button
            data-img-url={img.url}
            key={img._id || img.url}
            onClick={() => {
              handleThumbnailClick(img); // الدالة الذكية اللي بتربط اللون
              scrollToThumbnail(img.url); // التمرير السلس
            }}
            className={`flex-shrink-0 w-20 h-24 rounded-2xl border-2 transition-all duration-300 overflow-hidden relative group ${
              isSelected
                ? "border-[#e1ffad] scale-105 shadow-lg shadow-[#e1ffad]/10"
                : "border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#111111]"
            }`}
          >
            <img
              src={img.url}
              alt="thumbnail"
              className={`w-full h-full object-cover transition-all duration-300 ${
                isSelected ? "" : "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
              }`}
            />
            {/* Overlay خفيف للصور غير المختارة */}
            {!isSelected && (
              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        );
      })}
    </div>
  </div>
</div>

      {/* 📝 Right Side: Product Info */}
      <div className="md:w-1/2 flex flex-col p-2 sm:p-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-5xl font-black mb-3 tracking-tighter       uppercase text-slate-900 dark:text-white leading-none">
              {product.name}
            </h1>
             {/* Pricing Section */}
          <div translate="no" className="py-6 border-y  border-slate-100 dark:border-white/5 flex flex-wrap items-baseline gap-4">
            {product.salePrice ? (
              <>
                <span translate="no" className="text-4xl sm:text-5xl font-black       tracking-tighter text-slate-900 dark:text-white">
                  {product.salePrice} <span className="text-sm not-      opacity-60 uppercase">{translations.currency}</span>
                </span>
                <span translate="no" className="text-xl font-bold line-through text-slate-300 dark:text-slate-600">
                  {product.originalPrice}
                </span>
              </>
            ) : (
              <span className="text-4xl sm:text-5xl font-black       tracking-tighter text-slate-900 dark:text-white">
                {product.originalPrice || product.price} <span className="text-sm not-      opacity-60 uppercase">{translations.currency}</span>
              </span>
            )}
          </div>
            <div className="py-4 space-y-3">

  {/* Viewers Count */}
  <div className="flex items-center gap-3">
    <div className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
    </div>
    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
      {isRTL ? (
        <>هناك <span className="text-black dark:text-white font-black">{viewers}</span> أشخاص يشاهدون هذا المنتج الآن</>
      ) : (
        <><span className="text-black dark:text-white font-black">{viewers}</span> people are viewing this product right now</>
      )}
    </p>
  </div>

  {/* Sales Count */}
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-6 h-6 rounded-full  text-red-700">
      <ShoppingCart size={14} strokeWidth={3} />
    </div>
    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
      {isRTL ? (
        <>تم شراء هذا المنتج <span className="text-black dark:text-white font-black">{salesCount}</span> مرة خلال الـ 24 ساعة الماضية</>
      ) : (
        <>This product was purchased <span className="text-black dark:text-white font-black">{salesCount}</span> times in the last 24 hours</>
      )}
    </p>
  </div>
</div>

            <div className="flex items-center gap-3">
              <RatingStars value={product.rating || 0} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0} {isRTL ? "تقييم" : "reviews"})
              </span>
            </div>
          </div>


<div className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium transition-all duration-300 ease-in-out">
  {isExpanded && product.description}
</div>

<button
  onClick={() => setIsExpanded(!isExpanded)}
  className="
    mt-2
    px-4 py-2
    rounded-lg
    bg-red-800 text-white
    hover:bg-red-700
    active:bg-red-900
    transition-all duration-200
    font-semibold
    text-sm
    shadow-sm hover:shadow-md
    flex items-center gap-2
  "
>
  {isExpanded ? (
    <>
      {/* سهم لأعلى */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      {language === "ar" ? "إخفاء التفاصيل" : "Hide Details"}
    </>
  ) : (
    <>
      {/* سهم لأسفل */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
      {language === "ar" ? "عرض التفاصيل" : "View Details"}
    </>
  )}
</button>
         

       
   <div className="space-y-4">
  {/* العنوان المظبوط بنفس ستايل فيسترو */}
  <h3 className={`text-[20px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 
    ${isRTL ? "text-right" : "text-left"} 
    text-black dark:text-white`}>
    {isRTL ? "اختر اللون" : "Select Color"}
  </h3>

 <div
  className={`flex gap-6 overflow-x-auto py-4 no-scrollbar ${
    isRTL ? "flex-row-reverse justify-start" : "justify-start"
  }`}
>
  {product.options
    .find(opt => opt.name === "Color")
    ?.values.map((colorValue, index) => {

      // 🔥 كل variants الخاصة باللون
      const colorVariants = product.variants?.filter(
        v => v.options?.Color === colorValue
      );

      // 🎯 اختار variant فيه صورة فعليًا
      const variantWithImage = colorVariants?.find(
        v => v.images && v.images.length > 0 && v.images[0]?.url
      );

      // 🖼️ الصورة النهائية للون
      const colorImage =
        variantWithImage?.images?.[0]?.url ||
        product.images?.[0]?.url;

      const isOutOfStock = !colorVariants?.some(v => v.stock > 0);
      const isSelected = selectedOptions.Color === colorValue;

      return (
        <div key={index} className="flex flex-col items-center gap-2 min-w-fit">

          <button
            disabled={isOutOfStock}
            onClick={() => {
              if (isOutOfStock) return;

              setSelectedOptions(prev => ({
                ...prev,
                Color: colorValue,
              }));

              setSelectedImage(colorImage);
            }}
            className={`w-14 h-14 rounded-full border-2 relative transition-all duration-300 overflow-hidden ring-offset-2 dark:ring-offset-black ${
              isOutOfStock
                ? "opacity-20 cursor-not-allowed grayscale"
                : isSelected
                ? "ring-2 ring-red-700 scale-110 shadow-lg   dark:border-black"
                : "border-black/10 dark:border-white/20 hover:scale-110"
            }`}
          >
            <img
              src={colorImage}
              alt={colorValue}
              className="w-full h-full object-cover"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-full h-[1.5px] bg-white rotate-45"></div>
              </div>
            )}
          </button>

          {/* ⭐ اسم اللون ثابت تحت الدائرة */}
          <span
            className={`text-[10px] pt-2 md:text-xs font-black uppercase       truncate max-w-[70px] transition-colors ${
              isSelected
                ? "text-black dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {colorValue}
          </span>
        </div>
      );
    })}
</div>


</div>

{/* 2. المقاسات (Size Selection) */}
{product.options?.find(opt => opt.name === "Size")?.values.length > 0 && (
  <div ref={sizeSectionRef} className="space-y-4 scroll-mt-32 pt-4">
    <div className="flex justify-between items-center">
      <h3 className={`text-lg sm:text-base font-black uppercase tracking-[0.2em] mb-4  
  ${isRTL ? "text-right" : "text-left"} 
  text-black dark:text-white`}>
    {translations.sizes}
</h3>
      {product.sizeChart?.url && (
        <button
  onClick={() => setShowSizeChart(true)}
  className={`group flex items-center gap-2 transition-all duration-300 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
>
  {/* أيقونة المسطرة أو المقاسات بتدي إيحاء بصري للمحتوى */}
  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-red-800 transition-colors duration-300">
    <Ruler size={16} className="text-black dark:text-[#e1ffad] group-hover:text-black" />
  </div>

  <div className="flex flex-col items-start">
    <span className={`text-sm sm:text-base font-black leading-none text-black dark:text-white ${!isRTL ? "uppercase       tracking-wider" : "font-bold"}`}>
      {isRTL ? "جدول المقاسات" : "Size Guide"}
    </span>
    
    {/* خط الـ Underline بشكل مودرن (بيتحرك مع الـ Hover) */}
    <div className={`h-[2px] bg-[#e1ffad] dark:bg-[#e1ffad] transition-all duration-300 w-6 group-hover:w-full mt-1 ${isRTL ? "self-end" : "self-start"}`} />
  </div>
</button>
      )}
    </div>
  <div
  className={`flex gap-3 flex-wrap ${isRTL ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
>
  {product.options.find(opt => opt.name === "Size").values.map((sizeValue, index) => {
    const currentVariant = product.variants?.find(
      v => v.options.Color === selectedOptions.Color && v.options.Size === sizeValue
    );

    const isSelected = selectedOptions.Size === sizeValue;
    const isOutOfStock = !currentVariant || currentVariant.stock === 0;

    return (
     <button
  key={index}
  disabled={isOutOfStock}
  onClick={() => setSelectedOptions(prev => ({ ...prev, Size: sizeValue }))}
  className={`min-w-[60px] h-12 px-4 rounded-2xl border-2 font-black       transition-all relative ${
    isSelected
      ? "bg-red-700 text-black border-black shadow-lg shadow-[#86FE05]/20"
      : isOutOfStock
      ? "bg-slate-50 dark:bg-white/5 border-black dark:border-white text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
      : "bg-slate-50 dark:bg-[#111111] border-black dark:border-white text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-white"
  }`}
>
  {sizeValue}

  {isOutOfStock && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-[2px] bg-slate-300 dark:bg-slate-700 rotate-[-15deg]"></div>
    </div>
  )}
</button>
    );
  })}
</div>
  </div>
)}

{/* 3. الكمية وأزرار التحكم */}
  
    <div className="flex items-center gap-6 py-4">
      <h3 className="text-[15px] font-black uppercase tracking-[0.2em] text-black">
        {translations.quantity}
      </h3>
      <div className="flex items-center bg-slate-50 dark:bg-[#111111] rounded-2xl p-1 border border-slate-100 dark:border-white/5">
        <button
          onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
          className="p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          readOnly
          value={selectedQty}
          className="bg-transparent text-center w-12 font-black       outline-none"
        />
        <button
          onClick={() => {
            const currentVariant = product.variants?.find(
                v => v.options.Color === selectedOptions.Color && v.options.Size === selectedOptions.Size
            );
            if (selectedQty < (currentVariant?.stock || 0)) {
                setSelectedQty(prev => prev + 1);
            }
          }}
          className="p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>

  <div ref={actionsRef} className="flex flex-col sm:flex-row gap-4 pt-6 pb-10">
  
<motion.button
  disabled={isSoldOut}
  onClick={handleAddToCart}
  animate={!isSoldOut ? {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 0px 25px rgba(0,0,0,0.3)",
      "0px 0px 0px rgba(0,0,0,0)"
    ]
  } : {}}
  transition={{
    duration: 0.8,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  whileTap={{ scale: 0.92 }}
  className={`flex-1 py-5 text-lg rounded-[2rem] font-black uppercase       transition-all flex items-center justify-center gap-3 dark:bg-red-700 dark:text-black ${
    isSoldOut
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-red-700 text-white "
  }`}
>
  {isSoldOut ? (
    isRTL ? "نفدت الكمية" : "Sold Out"
  ) : (
    <>
      <ShoppingCart size={20} />
      {isRTL ? "أضف للسلة" : "Add To Cart"}
    </>
  )}
</motion.button>

  {/* Checkout - وميض سريع (Strobe effect) */}
<motion.button
  disabled={!cartHasItems}
  onClick={() => navigate("/checkout")}
  animate={
    cartHasItems
      ? {
          backgroundColor: darkMode
            ? ["#ffffff", "#eaeaea", "#ffffff"] // 🌙 دارك = أبيض
            : ["#000000", "#111111", "#000000"], // ☀️ لايت = أسود
          scale: [1, 1.04, 1],
        }
      : {}
  }
  transition={{
    duration: 0.6,
    repeat: Infinity,
    ease: "linear",
  }}
  whileTap={{ scale: 0.92 }}
  className={`flex-1 py-5 text-lg rounded-[2rem] font-black uppercase transition-all ${
    cartHasItems
      ? darkMode
        ? "bg-white text-black border border-black/10" // 👈 دارك
        : "bg-black text-white" // 👈 لايت
      : "bg-slate-600 text-black cursor-not-allowed"
  }`}
>
  {isRTL ? "إتمام الشراء" : "Checkout"}
</motion.button>
</div>


<ProductBundlesSection currentProductId={product?._id} />

<div
  className={`fixed bottom-0 left-0 w-full p-3 bg-black shadow-2xl z-50 transition-all duration-300 ${
    isSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
  }`}
>

 <button
  disabled={isSoldOut}
  onClick={handleAddToCart}
  className={`w-full h-13 rounded-xl font-black uppercase       tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
    isSoldOut
      ? "bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed"
      : !selectedOptions.Color || !selectedOptions.Size
      // الحالة قبل الاختيار (تعتمد على الثيم)
      ? "bg-black text-white dark:bg-transparent dark:text-[#86FE05] dark:border dark:border-[#86FE05]/30" 
      // الحالة بعد اختيار المقاس واللون
      : "bg-black text-white hover:scale-[1.02] active:scale-95 "
  }`}
>
  {isSoldOut ? (
    <span className="text-xs opacity-50">{isRTL ? "نفد من المخزن" : "Sold Out"}</span>
  ) : (
    <>
      <ShoppingCart size={18} strokeWidth={2.5} />
      <span className="text-sm">{isRTL ? "أضف إلى السلة" : "Add To Cart"}</span>
    </>
  )}
</button>

</div>
 </div>
      </div>
    </div>
    
{showSizeChart && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300"
    onClick={() => setShowSizeChart(false)}
  >
    {/* الخلفية مع تأثير التغبيش */}
    <div className="absolute inset-0 bg-white/80 dark:bg-black/95 backdrop-blur-xl" />

    {/* الحاوية الرئيسية */}
    <div 
      className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-black/5 dark:border-white/5 animate-in zoom-in-95 fade-in duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* الرأس (Header) */}
      <div className={`flex items-center justify-between p-6 sm:p-8 border-b border-black/5 dark:border-white/5 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
        <div className={isRTL ? "text-right" : "text-left"}>
          {/* تم تكبير العنوان وإلغاء الـ       في العربي لضمان الظهور */}
          <h2 className={`text-2xl sm:text-3xl font-black text-black dark:text-white ${!isRTL ? "uppercase       tracking-tighter" : ""}`}>
            {isRTL ? "جدول المقاسات" : "Size Guide"}
          </h2>
          <p className={`text-xs sm:text-sm font-bold mt-2 ${isRTL ? "text-slate-500" : "uppercase tracking-[0.1em] text-slate-400"}`}>
            {isRTL ? "تأكد من اختيار مقاسك المناسب بدقة" : "Find your perfect fit"}
          </p>
        </div>
        
        <button
          onClick={() => setShowSizeChart(false)}
          className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white hover:bg-[#e1ffad] hover:text-black transition-all duration-300"
        >
          <X size={24} strokeWidth={3} />
        </button>
      </div>

      {/* منطقة الصورة */}
      <div className="p-2 sm:p-4 max-h-[65vh] overflow-y-auto no-scrollbar bg-slate-50 dark:bg-black/40">
        <img
          src={product.sizeChart.url}
          alt="Size Chart"
          className="w-full h-auto rounded-xl"
        />
      </div>

      {/* التذييل (Footer) - كلام واضح وحجم مريح */}
      <div className="p-5 bg-black dark:bg-[#e1ffad] text-center">
         <p className="text-[11px] sm:text-xs font-black uppercase       tracking-[0.2em] text-[#e1ffad] dark:text-black">
            Vestro International Standard Sizes
         </p>
      </div>
    </div>
  </div>
)}

    {isLightboxOpen && (
      <div
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
        onClick={() => setIsLightboxOpen(false)}
      >
        <div className="absolute inset-0" 
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchMove={(e) => setTouchEnd(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (!touchStart || !touchEnd) return;
            const diff = touchStart - touchEnd;
            if (Math.abs(diff) < 30) return;
            e.stopPropagation();
            if (diff > 50) nextLightbox();
            else if (diff < -50) prevLightbox();
            setTouchStart(null); setTouchEnd(null);
          }}
        />
        <button onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); setHideArrows(false); // 👈 هنا الإضافة
 }} className="absolute top-10 right-10 text-white/50 hover:text-[#86FE05] z-[110]">
          <X size={40} />
        </button>
<button
  onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
  className="absolute left-6 top-1/2 -translate-y-1/2 
  w-14 h-14 rounded-full 
  bg-black/70 hover:bg-black 
  text-white flex items-center justify-center 
  shadow-2xl z-[110] transition-all"
>
  <span className="text-3xl font-bold">‹</span>
</button>        <img
          src={lightboxImages[lightboxIndex]?.url}
          alt="Preview"
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl z-[105]"
          onClick={(e) => e.stopPropagation()}
        />
<button
  onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
  className="absolute right-6 top-1/2 -translate-y-1/2 
  w-14 h-14 rounded-full 
  bg-black/70 hover:bg-black 
  text-white flex items-center justify-center 
  shadow-2xl z-[110] transition-all"
>
  <span className="text-3xl font-bold">›</span>
</button>      </div>
    )}

    {/* Related Products Section */}
{relatedProducts && relatedProducts.length > 0 && (
  <div className="mt-32">
    <h2 className="text-[19px] font-bold uppercase tracking-[0.1em] text-center mb-12 text-black dark:text-red-700">
      {translations.relatedProductsTitle}
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
      {relatedProducts.map((rp) => (
        // تأكد أن ProductCard يستلم المنتج بشكل صحيح
        <ProductCard key={rp._id} product={rp} />
      ))}
    </div>
  </div>
)}

    {/* Reviews Section */}
    <div className="mt-32 border-t border-slate-100 dark:border-white/5 pt-16 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-12 space-y-4">
        <h2 className="text-3xl font-black       uppercase tracking-tighter">
          {translations.reviewsSection} <span className="text-red-800">({reviews.length})</span>
        </h2>
        {!hasReviewed && (
          <p className="text-slate-400 text-sm uppercase tracking-widest">{translations.addReviewTitle}</p>
        )}
      </div>

      {!hasReviewed ? (
        <form onSubmit={submitReviewHandler} className="bg-slate-50 dark:bg-[#111111] p-8 rounded-[2.5rem] shadow-sm mb-16 border border-slate-100 dark:border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">{translations.reviewName}</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-transparent dark:border-white/5 focus:border-red-700 outline-none text-sm font-bold"
                placeholder={isRTL ? "أدخل اسمك" : "Enter your name"}
                required
                disabled={isSubmittingReview || (localStorage.getItem("guestReviewerName") && reviewerName)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">{translations.reviewRating}</label>
              <div className="h-[54px] flex items-center px-4 bg-white dark:bg-black rounded-2xl border border-transparent dark:border-white/5">
                <RatingInput value={newRating} onChange={setNewRating} disabled={isSubmittingReview} />
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-8">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">{translations.reviewComment}</label>
            <textarea
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white dark:bg-black border border-transparent dark:border-white/5 focus:border-red-700 outline-none text-sm font-bold resize-none"
              placeholder={isRTL ? "شاركنا رأيك..." : "Share your thoughts..."}
              required
              disabled={isSubmittingReview}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmittingReview}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black uppercase       tracking-widest hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {isSubmittingReview ? <Loader2 className="animate-spin mx-auto" /> : translations.submitReview}
          </button>
        </form>
      ) : (
        <div className="bg-[#86FE05]/10 border border-[#86FE05]/20 text-red-800 p-6 rounded-2xl mb-16 text-center font-black uppercase       tracking-widest text-xs">
          {translations.alreadyReviewed}
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-slate-400       py-10">{translations.noReviews}</p>
        ) : (
          reviews.map((review, index) => (
            <div key={review._id || index} className="p-6 bg-slate-50 dark:bg-[#111111] rounded-[2rem] border border-slate-100 dark:border-white/5 transition-all hover:border-red-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-black       uppercase tracking-tighter text-slate-900 dark:text-white">{review.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black mt-1">
                    {new Date(review.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                  </p>
                </div>
                <RatingStars value={review.rating} />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>

  {showToast && (
  <div 
    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
               bg-black dark:bg-[#e1ffad] text-white dark:text-black 
               px-10 py-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] 
               dark:shadow-[0_20px_60px_rgba(225,255,173,0.15)]
               z-[9999] font-black uppercase       tracking-[0.15em] text-center
               text-sm sm:text-base min-w-[300px]
               animate-in fade-in zoom-in duration-500
               flex flex-col items-center gap-5 border border-white/5 dark:border-black/5"
  >
    {/* أيقونة التنبيه - استايل هادي جداً Minimalist */}
    <div className="relative flex items-center justify-center mb-1">
      <div className="w-14 h-14 rounded-full border border-[#e1ffad]/20 dark:border-black/10 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#e1ffad] dark:bg-black animate-pulse" />
      </div>
      {/* حلقة خارجية هادية */}
      <div className="absolute w-14 h-14 rounded-full border border-red-800 dark:border-black opacity-20 animate-ping" />
    </div>
    
    <span className="leading-relaxed tracking-wider opacity-90 dark:text-black">
      {toastMessage}
    </span>

    {/* شريط التقدم - نحيف جداً وأنيق */}
    <div className="h-[2px] w-16 bg-white/10 dark:bg-black/10 rounded-full mt-1 overflow-hidden">
        <div 
            className="h-full bg-red-800 dark:bg-black opacity-60" 
            style={{
              animation: 'progress 3000ms linear forwards'
            }}
        ></div>
    </div>
  </div>
)}
  </div>
</div>
  );
}
