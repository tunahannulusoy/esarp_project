"use server";

import type { Siparis, SiparisDurum } from "@/app/types";
import {
  odemeBeklemeEmailiGonder,
  siparisDurumEmailiGonder,
  siparisOnayEmailiGonder,
  teslimatEmailiGonder,
} from "@/app/lib/email";
import { auditLogEkle } from "@/app/lib/audit-log";

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
