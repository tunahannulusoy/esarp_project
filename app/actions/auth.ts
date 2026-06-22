"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/app/lib/validation";
import { supabaseYapilandirilmisMi } from "@/app/lib/auth";
import { hosGeldinEmailiGonder } from "@/app/lib/email";
import { rateLimitKontrolEt } from "@/app/lib/rate-limit";
import { auditLogEkle } from "@/app/lib/audit-log";

export type AuthFormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const SUPABASE_BAGLANTI_YOK_MESAJI =
  "Supabase bağlantısı henüz yapılandırılmadı. .env.local dosyasına Supabase bilgilerinizi ekleyin.";

const COK_FAZLA_DENEME_MESAJI = (saniye: number) =>
  `Çok fazla deneme yaptınız. Lütfen ${saniye} saniye sonra tekrar deneyin.`;

export async function signUp(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const limit = rateLimitKontrolEt(`signup:${parsed.data.email}`, 5, 15 * 60 * 1000);
  if (!limit.izinVerildi) {
    return { success: false, message: COK_FAZLA_DENEME_MESAJI(limit.kalanSaniye) };
  }

  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  await hosGeldinEmailiGonder(parsed.data.email, parsed.data.email.split("@")[0]);
  await auditLogEkle("kayit_olusturuldu", { email: parsed.data.email });

  return { success: true, message: "Kayıt başarılı! Email adresinizi doğrulayın." };
}

export async function signIn(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const limit = rateLimitKontrolEt(`signin:${parsed.data.email}`, 5, 5 * 60 * 1000);
  if (!limit.izinVerildi) {
    return { success: false, message: COK_FAZLA_DENEME_MESAJI(limit.kalanSaniye) };
  }

  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const beniHatirla = formData.get("remember") === "on";
  const supabase = await createClient(beniHatirla);
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    await auditLogEkle("giris_basarisiz", { email: parsed.data.email });
    return { success: false, message: "Email veya şifre hatalı" };
  }

  await auditLogEkle("giris_basarili", { email: parsed.data.email });

  const hedef = formData.get("next");
  redirect(typeof hedef === "string" && hedef.startsWith("/") ? hedef : "/");
}

export async function adminSignIn(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const limit = rateLimitKontrolEt(`admin-signin:${parsed.data.email}`, 5, 5 * 60 * 1000);
  if (!limit.izinVerildi) {
    return { success: false, message: COK_FAZLA_DENEME_MESAJI(limit.kalanSaniye) };
  }

  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    await auditLogEkle("admin_giris_basarisiz", { email: parsed.data.email });
    return { success: false, message: "Email veya şifre hatalı" };
  }

  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (userError || userRow?.role !== "admin") {
    await supabase.auth.signOut();
    await auditLogEkle("admin_giris_basarisiz", { email: parsed.data.email, sebep: "admin_degil" }, data.user.id);
    return { success: false, message: "Bu hesap admin erişimine sahip değil" };
  }

  await auditLogEkle("admin_giris_basarili", { email: parsed.data.email }, data.user.id);

  redirect("/admin");
}

export async function resetPassword(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    return { success: false, message: "Geçerli bir email girin" };
  }

  const limit = rateLimitKontrolEt(`reset:${email}`, 3, 15 * 60 * 1000);
  if (!limit.izinVerildi) {
    return { success: false, message: COK_FAZLA_DENEME_MESAJI(limit.kalanSaniye) };
  }

  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset/confirm`,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Şifre sıfırlama linki email adresinize gönderildi." };
}

export async function updateEmail(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    return { success: false, message: "Geçerli bir email girin" };
  }

  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("email_guncellendi", { yeniEmail: email });

  return { success: true, message: "Yeni email adresinize onay linki gönderildi." };
}

export async function updatePassword(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const password = formData.get("password");
  const passwordTekrar = formData.get("passwordTekrar");

  if (password !== passwordTekrar) {
    return { success: false, message: "Şifreler eşleşmiyor" };
  }

  const parsed = signUpSchema.shape.password.safeParse(password);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Şifre geçersiz" };
  }

  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("sifre_guncellendi");

  return { success: true, message: "Şifreniz güncellendi." };
}

export async function deleteAccount(): Promise<AuthFormState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Oturum bulunamadı" };
  }

  const { error } = await supabase.from("users").update({ aktif: false }).eq("id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  await auditLogEkle("hesap_silindi", { email: user.email }, user.id);
  await supabase.auth.signOut();
  redirect("/");
}

export async function logout() {
  if (supabaseYapilandirilmisMi()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
