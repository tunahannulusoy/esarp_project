"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/client";

const supabaseYapilandirilmisMi = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [yukleniyor, setYukleniyor] = useState(supabaseYapilandirilmisMi);
  const pathname = usePathname();

  useEffect(() => {
    if (!supabaseYapilandirilmisMi) return;

    const supabase = createClient();

    // Sunucu action'ları (signIn/logout) cookie'leri sunucu tarafında günceller;
    // onAuthStateChange bunu yakalamaz. Bu yüzden her sayfa geçişinde
    // session'ı cookie'lerden tekrar okuyoruz.
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setYukleniyor(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (!supabaseYapilandirilmisMi) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, girisYapilmis: Boolean(user), yukleniyor };
}

/**
 * Tarayıcı client'ı üzerinden çıkış yapar. Bu, onAuthStateChange'i anında
 * tetikleyerek arayüzü hemen günceller (logout server action'ı sunucu
 * cookie'lerini temizleyip yönlendirme yapar, ama aynı sayfaya geri
 * dönüldüğünde pathname değişmediği için arayüz güncellemesi gecikebilir).
 */
export async function istemciTarafindaCikisYap() {
  if (!supabaseYapilandirilmisMi) return;
  const supabase = createClient();
  await supabase.auth.signOut();
}
