import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role (admin) Supabase client'ı. RLS'i tamamen bypass eder.
 * SADECE sunucu tarafındaki, kullanıcının kendi kimliği zaten doğrulanmış
 * ve özellikle yükseltilmiş yetki gerektiren akışlarda (ör. hesap silme)
 * kullanılmalı. Hiçbir zaman client component'e veya genel amaçlı bir
 * yardımcıya aktarılmamalı.
 */
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
