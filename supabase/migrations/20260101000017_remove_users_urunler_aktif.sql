-- users.aktif ve urunler.aktif kaldır

drop policy if exists "Herkes aktif ürünleri görebilir" on public.urunler;

create policy "Herkes ürünleri görebilir" on public.urunler
  for select using (true);

alter table public.urunler drop column if exists aktif;
alter table public.users drop column if exists aktif;
