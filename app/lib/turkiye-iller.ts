export const ILLER: Record<string, string[]> = {
  İstanbul: ["Kadıköy", "Üsküdar", "Beşiktaş", "Şişli", "Bakırköy", "Maltepe"],
  Ankara: ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut"],
  İzmir: ["Konak", "Karşıyaka", "Bornova", "Buca", "Bayraklı"],
  Bursa: ["Osmangazi", "Nilüfer", "Yıldırım"],
  Antalya: ["Muratpaşa", "Konyaaltı", "Kepez"],
  Adana: ["Seyhan", "Yüreğir", "Çukurova"],
  Konya: ["Selçuklu", "Meram", "Karatay"],
  Gaziantep: ["Şahinbey", "Şehitkamil"],
  Kayseri: ["Melikgazi", "Kocasinan"],
  Eskişehir: ["Odunpazarı", "Tepebaşı"],
};

export const IL_LISTESI = Object.keys(ILLER);

export function ilceleriGetir(il: string): string[] {
  return ILLER[il] ?? [];
}

const UZAK_ILLER = new Set(["Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Kayseri", "Eskişehir"]);

export function kargoUcretiHesapla(il: string): number {
  if (!il) return 49.9;
  if (il === "İstanbul") return 39.9;
  if (UZAK_ILLER.has(il)) return 59.9;
  return 69.9;
}

export function tahminiTeslimatGunSayisiHesapla(il: string): number {
  if (il === "İstanbul") return 2;
  if (UZAK_ILLER.has(il)) return 3;
  return 5;
}
