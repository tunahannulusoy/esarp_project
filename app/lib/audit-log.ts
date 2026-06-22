import { createClient } from "@/app/lib/supabase/server";
import { supabaseYapilandirilmisMi } from "@/app/lib/auth";

export type AuditOlayTipi =
  | "giris_basarili"
  | "giris_basarisiz"
  | "admin_giris_basarili"
  | "admin_giris_basarisiz"
  | "kayit_olusturuldu"
  | "sifre_guncellendi"
  | "email_guncellendi"
  | "hesap_silindi"
  | "siparis_olusturuldu"
  | "siparis_durumu_degisti";

export async function auditLogEkle(
  olayTipi: AuditOlayTipi,
  detay: Record<string, unknown> = {},
  kullaniciId?: string
) {
  const kayit = {
    olay_tipi: olayTipi,
    detay,
    kullanici_id: kullaniciId ?? null,
    zaman: new Date().toISOString(),
  };

  if (!supabaseYapilandirilmisMi()) {
    console.log("[audit]", JSON.stringify(kayit));
    return;
  }

  try {
    const supabase = await createClient();
    await supabase.from("audit_loglari").insert({
      olay_tipi: olayTipi,
      detay,
      kullanici_id: kullaniciId ?? null,
    });
  } catch (error) {
    console.error("Audit log yazılamadı:", error);
    console.log("[audit]", JSON.stringify(kayit));
  }
}
