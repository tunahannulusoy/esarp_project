"use server";

import { createClient } from "@/app/lib/supabase/server";
import { validateAdminRole, supabaseYapilandirilmisMi } from "@/app/lib/auth";
import { auditLogEkle } from "@/app/lib/audit-log";
import type { Kategori } from "@/app/types";

export type CategoryActionState = {
  success: boolean;
  message?: string;
  kategori?: Kategori;
};

const SUPABASE_BAGLANTI_YOK_MESAJI =
  "Supabase bağlantısı henüz yapılandırılmadı. .env.local dosyasına Supabase bilgilerinizi ekleyin.";

async function adminDogrula(): Promise<string | null> {
  try {
    await validateAdminRole();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Admin erişimi yok";
  }
}

export async function getAdminCategories(): Promise<Kategori[]> {
  if (!supabaseYapilandirilmisMi()) return [];

  const hata = await adminDogrula();
  if (hata) return [];

  const supabase = await createClient();
  const { data } = await supabase.from("kategoriler").select("*").order("sira");

  return (data as Kategori[]) ?? [];
}

export async function createCategory(ad: string): Promise<CategoryActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const hata = await adminDogrula();
  if (hata) return { success: false, message: hata };

  if (!ad.trim()) {
    return { success: false, message: "Kategori adı gerekli" };
  }

  const supabase = await createClient();
  const { count } = await supabase.from("kategoriler").select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("kategoriler")
    .insert({ ad: ad.trim(), sira: (count ?? 0) + 1 })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("kategori_olusturuldu", { ad });

  return { success: true, kategori: data as Kategori };
}

export async function deleteCategory(id: string): Promise<CategoryActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const hata = await adminDogrula();
  if (hata) return { success: false, message: hata };

  const supabase = await createClient();
  const { error } = await supabase.from("kategoriler").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("kategori_silindi", { id });

  return { success: true, message: "Kategori silindi." };
}
