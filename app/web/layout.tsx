"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/app/contexts/CartContext";


export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CartProvider>
          <Toaster position="top-right" duration={3000}/>
          <Navbar />
          <main className="flex-1 overflow-hidden">
          <div className="container mx-auto py-8 px-4">
            {children}
          </div>
          </main>
          <footer className="border-t py-8 bg-muted/40 p-5">
            <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">WickShop</h3>
                <p className="text-sm text-muted-foreground">
                  ร้านค้าออนไลน์ที่มีสินค้าคุณภาพดี ราคาถูก บริการประทับใจ
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">หมวดหมู่</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">อาหารและเครื่องดื่ม</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">สุขภาพและความงาม</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">แฟชั่น</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">อิเล็กทรอนิกส์</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">เครื่องใช้ในบ้าน</a></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">บริการ</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">วิธีการสั่งซื้อ</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">การจัดส่ง</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">การชำระเงิน</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">นโยบายการคืนสินค้า</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">คำถามที่พบบ่อย</a></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">ติดต่อเรา</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span className="text-muted-foreground">02-123-4567</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span className="text-muted-foreground">contact@wickshop.com</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span className="text-muted-foreground">กรุงเทพฯ 10330</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="container mt-8 pt-8 border-t">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">&copy; 2025 WickShop. สงวนลิขสิทธิ์ทั้งหมด</p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">นโยบายความเป็นส่วนตัว</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ข้อกำหนดการใช้งาน</a>
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
      </ThemeProvider>
    </>
  );
}
