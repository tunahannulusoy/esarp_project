"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/client";

const supabaseYapilandirilmisMi = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [yukleniyor, setYukleniyor] = useState(supabaseYapilandirilmisMi);

  useEffect(() => {
    if (!supabaseYapilandirilmisMi) return;

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setYukleniyor(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, girisYapilmis: Boolean(user), yukleniyor };
}
