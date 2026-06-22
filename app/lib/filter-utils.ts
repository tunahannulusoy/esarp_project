import type { SiralamaSecenegi, Urun } from "@/app/types";
import { indirimliFiyatHesapla } from "@/app/lib/mock-data";

export type UrunFiltreleri = {
  q?: string;
  minFiyat?: number;
  maxFiyat?: number;
  minPuan?: number;
  renkler: string[];
  kategoriler: string[];
  boyutlar: string[];
  siralama: SiralamaSecenegi;
};

export function aramaParametrelerindenFiltreleriCikar(
  params: Record<string, string | string[] | undefined>
): UrunFiltreleri {
  const tekDeger = (deger: string | string[] | undefined) => (Array.isArray(deger) ? deger[0] : deger);
  const listeDegeri = (deger: string | string[] | undefined) =>
    Array.isArray(deger) ? deger : deger ? deger.split(",") : [];

  return {
    q: tekDeger(params.q),
    minFiyat: params.minFiyat ? Number(tekDeger(params.minFiyat)) : undefined,
    maxFiyat: params.maxFiyat ? Number(tekDeger(params.maxFiyat)) : undefined,
    minPuan: params.puan ? Number(tekDeger(params.puan)) : undefined,
    renkler: listeDegeri(params.renk),
    kategoriler: listeDegeri(params.kategori),
    boyutlar: listeDegeri(params.boyut),
    siralama: (tekDeger(params.siralama) as SiralamaSecenegi) ?? "en_yeni",
  };
}

export function urunleriFiltreleVeSirala(urunler: Urun[], filtreler: UrunFiltreleri): Urun[] {
  let sonuc = urunler.filter((urun) => {
    const fiyat = indirimliFiyatHesapla(urun.fiyat, urun.indirim_orani);

    if (filtreler.q && !urun.ad.toLowerCase().includes(filtreler.q.toLowerCase())) return false;
    if (filtreler.minFiyat !== undefined && fiyat < filtreler.minFiyat) return false;
    if (filtreler.maxFiyat !== undefined && fiyat > filtreler.maxFiyat) return false;
    if (filtreler.renkler.length > 0 && !urun.renkler.some((r) => filtreler.renkler.includes(r.ad))) return false;
    if (filtreler.kategoriler.length > 0 && !filtreler.kategoriler.includes(urun.kategori_id)) return false;
    if (filtreler.boyutlar.length > 0 && !urun.boyutlar.some((b) => filtreler.boyutlar.includes(b))) return false;
    if (filtreler.minPuan !== undefined && urun.puan < filtreler.minPuan) return false;

    return true;
  });

  sonuc = [...sonuc].sort((a, b) => {
    const fiyatA = indirimliFiyatHesapla(a.fiyat, a.indirim_orani);
    const fiyatB = indirimliFiyatHesapla(b.fiyat, b.indirim_orani);

    switch (filtreler.siralama) {
      case "fiyat_artan":
        return fiyatA - fiyatB;
      case "fiyat_azalan":
        return fiyatB - fiyatA;
      case "en_yeni":
        return new Date(b.olusturulma_tarihi).getTime() - new Date(a.olusturulma_tarihi).getTime();
      case "en_cok_satan":
        return b.satis_adedi - a.satis_adedi;
      case "en_yuksek_puan":
        return b.puan - a.puan;
      default:
        return 0;
    }
  });

  return sonuc;
}

export function tumRenkleriGetir(urunler: Urun[]) {
  const renkMap = new Map<string, string>();
  urunler.forEach((urun) => urun.renkler.forEach((renk) => renkMap.set(renk.ad, renk.hex)));
  return Array.from(renkMap.entries()).map(([ad, hex]) => ({ ad, hex }));
}

export function tumBoyutlariGetir(urunler: Urun[]) {
  const boyutSeti = new Set<string>();
  urunler.forEach((urun) => urun.boyutlar.forEach((boyut) => boyutSeti.add(boyut)));
  return Array.from(boyutSeti);
}

