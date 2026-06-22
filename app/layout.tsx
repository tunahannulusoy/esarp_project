import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { CartProvider } from "@/app/lib/cart-context";
import { AddressProvider } from "@/app/lib/address-context";
import { FavoritesProvider } from "@/app/lib/favorites-context";
import { ProfileProvider } from "@/app/lib/profile-context";
import CartSessionSync from "@/app/components/cart-session-sync";
import FavoritesSessionSync from "@/app/components/favorites-session-sync";
import GoogleAnalytics from "@/app/components/google-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eşarp | Şıklığın Adresi",
  description: "Eşarp ve aksesuarları satışı yapan e-ticaret platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-stone-900">
        <GoogleAnalytics />
        <CartProvider>
          <AddressProvider>
            <FavoritesProvider>
              <ProfileProvider>
                <CartSessionSync />
                <FavoritesSessionSync />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </ProfileProvider>
            </FavoritesProvider>
          </AddressProvider>
        </CartProvider>
      </body>
    </html>
  );
}
