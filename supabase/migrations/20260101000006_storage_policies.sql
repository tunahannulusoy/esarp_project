-- "urunler" storage bucket'ı için RLS politikaları.
-- Herkes ürün görsellerini görebilir (public bucket); sadece adminler yükleyebilir/silebilir.

create policy "Herkes ürün görsellerini görebilir" on storage.objects
  for select using (bucket_id = 'urunler');

create policy "Adminler ürün görseli yükleyebilir" on storage.objects
  for insert with check (
    bucket_id = 'urunler'
    and exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler ürün görselini güncelleyebilir" on storage.objects
  for update using (
    bucket_id = 'urunler'
    and exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Adminler ürün görselini silebilir" on storage.objects
  for delete using (
    bucket_id = 'urunler'
    and exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
