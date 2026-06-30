"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Adres } from "@/app/types";
import {
  getAddresses,
  addAddress as addAddressAction,
  updateAddress as updateAddressAction,
  deleteAddress as deleteAddressAction,
  setDefaultAddress as setDefaultAddressAction,
} from "@/app/actions/users";

type YeniAdres = Omit<Adres, "id" | "kullanici_id" | "olusturulma_tarihi">;

type AddressContextValue = {
  adresler: Adres[];
  yukleniyor: boolean;
  adresEkle: (adres: YeniAdres) => Promise<Adres | null>;
  adresGuncelle: (id: string, adres: YeniAdres) => Promise<void>;
  adresSil: (id: string) => Promise<void>;
  varsayilanYap: (id: string) => Promise<void>;
};

const AddressContext = createContext<AddressContextValue | null>(null);

function adresFormVerisi(adres: YeniAdres): FormData {
  const fd = new FormData();
  fd.set("il", adres.il);
  fd.set("ilce", adres.ilce);
  fd.set("mahalle", adres.mahalle);
  fd.set("acik_adres", adres.acik_adres);
  fd.set("adres_basligi", adres.adres_basligi);
  fd.set("telefon", adres.telefon);
  if (adres.varsayilan) fd.set("varsayilan", "on");
  return fd;
}

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [adresler, setAdresler] = useState<Adres[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const pathname = usePathname();

  const yenidenYukle = useCallback(async () => {
    const veri = await getAddresses();
    setAdresler(veri);
    setYukleniyor(false);
  }, []);

  useEffect(() => {
    yenidenYukle();
  }, [pathname, yenidenYukle]);

  const adresEkle = useCallback(
    async (adres: YeniAdres) => {
      const sonuc = await addAddressAction(adresFormVerisi(adres));
      if (!sonuc.success || !sonuc.adres) return null;
      await yenidenYukle();
      return sonuc.adres;
    },
    [yenidenYukle]
  );

  const adresGuncelle = useCallback(
    async (id: string, adres: YeniAdres) => {
      await updateAddressAction(id, adresFormVerisi(adres));
      await yenidenYukle();
    },
    [yenidenYukle]
  );

  const adresSil = useCallback(
    async (id: string) => {
      await deleteAddressAction(id);
      await yenidenYukle();
    },
    [yenidenYukle]
  );

  const varsayilanYap = useCallback(
    async (id: string) => {
      await setDefaultAddressAction(id);
      await yenidenYukle();
    },
    [yenidenYukle]
  );

  const value = useMemo(
    () => ({ adresler, yukleniyor, adresEkle, adresGuncelle, adresSil, varsayilanYap }),
    [adresler, yukleniyor, adresEkle, adresGuncelle, adresSil, varsayilanYap]
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses, AddressProvider içinde kullanılmalı");
  return ctx;
}
