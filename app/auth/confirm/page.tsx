"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

// Supabase'in onay maillerindeki linklerin (şifre sıfırlama, email
// değiştirme, kayıt onayı) tıklandığında geldiği tek merkezi nokta.
// Token'lar URL hash fragment'inde geldiği için (#access_token=...) bu
// sayfa server route değil, client component olmalı — fragment hiçbir
// zaman sunucuya ulaşmaz, sadece tarayıcı JS'i okuyabilir. Supabase'in
// browser client'ı sayfa yüklenince bu fragment'i otomatik algılayıp
// oturumu kurar (detectSessionInUrl varsayılan olarak açık).
function OnayIcerik() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hata, setHata] = useState(false);

  useEffect(() => {
    const next = searchParams.get("next") ?? "/";
    const code = searchParams.get("code");
    const supabase = createClient();

    let iptal = false;

    const tamamla = () => {
      if (!iptal) router.replace(next);
    };

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) setHata(true);
        else tamamla();
      });
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setHata(true);
        return;
      }
      tamamla();
    });

    return () => {
      iptal = true;
    };
  }, [router, searchParams]);

  if (hata) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center sm:px-6">
        <p className="text-stone-600">Onay linki geçersiz veya süresi dolmuş.</p>
        <a href="/auth/login" className="mt-4 inline-block text-sm font-medium text-stone-900 hover:underline">
          Giriş sayfasına dön
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 text-center sm:px-6">
      <p className="text-stone-600">Doğrulanıyor...</p>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-sm px-4 py-16 text-center sm:px-6">
          <p className="text-stone-600">Doğrulanıyor...</p>
        </div>
      }
    >
      <OnayIcerik />
    </Suspense>
  );
}
