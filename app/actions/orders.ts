"use server";

import type { Siparis, SiparisDurum, SiparisUrun } from "@/app/types";
import {
  odemeBeklemeEmailiGonder,
  siparisDurumEmailiGonder,
  siparisOnayEmailiGonder,
  teslimatEmailiGonder,
} from "@/app/lib/email";
import { auditLogEkle } from "@/app/lib/audit-log";
import { createClient } from "@/app/lib/supabase/server";
import { getCurrentUser, supabaseYapilandirilmisMi } from "@/app/lib/auth";
import { siparisNoOlustur } from "@/app/lib/utils";
import { kargoUcretiHesapla, tahminiTeslimatGunSayisiHesapla } from "@/app/lib/turkiye-iller";

const SUPABASE_BAGLANTI_YOK_MESAJI =
  "Supabase bağlantısı henüz yapılandırılmadı. .env.local dosyasına Supabase bilgilerinizi ekleyin.";

export type SiparisActionState = { success: boolean; message?: string; siparis?: Siparis };

export async function createOrder(
  sepetOgeleri: SiparisUrun[],
  adresId: string,
  musteriAdi: string
): Promise<SiparisActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Giriş gerekli" };
  }

  if (sepetOgeleri.length === 0) {
    return { success: false, message: "Sepetiniz boş" };
  }

  const supabase = await createClient();

  const { data: adres } = await supabase.from("adresler").select("il").eq("id", adresId).single();
  if (!adres) {
    return { success: false, message: "Adres bulunamadı" };
  }

  const urunlerToplami = sepetOgeleri.reduce((acc, o) => acc + o.fiyat * o.adet, 0);
  const kargoUcreti = kargoUcretiHesapla(adres.il);
  const tahminiGun = tahminiTeslimatGunSayisiHesapla(adres.il);
  const tahminiTeslimat = new Date(Date.now() + tahminiGun * 86400000);

  const { data, error } = await supabase
    .from("siparisler")
    .insert({
      siparis_no: siparisNoOlustur(),
      kullanici_id: user.id,
      musteri_email: user.email,
      musteri_adi: musteriAdi,
      adres_id: adresId,
      urunler: sepetOgeleri,
      urunler_toplami: urunlerToplami,
      kargo_ucreti: kargoUcreti,
      toplam_tutar: urunlerToplami + kargoUcreti,
      tahmini_teslimat_tarihi: tahminiTeslimat.toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, siparis: data as Siparis };
}

export async function getOrderById(id: string): Promise<Siparis | null> {
  if (!supabaseYapilandirilmisMi()) return null;

  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase.from("siparisler").select("*").eq("id", id).single();

  return (data as Siparis) ?? null;
}

export async function getUserOrders(): Promise<Siparis[]> {
  if (!supabaseYapilandirilmisMi()) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("siparisler")
    .select("*")
    .eq("kullanici_id", user.id)
    .order("olusturulma_tarihi", { ascending: false });

  return (data as Siparis[]) ?? [];
}

export async function getAllOrdersAdmin(): Promise<Siparis[]> {
  if (!supabaseYapilandirilmisMi()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("siparisler")
    .select("*")
    .order("olusturulma_tarihi", { ascending: false });

  return (data as Siparis[]) ?? [];
}

export async function updateOrderStatus(id: string, durum: SiparisDurum): Promise<SiparisActionState> {
  if (!supabaseYapilandirilmisMi()) {
    return { success: false, message: SUPABASE_BAGLANTI_YOK_MESAJI };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("siparisler")
    .update({ durum, guncelleme_tarihi: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, siparis: data as Siparis };
}

export async function siparisOlusturulduBildirimGonder(
  siparis: Pick<Siparis, "id" | "siparis_no" | "urunler" | "toplam_tutar" | "musteri_email">,
  adresMetni: string
) {
  await auditLogEkle("siparis_olusturuldu", {
    siparisNo: siparis.siparis_no,
    toplamTutar: siparis.toplam_tutar,
    email: siparis.musteri_email,
  });

  if (!siparis.musteri_email) return;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  await siparisOnayEmailiGonder(siparis.musteri_email, {
    siparisNo: siparis.siparis_no,
    toplamTutar: siparis.toplam_tutar,
    urunler: siparis.urunler.map((u) => ({ ad: u.urun_id, adet: u.adet, fiyat: u.fiyat })),
    adres: adresMetni,
    trackingLink: `${siteUrl}/orders/${siparis.id}`,
  });

  await odemeBeklemeEmailiGonder(siparis.musteri_email, siparis.siparis_no, siparis.toplam_tutar);
}

export async function siparisDurumBildirimGonder(
  musteriEmail: string | null,
  siparisNo: string,
  yeniDurum: SiparisDurum,
  detay?: { kargoSirketi?: string; trackingNo?: string }
) {
  await auditLogEkle("siparis_durumu_degisti", { siparisNo, yeniDurum });

  if (!musteriEmail) return;

  if (yeniDurum === "Teslim Edildi") {
    await teslimatEmailiGonder(musteriEmail, siparisNo);
    return;
  }

  await siparisDurumEmailiGonder(musteriEmail, siparisNo, yeniDurum, detay);
}
