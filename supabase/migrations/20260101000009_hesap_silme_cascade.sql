-- "Hesabı Sil" akışı artık auth.users kaydını gerçekten siliyor (KVKK/GDPR
-- unutulma hakkı). users_id_fkey (public.users -> auth.users) zaten cascade
-- olduğu için profil, adresler, favoriler ve sepet otomatik temizlenir.
--
-- Ancak siparisler.kullanici_id hiç cascade davranışı tanımlamamıştı
-- (varsayılan: NO ACTION) — bu, sipariş geçmişi olan bir kullanıcının
-- silinmesini tamamen engelliyordu. Mali/ticari kayıt tutma yükümlülüğü
-- nedeniyle sipariş satırları silinmemeli; sadece kullanıcı bağı kopmalı.

alter table public.siparisler drop constraint if exists siparisler_kullanici_id_fkey;

alter table public.siparisler
  add constraint siparisler_kullanici_id_fkey
  foreign key (kullanici_id) references public.users(id) on delete set null;
