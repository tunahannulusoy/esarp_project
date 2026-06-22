import { describe, expect, it } from "vitest";
import { rateLimitKontrolEt } from "@/app/lib/rate-limit";

describe("rateLimitKontrolEt", () => {
  it("limit altındaki istekleri kabul eder", () => {
    const anahtar = `test-${Math.random()}`;
    expect(rateLimitKontrolEt(anahtar, 3, 60_000).izinVerildi).toBe(true);
    expect(rateLimitKontrolEt(anahtar, 3, 60_000).izinVerildi).toBe(true);
    expect(rateLimitKontrolEt(anahtar, 3, 60_000).izinVerildi).toBe(true);
  });

  it("limit aşıldığında isteği reddeder", () => {
    const anahtar = `test-${Math.random()}`;
    rateLimitKontrolEt(anahtar, 2, 60_000);
    rateLimitKontrolEt(anahtar, 2, 60_000);
    const sonuc = rateLimitKontrolEt(anahtar, 2, 60_000);
    expect(sonuc.izinVerildi).toBe(false);
    expect(sonuc.kalanSaniye).toBeGreaterThan(0);
  });
});
