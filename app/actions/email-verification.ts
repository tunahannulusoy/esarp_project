"use server";

import { dogrulamaKoduEmailiGonder } from "@/app/lib/email";
import { rateLimitKontrolEt } from "@/app/lib/rate-limit";

const KOD_GECERLILIK_MS = 10 * 60 * 1000;

type DogrulamaKaydi = { kod: string; sonaErme: number };

const dogrulamaKodlari = new Map<string, DogrulamaKaydi>();

function kodOlustur(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function dogrulamaKoduGonder(
  email: string
): Promise<{ success: boolean; message: string; devKod?: string }> {
  const limit = rateLimitKontrolEt(`dogrulama-kodu:${email}`, 3, 10 * 60 * 1000);
  if (!limit.izinVerildi) {
    return {
      success: false,
      message: `Çok fazla deneme yaptınız. Lütfen ${limit.kalanSaniye} saniye sonra tekrar deneyin.`,
    };
  }

  const kod = kodOlustur();
  dogrulamaKodlari.set(email, { kod, sonaErme: Date.now() + KOD_GECERLILIK_MS });

  if (!process.env.RESEND_API_KEY) {
    return {
      success: true,
      message: "Doğrulama kodu oluşturuldu (Resend API key tanımlı değil, kod aşağıda gösteriliyor).",
      devKod: kod,
    };
  }

  const sonuc = await dogrulamaKoduEmailiGonder(email, kod);
  if (!sonuc.gonderildi) {
    return { success: true, message: "Doğrulama kodu oluşturuldu ancak email gönderilemedi.", devKod: kod };
  }

  return { success: true, message: "Doğrulama kodu email adresinize gönderildi." };
}

export async function dogrulamaKoduKontrolEt(
  email: string,
  girilenKod: string
): Promise<{ success: boolean; message?: string }> {
  const limit = rateLimitKontrolEt(`dogrulama-kontrol:${email}`, 10, 10 * 60 * 1000);
  if (!limit.izinVerildi) {
    return {
      success: false,
      message: `Çok fazla deneme yaptınız. Lütfen ${limit.kalanSaniye} saniye sonra tekrar deneyin.`,
    };
  }

  const kayit = dogrulamaKodlari.get(email);

  if (!kayit) {
    return { success: false, message: "Önce doğrulama kodu isteyin." };
  }

  if (Date.now() > kayit.sonaErme) {
    dogrulamaKodlari.delete(email);
    return { success: false, message: "Doğrulama kodunun süresi doldu, yeniden gönderin." };
  }

  if (kayit.kod !== girilenKod) {
    return { success: false, message: "Doğrulama kodu hatalı." };
  }

  dogrulamaKodlari.delete(email);
  return { success: true };
}
