import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import SideCart from "./../pages/SideCart"; // 1. استيراد المكون الجديد

export default function Layout({ children }) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100]">
        {/* 1. بار الإعلانات */}
        <AnnouncementBar />

        {/* 2. الناف بار */}
        <Navbar />
      </header>

      {/* 2. إضافة السلة الجانبية هنا */}
      {/* هتظهر فوق كل حاجة لما isCartOpen تبقى true */}
      <SideCart />

      <main className="min-h-[80vh]">{children}</main>
      <Footer />
    </>
  );
}