-- siparisler.adres_id, adresler(id)'ye NO ACTION ile bağlıydı; bu da bir
-- adres silindiğinde (ör. hesap silme akışında) o adrese referans veren
-- siparişler varsa tüm silme işlemini engelliyordu.
--
-- Çözüm: teslimat adresinin okunabilir bir metin kopyasını (snapshot)
-- doğrudan sipariş satırına göm, adres_id'yi adres silinince null'a düşecek
-- şekilde değiştir. Böylece adres satırı silinse bile sipariş geçmişinde
-- adres bilgisi kaybolmaz; üstelik order sayfaları artık adresler tablosuna
-- join yapmaya da ihtiyaç duymaz.

alter table public.siparisler add column if not exists teslimat_adresi text;

update public.siparisler s
set teslimat_adresi = trim(both ', ' from concat_ws(', ', a.acik_adres, a.mahalle, a.ilce, a.il))
from public.adresler a
where s.adres_id = a.id and s.teslimat_adresi is null;

alter table public.siparisler drop constraint if exists siparisler_adres_id_fkey;

alter table public.siparisler
  add constraint siparisler_adres_id_fkey
  foreign key (adres_id) references public.adresler(id) on delete set null;
