-- public.users.id ile auth.users.id arasında açık bir FK yoktu; bu yüzden bir
-- auth.users kaydı silindiğinde public.users'da öksüz (orphaned) satır kalıyordu.
-- auth.users silindiğinde public.users satırının da otomatik silinmesi için
-- cascade'li bir FK ekliyoruz.

alter table public.users
  add constraint users_id_fkey foreign key (id) references auth.users(id) on delete cascade;
