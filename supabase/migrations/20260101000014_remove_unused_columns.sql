-- Kullanılmayan sipariş ve kategori kolonlarını kaldır

alter table public.siparisler drop column if exists whatsapp_mesaj_gonderildi;
alter table public.siparisler drop column if exists odeme_durumu;
alter table public.siparisler drop column if exists odeme_tarihi;

alter table public.kategoriler drop column if exists aciklama;
