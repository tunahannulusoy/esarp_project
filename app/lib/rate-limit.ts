type Kayit = { sayac: number; pencereBaslangic: number };

const istekKayitlari = new Map<string, Kayit>();

/**
 * Basit in-memory sliding-window rate limiter. Tek sunucu/dev ortamı için yeterlidir;
 * çoklu instance'lı production'da Redis tabanlı bir çözüme (Upstash vb.) geçilmelidir.
 */
export function rateLimitKontrolEt(
  anahtar: string,
  limit: number,
  pencereMs: number
): { izinVerildi: boolean; kalanSaniye: number } {
  const simdi = Date.now();
  const kayit = istekKayitlari.get(anahtar);

  if (!kayit || simdi - kayit.pencereBaslangic > pencereMs) {
    istekKayitlari.set(anahtar, { sayac: 1, pencereBaslangic: simdi });
    return { izinVerildi: true, kalanSaniye: 0 };
  }

  if (kayit.sayac >= limit) {
    const kalanMs = pencereMs - (simdi - kayit.pencereBaslangic);
    return { izinVerildi: false, kalanSaniye: Math.ceil(kalanMs / 1000) };
  }

  kayit.sayac += 1;
  return { izinVerildi: true, kalanSaniye: 0 };
}
