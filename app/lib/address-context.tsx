"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Adres } from "@/app/types";

const STORAGE_KEY = "esarp_adresler";

type YeniAdres = Omit<Adres, "id" | "kullanici_id" | "silinmis" | "olusturulma_tarihi">;

type AddressContextValue = {
  adresler: Adres[];
  adresEkle: (adres: YeniAdres) => Adres;
  adresGuncelle: (id: string, adres: YeniAdres) => void;
  adresSil: (id: string) => void;
  varsayilanYap: (id: string) => void;
};

const AddressContext = createContext<AddressContextValue | null>(null);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [adresler, setAdresler] = useState<Adres[]>([]);
  const [yuklendi, setYuklendi] = useState(false);

  useEffect(() => {
    try {
      const ham = localStorage.getItem(STORAGE_KEY);
      if (ham) setAdresler(JSON.parse(ham));
    } catch {
      // localStorage erişilemezse boş listeyle devam et
    } finally {
      setYuklendi(true);
    }
  }, []);

  useEffect(() => {
    if (!yuklendi) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adresler));
  }, [adresler, yuklendi]);

  const adresEkle = useCallback((adres: YeniAdres) => {
    const yeni: Adres = {
      ...adres,
      id: crypto.randomUUID(),
      kullanici_id: "guest",
      silinmis: false,
      olusturulma_tarihi: new Date().toISOString(),
    };

    setAdresler((mevcut) => {
      const guncellenmis = yeni.varsayilan
        ? mevcut.map((a) => ({ ...a, varsayilan: false }))
        : mevcut;
      return [...guncellenmis, yeni];
    });

    return yeni;
  }, []);

  const adresGuncelle = useCallback((id: string, adres: YeniAdres) => {
    setAdresler((mevcut) =>
      mevcut.map((a) => {
        if (a.id === id) return { ...a, ...adres };
        if (adres.varsayilan) return { ...a, varsayilan: false };
        return a;
      })
    );
  }, []);

  const adresSil = useCallback((id: string) => {
    setAdresler((mevcut) => mevcut.filter((a) => a.id !== id));
  }, []);

  const varsayilanYap = useCallback((id: string) => {
    setAdresler((mevcut) => mevcut.map((a) => ({ ...a, varsayilan: a.id === id })));
  }, []);

  const value = useMemo(
    () => ({ adresler, adresEkle, adresGuncelle, adresSil, varsayilanYap }),
    [adresler, adresEkle, adresGuncelle, adresSil, varsayilanYap]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses, AddressProvider içinde kullanılmalı");
  return ctx;
}
