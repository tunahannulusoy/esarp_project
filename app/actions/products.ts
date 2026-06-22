"use server";

import { createClient } from "@/app/lib/supabase/server";
import { validateAdminRole, supabaseYapilandirilmisMi } from "@/app/lib/auth";
import { auditLogEkle } from "@/app/lib/audit-log";
import type { Urun, UrunResim } from "@/app/types";

export type ProductActionState = {
  success: boolean;
  message?: string;
  urun?: Urun;
};

const SUPABASE_BAGLANTI_YOK_MESAJI =
  "Supabase bağlantısı henüz yapılandırılmadı. .env.local dosyasına Supabase bilgilerinizi ekleyin.";

export type UrunGirdisi = {
  id?: string;
  ad: string;
  aciklama: string;
  fiyat: number;
  indirim_orani: number;
  kategori_id: string;
  renkler: { ad: string; hex: string }[];
  boyutlar: string[];
  stok: number;
  resim_linkler?: UrunResim[];
};

async function adminDogrula(): Promise<string | null> {
  try {
    await validateAdminRole();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Admin erişimi yok";
  }
}

export async function createProduct(veri: UrunGirdisi): Promise<ProductActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const hata = await adminDogrula();
  if (hata) return { success: false, message: hata };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("urunler")
    .insert({
      ...(veri.id ? { id: veri.id } : {}),
      ad: veri.ad,
      aciklama: veri.aciklama,
      fiyat: veri.fiyat,
      indirim_orani: veri.indirim_orani,
      kategori_id: veri.kategori_id,
      renkler: veri.renkler,
      boyutlar: veri.boyutlar,
      stok: veri.stok,
      resim_linkler: veri.resim_linkler ?? [],
      puan: 0,
      satis_adedi: 0,
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("urun_olusturuldu", { ad: veri.ad });

  return { success: true, urun: data as Urun };
}

export async function updateProduct(productId: string, veri: UrunGirdisi): Promise<ProductActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const hata = await adminDogrula();
  if (hata) return { success: false, message: hata };

  const guncelleme: Record<string, unknown> = {
    ad: veri.ad,
    aciklama: veri.aciklama,
    fiyat: veri.fiyat,
    indirim_orani: veri.indirim_orani,
    kategori_id: veri.kategori_id,
    renkler: veri.renkler,
    boyutlar: veri.boyutlar,
    stok: veri.stok,
    guncelleme_tarihi: new Date().toISOString(),
  };

  if (veri.resim_linkler && veri.resim_linkler.length > 0) {
    guncelleme.resim_linkler = veri.resim_linkler;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("urunler")
    .update(guncelleme)
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("urun_guncellendi", { id: productId, ad: veri.ad });

  return { success: true, urun: data as Urun };
}

export async function deleteProduct(productId: string): Promise<ProductActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const hata = await adminDogrula();
  if (hata) return { success: false, message: hata };

  const supabase = await createClient();
  const { error } = await supabase.from("urunler").delete().eq("id", productId);

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("urun_silindi", { id: productId });

  return { success: true, message: "Ürün silindi." };
}

export async function getAdminProducts(): Promise<Urun[]> {
  if (!supabaseYapilandirilmisMi()) return [];

  const hata = await adminDogrula();
  if (hata) return [];

  const supabase = await createClient();
  const { data } = await supabase.from("urunler").select("*").order("olusturulma_tarihi", { ascending: false });

  return (data as Urun[]) ?? [];
}

export async function getAdminProduct(productId: string): Promise<Urun | null> {
  if (!supabaseYapilandirilmisMi()) return null;

  const hata = await adminDogrula();
  if (hata) return null;

  const supabase = await createClient();
  const { data } = await supabase.from("urunler").select("*").eq("id", productId).single();

  return (data as Urun) ?? null;
}
