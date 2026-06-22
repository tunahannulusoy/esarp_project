-- urunler ve kategoriler tablolarında sadece herkese açık SELECT politikası
-- vardı; adminlerin yazma (insert/update/delete) yapabilmesi için politika
-- hiç tanımlanmamıştı (admin panel ürün/kategori yönetimi bu yüzden RLS'e
-- takılıyordu).

create policy "Adminler ürün ekleyebilir" on urunler
  for insert with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler ürün güncelleyebilir" on urunler
  for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler ürün silebilir" on urunler
  for delete using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler kategori ekleyebilir" on kategoriler
  for insert with check (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler kategori güncelleyebilir" on kategoriler
  for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler kategori silebilir" on kategoriler
  for delete using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- Adminler pasif/aktif fark etmeksizin tüm ürün ve kategorileri görebilmeli
-- (mevcut select politikası sadece aktif=true olanları gösteriyordu).
create policy "Adminler tüm ürünleri görebilir" on urunler
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler tüm kategorileri görebilir" on kategoriler
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
