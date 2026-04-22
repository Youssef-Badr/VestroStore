// import { useEffect, useState, useCallback, memo } from "react";
// import { useNavigate } from "react-router-dom";
// import ProductCard from "../components/ProductCard";
// import { useLanguage } from "../contexts/LanguageContext";
// import api from "../../src/api/axiosInstance";

// // ✅ تحسين الأداء: لف الـ ProductCard بـ React.memo
// const MemoizedProductCard = memo(ProductCard);

// // ✅ Skeleton UI component
// const ProductSkeleton = () => {
//   return (
//     <div className="animate-pulse bg-white dark:bg-gray-800 shadow rounded-lg p-4 w-full">
//       {/* صورة */}
//       <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
//       {/* اسم المنتج */}
//       <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
//       {/* السعر */}
//       <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
//     </div>
//   );
// };

// export default function Offers() {
//   const { language } = useLanguage();
//   const isRTL = language === "ar";

//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // ✅ useCallback عشان الزر ما يتبنيش كل مرة
//   const handleBack = useCallback(() => {
//     navigate(-1);
//   }, [navigate]);

//   useEffect(() => {
//     let mounted = true;

//     const fetchProducts = async () => {
//       try {
//         setLoading(true);

//         const res = await api.get("/products");
//         if (!mounted) return;

//         const allProducts = res.data.products || res.data;

//         // ✅ Flatten variations
//         const flattenedProducts = allProducts.flatMap((product) => {
//           if (product.variations && product.variations.length > 0) {
//             return product.variations.map((variation) => ({
//               ...product,
//               _id: `${product._id}-${variation.color}`,
//               color: variation.color,
//               images: variation.images,
//               sizes: variation.sizes,
//               originalProductId: product._id,
//               allVariations: product.variations,
//             }));
//           }
//           return [{ ...product, originalProductId: product._id }];
//         });

//         // ✅ Filter by salePrice
//         const productsOnSale = flattenedProducts.filter(
//           (product) => product.salePrice && product.salePrice > 0
//         );

//         setProducts(productsOnSale);
//       } catch (err) {
//         console.error(err);
//         if (mounted) {
//           setError(
//             isRTL
//               ? "فشل تحميل المنتجات. حاول مرة أخرى لاحقاً."
//               : "Failed to load products. Please try again later."
//           );
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchProducts();

//     return () => {
//       mounted = false;
//     };
//   }, [isRTL]);

//   return (
//     <div
//       className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen pt-20 transition-colors duration-300"
//       dir={isRTL ? "rtl" : "ltr"}
//     >
//       <div className="container mt-10 mx-auto px-4 py-8 relative">
//         {/* 🔙 Back Button */}
//         <button
//         aria-labelledby="back-button"
//           onClick={handleBack}
//           className={`absolute top-4 ${
//             isRTL ? "right-4" : "left-4"
//           } p-2 rounded-full bg-gray-200 text-gray-800 
//                      hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 
//                      transition-colors shadow-md ring-1 ring-gray-300 dark:ring-gray-600 z-20`}
//           aria-label={isRTL ? "العودة" : "Go back"}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2.5}
//             stroke="currentColor"
//             className="w-5 h-5"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
//             />
//           </svg>
//         </button>

//         <h1
//           className="text-3xl sm:text-4xl font-bold mb-8 text-center 
//                          bg-gradient-to-r from-indigo-500 to-purple-500 
//                          bg-clip-text text-transparent"
//         >
//           {isRTL ? "⚡ العروض الحالية" : "⚡ On Sale Now"}
//         </h1>

//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {loading ? (
//             // ✅ Skeletons أثناء التحميل
//             [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
//           ) : error ? (
//             <p className="text-center text-red-500 dark:text-red-400 col-span-full">
//               {error}
//             </p>
//           ) : products.length > 0 ? (
//             products.map((product) => (
//               <MemoizedProductCard key={product._id} product={product} />
//             ))
//           ) : (
//             <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
//               {isRTL
//                 ? "لا توجد منتجات على الخصم حالياً."
//                 : "No products on sale right now."}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
