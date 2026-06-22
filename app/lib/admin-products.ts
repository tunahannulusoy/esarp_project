import type { Urun, UrunResim } from "@/app/types";
import { mockUrunler } from "@/app/lib/mock-data";

const STORAGE_KEY = "esarp_admin_urunler";

function urunleriOku(): Urun[] {
  if (typeof window === "undefined") return mockUrunler;
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    return ham ? JSON.parse(ham) : mockUrunler;
  } catch {
    return mockUrunler;
  }
}

function urunleriYaz(urunler: Urun[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urunler));
}

export function adminUrunleriGetir(): Urun[] {
  return urunleriOku();
}

export function adminUrunGetir(id: string): Urun | undefined {
  return urunleriOku().find((u) => u.id === id);
}

type UrunFormVerisi = {
  id: string;
  ad: string;
  aciklama: string;
  fiyat: number;
  indirim_orani: number;
  kategori_id: string;
  renkler: { ad: string; hex: string }[];
  boyutlar: string[];
  stok: number;
  resim_linkler?: UrunResim[];
};

export function yeniUrunIdOlustur(): string {
  return crypto.randomUUID();
}

export function adminUrunOlustur(veri: UrunFormVerisi): Urun {
  const varsayilanResimler: UrunResim[] = [1, 2, 3, 4].map((sira) => ({
    url: `https://placehold.co/600x600/png?text=${encodeURIComponent(veri.ad)}-${sira}`,
    sira,
  }));

  const yeni: Urun = {
    ...veri,
    resim_linkler: veri.resim_linkler && veri.resim_linkler.length > 0 ? veri.resim_linkler : varsayilanResimler,
    puan: 0,
    satis_adedi: 0,
    olusturulma_tarihi: new Date().toISOString(),
    guncelleme_tarihi: new Date().toISOString(),
    aktif: true,
  };

  const urunler = urunleriOku();
  urunleriYaz([...urunler, yeni]);
  return yeni;
}

export function adminUrunGuncelle(id: string, veri: UrunFormVerisi) {
  const urunler = urunleriOku();
  urunleriYaz(
    urunler.map((u) =>
      u.id === id ? { ...u, ...veri, guncelleme_tarihi: new Date().toISOString() } : u
    )
  );
}

export function adminUrunSil(id: string) {
  const urunler = urunleriOku();
  urunleriYaz(urunler.filter((u) => u.id !== id));
}
