import type { Kategori, Urun } from "@/app/types";

export const mockKategoriler: Kategori[] = [
  { id: "kat-1", ad: "İpek Eşarp", aciklama: "100% ipek eşarplar", resim_linki: "", sira: 1, aktif: true },
  { id: "kat-2", ad: "Pamuklu Eşarp", aciklama: "Günlük kullanım için pamuklu eşarplar", resim_linki: "", sira: 2, aktif: true },
  { id: "kat-3", ad: "Şal", aciklama: "Büyük boy şallar", resim_linki: "", sira: 3, aktif: true },
  { id: "kat-4", ad: "Bandana", aciklama: "Küçük boy bandanalar", resim_linki: "", sira: 4, aktif: true },
];

const renkPaleti = [
  { ad: "Kırmızı", hex: "#DC2626" },
  { ad: "Lacivert", hex: "#1E3A8A" },
  { ad: "Bej", hex: "#D6C3A1" },
  { ad: "Siyah", hex: "#111827" },
  { ad: "Yeşil", hex: "#15803D" },
];

const boyutPaleti = ["90x90", "70x180", "Standart"];

function urunOlustur(index: number): Urun {
  const fiyat = 199 + (index % 6) * 50;
  const indirim = index % 3 === 0 ? 20 : index % 4 === 0 ? 10 : 0;
  const kategori = mockKategoriler[index % mockKategoriler.length];
  return {
    id: `urun-${index + 1}`,
    ad: `Eşarp Modeli ${index + 1}`,
    aciklama:
      "Yumuşak dokusu ve şık desenleriyle her kombine uyum sağlayan, günlük kullanıma uygun kaliteli eşarp.",
    fiyat,
    indirim_orani: indirim,
    kategori_id: kategori.id,
    resim_linkler: [1, 2, 3, 4].map((sira) => ({
      url: `https://placehold.co/600x600/png?text=Esarp+${index + 1}-${sira}`,
      sira,
    })),
    boyutlar: boyutPaleti,
    renkler: renkPaleti.slice(0, 2 + (index % 3)),
    stok: index % 7 === 0 ? 0 : 10 + (index % 5) * 5,
    puan: Math.round((3 + ((index * 37) % 21) / 10) * 10) / 10,
    satis_adedi: (index * 13 + 7) % 200,
    olusturulma_tarihi: new Date(Date.now() - index * 86400000).toISOString(),
    guncelleme_tarihi: new Date(Date.now() - index * 86400000).toISOString(),
    aktif: true,
  };
}

export const mockUrunler: Urun[] = Array.from({ length: 16 }, (_, i) => urunOlustur(i));

export function indirimliFiyatHesapla(fiyat: number, indirimOrani: number): number {
  if (!indirimOrani) return fiyat;
  return Math.round(fiyat * (1 - indirimOrani / 100) * 100) / 100;
}

export function urunGetir(id: string) {
  return mockUrunler.find((u) => u.id === id);
}

export function ilgiliUrunleriGetir(urun: Urun, adet = 4) {
  return mockUrunler
    .filter((u) => u.id !== urun.id && u.kategori_id === urun.kategori_id)
    .slice(0, adet);
}

export function kategoriGetir(id: string) {
  return mockKategoriler.find((k) => k.id === id);
}
