import { createClient } from "@/app/lib/supabase/server";
import type { Kategori, Urun } from "@/app/types";

export async function kategorileriGetir(): Promise<Kategori[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("kategoriler").select("*").eq("aktif", true).order("sira");
  if (error || !data) return [];
  return data as Kategori[];
}

export function ilgiliUrunleriGetir(urun: Urun, tumUrunler: Urun[], adet = 4): Urun[] {
  return tumUrunler.filter((u) => u.id !== urun.id && u.kategori_id === urun.kategori_id).slice(0, adet);
}
