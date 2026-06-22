"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "esarp_profil";

export type ProfilBilgisi = {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
};

export const VARSAYILAN_PROFIL: ProfilBilgisi = {
  ad: "",
  soyad: "",
  email: "",
  telefon: "",
};

type ProfileContextValue = {
  profil: ProfilBilgisi;
  profilGuncelle: (veri: ProfilBilgisi) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profil, setProfil] = useState<ProfilBilgisi>(VARSAYILAN_PROFIL);
  const [yuklendi, setYuklendi] = useState(false);

  useEffect(() => {
    try {
      const ham = localStorage.getItem(STORAGE_KEY);
      if (ham) setProfil(JSON.parse(ham));
    } catch {
      // localStorage erişilemezse varsayılan profille devam et
    } finally {
      setYuklendi(true);
    }
  }, []);

  useEffect(() => {
    if (!yuklendi) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profil));
  }, [profil, yuklendi]);

  const value = useMemo(() => ({ profil, profilGuncelle: setProfil }), [profil]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile, ProfileProvider içinde kullanılmalı");
  return ctx;
}
