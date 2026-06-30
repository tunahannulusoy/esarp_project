"use server";

import { createClient } from "@/app/lib/supabase/server";
import { getCurrentUser, supabaseYapilandirilmisMi } from "@/app/lib/auth";
import { addressSchema } from "@/app/lib/validation";
import type { Adres } from "@/app/types";

export type UserActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type AddressActionState = UserActionState & { adres?: Adres };

const SUPABASE_BAGLANTI_YOK_MESAJI =
  "Supabase bağlantısı henüz yapılandırılmadı. .env.local dosyasına Supabase bilgilerinizi ekleyin.";

export type ProfilBilgisi = {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
};

export async function getProfile(): Promise<ProfilBilgisi | null> {
  if (!supabaseYapilandirilmisMi()) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("ad, soyad, telefon_numarasi")
    .eq("id", user.id)
    .single();

  return {
    ad: data?.ad ?? "",
    soyad: data?.soyad ?? "",
    email: user.email ?? "",
    telefon: data?.telefon_numarasi ?? "",
  };
}

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

export async function getAddresses(): Promise<Adres[]> {
  if (!supabaseYapilandirilmisMi()) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("adresler")
    .select("*")
    .eq("kullanici_id", user.id)
    .order("olusturulma_tarihi", { ascending: true });

  return (data as Adres[]) ?? [];
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

async function digerAdresleriVarsayilanlikdanCikar(userId: string) {
  const supabase = await createClient();
  await supabase.from("adresler").update({ varsayilan: false }).eq("kullanici_id", userId);
}

export async function addAddress(formData: FormData): Promise<AddressActionState> {
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
  const { count } = await supabase
    .from("adresler")
    .select("id", { count: "exact", head: true })
    .eq("kullanici_id", user.id);

  const varsayilanYapilsin = formData.get("varsayilan") === "on" || !count;

  if (varsayilanYapilsin) {
    await digerAdresleriVarsayilanlikdanCikar(user.id);
  }

  const { data, error } = await supabase
    .from("adresler")
    .insert({ ...parsed.data, kullanici_id: user.id, varsayilan: varsayilanYapilsin })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Adres eklendi.", adres: data as Adres };
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

  const varsayilanYapilsin = formData.get("varsayilan") === "on";
  if (varsayilanYapilsin) {
    await digerAdresleriVarsayilanlikdanCikar(user.id);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("adresler")
    .update({ ...parsed.data, varsayilan: varsayilanYapilsin })
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
    .delete()
    .eq("id", addressId)
    .eq("kullanici_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Adres silindi." };
}

export async function setDefaultAddress(addressId: string): Promise<UserActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Giriş gerekli" };
  }

  await digerAdresleriVarsayilanlikdanCikar(user.id);

  const supabase = await createClient();
  const { error } = await supabase
    .from("adresler")
    .update({ varsayilan: true })
    .eq("id", addressId)
    .eq("kullanici_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Varsayılan adres güncellendi." };
}
