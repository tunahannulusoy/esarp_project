"use client";

import { useEffect, useState } from "react";
import type { Urun } from "@/app/types";
import { getPublicProducts } from "@/app/actions/products-public";

let onbellek: Urun[] | null = null;

export function useUrunler() {
  const [urunler, setUrunler] = useState<Urun[]>(onbellek ?? []);
  const [yukleniyor, setYukleniyor] = useState(onbellek === null);

  useEffect(() => {
    if (onbellek) return;

    getPublicProducts().then((veri) => {
      onbellek = veri;
      setUrunler(veri);
      setYukleniyor(false);
    });
  }, []);

  const urunGetir = (id: string) => urunler.find((u) => u.id === id);

  return { urunler, urunGetir, yukleniyor };
}
