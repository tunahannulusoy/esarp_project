"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
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

const SUPABASE_HATA_CEVIRISI: Record<string, string> = {
  "User already registered": "Bu email adresi zaten kayıtlı.",
  "Invalid login credentials": "Email veya şifre hatalı.",
  "Email not confirmed": "Email adresiniz henüz doğrulanmamış.",
  "Password should be at least 6 characters": "Şifre en az 6 karakter olmalı.",
  "Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789.":
    "Şifre büyük/küçük harf ve rakam içermeli.",
  "Signup requires a valid password": "Geçerli bir şifre giriniz.",
  "Unable to validate email address: invalid format": "Geçersiz email formatı.",
  "Email rate limit exceeded": "Çok fazla deneme yapıldı. Lütfen bekleyin.",
  "over_email_send_rate_limit": "E-posta gönderme sınırı aşıldı. Lütfen bekleyin.",
  "For security purposes, you can only request this once every 60 seconds":
    "Güvenlik nedeniyle bu işlemi 60 saniyede bir yapabilirsiniz.",
  "User not found": "Kullanıcı bulunamadı.",
  "Token has expired or is invalid": "Bağlantı süresi dolmuş veya geçersiz.",
  "New password should be different from the old password": "Yeni şifre eski şifreden farklı olmalı.",
  "Auth session missing": "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
  "Session from session_id claim in JWT does not exist": "Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.",
};

function turkceHata(mesaj: string): string {
  if (SUPABASE_HATA_CEVIRISI[mesaj]) return SUPABASE_HATA_CEVIRISI[mesaj];
  for (const [en, tr] of Object.entries(SUPABASE_HATA_CEVIRISI)) {
    if (mesaj.toLowerCase().includes(en.toLowerCase())) return tr;
  }
  return mesaj;
}

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
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: turkceHata(error.message) };
  }

  // Email sahipliği kayıt formundan önce, app'in kendi 6 haneli kod akışıyla
  // zaten doğrulandı (bkz. app/actions/email-verification.ts). Supabase'in
  // kendi "confirm signup" akışı bundan habersiz olduğu için ayrıca bir
  // onay maili daha gönderip girişi engelliyordu — admin API ile hesabı
  // burada doğrudan doğrulanmış işaretleyerek bu tekrarı ortadan kaldırıyoruz.
  if (data.user) {
    const adminSupabase = createAdminClient();
    await adminSupabase.auth.admin.updateUserById(data.user.id, { email_confirm: true });
  }

  await hosGeldinEmailiGonder(parsed.data.email, parsed.data.email.split("@")[0]);
  await auditLogEkle("kayit_olusturuldu", { email: parsed.data.email });

  return { success: true, message: "Kayıt başarılı! Şimdi giriş yapabilirsiniz." };
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
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm?next=/auth/reset/confirm`,
  });

  if (error) {
    return { success: false, message: turkceHata(error.message) };
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
  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm?next=/profile/settings` }
  );

  if (error) {
    return { success: false, message: turkceHata(error.message) };
  }

  await auditLogEkle("email_guncellendi", { yeniEmail: email });

  return {
    success: true,
    message: "Onay linki hem eski hem yeni email adresinize gönderildi. Değişikliğin tamamlanması için her iki linke de tıklamanız gerekebilir.",
  };
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
    return { success: false, message: turkceHata(error.message) };
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

  // Kullanıcının kendi kimliği doğrulandıktan sonra, sadece bu işlem için
  // yükseltilmiş yetkili (service-role) client kullanılır.
  const adminSupabase = createAdminClient();

  // Sipariş kayıtları mali/ticari nedenlerle saklanır, ama kişisel veri
  // referansları (ad, email) silinmeden önce anonimleştirilir.
  await adminSupabase
    .from("siparisler")
    .update({ musteri_adi: "Silinmiş Kullanıcı", musteri_email: null })
    .eq("kullanici_id", user.id);

  // auth.users kaydını siler; public.users -> auth.users FK'si cascade
  // olduğu için profil, adresler, favoriler ve sepet de otomatik silinir.
  // siparisler.kullanici_id ise (FK: on delete set null) null'a düşer.
  const { error } = await adminSupabase.auth.admin.deleteUser(user.id);

  if (error) {
    return { success: false, message: turkceHata(error.message) };
  }

  await auditLogEkle("hesap_silindi", { email: user.email });
  await supabase.auth.signOut();
  redirect("/");
}

export async function bildirimTercihiGuncelle(acik: boolean): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("users").update({ bildirim_tercihi: acik }).eq("id", user.id);
}

export async function bildirimTercihiGetir(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return true;
  const { data } = await supabase.from("users").select("bildirim_tercihi").eq("id", user.id).single();
  return data?.bildirim_tercihi ?? true;
}

export async function logout() {
  if (supabaseYapilandirilmisMi()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
