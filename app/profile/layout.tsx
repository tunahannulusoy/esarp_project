"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/app/lib/use-session";
import AuthModal from "@/app/components/auth-modal";

const SEKMELER = [
  { href: "/profile", etiket: "Profilim" },
  { href: "/profile/addresses", etiket: "Adreslerim" },
  { href: "/profile/orders", etiket: "Siparişlerim" },
  { href: "/favorites", etiket: "Beğendiklerim" },
  { href: "/profile/settings", etiket: "Hesap Ayarları" },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { girisYapilmis, yukleniyor } = useSession();

  if (!yukleniyor && !girisYapilmis) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-stone-600">Profilinizi görüntülemek için giriş yapmalısınız.</p>
        <AuthModal acik onKapat={() => router.push("/")} hedefYol={pathname} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex gap-1 overflow-x-auto border-b border-stone-200 text-sm">
        {SEKMELER.map((sekme) => {
          const aktif = pathname === sekme.href;
          return (
            <Link
              key={sekme.href}
              href={sekme.href}
              className={`whitespace-nowrap border-b-2 px-4 py-3 font-medium ${
                aktif
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              {sekme.etiket}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
