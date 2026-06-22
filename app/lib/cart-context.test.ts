import { describe, expect, it } from "vitest";
import { sepetleriBirlestir } from "@/app/lib/cart-context";

describe("sepetleriBirlestir", () => {
  it("farklı ürünleri birleştirir", () => {
    const a = [{ urun_id: "1", adet: 1, secili_renk: "Kırmızı", secili_boyut: "M" }];
    const b = [{ urun_id: "2", adet: 2, secili_renk: "Mavi", secili_boyut: "L" }];

    const sonuc = sepetleriBirlestir(a, b);
    expect(sonuc).toHaveLength(2);
  });

  it("aynı ürün/renk/boyut eşleşirse adetleri toplar", () => {
    const a = [{ urun_id: "1", adet: 2, secili_renk: "Kırmızı", secili_boyut: "M" }];
    const b = [{ urun_id: "1", adet: 3, secili_renk: "Kırmızı", secili_boyut: "M" }];

    const sonuc = sepetleriBirlestir(a, b);
    expect(sonuc).toHaveLength(1);
    expect(sonuc[0].adet).toBe(5);
  });

  it("farklı renk/boyut kombinasyonlarını ayrı satır olarak tutar", () => {
    const a = [{ urun_id: "1", adet: 1, secili_renk: "Kırmızı", secili_boyut: "M" }];
    const b = [{ urun_id: "1", adet: 1, secili_renk: "Kırmızı", secili_boyut: "L" }];

    const sonuc = sepetleriBirlestir(a, b);
    expect(sonuc).toHaveLength(2);
  });
});
