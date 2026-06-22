-- users tablosunda RLS etkin ancak hiç politika tanımlı değildi, bu da
-- varsayılan "tüm satırları reddet" davranışına yol açıyordu (ör. adminSignIn
-- server action'ının kendi rolünü okuyamaması). Eksik politikaları ekliyoruz.

alter table users enable row level security;

create policy "Kullanıcılar kendi satırını okuyabilir" on users
  for select using (auth.uid() = id);

create policy "Kullanıcılar kendi satırını güncelleyebilir" on users
  for update using (auth.uid() = id);

-- service_role zaten RLS'i bypass eder (admin panel server action'ları için).
