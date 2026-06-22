"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FolderOpen, LayoutDashboard, LogOut, Menu, Package, ShoppingCart, X } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { istemciTarafindaCikisYap } from "@/app/lib/use-session";
import { useClearLocalSession } from "@/app/lib/use-clear-local-session";

const MENU_OGELERI = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/orders", label: "Siparişler", icon: ShoppingCart },
  { href: "/admin/categories", label: "Kategoriler", icon: FolderOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cikisYapiliyor, setCikisYapiliyor] = useState(false);
  const [menuAcik, setMenuAcik] = useState(false);
  const temizleYerelOturum = useClearLocalSession();

  useEffect(() => {
    setMenuAcik(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setCikisYapiliyor(true);
    await istemciTarafindaCikisYap();
    temizleYerelOturum();
    await logout();
  };

  const sidebarIcerik = (
    <>
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-blue-600">Eşarp</h1>
        <p className="text-sm text-gray-600">Admin Paneli</p>
      </div>

      <nav className="mt-6 flex-1">
        {MENU_OGELERI.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 border-l-4 border-transparent px-6 py-3 hover:border-blue-600 hover:bg-gray-100"
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-6">
        <button
          type="button"
          onClick={handleLogout}
          disabled={cikisYapiliyor}
          className="flex w-full items-center justify-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          {cikisYapiliyor ? "Çıkılıyor..." : "Çıkış Yap"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <header className="flex items-center justify-between border-b bg-white p-4 lg:hidden">
        <div>
          <h1 className="text-lg font-bold text-blue-600">Eşarp</h1>
          <p className="text-xs text-gray-600">Admin Paneli</p>
        </div>
        <button
          type="button"
          onClick={() => setMenuAcik(true)}
          aria-label="Menüyü aç"
          className="rounded p-2 text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </header>

      {menuAcik && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuAcik(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-lg">
            <button
              type="button"
              onClick={() => setMenuAcik(false)}
              aria-label="Menüyü kapat"
              className="absolute right-3 top-3 rounded p-1 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
            {sidebarIcerik}
          </aside>
        </div>
      )}

      <aside className="hidden w-64 flex-col bg-white shadow lg:flex">{sidebarIcerik}</aside>

      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
