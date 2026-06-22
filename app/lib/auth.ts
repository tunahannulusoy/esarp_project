import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export function supabaseYapilandirilmisMi() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getCurrentUser() {
  if (!supabaseYapilandirilmisMi()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserRole(): Promise<"user" | "admin" | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select("role").eq("id", user.id).single();

  if (error || !data) return null;
  return data.role as "user" | "admin";
}

export async function validateAdminRole() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Giriş gerekli");
  }

  const role = await getCurrentUserRole();

  if (role !== "admin") {
    throw new Error("Admin erişimi yok");
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

export async function logout() {
  if (supabaseYapilandirilmisMi()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
}
