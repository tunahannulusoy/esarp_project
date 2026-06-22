"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FolderOpen, LayoutDashboard, LogOut, Package, ShoppingCart } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { istemciTarafindaCikisYap } from "@/app/lib/use-session";
import { useClearLocalSession } from "@/app/lib/use-clear-local-session";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cikisYapiliyor, setCikisYapiliyor] = useState(false);
  const temizleYerelOturum = useClearLocalSession();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setCikisYapiliyor(true);
    await istemciTarafindaCikisYap();
    temizleYerelOturum();
    await logout();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex w-64 flex-col bg-white shadow">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-blue-600">Eşarp</h1>
          <p className="text-sm text-gray-600">Admin Paneli</p>
        </div>

        <nav className="mt-6 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 border-l-4 border-transparent px-6 py-3 hover:border-blue-600 hover:bg-gray-100"
          >
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 border-l-4 border-transparent px-6 py-3 hover:border-blue-600 hover:bg-gray-100"
          >
            <Package className="h-4 w-4" strokeWidth={1.5} />
            Ürünler
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 border-l-4 border-transparent px-6 py-3 hover:border-blue-600 hover:bg-gray-100"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
            Siparişler
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 border-l-4 border-transparent px-6 py-3 hover:border-blue-600 hover:bg-gray-100"
          >
            <FolderOpen className="h-4 w-4" strokeWidth={1.5} />
            Kategoriler
          </Link>
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
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
