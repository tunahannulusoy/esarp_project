"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, LogOut, MapPin, Package, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/lib/cart-context";
import { useFavorites } from "@/app/lib/favorites-context";
import { useSession, istemciTarafindaCikisYap } from "@/app/lib/use-session";
import { useClearLocalSession } from "@/app/lib/use-clear-local-session";
import { logout } from "@/app/actions/auth";
import AuthModal from "@/app/components/auth-modal";

export default function Header() {
  const pathname = usePathname();
  const [profilMenuAcik, setProfilMenuAcik] = useState(false);
  const [authModalAcik, setAuthModalAcik] = useState(false);
  const { toplamAdet, sunucuYuklendi: sepetYuklendi } = useCart();
  const { favoriUrunIdleri, yuklendi: favoriYuklendi } = useFavorites();
  const { girisYapilmis } = useSession();
  const temizleYerelOturum = useClearLocalSession();

  useEffect(() => {
    setProfilMenuAcik(false);
    if (girisYapilmis) setAuthModalAcik(false);
  }, [girisYapilmis]);

  if (pathname?.startsWith("/admin")) return null;

  const handleCikisYap = async () => {
    localStorage.removeItem("esarp_sepet");
    localStorage.removeItem("esarp_favoriler");
    sessionStorage.removeItem("esarp_sepet_birlestirildi");
    sessionStorage.removeItem("esarp_favoriler_birlestirildi");
    await istemciTarafindaCikisYap();
    temizleYerelOturum();
    await logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-300 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
            Eşarp
          </Link>

          <form action="/" className="relative hidden flex-1 max-w-md sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" strokeWidth={1.5} />
            <input
              type="search"
              name="q"
              placeholder="Ürün veya kategori ara..."
              className="w-full rounded-full border border-stone-300 py-2 pl-9 pr-4 text-sm focus:border-stone-500 focus:outline-none"
            />
          </form>

          <nav className="ml-auto flex items-center gap-4 text-sm">
            {/* Favoriler — her ekranda görünür */}
            <Link href="/favorites" className="flex items-center gap-1" aria-label="Beğendiklerim">
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {favoriYuklendi ? (
                <span>{favoriUrunIdleri.length}</span>
              ) : (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
              )}
            </Link>

            {/* Sepet */}
            <Link href="/cart" className="flex items-center gap-1" aria-label="Sepet">
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              {sepetYuklendi ? (
                <span>{toplamAdet}</span>
              ) : (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
              )}
            </Link>

            {girisYapilmis ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfilMenuAcik((v) => !v)}
                  className="flex items-center gap-1"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>

                {profilMenuAcik && (
                  <>
                    <button
                      type="button"
                      aria-label="Menüyü kapat"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setProfilMenuAcik(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
                      <Link href="/profile" onClick={() => setProfilMenuAcik(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
                        <User className="h-4 w-4" strokeWidth={1.5} />
                        Profilim
                      </Link>
                      <Link href="/profile/orders" onClick={() => setProfilMenuAcik(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
                        <Package className="h-4 w-4" strokeWidth={1.5} />
                        Siparişlerim
                      </Link>
                      <Link href="/profile/addresses" onClick={() => setProfilMenuAcik(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
                        <MapPin className="h-4 w-4" strokeWidth={1.5} />
                        Adreslerim
                      </Link>
                      <button type="button" onClick={handleCikisYap}
                        className="flex w-full items-center gap-2 border-t border-stone-100 px-4 py-2 text-sm text-rose-600 hover:bg-stone-50">
                        <LogOut className="h-4 w-4" strokeWidth={1.5} />
                        Çıkış Yap
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalAcik(true)}
                className="rounded-full bg-stone-900 px-4 py-1.5 text-sm text-white hover:bg-stone-700"
              >
                Giriş Yap
              </button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal
        acik={authModalAcik}
        onKapat={() => setAuthModalAcik(false)}
        hedefYol={pathname ?? "/"}
      />
    </>
  );
}
