/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../contexts/CartContext";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Sun,
  Moon,
  Home,
  ShoppingBag,
  Star,
  Gift,
  LogOut,
  Settings,
  Package,
  LogIn,
  Search,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  UserPlus,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "react-hot-toast";
import api from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

export default function Navbar({onCartClick }) {
  const { darkMode, setDarkMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const isRTL = language === "ar";
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [client, setClient] = useState(null);
  const [categories, setCategories] = useState([]);
const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
const [showSocial, setShowSocial] = useState(false);
  // --- Search States ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ products: [], keywords: [] });
  const [searchLoading, setSearchLoading] = useState(false);

  const fullName =
  client?.firstName || client?.lastName
    ? `${client?.firstName || ""} ${client?.lastName || ""}`.trim()
    : null;

  const userRef = useRef(null);
  const catRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const storedClient = localStorage.getItem("client");
    if (storedClient) setClient(JSON.parse(storedClient));
    
    const fetchCats = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (value) => {
  if (!value || value.length < 2) {
    setSuggestions({ products: [], keywords: [] });
    return;
  }
  setSearchLoading(true);
  try {
    const res = await api.get(`/products/suggestions?q=${value}`);
    setSuggestions(res.data); // هنا res.data تحتوي على products و keywords
  } catch (err) {
    console.error(err);
    setSuggestions({ products: [], keywords: [] });
  } finally {
    setSearchLoading(false);
  }
};

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const executeSearch = (query) => {
    if (!query.trim()) return;
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/clients/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("client");
      localStorage.removeItem("token");
      setClient(null);
      setUserDropdownOpen(false);
      setMenuOpen(false);
      toast.success(isRTL ? "تم تسجيل الخروج" : "Logged out");
      navigate("/");
    } catch (err) {
      localStorage.clear();
      setClient(null);
      navigate("/");
    }
  };

  const links = [
    { name: isRTL ? "الرئيسية" : "Home", path: "/", icon: Home },
    { name: isRTL ? "المنتجات" : "Products", path: "/products", icon: ShoppingBag },
    { name: isRTL ? "عروض فيسترو" : "Vestro Offers", path: "/bundles", icon: Package },
  ];

 return (
  <>
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className={`w-full z-[100] transition-all duration-500 border-b backdrop-blur-md sticky top-0 ${
        darkMode ? "bg-black/90 border-white/5 shadow-xl" : "bg-white/90 border-gray-100 shadow-sm"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 md:h-20 flex items-center justify-between relative">

        {/* Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)} className="group relative block">
            <img 
              src="/logo3.jpeg"
              alt="Logo"
              className="h-9 w-9 md:h-12 md:w-12 object-contain rounded-full border-2 border-white/30 transition-transform duration-500 group-hover:scale-110"
            />
          </Link>
        </div>

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link 
  to="/" 
  dir="ltr"
  className={`font-black text-2xl md:text-2xl flex items-center gap-1 transition-transform duration-300 ${
    isRTL ? "-translate-x-3" : "translate-x-3"
  }`}
>
            <span className={darkMode ? "text-white" : "text-black"}>VESTRO </span>
            {/* <span className="text-red-800">STORE</span> */}
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-[15px]  font-bold uppercase                 transition-all hover:text-red-700 ${
                  darkMode ? "text-gray-400" : "text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* DESKTOP CATEGORIES (زي ما هو) */}
            <div className="relative" ref={catRef}>
              <button 
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`flex items-center gap-1 text-[15px]  font-bold uppercase                 transition-all hover:text-red-800 ${
                  darkMode ? "text-gray-400" : "text-black"
                }`}
              >
                {isRTL ? "الأقسام" : "Categories"}
                <ChevronDown size={16} className={`transition-transform ${categoriesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {categoriesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full mt-4 w-56 rounded-2xl shadow-2xl border p-2 z-[110] ${
                      darkMode ? "bg-zinc-900 border-white/5" : "bg-white border-gray-100"
                    }`}
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products/category/${cat.id}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-xl text-xs font-bold uppercase ${
                          darkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-gray-50 text-black"
                        }`}
                      >
                        {cat.image?.url && (
                          <img src={cat.image.url} className="w-6 h-6 rounded-full object-cover" />
                        )}
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1.5 sm:gap-4">

          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border ${
              darkMode ? "border-white/10 text-gray-400" : "border-gray-200 text-black"
            }`}
          >
            <Search size={18} />
          </button>
          

          {/* Language + Theme (DESKTOP ONLY زي ما هو) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setLanguage(isRTL ? "en" : "ar")}
              className="text-[10px] font-black w-9 h-9 border rounded-xl"
            >
              {isRTL ? "EN" : "AR"}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 border rounded-xl flex items-center justify-center"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* User */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center"
            >
              <User size={18} />
            </button>

            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full mt-4 w-48 rounded-2xl border p-2 z-[110] ${
                    isRTL ? "left-0" : "right-0"
                  } ${darkMode ? "bg-zinc-900 border-white/5" : "bg-white"}`}
                >
                  {!client ? (
                    <>
                     <Link 
  to="/login" 
  onClick={() => {
    setUserDropdownOpen(false); // يقفل قائمة المستخدم
    setMenuOpen(false);         // يقفل قائمة الموبايل (التوجل)
  }} 
  className="p-3 flex items-center gap-2 text-[10px] font-black uppercase"
>
  <LogIn size={14} /> {isRTL ? "تسجيل دخول" : "Login"}
</Link>

<Link 
  to="/register" 
  onClick={() => {
    setUserDropdownOpen(false);
    setMenuOpen(false);
  }} 
  className="p-3 flex items-center gap-2 text-[10px] font-black uppercase"
>
  <UserPlus size={14} /> {isRTL ? "إنشاء حساب" : "Sign Up"}
</Link>
                    </>
                  ) : (
                    <>
                     <Link
  to="/profile"
  onClick={() => setUserDropdownOpen(false)}
  className="p-3 flex items-center gap-2 text-[10px] font-black uppercase"
>
  <Settings size={14} />
  {fullName || (isRTL ? "الصفحة الشخصية" : "Profile")}
</Link>

{/* 🧾 ORDERS LINK */}
<Link
  to="/orders"
  onClick={() => setUserDropdownOpen(false)}
  className="p-3 flex items-center gap-2 text-[10px] font-black uppercase"
>
  <Package size={14} />
  {isRTL ? "طلباتي" : "My Orders"}
</Link>

{/* 🚪 LOGOUT */}
<button
  onClick={handleLogout}
  className="p-3 w-full flex items-center gap-2 text-[10px] font-black uppercase text-red-500"
>
  <LogOut size={14} />
  {isRTL ? "خروج" : "Logout"}
</button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        <Link
  to="/cart"
 onClick={() => {
  setMenuOpen(false);
  onCartClick?.(); // يقفل الـ offers
}}
  className="relative z-[9999] w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center"
>
  <ShoppingCart size={18} />

  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-black text-[9px] font-black flex items-center justify-center rounded-lg">
      {cartCount}
    </span>
  )}
</Link>

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden ml-1">
            {menuOpen ? <X size={26} className="text-black dark:text-white" /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </nav>

    {/* MOBILE MENU */}
    <AnimatePresence>
      {menuOpen && (
        <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  className={`lg:hidden fixed inset-0 top-[64px] md:top-[80px] z-[99] flex flex-col overflow-y-auto ${
    darkMode ? "bg-black text-white" : "bg-white text-black"
  }`}
>
  
  {/* TOP CONTENT */}
<div className="flex-1 p-6 space-y-3 mt-4">

  {links.map((l, index) => (
  <div key={l.name}>
    
    <Link
      to={l.path}
      onClick={() => setMenuOpen(false)}
      className="block text-xl font-black   uppercase leading-tight py-3"
    >
      {l.name}
    </Link>

    {/* 🔥 Divider بين العناصر */}
    {index !== links.length - 1 && (
      <div className="h-[2px] w-full bg-black/10 dark:bg-white/10" />
    )}

    {/* 🔥 Bottom border بعد آخر عنصر */}
    {index === links.length - 1 && (
      <div className="h-[2px] w-full bg-black/10 dark:bg-white/10 mt-2" />
    )}

  </div>
))}

 

  {/* CATEGORIES */}
  <div className="mt-4 px-1">
    <button
      onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
      className="flex items-center justify-between w-full text-xl font-black  uppercase mb-3"
    >
      <span>{isRTL ? "الأقسام" : "Categories"}</span>
      <ChevronDown
        size={20}
        className={`transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}
      />
    </button>

    {mobileCategoriesOpen && (
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => (
          <motion.div key={cat.id}>
            <Link
              to={`/products/category/${cat.id}`}
              onClick={() => setMenuOpen(false)}
              className="relative block rounded-xl overflow-hidden aspect-square"
            >
              <img
                src={cat.image?.url}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm font-black uppercase text-center">
                  {cat.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    )}
  </div>
   {/* 🔥 SOCIAL BUTTON */}
  <button
    onClick={() => setShowSocial(!showSocial)}
    className="mt-4 w-full py-3 rounded-2xl border text-[12px] font-black uppercase flex items-center justify-center gap-2"
  >
    🌐 {isRTL ? "Follow Us On Social Media" : "Follow Us On Social Media"}
  </button>

<AnimatePresence>
  {showSocial && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="grid grid-cols-3 gap-3 mt-3"
    >

      {/* WhatsApp Sales */}
      <a
        href="https://wa.me/201120587886"
        target="_blank"
        className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-[#25D366] text-white shadow-md hover:scale-105 transition"
      >
        <FaWhatsapp size={22} />
        <span className="text-[10px] font-bold">
          {isRTL ? "المبيعات" : "Sales"}
        </span>
      </a>

      {/* WhatsApp Support */}
      <a
        href="https://wa.me/201060850472"
        target="_blank"
        className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-green-600 text-white shadow-md hover:scale-105 transition"
      >
        <FaWhatsapp size={22} />
        <span className="text-[10px] font-bold">
          {isRTL ? "الدعم" : "Support"}
        </span>
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/vestroeg"
        target="_blank"
        className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-md hover:scale-105 transition"
      >
        <FaInstagram size={22} />
        <span className="text-[10px] font-bold">
          Instagram
        </span>
      </a>

      {/* TikTok */}
      <a
        href="https://www.tiktok.com/"
        target="_blank"
        className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-black text-white shadow-md hover:scale-105 transition"
      >
        <FaTiktok size={22} />
        <span className="text-[10px] font-bold">
          TikTok
        </span>
      </a>

      {/* Facebook */}
      <a
        href="https://www.facebook.com/share/1E4b9xJXs2/"
        target="_blank"
        className="flex flex-col items-center justify-center gap-1 p-3 rounded-2xl bg-[#1877F2] text-white shadow-md hover:scale-105 transition"
      >
        <FaFacebookF size={22} />
        <span className="text-[10px] font-bold">
          Facebook
        </span>
      </a>

    </motion.div>
  )}
</AnimatePresence>

 
</div>

  {/* 🔥 BOTTOM FIXED SECTION */}
  <div className="p-6 border-t border-white/10 space-y-4">
   <div className="grid grid-cols-3 gap-3 mt-4 text-[13px] font-bold uppercase opacity-80 text-center">

  <Link to="/terms" onClick={() => setMenuOpen(false)}
  className="hover:text-red-700 transition-colors" // اختياري لإضافة لمسة جمالية
>
    {isRTL ? "الشروط" : "Terms"}
  </Link>

  <Link to="/privacy"onClick={() => setMenuOpen(false)}
  className="hover:text-red-700 transition-colors" // اختياري لإضافة لمسة جمالية
>
    {isRTL ? "الخصوصية" : "Privacy"}
  </Link>

 <Link 
  to="/policy" 
  onClick={() => setMenuOpen(false)}
  className="hover:text-red-700 transition-colors" // اختياري لإضافة لمسة جمالية
>
  {isRTL ? "سياسة الإسترجاع" : "Return Policy"}
</Link>

</div>
  

    {/* ACCOUNT */}
    <div>
  

      {!client ? (
        <div className="grid grid-cols-2 gap-3">
          <Link to="/login" className="py-4 bg-red-700 text-black font-black text-[12px] rounded-2xl text-center" onClick={() => setMenuOpen(false)}>
            {isRTL ? "تسجيل دخول" : "Login"}
          </Link>

          <Link to="/register" className="py-4 border font-black text-[12px] rounded-2xl text-center " onClick={() => setMenuOpen(false)}>
            {isRTL ? "إنشاء حساب" : "Sign Up"}
          </Link>
        </div>
      ) : (
        <Link to="/profile" className="p-4 border rounded-2xl flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <User size={20} className="text-red-700" />
          <span className="font-black uppercase">
            {isRTL ? "البروفايل" : "Profile"}
          </span>
        </Link>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">

      {/* DARK MODE */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="py-4 border rounded-2xl flex items-center justify-center gap-2"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        <span className="text-[10px] font-black uppercase">
          {darkMode ? "Light" : "Dark"}
        </span>
      </button>

      {/* LANGUAGE */}
      <button
        onClick={() => setLanguage(isRTL ? "en" : "ar")}
        className="py-4 border rounded-2xl text-[10px] font-black uppercase"
      >
        {isRTL ? "English" : "العربية"}
      </button>

    </div>

  

  </div>

</motion.div>
      )}
    </AnimatePresence>
    {/* --- SEARCH OVERLAY --- */}
<AnimatePresence>
  {isSearchOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[200] flex flex-col pt-10 ${
        darkMode ? "bg-black/95 backdrop-blur-xl text-white" : "bg-white text-black"
      }`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setIsSearchOpen(false)} className="p-2">
            {isRTL ? <ArrowRight size={30} /> : <ArrowLeft size={30} />}
          </button>
          <div className="flex-grow relative">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && executeSearch(searchQuery)}
              placeholder={isRTL ? "ابحث عن منتجك المفضل..." : "Search for products..."}
              className={`w-full bg-transparent border-b-2 py-4 text-2xl md:text-4xl font-black focus:outline-none transition-colors ${
                darkMode ? "border-white/10 focus:border-red-800" : "border-gray-200 focus:border-black"
              }`}
            />
            {searchLoading && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-red-800" size={24} />
              </div>
            )}
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto max-h-[70vh] pb-10">
  
  {/* العمود الأول: الكلمات الدليلة Keywords */}
  <div>
    <h3 className="text-[10px] font-black uppercase                 text-gray-500 mb-6">
      {isRTL ? "كلمات دليلة" : "Popular Tags"}
    </h3>
    <div className="flex flex-wrap gap-2">
      {suggestions?.keywords?.map((k, i) => (
        <button 
          key={i} 
          onClick={() => executeSearch(k)} 
          className={`px-4 py-2 rounded-full text-[10px] font-black border uppercase transition-all ${
            darkMode ? "border-zinc-800 hover:bg-red-800 hover:text-black" : "border-gray-100 hover:bg-black hover:text-white"
          }`}
        >
          # {k}
        </button>
      ))}
    </div>
  </div>

  {/* العمود الثاني: المنتجات المقترحة Products */}
  <div>
    <h3 className="text-[10px] font-black uppercase                 text-gray-500 mb-6">
      {isRTL ? "منتجات مقترحة" : "Suggested Products"}
    </h3>
    <div className="space-y-3">
      {suggestions?.products?.map((p) => (
        <div 
          key={p._id} 
          onClick={() => executeSearch(p.name)} 
          className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${
            darkMode ? "bg-zinc-900/50 hover:bg-zinc-800" : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <img 
            src={p.images?.[0]?.url || p.image?.url} 
            className="w-12 h-12 rounded-xl object-cover bg-white" 
            alt={p.name} 
          />
          <div className={isRTL ? "text-right" : "text-left"}>
            <p className="font-black text-xs uppercase line-clamp-1">{p.name}</p>
            <p className="text-red-800 font-black text-[10px]">{p.price} EGP</p>
          </div>
        </div>
      ))}
      
      {/* رسالة في حال عدم وجود نتائج */}
      {searchQuery.length >= 2 && suggestions?.products?.length === 0 && !searchLoading && (
        <p className="text-gray-500 text-xs  ">
          {isRTL ? "لا توجد منتجات مطابقة" : "No products found"}
        </p>
      )}
    </div>
  </div>
</div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
  </>
);
}