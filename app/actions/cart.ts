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

// Misafirken eklenen yerel sepeti, giriş yapılınca sunucudaki sepetle tek
// bir atomik adımda birleştirir. İstemci tarafında ayrı ayrı "oku" ve
// "yaz" effect'lerine bölünmüş bir birleştirme, aralarına başka bir
// yazma isteğinin girip eski/yarım veriyi sunucuya geri yazmasına açıktır
// (yarış durumu). Bunun yerine tek bir sunucu fonksiyonu hem okuyup hem
// birleştirip hem de yazarak bu riski ortadan kaldırır.
export async function mergeServerCart(yerelSepet: SepetUrun[]): Promise<SepetUrun[]> {
  if (!supabaseYapilandirilmisMi()) return yerelSepet;

  const user = await getCurrentUser();
  if (!user) return yerelSepet;

  if (yerelSepet.length === 0) return getServerCart();

  const supabase = await createClient();
  const { data } = await supabase.from("sepet").select("urunler").eq("kullanici_id", user.id).single();
  const sunucuSepeti = (data?.urunler as SepetUrun[]) ?? [];

  const birlesik = [...sunucuSepeti];
  yerelSepet.forEach((oge) => {
    const index = birlesik.findIndex((o) => ayniOge(o, oge.urun_id, oge.secili_renk, oge.secili_boyut));
    if (index === -1) {
      birlesik.push(oge);
    } else {
      birlesik[index] = { ...birlesik[index], adet: birlesik[index].adet + oge.adet };
    }
  });

  await supabase
    .from("sepet")
    .upsert(
      { kullanici_id: user.id, urunler: birlesik, guncelleme_tarihi: new Date().toISOString() },
      { onConflict: "kullanici_id" }
    );

  return birlesik;
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
