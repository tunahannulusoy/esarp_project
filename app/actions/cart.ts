"use server";

import { createClient } from "@/app/lib/supabase/server";
import { getCurrentUser, supabaseYapilandirilmisMi } from "@/app/lib/auth";
import type { SepetUrun } from "@/app/types";

export async function getServerCart(): Promise<SepetUrun[]> {
  if (!supabaseYapilandirilmisMi()) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase.from("sepet").select("urunler").eq("kullanici_id", user.id).single();

  return (data?.urunler as SepetUrun[]) ?? [];
}

export async function saveServerCart(items: SepetUrun[]): Promise<void> {
  if (!supabaseYapilandirilmisMi()) return;

  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase
    .from("sepet")
    .upsert(
      { kullanici_id: user.id, urunler: items, guncelleme_tarihi: new Date().toISOString() },
      { onConflict: "kullanici_id" }
    );
}

export async function clearServerCart(): Promise<void> {
  if (!supabaseYapilandirilmisMi()) return;

  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase.from("sepet").delete().eq("kullanici_id", user.id);
}

function ayniOge(a: SepetUrun, urunId: string, renk: string, boyut: string) {
  return a.urun_id === urunId && a.secili_renk === renk && a.secili_boyut === boyut;
}

export async function getCart(): Promise<SepetUrun[]> {
  return getServerCart();
}

export async function addToCart(productId: string, quantity: number, color: string, size: string): Promise<void> {
  const mevcut = await getServerCart();
  const index = mevcut.findIndex((o) => ayniOge(o, productId, color, size));

  if (index === -1) {
    mevcut.push({ urun_id: productId, adet: quantity, secili_renk: color, secili_boyut: size });
  } else {
    mevcut[index] = { ...mevcut[index], adet: mevcut[index].adet + quantity };
  }

  await saveServerCart(mevcut);
}

export async function removeFromCart(productId: string, color: string, size: string): Promise<void> {
  const mevcut = await getServerCart();
  await saveServerCart(mevcut.filter((o) => !ayniOge(o, productId, color, size)));
}

export async function updateCartQuantity(
  productId: string,
  quantity: number,
  color: string,
  size: string
): Promise<void> {
  const mevcut = await getServerCart();
  await saveServerCart(
    mevcut.map((o) => (ayniOge(o, productId, color, size) ? { ...o, adet: Math.max(1, quantity) } : o))
  );
}

export async function clearCart(): Promise<void> {
  await clearServerCart();
}
