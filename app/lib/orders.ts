import type { Adres, SepetOgesi, Siparis } from "@/app/types";
import { siparisNoOlustur } from "@/app/lib/utils";
import { indirimliFiyatHesapla } from "@/app/lib/mock-data";
import { kargoUcretiHesapla, tahminiTeslimatGunSayisiHesapla } from "@/app/lib/turkiye-iller";

const STORAGE_KEY = "esarp_siparisler";
const WHATSAPP_NUMARASI = "905555555555";
const ISLETME_ADI = "Eşarp";

function siparisleriOku(): Siparis[] {
  if (typeof window === "undefined") return [];
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    return ham ? JSON.parse(ham) : [];
  } catch {
    return [];
  }
}

function siparisleriYaz(siparisler: Siparis[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(siparisler));
}

export function siparisOlustur(
  sepetOgeleri: SepetOgesi[],
  adres: Adres,
  musteriEmail: string | null = null
): Siparis {
  const urunlerToplami = sepetOgeleri.reduce((acc, oge) => {
    const fiyat = indirimliFiyatHesapla(oge.urun.fiyat, oge.urun.indirim_orani);
    return acc + fiyat * oge.adet;
  }, 0);

  const kargoUcreti = kargoUcretiHesapla(adres.il);
  const tahminiGun = tahminiTeslimatGunSayisiHesapla(adres.il);
  const tahminiTeslimat = new Date(Date.now() + tahminiGun * 86400000);

  const siparis: Siparis = {
    id: crypto.randomUUID(),
    siparis_no: siparisNoOlustur(),
    kullanici_id: "guest",
    musteri_email: musteriEmail,
    adres_id: adres.id,
    urunler: sepetOgeleri.map((oge) => ({
      urun_id: oge.urun_id,
      adet: oge.adet,
      fiyat: indirimliFiyatHesapla(oge.urun.fiyat, oge.urun.indirim_orani),
      secili_renk: oge.secili_renk,
      secili_boyut: oge.secili_boyut,
    })),
    urunler_toplami: urunlerToplami,
    kargo_ucreti: kargoUcreti,
    toplam_tutar: urunlerToplami + kargoUcreti,
    durum: "Ödeme Bekleme",
    odeme_metodu: "Banka Transferi/Havale",
    odeme_durumu: "Beklemede",
    olusturulma_tarihi: new Date().toISOString(),
    odeme_tarihi: null,
    tahmini_teslimat_tarihi: tahminiTeslimat.toISOString(),
    guncelleme_tarihi: new Date().toISOString(),
    whatsapp_mesaj_gonderildi: false,
    tracking_no: null,
  };

  const siparisler = siparisleriOku();
  siparisleriYaz([...siparisler, siparis]);

  return siparis;
}

export function siparisGetir(id: string): Siparis | undefined {
  return siparisleriOku().find((s) => s.id === id);
}

export function kullaniciSiparisleriGetir(): Siparis[] {
  return siparisleriOku().sort(
    (a, b) => new Date(b.olusturulma_tarihi).getTime() - new Date(a.olusturulma_tarihi).getTime()
  );
}

export function siparisDurumGuncelle(id: string, durum: Siparis["durum"]) {
  const siparisler = siparisleriOku();
  siparisleriYaz(
    siparisler.map((s) =>
      s.id === id ? { ...s, durum, guncelleme_tarihi: new Date().toISOString() } : s
    )
  );
}

export function whatsappLinkiOlustur(siparis: Siparis): string {
  const mesaj = `Merhaba! ✨

Sipariş kaydınız oluşturulmuştur. 🎉
Sipariş No: #${siparis.siparis_no}
Toplam Tutar: ₺${siparis.toplam_tutar.toFixed(2)}

Havale/Banka Transferi işlemleriniz tamamlandıktan sonra
siparişiniz hazırlanmaya başlanacak ve tarafınıza bildirim yapılacaktır.

Sipariş detaylarını profilinizden takip edebilirsiniz.
Sorularınız için bize yazabilirsiniz. 📞

---
${ISLETME_ADI}`;

  return `https://wa.me/${WHATSAPP_NUMARASI}?text=${encodeURIComponent(mesaj)}`;
}
