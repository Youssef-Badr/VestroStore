/* eslint-disable no-unused-vars */
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState } from "react"; // أضفنا useState
import Layout from "./components/Layout.jsx";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollToTop.jsx";
import PaymentResultPage from "./pages/PaymentResultPage";
import "react-toastify/dist/ReactToastify.css";


// المكونات الجديدة للعروض
import OffersModal from "./pages/OffersModal"; // تأكد من المسار
import { FiGift } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "./contexts/ThemeContext"; // تأكد من المسار
import { useLanguage } from "./contexts/LanguageContext"; // تأكد من المسار

// ✅ Lazy loading للصفحات
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import(/* webpackPrefetch: true */ "./pages/Products"));
const ProductDetails = lazy(() => import(/* webpackPrefetch: true */ "./pages/ProductDetails"));
const Wishlist = lazy(() => import(/* webpackPrefetch: true */ "./pages/Wishlist"));
const Offers = lazy(() => import(/* webpackPrefetch: true */ "./pages/Offers"));
const LoginPage = lazy(() => import("./pages/LoginPage")); 
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const BundlesPage = lazy(() => import("./pages/BundlesPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Cart = lazy(() => import("./pages/Cart"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Policy = lazy(() => import("./pages/Policy"));
function App() {
  // حالة فتح موديل العروض (أصبحت Global هنا)
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const { darkMode } = useTheme();
  const { language } = useLanguage();


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Layout>
        <ScrollToTop />

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[60vh] text-xl font-medium text-gray-600 dark:text-gray-300">
              {`جارٍ التحميل...`}
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products/category/:categoryId" element={<CategoryPage />} />
            <Route path="/bundles" element={<BundlesPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/thankyou/:orderId" element={<ThankYou />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
          </Routes>
        </Suspense>

      {/* --- زر العروض العائم (الجهة اليسرى مع حركة جذب انتباه) --- */}
<motion.button
  onClick={() => setIsOffersOpen(true)}
  // حركة الجذب (تنبض وتتحرك للأعلى والأسفل)
  animate={{
    y: [0, -10, 0], // حركة للأعلى والأسفل
    scale: [1, 1.1, 1], // تكبير وتصغير (نبض)
    rotate: [0, -5, 5, 0], // اهتزاز خفيف
    boxShadow: darkMode 
      ? ["0 5px 15px rgba(0,0,0,0.2)", "0 10px 25px rgba(0,0,0,0.3)", "0 5px 15px rgba(0,0,0,0.2)"] 
      : ["0 5px 15px rgba(0,0,0,0.2)", "0 10px 25px rgba(0,0,0,0.3)", "0 5px 15px rgba(0,0,0,0.2)"]
  }}
  transition={{
    duration: 3, // سرعة الحركة الكلية
    repeat: Infinity, // تكرار لا نهائي
    ease: "easeInOut"
  }}
  whileHover={{ scale: 1.2, rotate: 0 }}
  whileTap={{ scale: 0.9 }}
  // التموضع على اليسار
  className="fixed bottom-10 left-10 z-[60] bg-[#559e08] text-black p-5 rounded-full  border-2 border-black/10 flex items-center justify-center cursor-pointer"
>
  <div className="relative">
    <FiGift size={28} />
    {/* نقطة تنبيه صغيرة فوق الأيقونة */}
    <span className="absolute -top-1 -right-1 flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
    </span>
  </div>
</motion.button>

        {/* --- موديل العروض (Global Modal) --- */}
        <OffersModal 
          isOpen={isOffersOpen} 
          onClose={() => setIsOffersOpen(false)} 
          darkMode={darkMode} 
          language={language} 
           className="z-[80989]"
        />

        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Layout>
    </div>
  );
}

export default App;