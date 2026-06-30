"use server";

import { createClient } from "@/app/lib/supabase/server";
import type { Urun } from "@/app/types";

export async function getPublicProducts(): Promise<Urun[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("urunler")
    .select("*")
    .order("olusturulma_tarihi", { ascending: false });

  if (error || !data) return [];
  return data as Urun[];
}

export async function getPublicProductById(id: string): Promise<Urun | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("urunler").select("*").eq("id", id).single();
  return (data as Urun) ?? null;
}
