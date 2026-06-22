import { describe, expect, it } from "vitest";
import { aramaParametrelerindenFiltreleriCikar, urunleriFiltreleVeSirala } from "@/app/lib/filter-utils";
import { indirimliFiyatHesapla, mockUrunler } from "@/app/lib/mock-data";

describe("aramaParametrelerindenFiltreleriCikar", () => {
  it("URL parametrelerini doğru filtre nesnesine dönüştürür", () => {
    const filtreler = aramaParametrelerindenFiltreleriCikar({
      q: "Modeli 1",
      minFiyat: "200",
      renk: "Kırmızı,Lacivert",
      siralama: "fiyat_artan",
    });

    expect(filtreler.q).toBe("Modeli 1");
    expect(filtreler.minFiyat).toBe(200);
    expect(filtreler.renkler).toEqual(["Kırmızı", "Lacivert"]);
    expect(filtreler.siralama).toBe("fiyat_artan");
  });

  it("parametre yokken en_yeni varsayılanını kullanır", () => {
    expect(aramaParametrelerindenFiltreleriCikar({}).siralama).toBe("en_yeni");
  });
});

describe("urunleriFiltreleVeSirala", () => {
  it("fiyat_artan sıralamasında en ucuz ürünü başa getirir", () => {
    const sonuc = urunleriFiltreleVeSirala(mockUrunler, {
      renkler: [],
      kategoriler: [],
      boyutlar: [],
      siralama: "fiyat_artan",
    });

    for (let i = 1; i < sonuc.length; i++) {
      const onceki = indirimliFiyatHesapla(sonuc[i - 1].fiyat, sonuc[i - 1].indirim_orani);
      const simdiki = indirimliFiyatHesapla(sonuc[i].fiyat, sonuc[i].indirim_orani);
      expect(simdiki).toBeGreaterThanOrEqual(onceki);
    }
    expect(sonuc.length).toBe(mockUrunler.length);
  });

  it("minPuan filtresi uygulandığında puanı düşük ürünleri eler", () => {
    const sonuc = urunleriFiltreleVeSirala(mockUrunler, {
      renkler: [],
      kategoriler: [],
      boyutlar: [],
      siralama: "en_yeni",
      minPuan: 4,
    });

    expect(sonuc.every((u) => u.puan >= 4)).toBe(true);
    expect(sonuc.length).toBeLessThan(mockUrunler.length);
  });

  it("eşleşmeyen arama sorgusunda boş liste döner", () => {
    const sonuc = urunleriFiltreleVeSirala(mockUrunler, {
      q: "olmayan-urun-xyz",
      renkler: [],
      kategoriler: [],
      boyutlar: [],
      siralama: "en_yeni",
    });
    expect(sonuc).toHaveLength(0);
  });
});
