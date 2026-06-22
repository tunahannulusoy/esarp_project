import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(kaliciOturum = true) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // "Beni Hatırla" işaretli değilse tarayıcı kapanınca silinecek
              // bir session cookie oluştur (maxAge/expires verilmez).
              const cozulmusOptions = kaliciOturum
                ? options
                : { ...options, maxAge: undefined, expires: undefined };
              cookieStore.set(name, value, cozulmusOptions);
            });
          } catch {
            // Server Component'tan çağrıldığında set edilemez; middleware session'ı yeniler.
          }
        },
      },
    }
  );
}
