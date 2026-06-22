import sharp from "sharp";

export const RESIM_BOYUTLARI = {
  thumbnail: 300,
  buyuk: 800,
  profil: 150,
} as const;

export type ResimBoyutTipi = keyof typeof RESIM_BOYUTLARI;

const JPEG_KALITESI = 82;

/**
 * Verilen görsel buffer'ını belirtilen boyuta göre kare (cover-fit) olarak
 * yeniden boyutlandırır ve JPEG (kalite 80-85) formatına dönüştürür.
 */
export async function resimYenidenBoyutlandir(
  buffer: Buffer,
  boyutTipi: ResimBoyutTipi
): Promise<Buffer> {
  const boyut = RESIM_BOYUTLARI[boyutTipi];

  return sharp(buffer)
    .resize(boyut, boyut, { fit: "cover", position: "center" })
    .jpeg({ quality: JPEG_KALITESI })
    .toBuffer();
}

/**
 * Bir ürün görseli için thumbnail (300x300) ve büyük görünüm (800x800)
 * varyantlarını üretir.
 */
export async function urunResimVaryantlariUret(buffer: Buffer) {
  const [thumbnail, buyuk] = await Promise.all([
    resimYenidenBoyutlandir(buffer, "thumbnail"),
    resimYenidenBoyutlandir(buffer, "buyuk"),
  ]);

  return { thumbnail, buyuk };
}

export async function profilResimYenidenBoyutlandir(buffer: Buffer): Promise<Buffer> {
  return resimYenidenBoyutlandir(buffer, "profil");
}
