create extension if not exists pgcrypto;

create table kategoriler (
  id uuid primary key default gen_random_uuid(),
  ad text not null unique,
  aciklama text,
  resim_linki text,
  sira integer,
  aktif boolean default true
);

create table urunler (
  id uuid primary key default gen_random_uuid(),
  ad text not null,
  aciklama text,
  fiyat numeric not null,
  indirim_orani integer default 0,
  kategori_id uuid references kategoriler(id),
  resim_linkler jsonb default '[]',
  boyutlar jsonb default '[]',
  renkler jsonb default '[]',
  stok integer default 0,
  puan numeric default 0,
  satis_adedi integer default 0,
  olusturulma_tarihi timestamptz default now(),
  guncelleme_tarihi timestamptz default now(),
  aktif boolean default true
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  sifre_hash text not null,
  ad text,
  soyad text,
  telefon_numarasi text,
  role text not null default 'user' check (role in ('user', 'admin')),
  email_dogrulanmis boolean default false,
  kayit_tarihi timestamptz default now(),
  son_giris_tarihi timestamptz,
  aktif boolean default true
);

create table adresler (
  id uuid primary key default gen_random_uuid(),
  kullanici_id uuid references users(id) on delete cascade,
  il text not null,
  ilce text not null,
  mahalle text,
  acik_adres text not null,
  adres_basligi text,
  telefon text,
  varsayilan boolean default false,
  silinmis boolean default false,
  olusturulma_tarihi timestamptz default now()
);

create table siparisler (
  id uuid primary key default gen_random_uuid(),
  siparis_no text not null unique,
  kullanici_id uuid references users(id),
  adres_id uuid references adresler(id),
  urunler jsonb not null default '[]',
  urunler_toplami numeric not null,
  kargo_ucreti numeric not null default 0,
  toplam_tutar numeric not null,
  durum text not null default 'Ödeme Bekleme'
    check (durum in ('Ödeme Bekleme', 'Hazırlanıyor', 'Gönderildi', 'Teslim Edildi', 'İptal Edildi')),
  odeme_metodu text not null default 'Banka Transferi/Havale',
  odeme_durumu text not null default 'Beklemede'
    check (odeme_durumu in ('Beklemede', 'Ödendi', 'İptal')),
  olusturulma_tarihi timestamptz default now(),
  odeme_tarihi timestamptz,
  tahmini_teslimat_tarihi date,
  guncelleme_tarihi timestamptz default now(),
  whatsapp_mesaj_gonderildi boolean default false,
  tracking_no text
);

create table favoriler (
  id uuid primary key default gen_random_uuid(),
  kullanici_id uuid references users(id) on delete cascade,
  urun_id uuid references urunler(id) on delete cascade,
  olusturulma_tarihi timestamptz default now(),
  unique (kullanici_id, urun_id)
);

create table sepet (
  id uuid primary key default gen_random_uuid(),
  kullanici_id uuid references users(id) on delete cascade unique,
  urunler jsonb not null default '[]',
  guncelleme_tarihi timestamptz default now()
);

create table email_dogrulama_kodlari (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kod text not null,
  olusturulma_tarihi timestamptz default now(),
  sona_erme_tarihi timestamptz not null,
  kullanilmis boolean default false
);

create table audit_loglari (
  id uuid primary key default gen_random_uuid(),
  olay_tipi text not null,
  detay jsonb default '{}',
  kullanici_id uuid references users(id),
  ip text,
  olusturulma_tarihi timestamptz default now()
);

create index idx_audit_loglari_olay_tipi on audit_loglari(olay_tipi);
create index idx_urunler_kategori on urunler(kategori_id);
create index idx_siparisler_kullanici on siparisler(kullanici_id);
create index idx_siparisler_durum on siparisler(durum);
create index idx_adresler_kullanici on adresler(kullanici_id);

alter table urunler enable row level security;
alter table kategoriler enable row level security;
alter table siparisler enable row level security;
alter table adresler enable row level security;
alter table favoriler enable row level security;
alter table sepet enable row level security;

create policy "Herkes aktif ürünleri görebilir" on urunler
  for select using (aktif = true);

create policy "Herkes aktif kategorileri görebilir" on kategoriler
  for select using (aktif = true);

create policy "Kullanıcılar kendi siparişlerini görebilir" on siparisler
  for select using (auth.uid() = kullanici_id);

create policy "Kullanıcılar kendi adreslerini yönetebilir" on adresler
  for all using (auth.uid() = kullanici_id);

create policy "Kullanıcılar kendi favorilerini yönetebilir" on favoriler
  for all using (auth.uid() = kullanici_id);

create policy "Kullanıcılar kendi sepetini yönetebilir" on sepet
  for all using (auth.uid() = kullanici_id);
