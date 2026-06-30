-- kategoriler.aktif kaldır; tüm kategoriler herkese açık

drop policy if exists "Herkes aktif kategorileri görebilir" on public.kategoriler;

create policy "Herkes kategorileri görebilir" on public.kategoriler
  for select using (true);

alter table public.kategoriler drop column if exists aktif;
