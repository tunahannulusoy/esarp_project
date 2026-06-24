export function fiyatFormatla(fiyat: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(fiyat);
}

export function siparisNoOlustur(): string {
  const tarih = new Date();
  const yil = tarih.getFullYear().toString().slice(-2);
  const ay = (tarih.getMonth() + 1).toString().padStart(2, "0");
  const rastgele = Math.floor(1000 + Math.random() * 9000);
  return `ESP${yil}${ay}${rastgele}`;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function indirimliFiyatHesapla(fiyat: number, indirimOrani: number): number {
  if (!indirimOrani) return fiyat;
  return Math.round(fiyat * (1 - indirimOrani / 100) * 100) / 100;
}
