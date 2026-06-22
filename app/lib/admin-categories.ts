import type { Kategori } from "@/app/types";
import { mockKategoriler } from "@/app/lib/mock-data";

const STORAGE_KEY = "esarp_admin_kategoriler";

function kategorileriOku(): Kategori[] {
  if (typeof window === "undefined") return mockKategoriler;
  try {
    const ham = localStorage.getItem(STORAGE_KEY);
    return ham ? JSON.parse(ham) : mockKategoriler;
  } catch {
    return mockKategoriler;
  }
}

function kategorileriYaz(kategoriler: Kategori[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kategoriler));
}

export function adminKategorileriGetir(): Kategori[] {
  return kategorileriOku().sort((a, b) => a.sira - b.sira);
}

export function adminKategoriOlustur(veri: { ad: string; aciklama: string }): Kategori {
  const kategoriler = kategorileriOku();
  const yeni: Kategori = {
    id: crypto.randomUUID(),
    ad: veri.ad,
    aciklama: veri.aciklama,
    resim_linki: "",
    sira: kategoriler.length + 1,
    aktif: true,
  };
  kategorileriYaz([...kategoriler, yeni]);
  return yeni;
}

export function adminKategoriSil(id: string) {
  const kategoriler = kategorileriOku();
  kategorileriYaz(kategoriler.filter((k) => k.id !== id));
}
