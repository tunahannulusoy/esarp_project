-- sifre_hash, gerçek kimlik doğrulaması Supabase Auth'a (auth.users.encrypted_password)
-- devredildiği için kullanılmıyor. Kafa karışıklığını önlemek için kaldırılıyor.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role, email_dogrulanmis)
  values (new.id, new.email, 'user', new.email_confirmed_at is not null)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

alter table public.users drop column if exists sifre_hash;
