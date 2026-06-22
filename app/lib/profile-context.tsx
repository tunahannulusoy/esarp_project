"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getProfile, updateProfile, type ProfilBilgisi } from "@/app/actions/users";

export type { ProfilBilgisi };

export const VARSAYILAN_PROFIL: ProfilBilgisi = {
  ad: "",
  soyad: "",
  email: "",
  telefon: "",
};

type ProfileContextValue = {
  profil: ProfilBilgisi;
  profilGuncelle: (veri: ProfilBilgisi) => Promise<void>;
  yukleniyor: boolean;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profil, setProfil] = useState<ProfilBilgisi>(VARSAYILAN_PROFIL);
  const [yukleniyor, setYukleniyor] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let iptalEdildi = false;

    getProfile().then((veri) => {
      if (iptalEdildi) return;
      setProfil(veri ?? VARSAYILAN_PROFIL);
      setYukleniyor(false);
    });

    return () => {
      iptalEdildi = true;
    };
  }, [pathname]);

  const profilGuncelle = useCallback(async (veri: ProfilBilgisi) => {
    setProfil(veri);

    const fd = new FormData();
    fd.set("ad", veri.ad);
    fd.set("soyad", veri.soyad);
    fd.set("telefon", veri.telefon);
    await updateProfile(fd);
  }, []);

  const value = useMemo(() => ({ profil, profilGuncelle, yukleniyor }), [profil, profilGuncelle, yukleniyor]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile, ProfileProvider içinde kullanılmalı");
  return ctx;
}
