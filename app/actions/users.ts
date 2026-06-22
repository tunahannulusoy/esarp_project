"use server";

import { createClient } from "@/app/lib/supabase/server";
import { getCurrentUser, supabaseYapilandirilmisMi } from "@/app/lib/auth";
import { addressSchema } from "@/app/lib/validation";

export type UserActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const SUPABASE_BAGLANTI_YOK_MESAJI =
  "Supabase bağlantısı henüz yapılandırılmadı. Bu süre boyunca localStorage tabanlı profil/adres yönetimi kullanılır.";

export async function updateProfile(formData: FormData): Promise<UserActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Giriş gerekli" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({
      ad: formData.get("ad"),
      soyad: formData.get("soyad"),
      telefon_numarasi: formData.get("telefon"),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Profil güncellendi." };
}

function formDataToAddressInput(formData: FormData) {
  return {
    il: formData.get("il") as string,
    ilce: formData.get("ilce") as string,
    mahalle: formData.get("mahalle") as string,
    acik_adres: formData.get("acik_adres") as string,
    adres_basligi: formData.get("adres_basligi") as string,
    telefon: formData.get("telefon") as string,
  };
}

export async function addAddress(formData: FormData): Promise<UserActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Giriş gerekli" };
  }

  const parsed = addressSchema.safeParse(formDataToAddressInput(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("adresler").insert({ ...parsed.data, kullanici_id: user.id });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Adres eklendi." };
}

export async function updateAddress(addressId: string, formData: FormData): Promise<UserActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Giriş gerekli" };
  }

  const parsed = addressSchema.safeParse(formDataToAddressInput(formData));
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("adresler")
    .update(parsed.data)
    .eq("id", addressId)
    .eq("kullanici_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Adres güncellendi." };
}

export async function deleteAddress(addressId: string): Promise<UserActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Giriş gerekli" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("adresler")
    .update({ silinmis: true })
    .eq("id", addressId)
    .eq("kullanici_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Adres silindi." };
}

export { deleteAccount } from "@/app/actions/auth";
