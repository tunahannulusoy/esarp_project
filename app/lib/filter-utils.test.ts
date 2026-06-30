import { describe, expect, it } from "vitest";
import { aramaParametrelerindenFiltreleriCikar, urunleriFiltreleVeSirala } from "@/app/lib/filter-utils";
import { indirimliFiyatHesapla } from "@/app/lib/utils";
import type { Urun } from "@/app/types";

const testUrunleri: Urun[] = [
  {
    id: "a1", ad: "Eşarp A", aciklama: "", fiyat: 100, indirim_orani: 0,
    kategori_id: "k1", resim_linkler: [], boyutlar: ["90x90"], renkler: [{ ad: "Kırmızı", hex: "#ff0000" }],
    stok: 10, puan: 4.5, satis_adedi: 50,
    olusturulma_tarihi: "2024-01-01T00:00:00Z", guncelleme_tarihi: "2024-01-01T00:00:00Z",
  },
  {
    id: "a2", ad: "Eşarp B", aciklama: "", fiyat: 200, indirim_orani: 10,
    kategori_id: "k2", resim_linkler: [], boyutlar: ["70x70"], renkler: [{ ad: "Lacivert", hex: "#000080" }],
    stok: 5, puan: 3.8, satis_adedi: 20,
    olusturulma_tarihi: "2024-02-01T00:00:00Z", guncelleme_tarihi: "2024-02-01T00:00:00Z",
  },
  {
    id: "a3", ad: "Eşarp C", aciklama: "", fiyat: 150, indirim_orani: 0,
    kategori_id: "k1", resim_linkler: [], boyutlar: ["90x90"], renkler: [{ ad: "Kırmızı", hex: "#ff0000" }],
    stok: 0, puan: 4.8, satis_adedi: 100,
    olusturulma_tarihi: "2024-03-01T00:00:00Z", guncelleme_tarihi: "2024-03-01T00:00:00Z",
  },
];

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
    const sonuc = urunleriFiltreleVeSirala(testUrunleri, {
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
    expect(sonuc.length).toBe(testUrunleri.length);
  });


  it("eşleşmeyen arama sorgusunda boş liste döner", () => {
    const sonuc = urunleriFiltreleVeSirala(testUrunleri, {
      q: "olmayan-urun-xyz",
      renkler: [],
      kategoriler: [],
      boyutlar: [],
      siralama: "en_yeni",
    });
    expect(sonuc).toHaveLength(0);
  });
});
