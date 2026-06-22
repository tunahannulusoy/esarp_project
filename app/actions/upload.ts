"use server";

import { createClient } from "@/app/lib/supabase/server";
import { validateAdminRole, supabaseYapilandirilmisMi } from "@/app/lib/auth";
import { urunResimVaryantlariUret } from "@/app/lib/image-processing";

const BUCKET = "urunler";

export async function urunResmiYukle(
  urunId: string,
  sira: number,
  file: File
): Promise<{ success: true; url: string; thumbnailUrl: string } | { success: false; message: string }> {
  if (!supabaseYapilandirilmisMi()) {
    return {
      success: false,
      message: "Supabase Storage henüz yapılandırılmadı. .env.local dosyasına Supabase bilgilerinizi ekleyin.",
    };
  }

  await validateAdminRole();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { thumbnail, buyuk } = await urunResimVaryantlariUret(buffer);

  const supabase = await createClient();
  const anaYol = `${urunId}/${urunId}_resim_${sira}.jpg`;
  const thumbYol = `${urunId}/${urunId}_resim_${sira}_thumb.jpg`;

  const [anaSonuc, thumbSonuc] = await Promise.all([
    supabase.storage.from(BUCKET).upload(anaYol, buyuk, { contentType: "image/jpeg", upsert: true }),
    supabase.storage.from(BUCKET).upload(thumbYol, thumbnail, { contentType: "image/jpeg", upsert: true }),
  ]);

  if (anaSonuc.error || thumbSonuc.error) {
    return { success: false, message: anaSonuc.error?.message ?? thumbSonuc.error?.message ?? "Yükleme başarısız" };
  }

  const { data: anaUrl } = supabase.storage.from(BUCKET).getPublicUrl(anaYol);
  const { data: thumbUrl } = supabase.storage.from(BUCKET).getPublicUrl(thumbYol);

  return { success: true, url: anaUrl.publicUrl, thumbnailUrl: thumbUrl.publicUrl };
}
