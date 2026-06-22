export type Renk = {
  ad: string;
  hex: string;
};

export type UrunResim = {
  url: string;
  sira: number;
};

export type Urun = {
  id: string;
  ad: string;
  aciklama: string;
  fiyat: number;
  indirim_orani: number;
  kategori_id: string;
  resim_linkler: UrunResim[];
  boyutlar: string[];
  renkler: Renk[];
  stok: number;
  puan: number;
  satis_adedi: number;
  olusturulma_tarihi: string;
  guncelleme_tarihi: string;
  aktif: boolean;
};

export type Kategori = {
  id: string;
  ad: string;
  aciklama: string;
  resim_linki: string;
  sira: number;
  aktif: boolean;
};

export type Kullanici = {
  id: string;
  email: string;
  ad: string;
  soyad: string;
  telefon_numarasi: string;
  role: "user" | "admin";
  email_dogrulanmis: boolean;
  kayit_tarihi: string;
  son_giris_tarihi: string;
  aktif: boolean;
};

export type Adres = {
  id: string;
  kullanici_id: string;
  il: string;
  ilce: string;
  mahalle: string;
  acik_adres: string;
  adres_basligi: string;
  telefon: string;
  varsayilan: boolean;
  silinmis: boolean;
  olusturulma_tarihi: string;
};

export type SiparisUrun = {
  urun_id: string;
  adet: number;
  fiyat: number;
  secili_renk: string;
  secili_boyut: string;
};

export type SiparisDurum =
  | "Ödeme Bekleme"
  | "Hazırlanıyor"
  | "Gönderildi"
  | "Teslim Edildi"
  | "İptal Edildi";

export type Siparis = {
  id: string;
  siparis_no: string;
  kullanici_id: string;
  musteri_email: string | null;
  musteri_adi: string;
  adres_id: string;
  urunler: SiparisUrun[];
  urunler_toplami: number;
  kargo_ucreti: number;
  toplam_tutar: number;
  durum: SiparisDurum;
  odeme_metodu: "Banka Transferi/Havale" | "Kapıda Ödeme";
  odeme_durumu: "Beklemede" | "Ödendi" | "İptal";
  olusturulma_tarihi: string;
  odeme_tarihi: string | null;
  tahmini_teslimat_tarihi: string | null;
  guncelleme_tarihi: string;
  whatsapp_mesaj_gonderildi: boolean;
  tracking_no: string | null;
};

export type Favori = {
  id: string;
  kullanici_id: string;
  urun_id: string;
  olusturulma_tarihi: string;
};

export type SepetUrun = {
  urun_id: string;
  adet: number;
  secili_renk: string;
  secili_boyut: string;
};

export type SepetOgesi = SepetUrun & {
  urun: Urun;
};

export type SiralamaSecenegi =
  | "fiyat_artan"
  | "fiyat_azalan"
  | "en_cok_satan"
  | "en_yeni"
  | "en_yuksek_puan";

export type FiltreSecenekleri = {
  minFiyat?: number;
  maxFiyat?: number;
  renkler?: string[];
  kategoriler?: string[];
  boyutlar?: string[];
};
