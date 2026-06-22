-- Yeni bir auth.users kaydı oluştuğunda (normal kayıt akışında) otomatik
-- olarak eşleşen bir public.users satırı oluşturur. sepet/adresler/siparisler/
-- favoriler tablolarındaki "references users(id)" FK kısıtlarının çalışması
-- için bu satırın var olması gerekir. RLS/insert yetkisine bağımlı değildir.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, sifre_hash, role, email_dogrulanmis)
  values (new.id, new.email, 'managed-by-supabase-auth', 'user', new.email_confirmed_at is not null)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
