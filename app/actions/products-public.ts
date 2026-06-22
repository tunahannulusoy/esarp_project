"use server";

import { createClient } from "@/app/lib/supabase/server";
import { mockUrunler } from "@/app/lib/mock-data";
import type { Urun } from "@/app/types";

const supabaseYapilandirilmisMi = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getPublicProducts(): Promise<Urun[]> {
  if (!supabaseYapilandirilmisMi) return mockUrunler;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("urunler")
    .select("*")
    .eq("aktif", true)
    .order("olusturulma_tarihi", { ascending: false });

  if (error || !data || data.length === 0) return mockUrunler;
  return data as Urun[];
}

export async function getPublicProductById(id: string): Promise<Urun | null> {
  if (!supabaseYapilandirilmisMi) return mockUrunler.find((u) => u.id === id) ?? null;

  const supabase = await createClient();
  const { data } = await supabase.from("urunler").select("*").eq("id", id).single();

  return (data as Urun) ?? null;
}
