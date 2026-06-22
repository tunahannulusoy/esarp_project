import { createClient } from "@/app/lib/supabase/server";
import { mockKategoriler } from "@/app/lib/mock-data";
import type { Kategori, Urun } from "@/app/types";

const supabaseYapilandirilmisMi = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function kategorileriGetir(): Promise<Kategori[]> {
  if (!supabaseYapilandirilmisMi) return mockKategoriler;

  const supabase = await createClient();
  const { data, error } = await supabase.from("kategoriler").select("*").eq("aktif", true).order("sira");

  if (error || !data || data.length === 0) return mockKategoriler;
  return data as Kategori[];
}

export function ilgiliUrunleriGetir(urun: Urun, tumUrunler: Urun[], adet = 4): Urun[] {
  return tumUrunler.filter((u) => u.id !== urun.id && u.kategori_id === urun.kategori_id).slice(0, adet);
}
