import { describe, expect, it } from "vitest";
import { addressSchema, signUpSchema } from "@/app/lib/validation";

describe("signUpSchema", () => {
  it("güçlü şifreyi kabul eder", () => {
    const sonuc = signUpSchema.safeParse({ email: "test@example.com", password: "Guclu123!" });
    expect(sonuc.success).toBe(true);
  });

  it("zayıf şifreyi reddeder", () => {
    const sonuc = signUpSchema.safeParse({ email: "test@example.com", password: "12345678" });
    expect(sonuc.success).toBe(false);
  });

  it("geçersiz email'i reddeder", () => {
    const sonuc = signUpSchema.safeParse({ email: "gecersiz", password: "Guclu123!" });
    expect(sonuc.success).toBe(false);
  });
});

describe("addressSchema", () => {
  it("eksik telefon ile reddeder", () => {
    const sonuc = addressSchema.safeParse({
      il: "İstanbul",
      ilce: "Kadıköy",
      mahalle: "Moda",
      acik_adres: "Test sokak no:1 daire:2",
      adres_basligi: "Ev",
      telefon: "",
    });
    expect(sonuc.success).toBe(false);
  });

  it("geçerli adresi kabul eder", () => {
    const sonuc = addressSchema.safeParse({
      il: "İstanbul",
      ilce: "Kadıköy",
      mahalle: "Moda",
      acik_adres: "Test sokak no:1 daire:2",
      adres_basligi: "Ev",
      telefon: "0555 555 55 55",
    });
    expect(sonuc.success).toBe(true);
  });
});
