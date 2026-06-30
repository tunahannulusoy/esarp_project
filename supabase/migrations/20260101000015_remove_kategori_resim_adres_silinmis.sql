-- Kategoriler ve adresler tablolarındaki kullanılmayan kolonları kaldır

alter table public.kategoriler drop column if exists resim_linki;

alter table public.adresler drop column if exists silinmis;
