import { describe, expect, it } from "vitest";
import { fiyatFormatla, siparisNoOlustur } from "@/app/lib/utils";

describe("fiyatFormatla", () => {
  it("TL formatında, iki ondalık basamakla biçimlendirir", () => {
    expect(fiyatFormatla(199)).toContain("199,00");
    expect(fiyatFormatla(159.2)).toContain("159,20");
  });
});

describe("siparisNoOlustur", () => {
  it("ESP ile başlayan bir sipariş numarası üretir", () => {
    expect(siparisNoOlustur()).toMatch(/^ESP\d+$/);
  });
});
