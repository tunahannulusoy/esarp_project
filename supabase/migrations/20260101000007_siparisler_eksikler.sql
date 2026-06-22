-- siparisler tablosunda musteri_email/musteri_adi kolonları yoktu (TS tipi
-- sonradan eklenmişti ama migration'a hiç yansıtılmamıştı). Ayrıca sadece
-- SELECT politikası vardı; kullanıcı kendi siparişini oluşturamıyor,
-- admin de durum güncelleyemiyordu.

alter table public.siparisler add column if not exists musteri_email text;
alter table public.siparisler add column if not exists musteri_adi text;

create policy "Kullanıcılar kendi siparişini oluşturabilir" on siparisler
  for insert with check (auth.uid() = kullanici_id);

create policy "Adminler tüm siparişleri görebilir" on siparisler
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler sipariş güncelleyebilir" on siparisler
  for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
