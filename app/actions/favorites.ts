"use server";

import { createClient } from "@/app/lib/supabase/server";
import { getCurrentUser, supabaseYapilandirilmisMi } from "@/app/lib/auth";

export async function getServerFavorites(): Promise<string[]> {
  if (!supabaseYapilandirilmisMi()) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase.from("favoriler").select("urun_idler").eq("kullanici_id", user.id).single();

  return (data?.urun_idler as string[]) ?? [];
}

export async function saveFavorites(urunIdleri: string[]): Promise<void> {
  if (!supabaseYapilandirilmisMi()) return;

  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase
    .from("favoriler")
    .upsert(
      { kullanici_id: user.id, urun_idler: urunIdleri, guncelleme_tarihi: new Date().toISOString() },
      { onConflict: "kullanici_id" }
    );
}

export async function addServerFavorite(urunId: string): Promise<void> {
  const mevcut = await getServerFavorites();
  if (mevcut.includes(urunId)) return;
  await saveFavorites([...mevcut, urunId]);
}

export async function removeServerFavorite(urunId: string): Promise<void> {
  const mevcut = await getServerFavorites();
  await saveFavorites(mevcut.filter((id) => id !== urunId));
}

export async function syncFavorites(yerel: string[]): Promise<string[]> {
  if (!supabaseYapilandirilmisMi()) return yerel;

  const user = await getCurrentUser();
  if (!user) return yerel;

  const sunucu = await getServerFavorites();
  const birlesik = Array.from(new Set([...sunucu, ...yerel]));
  await saveFavorites(birlesik);
  return birlesik;
}
