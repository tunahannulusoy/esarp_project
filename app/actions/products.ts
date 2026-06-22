"use server";

import { createClient } from "@/app/lib/supabase/server";
import { validateAdminRole, supabaseYapilandirilmisMi } from "@/app/lib/auth";
import { productSchema } from "@/app/lib/validation";
import { auditLogEkle } from "@/app/lib/audit-log";

export type ProductActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const SUPABASE_BAGLANTI_YOK_MESAJI =
  "Supabase bağlantısı henüz yapılandırılmadı. Admin panelinde bu süre boyunca localStorage tabanlı ürün yönetimi kullanılır.";

function formDataToProductInput(formData: FormData) {
  return {
    ad: formData.get("ad") as string,
    aciklama: formData.get("aciklama") as string,
    fiyat: Number(formData.get("fiyat")),
    indirim_orani: Number(formData.get("indirim_orani") ?? 0),
    kategori_id: formData.get("kategori_id") as string,
    renkler: (formData.get("renkler") as string)?.split(",").filter(Boolean) ?? [],
    boyutlar: (formData.get("boyutlar") as string)?.split(",").filter(Boolean) ?? [],
    stok: Number(formData.get("stok")),
  };
}

export async function createProduct(formData: FormData): Promise<ProductActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  await validateAdminRole();

  const parsed = productSchema.safeParse(formDataToProductInput(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("urunler").insert(parsed.data);

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("siparis_olusturuldu", { tip: "urun_olusturuldu", ad: parsed.data.ad });

  return { success: true, message: "Ürün oluşturuldu." };
}

export async function updateProduct(productId: string, formData: FormData): Promise<ProductActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  await validateAdminRole();

  const parsed = productSchema.safeParse(formDataToProductInput(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("urunler")
    .update({ ...parsed.data, guncelleme_tarihi: new Date().toISOString() })
    .eq("id", productId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Ürün güncellendi." };
}

export async function deleteProduct(productId: string): Promise<ProductActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  await validateAdminRole();

  const supabase = await createClient();
  const { error } = await supabase.from("urunler").delete().eq("id", productId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Ürün silindi." };
}

export async function getProduct(productId: string) {
  if (!supabaseYapilandirilmisMi()) return null;

  const supabase = await createClient();
  const { data } = await supabase.from("urunler").select("*").eq("id", productId).single();

  return data;
}

export async function getProducts(filter?: { kategori_id?: string; aktif?: boolean }) {
  if (!supabaseYapilandirilmisMi()) return [];

  const supabase = await createClient();
  let query = supabase.from("urunler").select("*");

  if (filter?.kategori_id) query = query.eq("kategori_id", filter.kategori_id);
  if (filter?.aktif !== undefined) query = query.eq("aktif", filter.aktif);

  const { data } = await query;
  return data ?? [];
}
