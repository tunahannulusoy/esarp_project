"use server";

import { createClient } from "@/app/lib/supabase/server";
import { getCurrentUser, supabaseYapilandirilmisMi } from "@/app/lib/auth";

export async function getServerFavorites(): Promise<string[]> {
  if (!supabaseYapilandirilmisMi()) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase.from("favoriler").select("urun_id").eq("kullanici_id", user.id);

  return (data ?? []).map((satir) => satir.urun_id as string);
}

export async function addServerFavorite(urunId: string): Promise<void> {
  if (!supabaseYapilandirilmisMi()) return;

  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase.from("favoriler").upsert(
    { kullanici_id: user.id, urun_id: urunId },
    { onConflict: "kullanici_id,urun_id", ignoreDuplicates: true }
  );
}

export async function removeServerFavorite(urunId: string): Promise<void> {
  if (!supabaseYapilandirilmisMi()) return;

  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase.from("favoriler").delete().eq("kullanici_id", user.id).eq("urun_id", urunId);
}

export async function syncFavorites(urunIdleri: string[]): Promise<void> {
  if (!supabaseYapilandirilmisMi() || urunIdleri.length === 0) return;

  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase
    .from("favoriler")
    .upsert(
      urunIdleri.map((urunId) => ({ kullanici_id: user.id, urun_id: urunId })),
      { onConflict: "kullanici_id,urun_id", ignoreDuplicates: true }
    );
}
